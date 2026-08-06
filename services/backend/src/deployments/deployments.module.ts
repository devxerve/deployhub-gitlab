import { Module } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { DeploymentsController } from './deployments.controller';
import { DeploymentsService } from './deployments.service';
import { DeploymentsProcessor } from './deployments.processor';
import { RealtimeModule } from '../realtime/realtime.module';
import { GitUtil } from './utils/git.utils';
import { PrismaService } from '../prisma/prisma.service';
import { DockerUtil } from './utils/docker.utils';

@Module ({
    imports: [
        RealtimeModule
    ],
    controllers: [
        DeploymentsController
    ],
    providers: [
        DeploymentsService,
        DeploymentsProcessor,
        GitUtil,
        DockerUtil,
        PrismaService,
    ],
    exports: [
        DeploymentsService
    ],
})
export class DeploymentsModule {}
