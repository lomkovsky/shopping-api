import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateShoppinglistDto } from './create-shoppinglist.dto';

export class UpdateShoppinglistDto extends PartialType(CreateShoppinglistDto) {
  @ApiProperty({ default: 'Updated shopping list' })
  name: string;
  @ApiProperty({ default: ['itemId'] })
  items: [string];
}
