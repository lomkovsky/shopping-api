import { ApiProperty } from '@nestjs/swagger';

export class refreshTokenDto {
  @ApiProperty()
  refreshToken: string;
}
