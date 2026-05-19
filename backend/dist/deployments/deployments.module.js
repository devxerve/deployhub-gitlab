"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeploymentsModule = void 0;
const common_1 = require("@nestjs/common");
const deployments_controller_1 = require("./deployments.controller");
const deployments_service_1 = require("./deployments.service");
const deployments_processor_1 = require("./deployments.processor");
const logs_service_1 = require("../realtime/logs.service");
const git_utils_1 = require("./utils/git.utils");
const docker_utils_1 = require("./utils/docker.utils");
let DeploymentsModule = class DeploymentsModule {
};
exports.DeploymentsModule = DeploymentsModule;
exports.DeploymentsModule = DeploymentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            logs_service_1.LogsService
        ],
        controllers: [
            deployments_controller_1.DeploymentsController
        ],
        providers: [
            deployments_service_1.DeploymentsService,
            deployments_processor_1.DeploymentsProcessor,
            git_utils_1.GitUtil,
            docker_utils_1.DockerUtil
        ],
        exports: [
            deployments_service_1.DeploymentsService
        ],
    })
], DeploymentsModule);
//# sourceMappingURL=deployments.module.js.map