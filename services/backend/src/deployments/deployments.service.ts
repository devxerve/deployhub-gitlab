import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service"; // Daniel
import { LogsService } from "../realtime/logs.service"; // Loreto
import { CreateDeployDto } from "./dto/create-deploy.dto";
import { DeployStatus } from "./constants/deploy-states";
import * as net from "net";

@Injectable()
export class DeploymentsService {
  private readonly logger = new Logger(DeploymentsService.name);
  private readonly BASE_PORT = 3000; // Puerto inicial para los deploys

  constructor(
    private readonly prisma: PrismaService,
    private readonly logsService: LogsService,
  ) {}

  /**
   * CREATE: Saves the initial deployment record in the database.
   */
  async createDeploy(dto: CreateDeployDto) {
    this.logger.log(`Creating database record for project: ${dto.projectId}`);

    return await this.prisma.deploy.create({
      data: {
        repoUrl: dto.repoUrl,
        projectId: dto.projectId,
        status: DeployStatus.PENDING,
        commitHash: dto.commitHash || null,
        envVariables: dto.envVariables
          ? JSON.stringify(dto.envVariables)
          : null,
      },
    });
  }

  /**
   * PORT MANAGEMENT: Finds the next truly available TCP port starting from BASE_PORT.
   * Uses Node's net module to probe real system port availability,
   * so it works correctly even after server restarts when mock DB loses state.
   */
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

    let port = this.BASE_PORT + 1; // start at 3001, leaving 3000 for the backend
    while (!(await isPortFree(port))) {
      this.logger.warn(`Port ${port} already in use, trying next...`);
      port++;
    }

    this.logger.log(`Assigned unique port: ${port}`);
    return port;
  }

  /**
   * PORT SAVE: Persists the assigned port to the deploy record.
   */
  async savePort(id: string, port: number) {
    await this.prisma.deploy.update({
      where: { id },
      data: { port },
    });
  }

  /**
   * UPDATE STATUS: Updates DB and broadcasts state
   */
  async updateStatusRealtime(id: string, status: DeployStatus) {
    await this.prisma.deploy.update({
      where: { id },
      data: { status },
    });

    this.logsService.sendStatus(id, status);
  }

  /**
   * ADD LOG: Sends a live log line
   */
  async addLogRealtime(id: string, message: string) {
    this.logsService.sendLog(id, message);
  }

  /**
   * FIND ONE: Retrieves a specific deployment.
   */
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

  async getAllDeploys() {
    this.logger.log("Retrieving all deployments from database");
    return await this.prisma.deploy.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async getDeployStatus(id: string) {
    const deploy = await this.getDeployById(id);
    return {
      id: deploy.id,
      status: deploy.status,
    };
  }

  /**
   * REMOVE: Deletes a deployment and its record.
   */
  async remove(id: string) {
    await this.getDeployById(id);
    return await this.prisma.deploy.delete({
      where: { id },
    });
  }
}
