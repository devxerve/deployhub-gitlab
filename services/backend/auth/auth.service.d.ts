import { HttpService } from "@nestjs/axios";
export declare class AuthService {
    private readonly httpService;
    private readonly authServiceUrl;
    constructor(httpService: HttpService);
    forwardRegister(dto: any): Promise<any>;
    forwardLogin(dto: any): Promise<unknown>;
    validateToken(token: string): Promise<any>;
    private handleError;
}
