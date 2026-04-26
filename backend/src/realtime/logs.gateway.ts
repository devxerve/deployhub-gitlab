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

  // cliente se une a un deploy
  @SubscribeMessage('join-deploy')
  handleJoin(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ) {
    // Si recibimos un objeto, extraemos el ID, si es string lo limpiamos de comillas
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
    this.server.to(`deploy-${deployId}`).emit('deploy:status', status);
  }
}
