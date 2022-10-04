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
      console.log('Socket connection with token: ', token);

      if (!token) {
        return console.error('Error on socket.afterInit: Token not providen');
      }

      socket.join(token);
    });
  }
}
