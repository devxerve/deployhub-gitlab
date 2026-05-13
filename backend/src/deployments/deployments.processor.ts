import { Injectable, Logger } from "@nestjs/common";
import * as fs from 'fs';
import { DeployStatus } from "./constants/deploy-states";
import { DeploymentsService } from "./deployments.service";
import { GitUtil } from 'src/deployments/utils/git.utils';
import { DockerUtil } from 'src/deployments/utils/docker.utils';

@Injectable()
export class DeploymentsProcessor {
    private readonly logger = new Logger(DeploymentsProcessor.name);

    constructor(
        private readonly deploymentsService: DeploymentsService,
        private readonly gitUtil: GitUtil,
        private readonly dockerUtil: DockerUtil,
    ){}

    /**
     * Main deployment pipeline
     */
    async process(id: string) {
        this.logger.log(`[START] Initializing pipeline for deploy ID: ${id}`);
        const workDir = `./tmp/${id}`;

        try {
            // 1. RETRIEVE DEPLOY DETAILS
            const deploy = await this.deploymentsService.getDeployById(id);

            // 2. GIT CLONE
            await this.deploymentsService.updateStatusRealtime(id, DeployStatus.CLONING);
            await this.deploymentsService.addLogRealtime(id, `Step 1/3: Cloning repository...`);
            
            await this.gitUtil.cloneRepository(deploy.repoUrl, workDir, id);
            await this.deploymentsService.addLogRealtime(id, `Repository cloned successfully.`);

            // 3. DOCKER BUILD
            await this.deploymentsService.updateStatusRealtime(id, DeployStatus.BUILDING);
            await this.deploymentsService.addLogRealtime(id, `Step 2/3: Building Docker image (this may take a while)...`);
            
            await this.dockerUtil.buildImage(id, workDir);
            await this.deploymentsService.addLogRealtime(id, `Docker image built successfully.`);

            // 4. ASSIGN PORT AND RUN
            await this.deploymentsService.updateStatusRealtime(id, DeployStatus.RUNNING);
            await this.deploymentsService.addLogRealtime(id, `Step 3/3: Starting container...`);

            // Find an available port and pass it to runContainer
            const port = await this.deploymentsService.getAvailablePort();
            await this.dockerUtil.runContainer(id, port);
            
            // 5. FINISH WITH SUCCESS
            await this.deploymentsService.updateStatusRealtime(id, DeployStatus.SUCCESS);
            await this.deploymentsService.addLogRealtime(id, `Deployment completed! Application is running on port ${port}`);
            this.logger.log(`[SUCCESS] Deploy ${id} finished on port ${port}.`);

        } catch (error) {
            this.logger.error(`[CRITICAL ERROR] Deploy ${id} failed: ${error.message}`);
            
            await this.deploymentsService.updateStatusRealtime(id, DeployStatus.FAILED);
            
            let errorMsg = 'An unexpected error occurred during deployment.';
            if (error.message.includes('git')) {
                errorMsg = 'Git Error: Please verify the repository is public and the URL is correct.';
            } else if (error.message.includes('docker')) {
                errorMsg = 'Docker Error: Build failed or container could not be started.';
            }
            
            await this.deploymentsService.addLogRealtime(id, `PROCESS FAILED: ${errorMsg}`);

        } finally {
            // 6. CLEANUP
            if (fs.existsSync(workDir)) {
                try {
                    fs.rmSync(workDir, { recursive: true, force: true });
                    this.logger.log(`[CLEANUP] Temporary workspace ${workDir} deleted.`);
                } catch (cleanupError) {
                    this.logger.error(`[CLEANUP ERROR] Could not delete ${workDir}: ${cleanupError.message}`);
                }
            }
        }
    }
}