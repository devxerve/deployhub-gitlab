import { Module } from "@nestjs/common";
import { MonitoringController } from "./monitoring.controller";
import { MonitoringService } from "./monitoring.service";
import { MetricsController } from "./metrics.controller";

@Module({
  controllers: [MonitoringController, MetricsController],
  providers: [MonitoringService],
})
export class MonitoringModule {}
