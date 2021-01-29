import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { User, UserDocument } from './users.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    const user = await createdUser.save();
    return user.publicFields();
  }

  async findAll(): Promise<UserDocument[]> {
    const users = await this.userModel
      .find()
      .select({
        name: 1,
        email: 1,
        company: 1,
        _id: 1,
      })
      .exec();
    return users;
  }

  async findOne(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.publicFields();
  }

  async findByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email: email }).exec();
    return user;
  }

  async findByIdAndRefreshToken(
    _id: string,
    refreshToken: string,
  ): Promise<UserDocument> {
    const user = await this.userModel
      .findOne({ _id: _id, refreshTokens: refreshToken })
      .exec();
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (updateUserDto.name) user.name = updateUserDto.name;
    if (updateUserDto.email) user.email = updateUserDto.email;
    if (updateUserDto.password) user.password = updateUserDto.password;
    await user.save();
    return user.publicFields();
  }

  async remove(id: string): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
