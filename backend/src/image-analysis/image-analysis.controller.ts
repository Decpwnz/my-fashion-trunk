import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageAnalysisService } from './image-analysis.service';
import { STORAGE_SERVICE, StorageService } from '../storage/storage.interface';
import { multerConfig } from '../config/multer.config';
import { Express } from 'express';

@Controller('analyze')
export class ImageAnalysisController {
  constructor(
    private readonly imageAnalysisService: ImageAnalysisService,
    @Inject(STORAGE_SERVICE) private readonly storageService: StorageService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async analyzeImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(
        'No file uploaded or invalid file field name. Expected field name: "image"',
      );
    }

    try {
      const analysisResult = await this.imageAnalysisService.analyzeImage(
        file.buffer,
      );
      const filename = await this.storageService.saveFile(file);
      const imageUrl = this.storageService.getFileUrl(filename);

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
