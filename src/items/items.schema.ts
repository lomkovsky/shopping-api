import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { User } from '../users/users.schema';

export type ItemsDocument = Items & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Items {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  price: string;
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  owner: User;
}

export const ItemsSchema = SchemaFactory.createForClass(Items);
