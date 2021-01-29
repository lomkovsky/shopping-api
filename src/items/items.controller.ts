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
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('items')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'The new item has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: name and price are required',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Request() req, @Body() createItemDto: CreateItemDto) {
    return this.itemsService.create(req, createItemDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Fetch all items',
  })
  @Get()
  findAll() {
    return this.itemsService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: 'Fetch item by id',
  })
  @ApiNotFoundResponse({
    description: 'Item not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Cast to ObjectId failed',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Update item by id',
  })
  @ApiNotFoundResponse({
    description: 'Item not found',
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
    @Body() updateItemDto: UpdateItemDto,
  ) {
    return this.itemsService.update(req, id, updateItemDto);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 204,
    description: 'Delete item by id',
  })
  @ApiNotFoundResponse({
    description: 'Item not found',
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
    return this.itemsService.remove(req, res, id);
  }
}
