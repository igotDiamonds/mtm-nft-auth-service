import {
  OnGatewayInit,
  WebSocketGateway as WSGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WSGateway({ cors: true })
export class WebSocketGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    server.on('connection', (socket) => {
      const token = socket.handshake.auth.token;

      if (!token) {
        throw new Error('Token not providen');
      }

      socket.join(token);

      console.log(
        `Socket with id - ${socket.id}  is in rooms - ${socket.rooms}`,
      );
    });
  }
}
