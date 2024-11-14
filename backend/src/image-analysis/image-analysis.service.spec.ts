import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ImageAnalysisService } from './image-analysis.service';
import { RekognitionService } from '../services/rekognition/rekognition.service';
import { Category } from '../categories/schemas/category.schema';

describe('ImageAnalysisService', () => {
  let service: ImageAnalysisService;
  let rekognitionService: RekognitionService;

  const mockCategories = [
    {
      name: 'Apparel',
      keywords: ['clothing', 'shirt', 'pants'],
      isProhibited: false,
    },
    {
      name: 'Weapons',
      keywords: ['gun', 'knife', 'sword'],
      isProhibited: true,
    },
  ];

  const mockRekognitionLabels = [
    { Name: 'Clothing', Confidence: 98.5 },
    { Name: 'Shirt', Confidence: 95.2 },
    { Name: 'Person', Confidence: 99.1 },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImageAnalysisService,
        {
          provide: RekognitionService,
          useValue: {
            detectLabels: jest.fn().mockResolvedValue(mockRekognitionLabels),
          },
        },
        {
          provide: getModelToken(Category.name),
          useValue: {
            find: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(mockCategories),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<ImageAnalysisService>(ImageAnalysisService);
    rekognitionService = module.get<RekognitionService>(RekognitionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('analyzeImage', () => {
    it('should analyze image and return valid result for allowed items', async () => {
      const imageBuffer = Buffer.from('mock-image');
      const result = await service.analyzeImage(imageBuffer);

      expect(result).toEqual({
        isValid: true,
        matchedCategories: expect.arrayContaining([
          expect.objectContaining({
            category: 'Apparel',
            isProhibited: false,
            confidence: expect.any(Number),
          }),
        ]),
        detectedLabels: ['Clothing', 'Shirt', 'Person'],
        rejectionReason: undefined,
      });
    });

    it('should mark result as invalid when prohibited items are detected', async () => {
      jest
        .spyOn(rekognitionService, 'detectLabels')
        .mockResolvedValueOnce([{ Name: 'Knife', Confidence: 95.0 }]);

      const imageBuffer = Buffer.from('mock-image');
      const result = await service.analyzeImage(imageBuffer);

      expect(result).toEqual({
        isValid: false,
        matchedCategories: expect.arrayContaining([
          expect.objectContaining({
            category: 'Weapons',
            isProhibited: true,
            confidence: expect.any(Number),
          }),
        ]),
        detectedLabels: ['Knife'],
        rejectionReason: 'Image contains prohibited items',
      });
    });

    it('should handle errors from Rekognition service', async () => {
      jest
        .spyOn(rekognitionService, 'detectLabels')
        .mockRejectedValueOnce(new Error('Rekognition error'));

      const imageBuffer = Buffer.from('mock-image');
      await expect(service.analyzeImage(imageBuffer)).rejects.toThrow(
        'Rekognition error',
      );
    });
  });
});
