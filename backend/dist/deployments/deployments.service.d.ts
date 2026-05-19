import { PrismaService } from '../prisma/prisma.service';
import { LogsService } from '../realtime/logs.service';
import { CreateDeployDto } from './dto/create-deploy.dto';
import { DeployStatus } from './constants/deploy-states';
export declare class DeploymentsService {
    private readonly prisma;
    private readonly logsService;
    private readonly logger;
    private readonly BASE_PORT;
    constructor(prisma: PrismaService, logsService: LogsService);
    createDeploy(dto: CreateDeployDto): Promise<any>;
    getAvailablePort(): Promise<number>;
    updateStatusRealtime(id: string, status: DeployStatus): Promise<void>;
    addLogRealtime(id: string, message: string): Promise<void>;
    getDeployById(id: string): Promise<any>;
    getAllDeploys(): Promise<any>;
    getDeployStatus(id: string): Promise<{
        id: any;
        status: any;
    }>;
    remove(id: string): Promise<any>;
}
