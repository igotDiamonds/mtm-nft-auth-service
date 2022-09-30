import {
  Controller,
  Get,
  HttpStatus,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { UserSessionService } from 'src/user-session/user-session.service';
import { WalletConnectService } from 'src/walletconnect/walletconnect.service';
import { AuthenticateService } from './authenticate.service';
import { JwtAuthGuard } from './jwt.guard';

@Controller('authenticate')
export class AuthenticateController {
  constructor(
    private walletConnectService: WalletConnectService,
    private userSessionService: UserSessionService,
    private authenticateService: AuthenticateService,
  ) {}

  @Get('get-deeplink')
  async getDeeplink() {
    const { uri } = await this.walletConnectService.createConnection();

    const jwt = await this.authenticateService.login(uri);

    return { uri, ...jwt };
  }

  @UseGuards(JwtAuthGuard)
  @Get('request-session')
  async requestSession(@Request() req, @Res() res: Response) {
    try {
      const token = req.user.uri;
      console.log(token);

      await this.walletConnectService.restoreConnection(token);

      res.status(HttpStatus.NO_CONTENT);
    } catch (error) {
      console.log(error);

      res.status(HttpStatus.UNAUTHORIZED);
    } finally {
      res.send();
    }
  }
}
