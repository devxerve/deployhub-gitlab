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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeploymentsController = void 0;
const common_1 = require("@nestjs/common");
const create_deploy_dto_1 = require("./dto/create-deploy.dto");
const deployments_service_1 = require("./deployments.service");
let DeploymentsController = class DeploymentsController {
    deploymentsService;
    constructor(deploymentsService) {
        this.deploymentsService = deploymentsService;
    }
    create(dto) {
        return this.deploymentsService.createDeploy(dto);
    }
    findAll() {
        return this.deploymentsService.getAllDeploys();
    }
    remove(id) {
        return this.deploymentsService.remove(id);
    }
    findOne(id) {
        return this.deploymentsService.getDeployById(id);
    }
    getStatus(id) {
        return this.deploymentsService.getDeployStatus(id);
    }
};
exports.DeploymentsController = DeploymentsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_deploy_dto_1.CreateDeployDto]),
    __metadata("design:returntype", void 0)
], DeploymentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DeploymentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DeploymentsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DeploymentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DeploymentsController.prototype, "getStatus", null);
exports.DeploymentsController = DeploymentsController = __decorate([
    (0, common_1.Controller)('deploy'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    })),
    __metadata("design:paramtypes", [deployments_service_1.DeploymentsService])
], DeploymentsController);
//# sourceMappingURL=deployments.controller.js.map