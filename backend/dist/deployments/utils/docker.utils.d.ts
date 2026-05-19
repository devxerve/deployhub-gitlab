import { DeploymentsService } from '../deployments.service';
export declare class DockerUtil {
    private readonly deploymentsService;
    private readonly logger;
    constructor(deploymentsService: DeploymentsService);
    buildImage(id: string, path: string): Promise<void>;
    runContainer(id: string, port: number): Promise<void>;
}
