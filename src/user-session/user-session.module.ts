import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../authentication/constants';
import { UserSessionService } from './user-session.service';
import { UserSession, UserSessionSchema } from '../schemas/user-session.schema';
import { WebSocketModule } from 'src/websocket.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserSession.name, schema: UserSessionSchema },
    ]),
    JwtModule.register({
      secret: jwtConstants.secret,
      // signOptions: { expiresIn: 60 },
    }),
  ],
  providers: [UserSessionService],
  exports: [UserSessionService],
})
export class UserSessionModule {}
