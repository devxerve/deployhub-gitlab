import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class LogsGateway {
  @WebSocketServer()
  server: Server;

  // el cliente se une a un deploy
  @SubscribeMessage('join-deploy')
  handleJoin(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ) {
    const deployId = typeof data === 'object' ? data.deployId : data.replace(/"/g, '');
    console.log(`Cliente unido al deploy: ${deployId}`);
    socket.join(`deploy-${deployId}`);
  }

  // enviar log a un deploy
  sendLog(deployId: string, log: string) {
    console.log(`Emitiendo log para ${deployId}: ${log}`);
    this.server.to(`deploy-${deployId}`).emit('deploy:log', log);
  }

  // enviar estado
  sendStatus(deployId: string, status: string) {
    console.log(`Emitiendo estado para ${deployId}: ${status}`);
    this.server.to(`deploy-${deployId}`).emit('deploy:status', { deployId, status });
  }

  // enviar inicio de deploy
  sendStart(deployId: string) {
    console.log(`Emitiendo inicio para ${deployId}`);
    this.server.to(`deploy-${deployId}`).emit('deploy:start', { deployId });
  }

  // enviar fin de deploy
  sendEnd(deployId: string, success: boolean) {
    console.log(`Emitiendo fin para ${deployId} (success: ${success})`);
    this.server.to(`deploy-${deployId}`).emit('deploy:end', { deployId, success });
  }
}
