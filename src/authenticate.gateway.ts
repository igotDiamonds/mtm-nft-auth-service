import {
  ConnectedSocket,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import WalletConnect from '@walletconnect/client';
import { alchemy } from './alchemy.adapter';

import { AuthenticateService } from './authenticate.service';
import { UserSessionService } from './user-session/user-session.service';

@WebSocketGateway({ cors: true })
export class AuthenticateGateway implements OnGatewayConnection {
  constructor(
    private authenticateService: AuthenticateService,
    private userSessionService: UserSessionService,
  ) {
    authenticateService.setOnWalletConnectCallback = this.handleWalletConnect;
  }

  @WebSocketServer()
  server: Server;

  handleConnection(@ConnectedSocket() socket: Socket) {
    socket.emit('hello', { client: true });
  }

  handleWalletConnect(ctx: WalletConnect, wallet: string) {
    this.userSessionService.createSession({
      sessionId: '123',
      sessionJSON: JSON.stringify(ctx.session),
      expires: Infinity,
    });

    alchemy.nft.getNftsForOwner(wallet).then(console.log);
  }

  @SubscribeMessage('requestURL')
  handleRequestURL(): string {
    const url = this.authenticateService.getLoginURL();
    console.log('Getting wallet deeplink... ', url);
    return url;
  }
}
