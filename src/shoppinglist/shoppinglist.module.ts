import { Module } from '@nestjs/common';
import { ShoppinglistService } from './shoppinglist.service';
import { ShoppinglistController } from './shoppinglist.controller';

@Module({
  controllers: [ShoppinglistController],
  providers: [ShoppinglistService]
})
export class ShoppinglistModule {}
