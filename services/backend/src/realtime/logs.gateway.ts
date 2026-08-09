import { Logger } from "@nestjs/common";

import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";

import type { Server, Socket } from "socket.io";

const socketAllowedOrigins = (
  process.env.CORS_ORIGINS ?? "https://localhost:8443,http://localhost:3000"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

function extractDeployId(data: unknown): string | null {
  if (typeof data === "string") {
    const deployId = data.replace(/"/g, "").trim();

    return deployId.length > 0 ? deployId : null;
  }

  if (typeof data !== "object" || data === null || !("deployId" in data)) {
    return null;
  }

  const deployId = (data as Record<string, unknown>).deployId;

  if (typeof deployId !== "string") {
    return null;
  }

  const normalized = deployId.trim();

  return normalized.length > 0 ? normalized : null;
}

@WebSocketGateway({
  cors: {
    origin: socketAllowedOrigins,
    credentials: true,
  },
})
export class LogsGateway {
  private readonly logger = new Logger(LogsGateway.name);

  @WebSocketServer()
  server!: Server;

  @SubscribeMessage("join-deploy")
  async handleJoin(
    @MessageBody() data: unknown,
    @ConnectedSocket()
    socket: Socket,
  ): Promise<void> {
    const deployId = extractDeployId(data);

    if (!deployId) {
      this.logger.warn("Invalid join-deploy payload received");

      return;
    }

    await socket.join(`deploy-${deployId}`);

    this.logger.debug(`Client joined deploy ${deployId}`);
  }

  sendLog(deployId: string, log: string): void {
    this.server.to(`deploy-${deployId}`).emit("deploy:log", log);
  }

  sendStatus(deployId: string, status: string): void {
    this.server.to(`deploy-${deployId}`).emit("deploy:status", {
      deployId,
      status,
    });
  }
}
