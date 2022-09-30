import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserSessionModule } from '../user-session/user-session.module';
import { AuthenticateController } from './authenticate.controller';
import { WalletConnectModule } from 'src/walletconnect/walletconnect.module';
import { AuthenticateService } from './authenticate.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UserSessionModule,
    WalletConnectModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      // signOptions: { expiresIn: 60 },
    }),
  ],
  providers: [AuthenticateService, JwtStrategy],
  controllers: [AuthenticateController],
})
export class AuthenticateModule {}
