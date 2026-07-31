import { Module } from '@nestjs/common';
import { LogsGateway } from './logs.gateway';
import { LogsService } from './logs.service';
import { RealtimeController } from './realtime.controller';
import { LogsController } from './logs.controller';

@Module({
  controllers: [RealtimeController, LogsController],
  providers: [LogsGateway, LogsService],
  exports: [LogsService],
})
export class RealtimeModule {}
