import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import {
  MonitoringService,
  OverviewMetrics,
  HistoryPoint,
  ActiveAlert,
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

  @Get("alerts")
  getAlerts(): ActiveAlert[] {
    return this.monitoringService.getActiveAlerts();
  }

  // Called by Alertmanager (services/infra/alertmanager/alertmanager.yml), not
  // by the browser — no user session exists for it to authenticate with.
  @Post("alerts")
  receiveAlerts(@Body() payload: unknown): { ok: true } {
    this.monitoringService.receiveAlertWebhook(payload);
    return { ok: true };
  }
}
