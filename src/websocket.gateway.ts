import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayInit,
  WebSocketGateway as WSGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WSGateway({ cors: true })
export class WebSocketGateway implements OnGatewayInit {
  constructor(private jwtService: JwtService) {}
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    server.on('connection', (socket) => {
      const token = this.jwtService.decode(socket.handshake.auth.token);

      if (!token) {
        return console.error('Socket.io connection error - no token');
      }

      console.log('Socket.io connected: ', token);

      socket.join(token as string);
      console.log('Socket.io joined room - ' + token);
    });
  }
}
