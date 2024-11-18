import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  RekognitionClient,
  DetectLabelsCommand,
  DetectLabelsResponse,
} from '@aws-sdk/client-rekognition';

@Injectable()
export class RekognitionService {
  private readonly rekognitionClient: RekognitionClient;

  constructor(private readonly configService: ConfigService) {
    this.rekognitionClient = new RekognitionClient({
      region: this.configService.get('app.aws.rekognitionRegion'),
      credentials: {
        accessKeyId: this.configService.get('app.aws.accessKeyId'),
        secretAccessKey: this.configService.get('app.aws.secretAccessKey'),
      },
    });
  }

  async detectLabels(
    imageBuffer: Buffer,
  ): Promise<DetectLabelsResponse['Labels']> {
    const command = new DetectLabelsCommand({
      Image: {
        Bytes: imageBuffer,
      },
      MaxLabels: 20,
      MinConfidence: 70,
    });

    const response = await this.rekognitionClient.send(command);
    return response.Labels || [];
  }
}
