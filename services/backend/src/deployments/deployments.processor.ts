import { Injectable, Logger } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import { DeployStatus } from "./constants/deploy-states";
import { DeploymentsService } from "./deployments.service";
import { GitUtil } from "./utils/git.utils";
import { DockerUtil } from "./utils/docker.utils";

type EnvVariables = Record<string, string>;

function isEnvVariables(value: unknown): value is EnvVariables {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  return Object.values(value).every((item) => typeof item === "string");
}

function parseEnvVariables(value: unknown): EnvVariables {
  if (value === null || value === undefined || value === "") {
    return {};
  }

  let parsed: unknown = value;

  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value) as unknown;
    } catch {
      throw new Error("Invalid environment variables: malformed JSON.");
    }
  }

  if (!isEnvVariables(parsed)) {
    throw new Error("Invalid environment variables: expected string values.");
  }

  return parsed;
}

@Injectable()
export class DeploymentsProcessor {
  private readonly logger = new Logger(DeploymentsProcessor.name);

  constructor(
    private readonly deploymentsService: DeploymentsService,
    private readonly gitUtil: GitUtil,
    private readonly dockerUtil: DockerUtil,
  ) {}

  async process(id: string) {
    this.logger.log(`[START] Initializing pipeline for deploy ID: ${id}`);
    const workDir = path.join(process.env.DEPLOY_TMP_DIR || "/app/tmp", id);

    try {
      const deploy = await this.deploymentsService.getDeployById(id);

      await this.deploymentsService.updateStatusRealtime(
        id,
        DeployStatus.CLONING,
      );
      await this.deploymentsService.addLogRealtime(
        id,
        deploy.branch
          ? `Step 1/3: Cloning repository (branch: ${deploy.branch})...`
          : `Step 1/3: Cloning repository...`,
      );

      await this.gitUtil.cloneRepository(
        deploy.repoUrl,
        workDir,
        id,
        deploy.branch || undefined,
      );
      await this.deploymentsService.addLogRealtime(
        id,
        `Repository cloned successfully.`,
      );

      if (deploy.commitHash) {
        await this.deploymentsService.addLogRealtime(
          id,
          `Navigating to specific commit: ${deploy.commitHash}...`,
        );
        try {
          await this.gitUtil.checkoutCommit(workDir, deploy.commitHash);
          await this.deploymentsService.addLogRealtime(
            id,
            `✅ Successfully switched to commit ${deploy.commitHash.substring(0, 7)}.`,
          );
        } catch {
          throw new Error(
            `Git Error: Failed to checkout commit ${deploy.commitHash}.`,
          );
        }
      }

      const variables = parseEnvVariables(deploy.envVariables);

      const envPath = path.join(workDir, ".env");
      if (variables && Object.keys(variables).length > 0) {
        await this.deploymentsService.addLogRealtime(
          id,
          `Configuring environment variables securely...`,
        );

        const envContent = Object.entries(variables)
          .map(([key, value]) => `${key}=${value}`)
          .join("\n");

        fs.writeFileSync(envPath, envContent, "utf-8");
        await this.deploymentsService.addLogRealtime(
          id,
          `✅ Environment variables injected successfully.`,
        );
      } else {
        fs.writeFileSync(envPath, "", "utf-8");
      }

      const dockerfilePath = path.join(workDir, "Dockerfile");
      if (!fs.existsSync(dockerfilePath)) {
        throw new Error(`Cannot process request: Dockerfile missing.`);
      }

      await this.deploymentsService.updateStatusRealtime(
        id,
        DeployStatus.BUILDING,
      );
      await this.deploymentsService.addLogRealtime(
        id,
        `Step 2/3: Building Docker image (this may take a while)...`,
      );

      await this.dockerUtil.buildImage(id, workDir);
      await this.deploymentsService.addLogRealtime(
        id,
        `Docker image built successfully.`,
      );

      await this.deploymentsService.updateStatusRealtime(
        id,
        DeployStatus.RUNNING,
      );
      await this.deploymentsService.addLogRealtime(
        id,
        `Step 3/3: Starting container...`,
      );

      const port = await this.deploymentsService.getAvailablePort();
      await this.deploymentsService.savePort(id, port);
      await this.dockerUtil.runContainer(id, port);

      await this.deploymentsService.updateStatusRealtime(
        id,
        DeployStatus.SUCCESS,
      );
      await this.deploymentsService.addLogRealtime(
        id,
        `Deployment completed! Running correctly.`,
      );
      this.logger.log(`[SUCCESS] Deploy ${id} finished on port ${port}.`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(
        `[CRITICAL ERROR] Deploy ${id} failed: ${errorMessage}`,
      );

      await this.deploymentsService.updateStatusRealtime(
        id,
        DeployStatus.FAILED,
      );

      let errorMsg = "An unexpected error occurred during deployment.";
      if (errorMessage.includes("git")) {
        errorMsg =
          "Git Error: Please verify the repository is public and the URL is correct.";
      } else if (errorMessage.includes("docker")) {
        errorMsg =
          "Docker Error: Build failed or container could not be started.";
      }

      await this.deploymentsService.addLogRealtime(id, `PROCESS FAILED: ${errorMsg}`);
    } finally {
      if (fs.existsSync(workDir)) {
        try {
          fs.rmSync(workDir, { recursive: true, force: true });
          this.logger.log(`[CLEANUP] Temporary workspace ${workDir} deleted.`);
        } catch (cleanupError) {
          const cleanupMessage =
            cleanupError instanceof Error
              ? cleanupError.message
              : String(cleanupError);
          this.logger.error(
            `[CLEANUP ERROR] Could not delete ${workDir}: ${cleanupMessage}`,
          );
        }
      }
    }
  }
}
