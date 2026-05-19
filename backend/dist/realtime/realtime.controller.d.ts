import { LogsService } from './logs.service';
export declare class RealtimeController {
    private readonly logsService;
    constructor(logsService: LogsService);
    receiveLog(data: {
        deployId: string;
        log: string;
    }): {
        ok: boolean;
        message: string;
    };
    receiveStatus(data: {
        deployId: string;
        status: string;
    }): {
        ok: boolean;
        message: string;
    };
    receiveStart(data: {
        deployId: string;
    }): {
        ok: boolean;
        message: string;
    };
    receiveEnd(data: {
        deployId: string;
        success: boolean;
    }): {
        ok: boolean;
        message: string;
    };
}
