import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as Joi from '@hapi/joi';
import {
  AllExceptionsFilter,
  MongoExceptionFilter,
} from './http-exception.filter';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ItemsModule } from './items/items.module';
import { ShoppinglistModule } from './shoppinglist/shoppinglist.module';

console.log('process.env.NODE_ENV ', process.env.NODE_ENV);
const envFound = `./.env.${process.env.NODE_ENV || 'development'}`;
console.log('envFound ', envFound);
if (!envFound) throw new Error("Couldn't find .env file");

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFound,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        API_PORT: Joi.number().default(7000),
        API_ADDRESS: Joi.string().default('localhost'),
        MONGODB: Joi.string().default('MONGODB'),
        JWT_SECRET: Joi.string().default('JWT_SECRET'),
        JWT_REFRESH_SECRET: Joi.string().default('JWT_REFRESH_SECRET'),
      }),
    }),
    MongooseModule.forRoot(process.env.MONGODB),
    UsersModule,
    AuthModule,
    ItemsModule,
    ShoppinglistModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: MongoExceptionFilter,
    },
  ],
})
export class AppModule {}
