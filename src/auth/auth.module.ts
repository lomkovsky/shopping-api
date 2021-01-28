import { Module } from '@nestjs/common';
import * as Joi from '@hapi/joi';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
const envFound = `./.env.${process.env.NODE_ENV || 'development'}`;
console.log('envFound ', envFound);
if (!envFound) throw new Error("Couldn't find .env file");

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFound,
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string(),
        JWT_REFRESH_SECRET: Joi.string(),
      }),
    }),
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '10m' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
