import { Controller, Get, Req, Request, UseGuards } from '@nestjs/common';
// import { Request } from 'express';
import { JwtAuthGuard } from 'src/authentication/jwt.guard';
import { UserSessionService } from 'src/user-session/user-session.service';
import { AuthorizationService } from './authorization.service';

@Controller('authorization')
export class AuthorizationController {
  constructor(
    private userSessionService: UserSessionService,
    private authorizationService: AuthorizationService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async checkNFTs(@Req() request) {
    const token = request.user.uri;
    const query = request.query.contracts;
    const wallet = await this.userSessionService.getWalletOf(token);
    console.log('GET /authorization - check NFT of wallet [' + wallet + ']');

    return {
      ownsNFT: await this.authorizationService.checkNftOwnership(wallet, [
        '0x89de3d3cbceb94734393cc857886aad4da6bc111',
      ]),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('streaming')
  async checkForStreaming(@Request() req) {
    const token = req.user.uri;
    const wallet = await this.userSessionService.getWalletOf(token);
    const query = req.query.contracts;

    return this.authorizationService.isStreamingAvailable(wallet, query);
  }
}
