"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DockerUtil_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DockerUtil = void 0;
const common_1 = require("@nestjs/common");
const child_process_1 = require("child_process");
const deployments_service_1 = require("../deployments.service");
let DockerUtil = DockerUtil_1 = class DockerUtil {
    deploymentsService;
    logger = new common_1.Logger(DockerUtil_1.name);
    constructor(deploymentsService) {
        this.deploymentsService = deploymentsService;
    }
    async buildImage(id, path) {
        return new Promise((resolve, reject) => {
            const timeoutLimit = +(process.env.DOCKER_BUILD_TIMEOUT || 300000);
            const child = (0, child_process_1.spawn)('docker', ['build', '-t', `image-${id}`, path]);
            const timeout = setTimeout(() => {
                child.kill();
                reject(new Error(`Cannot procces Docker build: timeout of ${timeoutLimit / 1000} seconds exceeded`));
            }, timeoutLimit);
            child.stdout.on('data', (data) => {
                this.logger.log(`Build stdout: ${data}`);
            });
            child.on('close', (code) => {
                clearTimeout(timeout);
                if (code === 0) {
                    resolve();
                }
                else {
                    reject(new Error(`Docker build failed with code: ${code}`));
                }
            });
            child.on('error', (err) => {
                clearTimeout(timeout);
                reject(err);
            });
        });
    }
    async runContainer(id, port) {
        return new Promise((resolve, reject) => {
            const netWorkName = process.env.DOCKER_NETWORK_NAME || 'deploy-network';
            const child = (0, child_process_1.spawn)('docker', [
                'run', '-d',
                '--network', netWorkName,
                '-p', `${port}:3000`,
                '--name', `container-${id}`,
                `deploy-${id}`
            ]);
            child.on('close', (code) => {
                code === 0 ? resolve() : reject(new Error(`Docker run failed: ${code}`));
            });
        });
    }
};
exports.DockerUtil = DockerUtil;
exports.DockerUtil = DockerUtil = DockerUtil_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [deployments_service_1.DeploymentsService])
], DockerUtil);
//# sourceMappingURL=docker.utils.js.map