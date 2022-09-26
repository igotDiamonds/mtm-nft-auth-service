import { Module } from '@nestjs/common';
import { UserSessionModule } from '../user-session/user-session.module';
import { AuthenticateController } from './authenticate.controller';
import { WalletConnectModule } from 'src/walletconnect/walletconnect.module';

@Module({
  imports: [UserSessionModule, WalletConnectModule],
  controllers: [AuthenticateController],
})
export class AuthenticateModule {}
