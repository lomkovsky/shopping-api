import { ApiProperty } from '@nestjs/swagger';

export class CreateShoppinglistDto {
  @ApiProperty({ default: 'New shopping list' })
  name: string;
  @ApiProperty({ default: ['itemId'] })
  items: [string];
}
