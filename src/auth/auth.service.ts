import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { refreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.password) return null;
    const compareResult = await bcrypt.compare(password, user.password);
    if (!compareResult) return null;
    return user;
  }

  async login(user: any) {
    const payload = { _id: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getRefreshToken(userId: number) {
    const payload = { _id: userId };
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
    return refreshToken;
  }

  async addRefreshToken(user: any, refreshToken: string) {
    if (!user.refreshTokens) user.refreshTokens = [];
    if (user.refreshTokens.length) {
      const validRefreshTokens = [];
      user.refreshTokens.forEach((refreshToken) => {
        const decodedToken = this.jwtService.decode(refreshToken);
        const exp = decodedToken['exp'];
        const expirationDateFromToken = new Date(exp * 1000);
        if (expirationDateFromToken >= new Date()) {
          validRefreshTokens.push(refreshToken);
        }
      });
      user.refreshTokens = validRefreshTokens;
    }
    user.refreshTokens.push(refreshToken);
    await user.save();
    return user;
  }

  async refreshToken(req, refreshTokenDto: refreshTokenDto) {
    const header = req.headers.authorization;
    if (!refreshTokenDto.refreshToken) {
      throw new BadRequestException('Bad Request: required fields');
    }
    try {
      if (typeof header !== 'undefined') {
        const bearer = header.split(' ');
        const oldToken = bearer[1];
        const verifiedRefreshToken = this.jwtService.verify(
          refreshTokenDto.refreshToken,
          {
            secret: process.env.JWT_REFRESH_SECRET,
          },
        );
        if (!verifiedRefreshToken) throw new UnauthorizedException();
        const decodedToken = this.jwtService.decode(oldToken);
        const userId = decodedToken['_id'];
        const user = await this.usersService.findByIdAndRefreshToken(
          userId,
          refreshTokenDto.refreshToken,
        );
        if (!user) throw new UnauthorizedException();
        const indexOfToken = user.refreshTokens.indexOf(
          refreshTokenDto.refreshToken,
        );
        if (indexOfToken > -1) {
          user.refreshTokens.splice(indexOfToken, 1);
        }
        await user.save();
        const { access_token } = await this.login(user);
        const refreshToken = await this.getRefreshToken(user._id);
        await this.addRefreshToken(user, refreshToken);
        return { access_token, refreshToken };
      } else {
        throw new BadRequestException('Bad Request: required headers');
      }
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
