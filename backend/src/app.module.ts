import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageAnalysisModule } from './image-analysis/image-analysis.module';
import envConfig from './config/env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [envConfig],
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'local'}`,
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/fashion-trunk',
    ),
    ImageAnalysisModule,
  ],
})
export class AppModule {}
