import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticateService {
  constructor(private jwtService: JwtService) {}
  async login(wcSessionURI: any) {
    return { access_token: this.jwtService.sign(wcSessionURI) };
  }
}
