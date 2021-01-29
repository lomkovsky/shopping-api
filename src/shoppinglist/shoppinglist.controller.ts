import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ShoppinglistService } from './shoppinglist.service';
import { CreateShoppinglistDto } from './dto/create-shoppinglist.dto';
import { UpdateShoppinglistDto } from './dto/update-shoppinglist.dto';
import {
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('shoppinglist')
@Controller('shoppinglist')
export class ShoppinglistController {
  constructor(private readonly shoppinglistService: ShoppinglistService) {}

  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'The new shopping list has been successfully created.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: name required',
  })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Request() req, @Body() createShoppinglistDto: CreateShoppinglistDto) {
    return this.shoppinglistService.create(req, createShoppinglistDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Fetch all shopping lists',
  })
  @Get()
  findAll() {
    return this.shoppinglistService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: 'Fetch shopping list by id',
  })
  @ApiNotFoundResponse({
    description: 'Shopping list not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Cast to ObjectId failed',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shoppinglistService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Update shopping list by id',
  })
  @ApiNotFoundResponse({
    description: 'Shopping list not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Cast to ObjectId failed / Not owner',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateShoppinglistDto: UpdateShoppinglistDto,
  ) {
    return this.shoppinglistService.update(req, id, updateShoppinglistDto);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 204,
    description: 'Delete shopping list by id',
  })
  @ApiNotFoundResponse({
    description: 'Shopping list not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Cast to ObjectId failed / Not owner',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Res() res, @Request() req, @Param('id') id: string) {
    return this.shoppinglistService.remove(req, res, id);
  }
}
