import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [HttpModule], // Permite usar HttpService para conectarse al contenedor Express
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
