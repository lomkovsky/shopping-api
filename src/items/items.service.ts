import {
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

// import { User, UserDocument } from '../users/users.schema';
import { Items, ItemsDocument } from './items.schema';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Items.name)
    private itemsModel: Model<ItemsDocument>, // @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(req, createItemDto: CreateItemDto): Promise<ItemsDocument> {
    const itemNew = new this.itemsModel(createItemDto);
    itemNew.owner = req.user._id;
    let item = await itemNew.save();
    item = await item
      .populate({
        path: 'owner',
        select: 'name',
      })
      .execPopulate();
    return item;
  }

  async findAll(): Promise<ItemsDocument[]> {
    const items = await this.itemsModel
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

  async findOne(id: string): Promise<ItemsDocument> {
    const item = await this.itemsModel
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

  async update(
    req,
    id: string,
    updateItemDto: UpdateItemDto,
  ): Promise<ItemsDocument> {
    let item = await this.itemsModel.findById(id).exec();
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    if (item.owner.toString() !== req.user._id.toString()) {
      throw new BadRequestException('Not owner');
    }
    if (updateItemDto.name) item.name = updateItemDto.name;
    if (updateItemDto.price) item.price = updateItemDto.price;
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
    const item = await this.itemsModel.findById(id).exec();
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    if (item.owner.toString() !== req.user._id.toString()) {
      throw new BadRequestException('Not owner');
    }
    await this.itemsModel.findByIdAndDelete(id).exec();
    return res.status(HttpStatus.NO_CONTENT).json();
  }
}
