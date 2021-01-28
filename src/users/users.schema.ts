/* eslint-disable @typescript-eslint/no-this-alias */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export type UserDocument = User & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class User {
  @Prop({ required: true })
  password: string;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  email: string;
  @Prop()
  refreshTokens: [string];
  publicFields: () => UserDocument;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.publicFields = async function () {
  this;
  const userObject: any = this.toObject();
  delete userObject.refreshTokens;
  delete userObject.password;
  return userObject;
};

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const userObject: any = this;
    userObject.password = await bcrypt.hash(userObject.password, 8);
    return userObject;
  }
  next();
});
