import { Test, TestingModule } from '@nestjs/testing';
import { ImageAnalysisController } from './image-analysis.controller';
import { ImageAnalysisService } from './image-analysis.service';
import { BadRequestException } from '@nestjs/common';

describe('ImageAnalysisController', () => {
  let controller: ImageAnalysisController;
  let service: ImageAnalysisService;

  const mockAnalysisResult = {
    isValid: true,
    matchedCategories: [
      {
        category: 'Apparel',
        matches: ['clothing', 'shirt'],
        confidence: 98.5,
        isProhibited: false,
      },
    ],
    detectedLabels: ['Clothing', 'Shirt'],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageAnalysisController],
      providers: [
        {
          provide: ImageAnalysisService,
          useValue: {
            analyzeImage: jest.fn().mockResolvedValue(mockAnalysisResult),
          },
        },
      ],
    }).compile();

    controller = module.get<ImageAnalysisController>(ImageAnalysisController);
    service = module.get<ImageAnalysisService>(ImageAnalysisService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('analyzeImage', () => {
    it('should analyze an uploaded image', async () => {
      const mockFile = {
        buffer: Buffer.from('mock-image-data'),
        filename: 'test-image.jpg',
      } as Express.Multer.File;

      const result = await controller.analyzeImage(mockFile);

      expect(result).toEqual({
        imageUrl: expect.stringContaining('/uploads/test-image.jpg'),
        analysis: {
          ...mockAnalysisResult,
          imageUrl: expect.stringContaining('/uploads/test-image.jpg'),
        },
      });
      expect(service.analyzeImage).toHaveBeenCalledWith(mockFile.buffer);
    });

    it('should throw BadRequestException when no file is provided', async () => {
      await expect(controller.analyzeImage(undefined)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should handle service errors', async () => {
      const mockFile = {
        buffer: Buffer.from('mock-image-data'),
        filename: 'test-image.jpg',
      } as Express.Multer.File;

      jest
        .spyOn(service, 'analyzeImage')
        .mockRejectedValueOnce(new Error('Analysis failed'));

      await expect(controller.analyzeImage(mockFile)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
