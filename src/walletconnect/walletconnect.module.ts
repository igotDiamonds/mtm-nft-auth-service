import { Module } from '@nestjs/common';

import { UserSessionModule } from 'src/user-session/user-session.module';
import { WebSocketGateway } from 'src/websocket.gateway';
import { WalletConnectService } from './walletconnect.service';

@Module({
  imports: [UserSessionModule],
  exports: [WalletConnectService],
  providers: [WalletConnectService, WebSocketGateway],
})
export class WalletConnectModule {}
