import { Module } from '@nestjs/common';
import { AuthenticateService } from './authenticate.service';
import { UserSessionModule } from '../user-session/user-session.module';
import { AuthenticateController } from './authenticate.controller';
import { WalletConnectModule } from 'src/walletconnect/walletconnect.module';

@Module({
  imports: [UserSessionModule, WalletConnectModule],
  providers: [AuthenticateService],
  controllers: [AuthenticateController],
})
export class AuthenticateModule {}
