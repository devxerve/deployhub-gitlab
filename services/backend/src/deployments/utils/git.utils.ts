import { Injectable, Logger } from "@nestjs/common";
import { spawn } from "child_process";
import * as fs from "fs";

import { DeploymentsService } from "../deployments.service";

@Injectable()
export class GitUtil {
  private readonly logger = new Logger(GitUtil.name);

  constructor(private readonly deploymentsService: DeploymentsService) {}

  async checkoutCommit(
    repositoryPath: string,
    commitHash: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const child = spawn("git", ["checkout", commitHash], {
        cwd: repositoryPath,
      });

      child.stderr.on("data", (data: Buffer) => {
        this.logger.debug(`[GIT CHECKOUT INFO]: ${data.toString()}`);
      });

      child.on("error", (error: Error) => {
        reject(error);
      });

      child.on("close", (code: number | null) => {
        if (code === 0) {
          this.logger.log(`[GIT] Successfully moved to commit: ${commitHash}`);

          resolve();
          return;
        }

        reject(new Error(`Git checkout failed with code ${String(code)}`));
      });
    });
  }

  async cloneRepository(
    repoUrl: string,
    repositoryPath: string,
    id: string,
    branch?: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(repositoryPath)) {
        fs.mkdirSync(repositoryPath, {
          recursive: true,
        });
      }

      const args = branch
        ? ["clone", "-b", branch, repoUrl, repositoryPath]
        : ["clone", repoUrl, repositoryPath];
      const child = spawn("git", args);

      child.stdout.on("data", (data: Buffer) => {
        this.deploymentsService.addLogRealtime(id, data.toString());
      });

      child.stderr.on("data", (data: Buffer) => {
        this.logger.debug(`[GIT INFO]: ${data.toString()}`);
      });

      child.on("error", (error: Error) => {
        reject(error);
      });

      child.on("close", (code: number | null) => {
        if (code === 0) {
          this.logger.log(`[GIT] Cloned successfully: ${id}`);

          resolve();
          return;
        }

        reject(new Error(`Git clone failed with code ${String(code)}`));
      });
    });
  }
}
