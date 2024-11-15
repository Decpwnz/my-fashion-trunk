import { Module } from '@nestjs/common';
import { ImageAnalysisController } from './image-analysis.controller';
import { ImageAnalysisService } from './image-analysis.service';
import { RekognitionService } from '../services/rekognition/rekognition.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Category,
  CategorySchema,
} from '../categories/schemas/category.schema';
import { StorageModule } from '../storage/storage.module';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
    StorageModule,
    CategoriesModule,
  ],
  controllers: [ImageAnalysisController],
  providers: [ImageAnalysisService, RekognitionService],
})
export class ImageAnalysisModule {}
