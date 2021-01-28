import { Injectable } from '@nestjs/common';
import { CreateShoppinglistDto } from './dto/create-shoppinglist.dto';
import { UpdateShoppinglistDto } from './dto/update-shoppinglist.dto';

@Injectable()
export class ShoppinglistService {
  create(createShoppinglistDto: CreateShoppinglistDto) {
    return 'This action adds a new shoppinglist';
  }

  findAll() {
    return `This action returns all shoppinglist`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shoppinglist`;
  }

  update(id: number, updateShoppinglistDto: UpdateShoppinglistDto) {
    return `This action updates a #${id} shoppinglist`;
  }

  remove(id: number) {
    return `This action removes a #${id} shoppinglist`;
  }
}
