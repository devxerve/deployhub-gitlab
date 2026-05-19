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
var DeploymentsService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeploymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const logs_service_1 = require("../realtime/logs.service");
const deploy_states_1 = require("./constants/deploy-states");
let DeploymentsService = DeploymentsService_1 = class DeploymentsService {
    prisma;
    logsService;
    logger = new common_1.Logger(DeploymentsService_1.name);
    BASE_PORT = 3000;
    constructor(prisma, logsService) {
        this.prisma = prisma;
        this.logsService = logsService;
    }
    async createDeploy(dto) {
        this.logger.log(`Creating database record for project: ${dto.projectId}`);
        return await this.prisma.deploy.create({
            data: {
                repoUrl: dto.repoUrl,
                projectId: dto.projectId,
                status: deploy_states_1.DeployStatus.PENDING,
            },
        });
    }
    async getAvailablePort() {
        const lastDeploy = await this.prisma.deploy.findFirst({
            where: {
                port: { not: null },
                status: deploy_states_1.DeployStatus.RUNNING
            },
            orderBy: { port: 'desc' },
        });
        const nextPort = lastDeploy ? lastDeploy.port + 1 : this.BASE_PORT;
        this.logger.log(`Assigned unique port: ${nextPort}`);
        return nextPort;
    }
    async updateStatusRealtime(id, status) {
        await this.prisma.deploy.update({
            where: { id },
            data: { status },
        });
        this.logsService.sendStatus(id, status);
    }
    async addLogRealtime(id, message) {
        this.logsService.sendLog(id, message);
    }
    async getDeployById(id) {
        const deploy = await this.prisma.deploy.findUnique({
            where: { id },
        });
        if (!deploy) {
            throw new common_1.NotFoundException(`Cannot process request: Deployment ${id} not found.`);
        }
        return deploy;
    }
    async getAllDeploys() {
        this.logger.log('Retrieving all deployments from database');
        return await this.prisma.deploy.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async getDeployStatus(id) {
        const deploy = await this.getDeployById(id);
        return {
            id: deploy.id,
            status: deploy.status,
        };
    }
    async remove(id) {
        await this.getDeployById(id);
        return await this.prisma.deploy.delete({
            where: { id },
        });
    }
};
exports.DeploymentsService = DeploymentsService;
exports.DeploymentsService = DeploymentsService = DeploymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, logs_service_1.LogsService])
], DeploymentsService);
//# sourceMappingURL=deployments.service.js.map