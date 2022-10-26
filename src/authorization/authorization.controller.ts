import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { alchemy } from 'src/alchemy.adapter';
import { JwtAuthGuard } from 'src/authentication/jwt.guard';
import { UserSessionService } from 'src/user-session/user-session.service';

@Controller('authorization')
export class AuthorizationController {
  constructor(private userSessionService: UserSessionService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async checkNFTs(@Request() req) {
    const token = req.user.uri;
    const wallet = await this.userSessionService.getWalletOf(token);
    console.log('GET /authorization - check NFT of wallet [' + wallet + ']');

    return {
      ownsNFT: await alchemy.nft.checkNftOwnership(wallet, [
        '0x89de3d3cbceb94734393cc857886aad4da6bc111',
      ]),
    };
  }
}
