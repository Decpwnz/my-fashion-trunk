import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ItemsService } from './items.service';
import { Item } from './interfaces/item.interface';
import { multerConfig } from '../config/multer.config';
import { RekognitionService } from '../services/rekognition/rekognition.service';
import * as path from 'path';

@Controller('items')
export class ItemsController {
  constructor(
    private readonly itemsService: ItemsService,
    private readonly rekognitionService: RekognitionService,
  ) {}

  @Get('test-rekognition')
  async testRekognition() {
    return this.rekognitionService.testConnection();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Item> {
    return this.itemsService.findOne(id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(
        'No file uploaded or invalid file field name. Expected field name: "image"',
      );
    }

    try {
      const imageUrl = `http://localhost:3000/uploads/${file.filename}`;
      const imagePath = path.join(process.cwd(), 'uploads', file.filename);
      const analysis = await this.rekognitionService.analyzeImage(
        imagePath,
        imageUrl,
      );
      return { imageUrl, analysis };
    } catch (error) {
      throw new BadRequestException(`Error processing image: ${error.message}`);
    }
  }

  @Get()
  findAll(): Promise<Item[]> {
    return this.itemsService.findAll();
  }

  @Post()
  create(@Body() item: Item): Promise<Item> {
    return this.itemsService.create(item);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<Item> {
    return this.itemsService.delete(id);
  }
}
