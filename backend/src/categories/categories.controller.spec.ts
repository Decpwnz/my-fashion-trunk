import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Types } from 'mongoose';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  const mockCategory = {
    _id: new Types.ObjectId(),
    name: 'Apparel',
    keywords: ['clothing', 'shirt', 'pants'],
    isProhibited: false,
  };

  const mockCategoryDto = {
    name: 'Electronics',
    keywords: ['phone', 'laptop', 'tablet'],
    isProhibited: false,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockCategory]),
            create: jest.fn().mockResolvedValue(mockCategory),
            delete: jest.fn().mockResolvedValue(mockCategory),
          },
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockCategory]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const result = await controller.create(mockCategoryDto);
      expect(result).toEqual(mockCategory);
      expect(service.create).toHaveBeenCalledWith(mockCategoryDto);
    });
  });

  describe('delete', () => {
    it('should delete a category', async () => {
      const mockId = mockCategory._id.toString();
      const result = await controller.delete(mockId);
      expect(result).toEqual(mockCategory);
      expect(service.delete).toHaveBeenCalledWith(mockId);
    });
  });
});
