import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ default: 'user@email.com' })
  email: string;
  @ApiProperty({ default: 'password' })
  password: string;
}
