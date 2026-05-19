import { CreateDeployDto } from './dto/create-deploy.dto';
import { DeploymentsService } from './deployments.service';
export declare class DeploymentsController {
    private readonly deploymentsService;
    constructor(deploymentsService: DeploymentsService);
    create(dto: CreateDeployDto): Promise<any>;
    findAll(): Promise<any>;
    remove(id: string): Promise<any>;
    findOne(id: string): Promise<any>;
    getStatus(id: string): Promise<{
        id: any;
        status: any;
    }>;
}
