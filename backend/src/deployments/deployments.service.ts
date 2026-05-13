import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Daniel
import { LogsService } from '../realtime/logs.service';     // Loreto
import { CreateDeployDto } from './dto/create-deploy.dto';
import { DeployStatus } from './constants/deploy-states';

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
      },
    });
  }

  /**
   * PORT MANAGEMENT: Finds the next available port for a new container.
   */
  async getAvailablePort(): Promise<number> {
    // Search for deploy with hihhest assigned port
    const lastDeploy = await this.prisma.deploy.findFirst({
      where: { 
        port: { not: null },
        status: DeployStatus.RUNNING 
      },
      orderBy: { port: 'desc' },
    });
    // If there are none, we start at BASE_PORT, if there are, we add 1
    const nextPort = lastDeploy ? lastDeploy.port + 1 : this.BASE_PORT;
    
    this.logger.log(`Assigned unique port: ${nextPort}`);
    return nextPort;
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
      throw new NotFoundException(`No se puede procesar la solicitud: Deployment ${id} not found.`);
    }
    return deploy;
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