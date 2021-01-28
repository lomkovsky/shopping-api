import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ShoppinglistService } from './shoppinglist.service';
import { CreateShoppinglistDto } from './dto/create-shoppinglist.dto';
import { UpdateShoppinglistDto } from './dto/update-shoppinglist.dto';

@Controller('shoppinglist')
export class ShoppinglistController {
  constructor(private readonly shoppinglistService: ShoppinglistService) {}

  @Post()
  create(@Body() createShoppinglistDto: CreateShoppinglistDto) {
    return this.shoppinglistService.create(createShoppinglistDto);
  }

  @Get()
  findAll() {
    return this.shoppinglistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shoppinglistService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateShoppinglistDto: UpdateShoppinglistDto) {
    return this.shoppinglistService.update(+id, updateShoppinglistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shoppinglistService.remove(+id);
  }
}
