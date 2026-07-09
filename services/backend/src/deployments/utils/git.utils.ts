import { Injectable, Logger } from "@nestjs/common";
import { spawn } from "child_process";
import * as fs from "fs";
import { DeploymentsService } from "../deployments.service";

@Injectable()
export class GitUtil {
  private readonly logger = new Logger(GitUtil.name);

  constructor(private readonly deploymentsService: DeploymentsService) {}

  async checkoutCommit(path: string, commitHash: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const child = spawn("git", ["checkout", commitHash], { cwd: path });

      child.stderr.on("data", (data) => {
        this.logger.debug(`[GIT CHECKOUT INFO]: ${data}`);
      });

      child.on("close", (code) => {
        if (code === 0) {
          this.logger.log(`[GIT] Successfully moved to commit: ${commitHash}`);
          resolve();
        } else {
          reject(new Error(`Git checkout failed with code ${code}`));
        }
      });
    });
  }

  async cloneRepository(
    repoUrl: string,
    path: string,
    id: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
      }
      const child = spawn("git", ["clone", repoUrl, path]);

      child.stdout.on("data", (data) => {
        this.deploymentsService.addLogRealtime(id, data.toString());
      });

      child.stderr.on("data", (data) => {
        this.logger.debug(`[GIT INFO]: ${data}`);
      });

      child.on("close", (code) => {
        if (code === 0) {
          this.logger.log(`[GIT] Cloned successfully: ${id}`);
          resolve();
        } else {
          reject(new Error(`Git clone failed with code ${code}`));
        }
      });
    });
  }
}
