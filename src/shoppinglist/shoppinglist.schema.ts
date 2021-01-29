import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { User } from '../users/users.schema';
import { Items } from '../items/items.schema';

export type ShoppingListDocument = ShoppingList & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class ShoppingList {
  @Prop({ required: true })
  name: string;
  @Prop([
    {
      type: MongooseSchema.Types.ObjectId,
      ref: 'Items',
    },
  ])
  items: Items;
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  owner: User;
}

export const ShoppingListSchema = SchemaFactory.createForClass(ShoppingList);
