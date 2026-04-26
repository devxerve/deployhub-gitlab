import { Controller, Post, Body } from '@nestjs/common';
import { LogsService } from './logs.service';

@Controller('realtime')
export class RealtimeController {
  constructor(private readonly logsService: LogsService) {}

  @Post('log')
  receiveLog(@Body() data: { deployId: string; log: string }) {
    this.logsService.sendLog(data.deployId, data.log);
    return { ok: true, message: 'Log broadcasted' };
  }

  @Post('status')
  receiveStatus(@Body() data: { deployId: string; status: string }) {
    this.logsService.sendStatus(data.deployId, data.status);
    return { ok: true, message: 'Status broadcasted' };
  }
}
