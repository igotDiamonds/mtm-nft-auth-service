import { Controller, Get, Req, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { alchemy } from 'src/alchemy.adapter';
import { UserSessionService } from 'src/user-session/user-session.service';

@Controller('authorization')
export class AuthorizationController {
  constructor(private userSessionService: UserSessionService) {}
  @Get()
  async checkNFTs(@Req() req: Request) {
    const token = req.cookies['auth-token'];
    if (!token) throw new UnauthorizedException();
    const wallet = await this.userSessionService.getWalletOf(token);
    return {
      ownsNFT: await alchemy.nft.checkNftOwnership(wallet, [
        '0x89de3d3cbceb94734393cc857886aad4da6bc111',
      ]),
    };
  }
}
