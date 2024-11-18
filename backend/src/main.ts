import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

  // ec2-13-48-127-146.eu-north-1.compute.amazonaws.com  frontend
  // ec2-16-171-197-254.eu-north-1.compute.amazonaws.com  backend
  console.log('process.env.NODE_ENV', process.env.NODE_ENV);

  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? 'http://my-fashion-trunk-alb-1332421404.eu-north-1.elb.amazonaws.com/'
        : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
