import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ default: 'Updated Admin Name' })
  name: string;
  @ApiProperty({ default: 'adminUpdated@email.com' })
  email: string;
  @ApiProperty({ default: 'passwordUpdated' })
  password: string;
}
