import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ListitemsService } from './listitems.service';
import { ListitemsController } from './listitems.controller';
import { Listitems, ListitemsSchema } from './listitems.shema';
import { User, UserSchema } from '../users/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Listitems.name, schema: ListitemsSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [ListitemsController],
  providers: [ListitemsService],
  exports: [ListitemsService],
})
export class ListitemsModule {}
