import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserSessionDocument = UserSession & Document;

@Schema()
export class UserSession {
  @Prop({ unique: true, required: true })
  sessionId: string;

  @Prop({ required: true })
  sessionJSON: string;

  @Prop()
  wallet: string;

  @Prop()
  expires?: number;
}

export const UserSessionSchema = SchemaFactory.createForClass(UserSession);
