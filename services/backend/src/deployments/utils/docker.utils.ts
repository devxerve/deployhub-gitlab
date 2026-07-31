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

      // 1. Set time limit for build (5 minutes = 300,000 ms)
      const timeout = setTimeout(() => {
        child.kill(); // stop the build process
        reject(
          new Error(
            `Cannot procces Docker build: timeout of ${timeoutLimit / 1000} seconds exceeded`,
          ),
        );
      }, timeoutLimit);

      child.stdout.on("data", (data) => {
        this.logger.log(`Build stdout: ${data}`);
      });

      child.on("close", (code) => {
        // 2. if the process finishes before timeout, clear the timeout
        clearTimeout(timeout);

        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Docker build failed with code: ${code}`));
        }
      });

      child.on("error", (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });
  }

  async runContainer(id: string, port: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const netWorkName = process.env.DOCKER_NETWORK_NAME || "deploy-network";
      const workDir = path.join(process.env.DEPLOY_TMP_DIR || '/app/tmp', id);

      const child = spawn("docker", [
        "run",
        "-d",
        "--network",
        netWorkName,
        "--name",
        `container-${id}`,
        "--label", "traefik.enable=true",
        "--label", `traefik.http.routers.deploy-${id}.rule=Host(\`${id}.localhost\`)`,
        "--label", `traefik.http.services.deploy-${id}.loadbalancer.server.port=3000`,
        "--env-file",
        `${workDir}/.env`,
        `image-${id}`,
      ]);

      child.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Docker run failed with code: ${code}`));
        }
      });
    });
  }
}
