import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  UserSession,
  UserSessionDocument,
} from '../schemas/user-session.schema';

@Injectable()
export class UserSessionService {
  constructor(
    @InjectModel(UserSession.name)
    private userSessionModel: Model<UserSessionDocument>,
  ) {}

  async createSession(userSession: UserSession) {
    const createdUserSession = new this.userSessionModel(userSession);

    return createdUserSession.save();
  }
  async deleteSession(token: string) {
    return this.userSessionModel.findOneAndRemove({ sessionId: token }).exec();
  }

  async getWalletOf(token: string) {
    const session = await this.userSessionModel
      .findOne({ sessionId: token })
      .exec();

    return session?.wallet;
  }

  async getSession(sessionId: string) {
    return this.userSessionModel.findOne({ sessionId }).exec();
  }
}
