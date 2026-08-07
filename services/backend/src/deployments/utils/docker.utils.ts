import { Injectable, Logger } from "@nestjs/common";
import { spawn } from "child_process";
import * as path from "path";
import { DeploymentsService } from "../deployments.service";

@Injectable()
export class DockerUtil {
  private readonly logger = new Logger(DockerUtil.name);

  constructor(private readonly deploymentsService: DeploymentsService) {}

  async buildImage(id: string, path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeoutLimit = +(process.env.DOCKER_BUILD_TIMEOUT || 300000);

      const child = spawn("docker", ["build", "-t", `image-${id}`, path]);

      const timeout = setTimeout(() => {
        child.kill();
        reject(
          new Error(
            `Cannot procces Docker build: timeout of ${timeoutLimit / 1000} seconds exceeded`,
          ),
        );
      }, timeoutLimit);

      child.stdout.on("data", (data) => {
        this.logger.log(`Build stdout: ${data}`);
      });

      child.on("error", (error: Error) => {
        reject(error);
      });

      child.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Docker run failed with code: ${String(code)}`));
        }
      });

      child.on("error", (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });
  }

  async runContainer(id: string, port: number): Promise<void> {
    void port;

    return new Promise((resolve, reject) => {
      const netWorkName = process.env.DOCKER_NETWORK_NAME || "paas_network";

      const workDir = path.join(process.env.DEPLOY_TMP_DIR || "/app/tmp", id);

      const child = spawn("docker", [
        "run",
        "-d",
        "--network",
        netWorkName,
        "--name",
        `container-${id}`,
        "--label",
        "traefik.enable=true",
        "--label",
        `traefik.http.routers.deploy-${id}.rule=Host(\`${id}.localhost\`)`,
        "--label",
        `traefik.http.routers.deploy-${id}.entrypoints=websecure`,
        "--label",
        `traefik.http.routers.deploy-${id}.tls=true`,
        "--label",
        `traefik.http.services.deploy-${id}.loadbalancer.server.port=3000`,
        "--env-file",
        `${workDir}/.env`,
        `image-${id}`,
      ]);

      child.on("error", (error: Error) => {
        reject(error);
      });

      child.on("close", (code) => {
        if (code === 0) {
          resolve();
          return;
        }

        reject(new Error(`Docker run failed with code: ${String(code)}`));
      });
    });
  }

  private getContainerLogLines(
    containerName: string,
    tail: number,
  ): Promise<{ ts: string; stream: "stdout" | "stderr"; text: string }[]> {
    return new Promise((resolve) => {
      const child = spawn("docker", [
        "logs",
        "--timestamps",
        "--tail",
        String(tail),
        containerName,
      ]);
      const lines: { ts: string; stream: "stdout" | "stderr"; text: string }[] =
        [];

      const parse = (buffer: Buffer, stream: "stdout" | "stderr") => {
        for (const raw of buffer.toString().split("\n")) {
          if (!raw.trim()) {
            continue;
          }

          const spaceIdx = raw.indexOf(" ");

          const ts =
            spaceIdx > -1 ? raw.slice(0, spaceIdx) : new Date().toISOString();

          const text = spaceIdx > -1 ? raw.slice(spaceIdx + 1) : raw;

          lines.push({
            ts,
            stream,
            text,
          });
        }
      };

      child.stdout.on("data", (data: Buffer) => {
        parse(data, "stdout");
      });

      child.stderr.on("data", (data: Buffer) => {
        parse(data, "stderr");
      });

      child.stdout.on("data", (data: Buffer) => {
        parse(data, "stdout");
      });
      child.stderr.on("data", (data: Buffer) => {
        parse(data, "stderr");
      });
      child.on("close", () => resolve(lines));
      child.on("error", () => resolve(lines));
    });
  }

  async getRecentDeploymentLogs(
    userId: string,
    tailPerContainer = 40,
  ): Promise<
    Array<{
      ts: string;
      level: "INFO" | "WARN" | "ERROR";
      app: string;
      msg: string;
    }>
  > {
    const deploys = await this.deploymentsService.getAllDeploys(userId);
    const relevant = deploys.filter((deploy) =>
      ["running", "success", "failed"].includes(
        String(deploy.status).toLowerCase(),
      ),
    );

    const entries: Array<{
      ts: string;
      level: "INFO" | "WARN" | "ERROR";
      app: string;
      msg: string;
    }> = [];

    for (const deploy of relevant) {
      const status = String(deploy.status).toLowerCase();

      // Failed deploys usually never got a container running — surface why
      // they failed from the persisted pipeline logs instead of `docker logs`.
      if (status === "failed") {
        const persisted = await this.deploymentsService.getDeployLogEntries(
          deploy.id,
          userId,
        );
        for (const log of persisted) {
          const lower = log.message.toLowerCase();
          const level: "INFO" | "WARN" | "ERROR" =
            lower.includes("error") || lower.includes("failed")
              ? "ERROR"
              : lower.includes("warn")
                ? "WARN"
                : "INFO";
          entries.push({
            ts: log.createdAt.toISOString(),
            level,
            app: deploy.projectId,
            msg: log.message,
          });
        }
        continue;
      }

      const lines = await this.getContainerLogLines(
        `container-${deploy.id}`,
        tailPerContainer,
      );
      for (const line of lines) {
        const lower = line.text.toLowerCase();
        const level: "INFO" | "WARN" | "ERROR" =
          line.stream === "stderr" || lower.includes("error")
            ? "ERROR"
            : lower.includes("warn")
              ? "WARN"
              : "INFO";
        entries.push({
          ts: line.ts,
          level,
          app: deploy.projectId,
          msg: line.text,
        });
      }
    }

    entries.sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());
    return entries;
  }
}
