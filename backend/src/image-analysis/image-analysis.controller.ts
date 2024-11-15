import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageAnalysisService } from './image-analysis.service';
import { multerConfig } from '../config/multer.config';
import { Express } from 'express';
import * as fs from 'fs';

@Controller('analyze')
export class ImageAnalysisController {
  constructor(private readonly imageAnalysisService: ImageAnalysisService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async analyzeImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(
        'No file uploaded or invalid file field name. Expected field name: "image"',
      );
    }

    try {
      const buffer = file.buffer || (await fs.promises.readFile(file.path));

      const analysisResult =
        await this.imageAnalysisService.analyzeImage(buffer);
      const baseUrl = process.env.BASE_URL;
      const imageUrl = `${baseUrl}/uploads/${file.filename}`;

      return {
        imageUrl,
        analysis: {
          ...analysisResult,
          imageUrl,
        },
      };
    } catch (error) {
      console.error('Error processing image:', error);
      throw new BadRequestException(`Error processing image: ${error.message}`);
    }
  }
}
