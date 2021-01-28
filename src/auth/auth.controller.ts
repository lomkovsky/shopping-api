import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  UseGuards,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { refreshTokenDto } from './dto/refresh-token.dto';

import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: 200,
    description: 'New tokens successfully created.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @UseGuards(AuthGuard('local'))
  @Post('login')
  public async login(
    @Request() req,
    @Res() res,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() loginUserDto: LoginUserDto,
  ): Promise<any> {
    const { user } = req;
    const { access_token } = await this.authService.login(user);
    const refreshToken = await this.authService.getRefreshToken(user._id);
    await this.authService.addRefreshToken(user, refreshToken);
    return res.status(HttpStatus.OK).json({ access_token, refreshToken });
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'New token successfully refreshed.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @Post('refresh')
  public async refresh(
    @Request() req,
    @Res() res,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() refreshTokenDto: refreshTokenDto,
  ): Promise<any> {
    const userUpdated = await this.authService.refreshToken(
      req,
      refreshTokenDto,
    );
    return res.status(HttpStatus.OK).json(userUpdated);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Fetch user by token',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMe(@Request() req, @Res() res) {
    const { user } = req;
    return res.status(HttpStatus.OK).json(user);
  }
}
