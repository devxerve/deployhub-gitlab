import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RealtimeModule } from './realtime/realtime.module';

import { DeploymentsController } from './deployments/deployments.controller';
import { DeploymentsService } from './deployments/deployments.service';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [RealtimeModule],
  controllers: [
    AppController,
    DeploymentsController
  ],
  providers: [
    AppService,
    DeploymentsService,
    PrismaService,
  ],
})
export class AppModule {}
