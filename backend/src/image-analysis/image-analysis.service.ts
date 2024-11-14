import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from '../categories/schemas/category.schema';
import { RekognitionService } from '../services/rekognition/rekognition.service';
import {
  CategoryMapping,
  MatchedCategory,
  ImageAnalysisResult,
} from './dto/image-analysis.dto';

@Injectable()
export class ImageAnalysisService {
  constructor(
    private readonly rekognitionService: RekognitionService,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  private async getCategoryMapping(): Promise<CategoryMapping> {
    const categories = await this.categoryModel.find().exec();

    const mapping: CategoryMapping = {
      allowed: {},
      prohibited: {},
    };

    categories.forEach((category) => {
      if (category.isProhibited) {
        mapping.prohibited[category.name] = category.keywords;
      } else {
        mapping.allowed[category.name] = category.keywords;
      }
    });

    return mapping;
  }

  async analyzeImage(imageBuffer: Buffer): Promise<ImageAnalysisResult> {
    const labels = await this.rekognitionService.detectLabels(imageBuffer);
    const categoryMapping = await this.getCategoryMapping();

    const matchedCategories: MatchedCategory[] = [];
    const detectedLabels = labels.map((label) => ({
      name: label.Name,
      confidence: label.Confidence || 0,
    }));

    for (const [categoryName, keywords] of Object.entries(
      categoryMapping.allowed,
    )) {
      const matches = keywords.filter((keyword) =>
        detectedLabels.some((label) =>
          label.name.toLowerCase().includes(keyword.toLowerCase()),
        ),
      );

      if (matches.length > 0) {
        const confidence =
          detectedLabels
            .filter((label) =>
              matches.some((match) =>
                label.name.toLowerCase().includes(match.toLowerCase()),
              ),
            )
            .reduce((acc, label) => acc + label.confidence, 0) / matches.length;

        matchedCategories.push({
          category: categoryName,
          matches,
          confidence,
          isProhibited: false,
        });
      }
    }

    for (const [categoryName, keywords] of Object.entries(
      categoryMapping.prohibited,
    )) {
      const matches = keywords.filter((keyword) =>
        detectedLabels.some((label) =>
          label.name.toLowerCase().includes(keyword.toLowerCase()),
        ),
      );

      if (matches.length > 0) {
        const confidence =
          detectedLabels
            .filter((label) =>
              matches.some((match) =>
                label.name.toLowerCase().includes(match.toLowerCase()),
              ),
            )
            .reduce((acc, label) => acc + label.confidence, 0) / matches.length;

        matchedCategories.push({
          category: categoryName,
          matches,
          confidence,
          isProhibited: true,
        });
      }
    }

    const hasProhibitedItems = matchedCategories.some(
      (cat) => cat.isProhibited,
    );

    return {
      isValid: !hasProhibitedItems,
      matchedCategories,
      detectedLabels: detectedLabels.map((label) => label.name),
      rejectionReason: hasProhibitedItems
        ? 'Image contains prohibited items'
        : undefined,
    };
  }
}
