import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { ItemSchema } from './schemas/items.schema';
import { RekognitionService } from '../services/rekognition.service';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: 'Item', schema: ItemSchema }]),
  ],
  providers: [ItemsService, RekognitionService],
  controllers: [ItemsController],
})
export class ItemsModule {}
