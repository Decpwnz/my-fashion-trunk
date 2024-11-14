import { Injectable, Logger } from '@nestjs/common';
import {
  RekognitionClient,
  DetectLabelsCommand,
  Label,
} from '@aws-sdk/client-rekognition';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RekognitionService {
  private readonly rekognition: RekognitionClient;
  private readonly logger = new Logger(RekognitionService.name);

  constructor(private readonly configService: ConfigService) {
    this.rekognition = new RekognitionClient({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async detectLabels(imageBuffer: Buffer): Promise<Label[]> {
    const command = new DetectLabelsCommand({
      Image: {
        Bytes: imageBuffer,
      },
      MaxLabels: 20,
      MinConfidence: 70,
    });

    try {
      const response = await this.rekognition.send(command);
      return response.Labels || [];
    } catch (error) {
      this.logger.error('Error detecting labels:', error);
      throw error;
    }
  }
}
