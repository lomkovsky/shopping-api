import { PartialType } from '@nestjs/mapped-types';
import { CreateListitemDto } from './create-listitem.dto';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateListitemDto extends PartialType(CreateListitemDto) {
  @ApiProperty({ default: 'New name of the item' })
  name: string;
  @ApiProperty({ default: '1000' })
  price: string;
}
