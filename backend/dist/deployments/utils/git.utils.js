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
var GitUtil_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitUtil = void 0;
const common_1 = require("@nestjs/common");
const child_process_1 = require("child_process");
const fs = __importStar(require("fs"));
const deployments_service_1 = require("../deployments.service");
let GitUtil = GitUtil_1 = class GitUtil {
    deploymentsService;
    logger = new common_1.Logger(GitUtil_1.name);
    constructor(deploymentsService) {
        this.deploymentsService = deploymentsService;
    }
    async cloneRepository(repoUrl, path, id) {
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path, { recursive: true });
            }
            const child = (0, child_process_1.spawn)('git', ['clone', '--depth', '1', repoUrl, path]);
            child.stdout.on('data', (data) => {
                this.deploymentsService.addLogRealtime(id, data.toString());
            });
            child.stderr.on('data', (data) => {
                this.logger.debug(`[GIT INFO]: ${data}`);
            });
            child.on('close', (code) => {
                if (code === 0) {
                    this.logger.log(`[GIT] Cloned successfully: ${id}`);
                    resolve();
                }
                else {
                    reject(new Error(`Git clone failed with code ${code}`));
                }
            });
        });
    }
};
exports.GitUtil = GitUtil;
exports.GitUtil = GitUtil = GitUtil_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [deployments_service_1.DeploymentsService])
], GitUtil);
//# sourceMappingURL=git.utils.js.map