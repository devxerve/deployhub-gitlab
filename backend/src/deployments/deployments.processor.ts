import { Injectable, Logger } from "@nestjs/common";
import { DeployStatus } from "./constants/deploy-states";
import { DeploymentsService } from "./deployments.service";
import { GitUtil } from "./utils/git.util"; // Updated path
import { DockerUtil } from "./utils/docker.util"; 

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
            // 1. RETRIEVE DEPLOY DETAILS
            // Now we use 'await' because Prisma is asynchronous
            const deploy = await this.deploymentsService.getDeployById(id);

            // Path where the code will be stored locally
            const workDir = `./tmp/${id}`;

            // 2. GIT CLONE
            await this.deploymentsService.updateStatusRealtime(id, DeployStatus.CLONING);
            await this.deploymentsService.addLogRealtime(id, `Step 1/3: Cloning repository...`);

            // We pass the URL from Prisma and the workDir
            await this.gitUtil.cloneRepository(deploy.repoUrl, workDir);

            this.logger.log(`[GIT] Repository cloned successfully for deploy ID: ${id}`);
            await this.deploymentsService.addLogRealtime(id, `Repository cloned successfully.`);

            // 3. DOCKER BUILD
            await this.deploymentsService.updateStatusRealtime(id, DeployStatus.BUILDING);
            await this.deploymentsService.addLogRealtime(id, `Step 2/3: Building Docker image...`);

            // Docker needs to know where the files are (workDir)
            await this.dockerUtil.buildImage(id, workDir);

            this.logger.log(`[DOCKER] Image built successfully for deploy ID: ${id}`);
            await this.deploymentsService.addLogRealtime(id, `Docker image built successfully.`);

            // 4. DOCKER RUN
            await this.deploymentsService.updateStatusRealtime(id, DeployStatus.RUNNING);
            await this.deploymentsService.addLogRealtime(id, `Step 3/3: Deploying Docker container...`);

            await this.dockerUtil.runContainer(id);
            
            this.logger.log(`[DOCKER] Container running successfully for deploy ID: ${id}`);
            await this.deploymentsService.addLogRealtime(id, `Docker container is now running.`);

            // FINAL STATUS
            await this.deploymentsService.updateStatusRealtime(id, DeployStatus.SUCCESS);
            await this.deploymentsService.addLogRealtime(id, `Process completed! Application deployed successfully.`);
            this.logger.log(`[SUCCESS] Deploy ${id} completed without errors.`);

        } catch (error) {
            this.logger.error(`[CRITICAL ERROR] Deploy ${id} failed with error: ${error.message}`);
            
            await this.deploymentsService.updateStatusRealtime(id, DeployStatus.FAILED);

            let userFriendlyMessage = 'Unexpected system error occurred.';
            if (error.message.includes('git')) {
                userFriendlyMessage = 'Git error: Verify that the URL is public and correct';
            } else if (error.message.includes('docker')) {
                userFriendlyMessage = 'Docker error: Problem compiling or executing your code.';
            }
            
            await this.deploymentsService.addLogRealtime(id, `Process failed: ${userFriendlyMessage}`);
        }
    }
}