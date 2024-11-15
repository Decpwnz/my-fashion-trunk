import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemsModule } from './items/items.module';
import { CategoriesModule } from './categories/categories.module';
import { ImageAnalysisModule } from './image-analysis/image-analysis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    ItemsModule,
    CategoriesModule,
    ImageAnalysisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
