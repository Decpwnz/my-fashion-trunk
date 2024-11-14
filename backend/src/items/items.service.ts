import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Item } from './schemas/items.schema';
import { CreateItemDto } from './dto/create-item.dto';

@Injectable()
export class ItemsService {
  constructor(@InjectModel(Item.name) private itemModel: Model<Item>) {}

  async findAll(): Promise<Item[]> {
    return this.itemModel.find().exec();
  }

  async findOne(id: string): Promise<Item> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(
        'Invalid ID format: ID must be a valid MongoDB ObjectId',
      );
    }
    const objectId = new Types.ObjectId(id);
    const item = await this.itemModel.findOne({ _id: objectId }).exec();
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    return item;
  }

  async create(createItemDto: CreateItemDto): Promise<Item> {
    const newItem = new this.itemModel(createItemDto);
    return newItem.save();
  }

  async delete(id: string): Promise<Item> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(
        'Invalid ID format: ID must be a valid MongoDB ObjectId',
      );
    }
    const deletedItem = await this.itemModel.findByIdAndDelete(id).exec();
    if (!deletedItem) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return deletedItem;
  }
}
