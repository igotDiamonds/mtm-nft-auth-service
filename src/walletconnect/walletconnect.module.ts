import { Module } from '@nestjs/common';

import { UserSessionModule } from 'src/user-session/user-session.module';
import { WebSocketModule } from 'src/websocket.module';
import { WalletConnectService } from './walletconnect.service';

@Module({
  imports: [UserSessionModule, WebSocketModule],
  exports: [WalletConnectService],
  providers: [WalletConnectService],
})
export class WalletConnectModule {}
