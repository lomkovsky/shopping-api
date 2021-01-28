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
  HttpStatus,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ListitemsService } from './listitems.service';
import { CreateListitemDto } from './dto/create-listitem.dto';
import { UpdateListitemDto } from './dto/update-listitem.dto';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

@Controller('listitems')
export class ListitemsController {
  constructor(private readonly listitemsService: ListitemsService) {}

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
  create(@Request() req, @Body() createListitemDto: CreateListitemDto) {
    return this.listitemsService.create(req, createListitemDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Fetch all items',
  })
  @Get()
  findAll() {
    return this.listitemsService.findAll();
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
    return this.listitemsService.findOne(id);
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
    @Body() updateListitemDto: UpdateListitemDto,
  ) {
    return this.listitemsService.update(req, id, updateListitemDto);
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
    return this.listitemsService.remove(req, res, id);
  }
}
