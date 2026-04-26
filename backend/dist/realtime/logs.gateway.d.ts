import { Server, Socket } from 'socket.io';
export declare class LogsGateway {
    server: Server;
    handleJoin(data: any, socket: Socket): void;
    sendLog(deployId: string, log: string): void;
    sendStatus(deployId: string, status: string): void;
}
