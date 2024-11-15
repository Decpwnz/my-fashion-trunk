import { Injectable } from '@nestjs/common';
import { StorageService } from './storage.interface';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3StorageService implements StorageService {
  private readonly s3Client: S3Client;
  private readonly bucket: string;

  constructor(private readonly configService: ConfigService) {
    this.bucket = this.configService.get<string>('AWS_S3_BUCKET');
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    const filename = `${Date.now()}-${file.originalname}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: filename,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return filename;
  }

  getFileUrl(filename: string): string {
    return `https://${this.bucket}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${filename}`;
  }

  async deleteFile(filename: string): Promise<void> {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: filename,
      }),
    );
  }
}
