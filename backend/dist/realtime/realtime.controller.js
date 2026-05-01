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
exports.RealtimeController = void 0;
const common_1 = require("@nestjs/common");
const logs_service_1 = require("./logs.service");
let RealtimeController = class RealtimeController {
    logsService;
    constructor(logsService) {
        this.logsService = logsService;
    }
    receiveLog(data) {
        this.logsService.sendLog(data.deployId, data.log);
        return { ok: true, message: 'Log broadcasted' };
    }
    receiveStatus(data) {
        this.logsService.sendStatus(data.deployId, data.status);
        return { ok: true, message: 'Status broadcasted' };
    }
    receiveStart(data) {
        this.logsService.sendStart(data.deployId);
        return { ok: true, message: 'Start broadcasted' };
    }
    receiveEnd(data) {
        this.logsService.sendEnd(data.deployId, data.success);
        return { ok: true, message: 'End broadcasted' };
    }
};
exports.RealtimeController = RealtimeController;
__decorate([
    (0, common_1.Post)('log'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RealtimeController.prototype, "receiveLog", null);
__decorate([
    (0, common_1.Post)('status'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RealtimeController.prototype, "receiveStatus", null);
__decorate([
    (0, common_1.Post)('start'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RealtimeController.prototype, "receiveStart", null);
__decorate([
    (0, common_1.Post)('end'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RealtimeController.prototype, "receiveEnd", null);
exports.RealtimeController = RealtimeController = __decorate([
    (0, common_1.Controller)('realtime'),
    __metadata("design:paramtypes", [logs_service_1.LogsService])
], RealtimeController);
//# sourceMappingURL=realtime.controller.js.map