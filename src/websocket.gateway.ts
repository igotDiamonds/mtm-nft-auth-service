import {
  WebSocketGateway as WSGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WSGateway({ cors: true })
export class WebSocketGateway {
  @WebSocketServer()
  server: Server;
}
