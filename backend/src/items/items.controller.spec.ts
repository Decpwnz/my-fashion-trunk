import { Test, TestingModule } from '@nestjs/testing';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { Types } from 'mongoose';

describe('ItemsController', () => {
  let controller: ItemsController;
  let service: ItemsService;

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
      controllers: [ItemsController],
      providers: [
        {
          provide: ItemsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockItem]),
            findOne: jest.fn().mockResolvedValue(mockItem),
            create: jest.fn().mockResolvedValue(mockItem),
            delete: jest.fn().mockResolvedValue(mockItem),
          },
        },
      ],
    }).compile();

    controller = module.get<ItemsController>(ItemsController);
    service = module.get<ItemsService>(ItemsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of items', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockItem]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single item', async () => {
      const mockId = mockItem._id.toString();
      const result = await controller.findOne(mockId);
      expect(result).toEqual(mockItem);
      expect(service.findOne).toHaveBeenCalledWith(mockId);
    });
  });

  describe('create', () => {
    it('should create a new item', async () => {
      const result = await controller.create(mockCreateItemDto);
      expect(result).toEqual(mockItem);
      expect(service.create).toHaveBeenCalledWith(mockCreateItemDto);
    });
  });

  describe('delete', () => {
    it('should delete an item', async () => {
      const mockId = mockItem._id.toString();
      const result = await controller.delete(mockId);
      expect(result).toEqual(mockItem);
      expect(service.delete).toHaveBeenCalledWith(mockId);
    });
  });
});
