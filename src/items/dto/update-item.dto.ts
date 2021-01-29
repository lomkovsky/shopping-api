import { PartialType } from '@nestjs/mapped-types';
import { CreateItemDto } from './create-item.dto';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateItemDto extends PartialType(CreateItemDto) {
  @ApiProperty({ default: 'New name of the item' })
  name: string;
  @ApiProperty({ default: '1000' })
  price: string;
}
