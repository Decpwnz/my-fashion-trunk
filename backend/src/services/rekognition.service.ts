import { Injectable, Logger } from '@nestjs/common';
import {
  RekognitionClient,
  DetectLabelsCommand,
} from '@aws-sdk/client-rekognition';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';

@Injectable()
export class RekognitionService {
  private readonly logger = new Logger(RekognitionService.name);
  private rekognitionClient: RekognitionClient;

  constructor(private configService: ConfigService) {
    const region = this.configService.get<string>('AWS_REGION');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>(
      'AWS_SECRET_ACCESS_KEY',
    );

    if (!region || !accessKeyId || !secretAccessKey) {
      this.logger.error('AWS credentials not properly configured');
      throw new Error('AWS credentials not properly configured');
    }

    this.rekognitionClient = new RekognitionClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async testConnection() {
    try {
      const testImage = Buffer.from(
        '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
        'base64',
      );

      const command = new DetectLabelsCommand({
        Image: { Bytes: testImage },
        MaxLabels: 1,
        MinConfidence: 50,
      });

      await this.rekognitionClient.send(command);
      return { status: 'AWS Rekognition connection successful' };
    } catch (error) {
      this.logger.error('AWS Rekognition connection failed', error.stack);
      return {
        status: 'AWS Rekognition connection failed',
        error: error.message,
      };
    }
  }

  async analyzeImage(imagePath: string) {
    const imageBuffer = await fs.readFile(imagePath);
    const command = new DetectLabelsCommand({
      Image: { Bytes: imageBuffer },
    });
    return this.rekognitionClient.send(command);
  }
}
