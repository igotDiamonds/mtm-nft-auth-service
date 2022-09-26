import {
  ConnectedSocket,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway as WSGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import WalletConnect from '@walletconnect/client';
import { alchemy } from './alchemy.adapter';

import { AuthenticateService } from './authentication/authenticate.service';
import { UserSessionService } from './user-session/user-session.service';

@WSGateway({ cors: true })
export class WebSocketGateway {
  // constructor(
  //   private authenticateService: AuthenticateService,
  //   private userSessionService: UserSessionService,
  // ) {
  //   authenticateService.setOnWalletConnectCallback = this.handleWalletConnect;
  // }
  // 1. Пользователь без кук делает запрос на подключение к сокету
  // 2. Пользователь получает сообщение pleaseAuth, требование авторизации и диплинк WalletConnect
  // 3. Пользователь сканирует QR-код, дает согласие, WalletConnect стреляет 'connect' евент
  // 4. Создается сессия, пользователю проставляется кука
  // 5. В дальнейшем при подключении с этого устройства будет воскрешаться сессия пользователя
  // 6. ???
  @WebSocketServer()
  server: Server;

  // handleConnection(@ConnectedSocket() socket: Socket) {
  //   socket.emit('hello', { client: true });
  // }

  // handleWalletConnect(ctx: WalletConnect, wallet: string) {
  //   this.userSessionService.createSession({
  //     sessionId: '123',
  //     sessionJSON: JSON.stringify(ctx.session),
  //     expires: Infinity,
  //   });

  //   alchemy.nft.getNftsForOwner(wallet).then(console.log);
  // }

  // @SubscribeMessage('requestURL')
  // handleRequestURL(): string {
  //   const url = this.authenticateService.getLoginURL();
  //   console.log('Getting wallet deeplink... ', url);
  //   return url;
  // }
}
