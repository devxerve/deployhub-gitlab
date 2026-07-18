import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RealtimeModule } from './realtime/realtime.module';
import { DeploymentsModule } from './deployments/deployments.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    RealtimeModule,
    DeploymentsModule,
	AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
