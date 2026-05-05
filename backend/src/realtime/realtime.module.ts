import { Module } from '@nestjs/common';
import { LogsGateway } from './logs.gateway';
import { LogsService } from './logs.service';
import { RealtimeController } from './realtime.controller';

@Module({
  controllers: [RealtimeController],
  providers: [LogsGateway, LogsService],
  exports: [LogsService],
})
export class RealtimeModule {}
