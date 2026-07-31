import { Controller, Get, Query } from "@nestjs/common";
import {
  MonitoringService,
  OverviewMetrics,
  HistoryPoint,
} from "./monitoring.service";

@Controller("monitoring")
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get("overview")
  getOverview(): Promise<OverviewMetrics> {
    return this.monitoringService.getOverview();
  }

  @Get("history")
  getHistory(@Query("hours") hours?: string): Promise<HistoryPoint[]> {
    const parsed = hours ? parseInt(hours, 10) : undefined;
    return this.monitoringService.getHistory(
      parsed && Number.isFinite(parsed) ? parsed : undefined,
    );
  }
}
