import { ApiProperty } from '@nestjs/swagger';

export class CreateItemDto {
  @ApiProperty({ default: 'New item' })
  name: string;
  @ApiProperty({ default: '100' })
  price: string;
}
