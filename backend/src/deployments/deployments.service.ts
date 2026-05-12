import { Injectable, NotFoundException } from "@nestjs/common";
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

  /**
   * All active deploys
   */
  getAllDeploys(): Deploy[] {
    return this.deploys;
  }

  /**
   * Searches for a deploy by its ID and returns it. If not found, throws a NotFoundException.
   */
  getDeployById(id: string): Deploy {
    const deploy = this.deploys.find((d) => d.id === id);
    if (!deploy) {
      throw new NotFoundException(`El deploy con ID ${id} no existe`);
    }
    return deploy;
  }

  /**
   * Returns state of a deploy by its ID.
   */
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

  /**
   * FOR PROCESSOR
   * Allows the processor to send logs in real-time to the frontend via WebSocket.
   */
  addLogRealtime(id: string, message: string) {
    this.logsService.sendLog(id, message);
  }

  /**
   * FOR PROCESSOR
   * Updates the status of a deploy in real-time and notifies the frontend via WebSocket.
   */
  updateStatusRealtime(id: string, status: DeployStatus) {
    const deploy = this.getDeployById(id);
    deploy.status = status;
    this.logsService.sendStatus(id, status);
  }
}