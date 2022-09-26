import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSessionService } from './user-session.service';
import { UserSession, UserSessionSchema } from '../schemas/user-session.schema';
import { WebSocketGateway } from 'src/websocket.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserSession.name, schema: UserSessionSchema },
    ]),
  ],
  providers: [UserSessionService, WebSocketGateway],
  exports: [UserSessionService],
})
export class UserSessionModule {}
