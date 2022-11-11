import { Module } from '@nestjs/common';
import { UserSessionModule } from 'src/user-session/user-session.module';
import { AuthorizationController } from './authorization.controller';
import { AuthorizationService } from './authorization.service';

@Module({
  imports: [UserSessionModule],
  providers: [AuthorizationService],
  controllers: [AuthorizationController],
})
export class AuthorizationModule {}
