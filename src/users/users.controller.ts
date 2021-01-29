import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiNotFoundResponse, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({
    status: 201,
    description: 'The new user has been successfully created.',
  })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Fetch all users',
  })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: 'Fetch user by id',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Cast to ObjectId failed',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @ApiResponse({
    status: 200,
    description: 'Update user by id',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Cast to ObjectId failed',
  })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiResponse({
    status: 204,
    description: 'Delete user by id',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Cast to ObjectId failed',
  })
  @Delete(':id')
  async remove(@Res() res, @Param('id') id: string) {
    await this.usersService.remove(id);
    return res.status(HttpStatus.NO_CONTENT).json();
  }
}
