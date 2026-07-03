import { Injectable } from "@nestjs/common";
import { LogsGateway } from "./logs.gateway";

@Injectable()
export class LogsService {
  constructor(private readonly gateway: LogsGateway) {}

  sendLog(deployId: string, log: string) {
    this.gateway.sendLog(deployId, log);
  }

  sendStatus(deployId: string, status: string) {
    this.gateway.sendStatus(deployId, status);
  }

  sendStart(deployId: string) {
    this.gateway.sendStart(deployId);
  }

  sendEnd(deployId: string, success: boolean) {
    this.gateway.sendEnd(deployId, success);
  }
}
