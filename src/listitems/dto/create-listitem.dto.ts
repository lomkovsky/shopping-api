import { ApiProperty } from '@nestjs/swagger';

export class CreateListitemDto {
  @ApiProperty({ default: 'New item' })
  name: string;
  @ApiProperty({ default: '100' })
  price: string;
}
