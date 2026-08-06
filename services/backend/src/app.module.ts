import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { RealtimeModule } from "./realtime/realtime.module";
import { DeploymentsModule } from "./deployments/deployments.module";
import { AuthModule } from "./auth/auth.module";
import { MonitoringModule } from "./monitoring/monitoring.module";
import { HttpMetricsMiddleware } from "./monitoring/http-metrics.middleware";

@Module({
  imports: [RealtimeModule, DeploymentsModule, AuthModule, MonitoringModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpMetricsMiddleware).forRoutes("*");
  }
}
