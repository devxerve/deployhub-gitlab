"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DeploymentsProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeploymentsProcessor = void 0;
const common_1 = require("@nestjs/common");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const deploy_states_1 = require("./constants/deploy-states");
const deployments_service_1 = require("./deployments.service");
const git_utils_1 = require("./utils/git.utils");
const docker_utils_1 = require("./utils/docker.utils");
let DeploymentsProcessor = DeploymentsProcessor_1 = class DeploymentsProcessor {
    deploymentsService;
    gitUtil;
    dockerUtil;
    logger = new common_1.Logger(DeploymentsProcessor_1.name);
    constructor(deploymentsService, gitUtil, dockerUtil) {
        this.deploymentsService = deploymentsService;
        this.gitUtil = gitUtil;
        this.dockerUtil = dockerUtil;
    }
    async process(id) {
        this.logger.log(`[START] Initializing pipeline for deploy ID: ${id}`);
        const workDir = `./tmp/${id}`;
        try {
            const deploy = await this.deploymentsService.getDeployById(id);
            await this.deploymentsService.updateStatusRealtime(id, deploy_states_1.DeployStatus.CLONING);
            await this.deploymentsService.addLogRealtime(id, `Step 1/3: Cloning repository...`);
            await this.gitUtil.cloneRepository(deploy.repoUrl, workDir, id);
            await this.deploymentsService.addLogRealtime(id, `Repository cloned successfully.`);
            const dockerfilePath = path.join(workDir, 'Dockerfile');
            if (!fs.existsSync(dockerfilePath)) {
                throw new Error(`Cannot process request: Dockerfile missing.`);
            }
            await this.deploymentsService.updateStatusRealtime(id, deploy_states_1.DeployStatus.BUILDING);
            await this.deploymentsService.addLogRealtime(id, `Step 2/3: Building Docker image (this may take a while)...`);
            await this.dockerUtil.buildImage(id, workDir);
            await this.deploymentsService.addLogRealtime(id, `Docker image built successfully.`);
            await this.deploymentsService.updateStatusRealtime(id, deploy_states_1.DeployStatus.RUNNING);
            await this.deploymentsService.addLogRealtime(id, `Step 3/3: Starting container...`);
            const port = await this.deploymentsService.getAvailablePort();
            await this.dockerUtil.runContainer(id, port);
            await this.deploymentsService.updateStatusRealtime(id, deploy_states_1.DeployStatus.SUCCESS);
            await this.deploymentsService.addLogRealtime(id, `Deployment completed! Application is running on port ${port}`);
            this.logger.log(`[SUCCESS] Deploy ${id} finished on port ${port}.`);
        }
        catch (error) {
            this.logger.error(`[CRITICAL ERROR] Deploy ${id} failed: ${error.message}`);
            await this.deploymentsService.updateStatusRealtime(id, deploy_states_1.DeployStatus.FAILED);
            let errorMsg = 'An unexpected error occurred during deployment.';
            if (error.message.includes('git')) {
                errorMsg = 'Git Error: Please verify the repository is public and the URL is correct.';
            }
            else if (error.message.includes('docker')) {
                errorMsg = 'Docker Error: Build failed or container could not be started.';
            }
            await this.deploymentsService.addLogRealtime(id, `PROCESS FAILED: ${errorMsg}`);
        }
        finally {
            if (fs.existsSync(workDir)) {
                try {
                    fs.rmSync(workDir, { recursive: true, force: true });
                    this.logger.log(`[CLEANUP] Temporary workspace ${workDir} deleted.`);
                }
                catch (cleanupError) {
                    this.logger.error(`[CLEANUP ERROR] Could not delete ${workDir}: ${cleanupError.message}`);
                }
            }
        }
    }
};
exports.DeploymentsProcessor = DeploymentsProcessor;
exports.DeploymentsProcessor = DeploymentsProcessor = DeploymentsProcessor_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [deployments_service_1.DeploymentsService,
        git_utils_1.GitUtil,
        docker_utils_1.DockerUtil])
], DeploymentsProcessor);
//# sourceMappingURL=deployments.processor.js.map