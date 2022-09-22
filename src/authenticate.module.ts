import { Module } from '@nestjs/common';
import { AuthenticateGateway } from './authenticate.gateway';
import { AuthenticateService } from './authenticate.service';
import { UserSessionModule } from './user-session/user-session.module';

@Module({
  imports: [UserSessionModule],
  providers: [AuthenticateService, AuthenticateGateway],
})
export class AuthenticateModule {}
