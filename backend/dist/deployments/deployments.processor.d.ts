import { DeploymentsService } from "./deployments.service";
import { GitUtil } from "./utils/git.utils";
import { DockerUtil } from "./utils/docker.utils";
export declare class DeploymentsProcessor {
    private readonly deploymentsService;
    private readonly gitUtil;
    private readonly dockerUtil;
    private readonly logger;
    constructor(deploymentsService: DeploymentsService, gitUtil: GitUtil, dockerUtil: DockerUtil);
    process(id: string): Promise<void>;
}
