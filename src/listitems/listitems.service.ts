import {
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { CreateListitemDto } from './dto/create-listitem.dto';
import { UpdateListitemDto } from './dto/update-listitem.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserDocument } from '../users/users.schema';
import { Listitems, ListitemsDocument } from './listitems.shema';

@Injectable()
export class ListitemsService {
  constructor(
    @InjectModel(Listitems.name)
    private listitemsModel: Model<ListitemsDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(req, createListitemDto: CreateListitemDto) {
    const listitemNew = new this.listitemsModel(createListitemDto);
    listitemNew.owner = req.user._id;
    const item = await listitemNew.save();
    return item;
  }

  async findAll() {
    const items = await this.listitemsModel
      .find()
      .select({
        name: 1,
        price: 1,
        owner: 1,
        _id: 1,
      })
      .populate({
        path: 'owner',
        select: 'name',
      })
      .exec();
    return items;
  }

  async findOne(id: string) {
    const item = await this.listitemsModel
      .findById(id)
      .select({
        name: 1,
        price: 1,
        owner: 1,
        _id: 1,
      })
      .populate({
        path: 'owner',
        select: 'name',
      })
      .exec();
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    return item;
  }

  async update(req, id: string, updateListitemDto: UpdateListitemDto) {
    let item = await this.listitemsModel.findById(id).exec();
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    if (item.owner.toString() !== req.user._id.toString()) {
      throw new BadRequestException('Not owner');
    }
    if (updateListitemDto.name) item.name = updateListitemDto.name;
    if (updateListitemDto.price) item.price = updateListitemDto.price;
    await item.save();
    item = await item
      .populate({
        path: 'owner',
        select: 'name',
      })
      .execPopulate();
    return item;
  }

  async remove(req, res, id: string) {
    const item = await this.listitemsModel.findById(id).exec();
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    if (item.owner.toString() !== req.user._id.toString()) {
      throw new BadRequestException('Not owner');
    }
    await this.listitemsModel.findByIdAndDelete(id).exec();
    return res.status(HttpStatus.NO_CONTENT).json();
  }
}
