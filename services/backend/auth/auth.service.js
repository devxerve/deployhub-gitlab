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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let AuthService = class AuthService {
    httpService;
    authServiceUrl = process.env.AUTH_SERVICE_URL;
    constructor(httpService) {
        this.httpService = httpService;
    }
    async forwardRegister(dto) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.authServiceUrl}/auth/register`, dto));
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async forwardLogin(dto) {
        try {
            return await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.authServiceUrl}/auth/login`, dto));
        }
        catch (error) {
            this.handleError(error);
        }
    }
    async validateToken(token) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.authServiceUrl}/auth/validate`, {}, { headers: { Authorization: `Bearer ${token}` } }));
            return response.data;
        }
        catch (error) {
            this.handleError(error);
        }
    }
    handleError(error) {
        const status = typeof error.response?.status === 'number'
            ? error.response.status
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.response?.data?.message || 'Error en el servicio satélite de Auth';
        throw new common_1.HttpException(message, status);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof axios_1.HttpService !== "undefined" && axios_1.HttpService) === "function" ? _a : Object])
], AuthService);

