import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ default: 'User Name' })
  name: string;
  @ApiProperty({ default: 'user@email.com' })
  email: string;
  @ApiProperty({ default: 'password' })
  password: string;
}
