import { Injectable, Logger } from "@nestjs/common";
import { DeployStatus } from "./constants/deploy-states";
import { DeploymentsService } from "./deployments.service";
import { GitUtil } from "./git.utils";
import { DockerUtil } from "./docker.utils"; 

@Injectable()
export class DeploymentsProcessor {
    private readonly logger = new Logger(DeploymentsProcessor.name);

    constructor(
        private readonly deploymentsService: DeploymentsService,
        private readonly gitUtil: GitUtil,
        private readonly dockerUtil: DockerUtil,
    ){}
    /**
     * Principal pipe for deployments
     */
    async process(id: string) {
        this.logger.log(`[START] Initializing pipeline for deploy ID: ${id}`);

        try {
            // retrieve deploy details
            const deploy = this.deploymentsService.getDeployById(id);

            // 1. GIT CLONE
            await this.deploymentsService.updateStatusRealtime(id, DeployStatus.CLONING);
            this.deploymentsService.addLogRealtime(id, `Step 1/3: Clonning repository...`);

            await this.gitUtil.clone(deploy.repoUrl, id);

            this.logger.log(`[GIT] Repository cloned successfully for deploy ID: ${id}`);
            this.deploymentsService.addLogRealtime(id, `Repository cloned successfully.`);

            // 2. DOCKER BUILD
            await this.deploymentsService.updateStatusRealtime(id, DeployStatus.BUILDING);
            this.deploymentsService.addLogRealtime(id, `Step 2/3: Building Docker image...`);

            await this.dockerUtil.buildImage(id);

            this.logger.log(`[DOCKER] Image built successfully for deploy ID: ${id}`);
            this.deploymentsService.addLogRealtime(id, `Docker image built successfully.`);

            // 3. DOCKER RUN
            await this.deploymentsService.updateStatusRealtime(id, DeployStatus.RUNNING);
            this.deploymentsService.addLogRealtime(id, `Step 3/3: Deploying Docker container...`);

            await this.dockerUtil.runContainer(id);
            
            this.logger.log(`[DOCKER] Container running successfully for deploy ID: ${id}`);
            this.deploymentsService.addLogRealtime(id, `Docker container is now running.`);

            // FINAL STATUS
            await this.deploymentsService.updateStatusRealtime(id, DeployStatus.SUCCESS);
            this.deploymentsService.addLogRealtime(id, `Process completed! Application deployed succesfully.`);
            this.logger.log(`[SUCCESS] Deploy ${id} completed without errors.`);
        }
        catch (error) {
            this.logger.error(`[CRITICAL ERROR] Deploy ${id} failed with error: ${error.message}`);
            if (error.stack) this.logger.error(`Stack: ${error.stack}`);

            await this.deploymentsService.updateStatusRealtime(id, DeployStatus.FAILED);

            let userFriendlyMessage = 'Unexpected system error occurred.';

            if (error.message.includes('git')){
                userFriendlyMessage = 'Git error: Verify that the URL is public and correct';
            }
            else if (error.message.includes('docker')){
                userFriendlyMessage = 'Docker error: There was a problem compiling or executing your code.';
            }
        this.deploymentsService.addLogRealtime(id, `Process failed: ${userFriendlyMessage}`);
        this.deploymentsService.addLogRealtime(id, `Please check the error details and try again.`);
        }
    }
}