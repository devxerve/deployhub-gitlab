import { LogsGateway } from './logs.gateway';
export declare class LogsService {
    private readonly gateway;
    constructor(gateway: LogsGateway);
    sendLog(deployId: string, log: string): void;
    sendStatus(deployId: string, status: string): void;
    sendStart(deployId: string): void;
    sendEnd(deployId: string, success: boolean): void;
}
