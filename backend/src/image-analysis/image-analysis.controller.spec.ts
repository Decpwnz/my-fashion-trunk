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
        {
          provide: 'STORAGE_SERVICE',
          useValue: {
            saveFile: jest.fn().mockResolvedValue('mocked-url'),
            getFileUrl: jest.fn().mockReturnValue('/uploads/test-image.jpg'),
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

      jest.spyOn(console, 'error').mockImplementation(() => {});

      jest
        .spyOn(service, 'analyzeImage')
        .mockRejectedValue(new Error('Analysis failed'));

      try {
        await controller.analyzeImage(mockFile);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Error processing image: Analysis failed');
      }
    });
  });
});
