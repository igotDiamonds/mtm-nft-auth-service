import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthenticateModule } from './authenticate.module';
import { UserSessionModule } from './user-session/user-session.module';

@Module({
  imports: [
    UserSessionModule,
    AuthenticateModule,
    MongooseModule.forRoot(
      'mongodb+srv://mtmadmin:BS33eYIYbyb8GaKY@mtm.q1hphfi.mongodb.net/?retryWrites=true&w=majority',
      // 'mongodb+srv://mtmadmin:BS33eYIYbyb8GaKY@mtm.q1hphfi.mongodb.net/?retryWrites=true&w=majority',
    ),
  ],
})
export class AppModule {}
