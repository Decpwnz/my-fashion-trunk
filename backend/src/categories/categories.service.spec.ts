import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CategoriesService } from './categories.service';
import { Category } from './schemas/category.schema';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let model: Model<Category>;

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
      providers: [
        CategoriesService,
        {
          provide: getModelToken(Category.name),
          useValue: {
            find: jest.fn(),
            findByIdAndDelete: jest.fn(),
            create: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    model = module.get<Model<Category>>(getModelToken(Category.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const mockCategories = [mockCategory];
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockCategories),
      } as any);

      const result = await service.findAll();
      expect(result).toEqual(mockCategories);
      expect(model.find).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const createdCategory = { ...mockCategory };

      jest.spyOn(model, 'create').mockResolvedValueOnce(createdCategory as any);

      const result = await service.create(mockCategoryDto);

      expect(result).toEqual(createdCategory);
      expect(model.create).toHaveBeenCalledWith(mockCategoryDto);
    });
  });

  describe('delete', () => {
    it('should delete a category successfully', async () => {
      const mockId = mockCategory._id.toString();
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockCategory),
      } as any);

      const result = await service.delete(mockId);
      expect(result).toEqual(mockCategory);
      expect(model.findByIdAndDelete).toHaveBeenCalledWith(mockId);
    });

    it('should throw BadRequestException if invalid ID is provided', async () => {
      const invalidId = 'invalid-id';

      await expect(service.delete(invalidId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if category is not found', async () => {
      const validId = new Types.ObjectId().toString();
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      await expect(service.delete(validId)).rejects.toThrow(NotFoundException);
    });
  });
});
