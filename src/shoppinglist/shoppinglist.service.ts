import {
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateShoppinglistDto } from './dto/create-shoppinglist.dto';
import { UpdateShoppinglistDto } from './dto/update-shoppinglist.dto';
import { ShoppingList, ShoppingListDocument } from './shoppinglist.schema';

@Injectable()
export class ShoppinglistService {
  constructor(
    @InjectModel(ShoppingList.name)
    private shoppingListModel: Model<ShoppingListDocument>,
  ) {}

  async create(
    req,
    createShoppinglistDto: CreateShoppinglistDto,
  ): Promise<ShoppingListDocument> {
    const shoppingListNew = new this.shoppingListModel(createShoppinglistDto);
    shoppingListNew.owner = req.user._id;
    let shoppingList = await shoppingListNew.save();
    shoppingList = await shoppingList
      .populate({
        path: 'owner',
        select: 'name',
      })
      .populate({
        path: 'items',
        select: 'name',
      })
      .execPopulate();
    return shoppingList;
  }

  async findAll(): Promise<ShoppingListDocument[]> {
    const items = await this.shoppingListModel
      .find()
      .select({
        name: 1,
        items: 1,
        owner: 1,
        _id: 1,
      })
      .populate({
        path: 'owner',
        select: 'name',
      })
      .populate({
        path: 'items',
        select: 'name',
      })
      .exec();
    return items;
  }

  async findOne(id: string): Promise<ShoppingListDocument> {
    const item = await this.shoppingListModel
      .findById(id)
      .select({
        name: 1,
        items: 1,
        owner: 1,
        _id: 1,
      })
      .populate({
        path: 'owner',
        select: 'name',
      })
      .populate({
        path: 'items',
        select: 'name',
      })
      .exec();
    if (!item) {
      throw new NotFoundException('Shopping list not found');
    }
    return item;
  }

  async update(
    req,
    id: string,
    updateShoppinglistDto: any,
  ): Promise<ShoppingListDocument> {
    let shoppingList = await this.shoppingListModel.findById(id).exec();
    if (!shoppingList) {
      throw new NotFoundException('Shopping List not found');
    }
    if (shoppingList.owner.toString() !== req.user._id.toString()) {
      throw new BadRequestException('Not owner');
    }
    if (updateShoppinglistDto.name)
      shoppingList.name = updateShoppinglistDto.name;
    if (updateShoppinglistDto.items)
      shoppingList.items = updateShoppinglistDto.items;
    await shoppingList.save();
    shoppingList = await shoppingList
      .populate({
        path: 'owner',
        select: 'name',
      })
      .populate({
        path: 'items',
        select: 'name',
      })
      .execPopulate();
    return shoppingList;
  }

  async remove(req, res, id: string) {
    const shoppingList = await this.shoppingListModel.findById(id).exec();
    if (!shoppingList) {
      throw new NotFoundException('Shopping list not found');
    }
    if (shoppingList.owner.toString() !== req.user._id.toString()) {
      throw new BadRequestException('Not owner');
    }
    await this.shoppingListModel.findByIdAndDelete(id).exec();
    return res.status(HttpStatus.NO_CONTENT).json();
  }
}
