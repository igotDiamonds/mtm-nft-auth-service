import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { WalletConnectModule } from './walletconnect/walletconnect.module';
import { AuthenticateModule } from './authentication/authenticate.module';
import { UserSessionModule } from './user-session/user-session.module';
import { AuthorizationController } from './authorization/authorization.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `.env.${process.env.NODE_ENV}` }),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/?retryWrites=true&w=majority`,
    ),
    UserSessionModule,
    AuthenticateModule,
    WalletConnectModule,
  ],
  controllers: [AuthorizationController],
})
export class AppModule {}
