import { Module } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { DeploymentsController } from './deployments.controller';
import { DeploymentsService } from './deployments.service';
import { DeploymentsProcessor } from './deployments.processor';
import { LogsService } from 'src/realtime/logs.service';
import { GitUtil } from 'src/deployments/utils/git.utils';
import { DockerUtil } from 'src/deployments/utils/docker.utils';

@Module ({
    imports: [
        LogsService
    ],
    controllers: [
        DeploymentsController
    ],
    providers: [
        DeploymentsService,
        DeploymentsProcessor,
        GitUtil,
        DockerUtil
    ],
    exports: [
        DeploymentsService
    ],
})
export class DeploymentsModule {}