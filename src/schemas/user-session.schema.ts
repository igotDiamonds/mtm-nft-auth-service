import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserSessionDocument = UserSession & Document;

@Schema()
export class UserSession {
  @Prop()
  sessionId: string;

  @Prop()
  sessionJSON: string;

  @Prop()
  wallet: string;

  @Prop()
  expires?: number;
}

export const UserSessionSchema = SchemaFactory.createForClass(UserSession);
