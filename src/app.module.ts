import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { WalletConnectModule } from './walletconnect/walletconnect.module';
import { AuthenticateModule } from './authentication/authenticate.module';
import { UserSessionModule } from './user-session/user-session.module';
import { AuthenticateController } from './authentication/authenticate.controller';
import { AuthorizationController } from './authorization/authorization.controller';

@Module({
  imports: [
    UserSessionModule,
    AuthenticateModule,
    MongooseModule.forRoot(
      'mongodb+srv://mtmadmin:BS33eYIYbyb8GaKY@mtm.q1hphfi.mongodb.net/?retryWrites=true&w=majority',
      // 'mongodb+srv://mtmadmin:BS33eYIYbyb8GaKY@mtm.q1hphfi.mongodb.net/?retryWrites=true&w=majority',
    ),
    WalletConnectModule,
  ],
  controllers: [AuthorizationController],
})
export class AppModule {}
