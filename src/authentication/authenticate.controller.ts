import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { WalletConnectService } from 'src/walletconnect/walletconnect.service';
import { AuthenticateService } from './authenticate.service';
import { JwtAuthGuard } from './jwt.guard';

@Controller('authenticate')
export class AuthenticateController {
  constructor(
    private walletConnectService: WalletConnectService,
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
  async requestSession(@Request() req) {
    const token = req.user.uri;

    const wcConnection = await this.walletConnectService.restoreConnection(
      token,
    );

    return { uri: wcConnection.uri, session: wcConnection.session };
  }
}
