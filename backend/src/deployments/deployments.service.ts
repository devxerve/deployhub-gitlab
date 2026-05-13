/*import { Injectable, NotFoundException } from "@nestjs/common";
import {CreateDeployDto} from "./dto/create-deploy.dto";
import { LogsService } from 'src/realtime/logs.service';
import { DeployStatus } from "./constants/deploy-states";
import { DeploymentsProcessor } from "./deployments.processor";

export interface Deploy {
    id : string;
    repoUrl: string;
    projectId: string;
    status: DeployStatus;
    createdAt: Date;
}

@Injectable()
export class DeploymentsService {

    private deploys: Deploy[] = []; // temporal hasta tener base de datos, si se reinicia el server queda vacia

   constructor(
        private readonly logsService: LogsService,
        private readonly processor: DeploymentsProcessor,
   ) {}

   async createDeploy(dto: CreateDeployDto){
    // Nota: Cuando Daniel termine, esto lo hará 'this.repo.save(dto)'
    const deployId = Math.random().toString(36).substring(7); // temporal

    const newDeploy: Deploy = {
        id: deployId,
        ...dto,
        status: DeployStatus.PENDING,
        createdAt: new Date(), // temp por ahora, debe hacerlo la DB
    };

    this.deploys.push(newDeploy);
    this.logsService.sendStart(deployId);
    this.logsService.sendLog(deployId, `[SYSTEM] Petition received. Deploy ID: ${deployId}`);
    this.logsService.sendStatus(deployId, DeployStatus.PENDING);

    this.processor.process(deployId);

    return newDeploy;
   }

  
  getAllDeploys(): Deploy[] {
    return this.deploys;
  }

  getDeployById(id: string): Deploy {
    const deploy = this.deploys.find((d) => d.id === id);
    if (!deploy) {
      throw new NotFoundException(`El deploy con ID ${id} no existe`);
    }
    return deploy;
  }

  getDeployStatus(id: string) {
    const deploy = this.getDeployById(id);
    return { status: deploy.status };
  }

  remove(id: string){
    const index = this.deploys.findIndex((d) => d.id === id);
    if (index === -1) {
      throw new NotFoundException(`Can't delete deploy with ID ${id} because it does not exist`);
    }
    this.deploys.splice(index, 1);
    return { message: `Deploy with ID ${id} has been removed` };
  }
  addLogRealtime(id: string, message: string) {
    this.logsService.sendLog(id, message);
  }

  updateStatusRealtime(id: string, status: DeployStatus) {
    const deploy = this.getDeployById(id);
    deploy.status = status;
    this.logsService.sendStatus(id, status);
  }
}*/

import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Daniel
import { LogsService } from '../realtime/logs.service';     // Loreto
import { CreateDeployDto } from './dto/create-deploy.dto';
import { DeployStatus } from './constants/deploy-states';

@Injectable()
export class DeploymentsService {
  private readonly logger = new Logger(DeploymentsService.name);

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
   * UPDATE STATUS: Updates the DB and broadcasts the new state using Loreto's sendStatus.
   */
  async updateStatusRealtime(id: string, status: DeployStatus) {
    // 1. Update Database (Daniel's part)
    await this.prisma.deploy.update({
      where: { id },
      data: { status },
    });

    // 2. Broadcast Status (Using Loreto's function: sendStatus)
    this.logsService.sendStatus(id, status);
    
    this.logger.debug(`Status updated and broadcasted: ${id} -> ${status}`);
  }

  /**
   * ADD LOG: Sends a live log line using Loreto's sendLog.
   */
  async addLogRealtime(id: string, message: string) {
    // Calling the exact function Loreto defined: sendLog
    this.logsService.sendLog(id, message);
  }

  /**
   * FIND ONE: Retrieves a specific deployment by ID.
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
   * FIND ALL: Returns the complete list from the database.
   */
  async getAllDeploys() {
    return await this.prisma.deploy.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * REMOVE: Deletes a deployment record from the database.
   */
  async remove(id: string) {
    await this.getDeployById(id);
    return await this.prisma.deploy.delete({
      where: { id },
    });
  }
  
  /**
   * GET STATUS: Returns only the status string of a deployment.
   */
  async getDeployStatus(id: string) {
    const deploy = await this.prisma.deploy.findUnique({
      where: { id },
      select: { status: true }, // Solo traemos el campo 'status' para ser eficientes
    });

    if (!deploy) {
      throw new NotFoundException(`No se puede procesar la solicitud: Deployment ${id} not found.`);
    }

    return { status: deploy.status };
  }
}