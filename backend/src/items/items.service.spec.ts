import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ItemsService } from './items.service';
import { Item } from './schemas/items.schema';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ItemsService', () => {
  let service: ItemsService;
  let model: Model<Item>;

  const mockItem = {
    _id: new Types.ObjectId(),
    name: 'Test Item',
    category: 'Apparel',
    imageUrl: 'http://example.com/image.jpg',
  };

  const mockCreateItemDto = {
    name: 'New Item',
    category: 'Electronics',
    imageUrl: 'http://example.com/new-image.jpg',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemsService,
        {
          provide: getModelToken(Item.name),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            findByIdAndDelete: jest.fn(),
            create: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ItemsService>(ItemsService);
    model = module.get<Model<Item>>(getModelToken(Item.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of items', async () => {
      const mockItems = [mockItem];
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockItems),
      } as any);

      const result = await service.findAll();
      expect(result).toEqual(mockItems);
      expect(model.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single item', async () => {
      const mockId = mockItem._id.toString();
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockItem),
      } as any);

      const result = await service.findOne(mockId);
      expect(result).toEqual(mockItem);
      expect(model.findOne).toHaveBeenCalledWith({
        _id: new Types.ObjectId(mockId),
      });
    });

    it('should throw BadRequestException if invalid ID is provided', async () => {
      const invalidId = 'invalid-id';
      await expect(service.findOne(invalidId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if item is not found', async () => {
      const validId = new Types.ObjectId().toString();
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      await expect(service.findOne(validId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new item', async () => {
      const createdItem = { ...mockItem };
      jest.spyOn(model, 'create').mockResolvedValueOnce(createdItem as any);

      const result = await service.create(mockCreateItemDto);
      expect(result).toEqual(createdItem);
      expect(model.create).toHaveBeenCalledWith(mockCreateItemDto);
    });
  });

  describe('delete', () => {
    it('should delete an item', async () => {
      const mockId = mockItem._id.toString();
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockItem),
      } as any);

      const result = await service.delete(mockId);
      expect(result).toEqual(mockItem);
      expect(model.findByIdAndDelete).toHaveBeenCalledWith(mockId);
    });

    it('should throw BadRequestException if invalid ID is provided', async () => {
      const invalidId = 'invalid-id';
      await expect(service.delete(invalidId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if item to delete is not found', async () => {
      const validId = new Types.ObjectId().toString();
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      await expect(service.delete(validId)).rejects.toThrow(NotFoundException);
    });
  });
});
