import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShoppinglistService } from './shoppinglist.service';
import { ShoppinglistController } from './shoppinglist.controller';
import { Items, ItemsSchema } from '../items/items.schema';
import { User, UserSchema } from '../users/users.schema';
import { ShoppingList, ShoppingListSchema } from './shoppinglist.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Items.name, schema: ItemsSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: ShoppingList.name, schema: ShoppingListSchema },
    ]),
  ],
  controllers: [ShoppinglistController],
  providers: [ShoppinglistService],
  exports: [ShoppinglistService],
})
export class ShoppinglistModule {}
