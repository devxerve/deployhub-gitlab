import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { LogsService } from "../realtime/logs.service";
import { CreateDeployDto } from "./dto/create-deploy.dto";
import { DeployStatus } from "./constants/deploy-states";
import * as net from "net";

@Injectable()
export class DeploymentsService {
  private readonly logger = new Logger(DeploymentsService.name);
  private readonly BASE_PORT = 3000;
  constructor(
    private readonly prisma: PrismaService,
    private readonly logsService: LogsService,
  ) {}

  async createDeploy(dto: CreateDeployDto, userId: string) {
    this.logger.log(`Creating database record for project:`);

    return await this.prisma.deploy.create({
      data: {
        userId,
        repoUrl: dto.repoUrl,
        projectId: dto.projectId,
        status: DeployStatus.PENDING,
        commitHash: dto.commitHash || null,
        branch: dto.branch || null,
        envVariables: dto.envVariables
          ? JSON.stringify(dto.envVariables)
          : null,
      },
    });
  }

  async getAvailablePort(): Promise<number> {
    const isPortFree = (port: number): Promise<boolean> =>
      new Promise((resolve) => {
        const server = net.createServer();
        server.once("error", () => resolve(false));
        server.once("listening", () => {
          server.close();
          resolve(true);
        });
        server.listen(port, "0.0.0.0");
      });

    let port = this.BASE_PORT + 1;
    while (!(await isPortFree(port))) {
      this.logger.warn(`Port ${port} already in use, trying next...`);
      port++;
    }

    this.logger.log(`Assigned unique port: ${port}`);
    return port;
  }

  async savePort(id: string, port: number) {
    await this.prisma.deploy.update({
      where: { id },
      data: { port },
    });
  }

  async updateStatusRealtime(id: string, status: DeployStatus) {
    await this.prisma.deploy.update({
      where: { id },
      data: { status },
    });

    this.logsService.sendStatus(id, status);
  }

  async addLogRealtime(id: string, message: string): Promise<void> {
    await this.prisma.deployLog.create({
      data: { deployId: id, message },
    });
    this.logsService.sendLog(id, message);
  }

  async getDeployLogs(id: string, userId: string): Promise<string[]> {
    const entries = await this.getDeployLogEntries(id, userId);
    return entries.map((entry) => entry.message);
  }

  async getDeployLogEntries(
    id: string,
    userId: string,
  ): Promise<Array<{ message: string; createdAt: Date }>> {
    await this.getDeployByIdForUser(id, userId);
    return this.prisma.deployLog.findMany({
      where: { deployId: id },
      orderBy: { createdAt: "asc" },
      select: { message: true, createdAt: true },
    });
  }

  /** Unscoped lookup for internal use by the deployment pipeline, which already knows the id. */
  async getDeployById(id: string) {
    const deploy = await this.prisma.deploy.findUnique({
      where: { id },
    });

    if (!deploy) {
      throw new NotFoundException(
        `Cannot process request: Deployment ${id} not found.`,
      );
    }
    return deploy;
  }

  async getDeployByIdForUser(id: string, userId: string) {
    const deploy = await this.prisma.deploy.findFirst({
      where: { id, userId },
    });

    if (!deploy) {
      throw new NotFoundException(
        `Cannot process request: Deployment ${id} not found.`,
      );
    }
    return deploy;
  }

  async getAllDeploys(userId: string) {
    this.logger.log("Retrieving all deployments from database");
    return await this.prisma.deploy.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async getDeployStatus(id: string, userId: string) {
    const deploy = await this.getDeployByIdForUser(id, userId);
    return {
      id: deploy.id,
      status: deploy.status,
    };
  }

  async remove(id: string, userId: string) {
    await this.getDeployByIdForUser(id, userId);
    return await this.prisma.deploy.delete({
      where: { id },
    });
  }
}
