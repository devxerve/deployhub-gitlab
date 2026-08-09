import { Module } from "@nestjs/common";
import { LogsGateway } from "./logs.gateway";
import { LogsService } from "./logs.service";

@Module({
  providers: [LogsGateway, LogsService],
  exports: [LogsService],
})
export class RealtimeModule {}
