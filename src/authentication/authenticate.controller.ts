import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { UserSessionService } from 'src/user-session/user-session.service';
import { WalletConnectService } from 'src/walletconnect/walletconnect.service';

@Controller('authenticate')
export class AuthenticateController {
  constructor(
    private walletConnectService: WalletConnectService,
    private userSessionService: UserSessionService,
  ) {}

  @Get('get-deeplink')
  async getDeeplink(@Res({ passthrough: true }) res: Response) {
    const { uri, handshakeTopic } =
      await this.walletConnectService.createConnection();

    res.cookie('auth-token', handshakeTopic);
    return uri;
  }

  @Get('get-wallet')
  async getWalletAddress(@Req() req: Request) {
    return (
      this.userSessionService.getWalletOf(req.cookies['auth-token']) || false
    );
  }

  @Get('request-session')
  async requestSession(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.cookies['auth-token'];
      if (!token) throw new UnauthorizedException();

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
