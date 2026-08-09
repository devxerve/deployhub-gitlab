import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { RealtimeModule } from "./realtime/realtime.module";
import { DeploymentsModule } from "./deployments/deployments.module";
import { AuthModule } from "./auth/auth.module";
import { MonitoringModule } from "./monitoring/monitoring.module";
import { HttpMetricsMiddleware } from "./monitoring/http-metrics.middleware";
import { ProjectsModule } from "./projects/projects.module";

@Module({
  imports: [
    RealtimeModule,
    DeploymentsModule,
    AuthModule,
    MonitoringModule,
    ProjectsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpMetricsMiddleware).forRoutes("*");
  }
}
