import { Module } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { DeploymentsController } from './deployments.controller';
import { DeploymentsService } from './deployments.service';
import { DeploymentsProcessor } from './deployments.processor';
import { RealtimeModule } from '../realtime/realtime.module';
import { GitUtil } from 'src/deployments/utils/git.utils';
import { PrismaService } from '../prisma/prisma.service'; // mock de DB, Daniel
import { DockerUtil } from 'src/deployments/utils/docker.utils';

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
        PrismaService, // mock de DB, Daniel
    ],
    exports: [
        DeploymentsService
    ],
})
export class DeploymentsModule {}