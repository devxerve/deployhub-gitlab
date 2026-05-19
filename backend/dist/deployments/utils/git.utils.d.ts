import { DeploymentsService } from '../deployments.service';
export declare class GitUtil {
    private readonly deploymentsService;
    private readonly logger;
    constructor(deploymentsService: DeploymentsService);
    cloneRepository(repoUrl: string, path: string, id: string): Promise<void>;
}
