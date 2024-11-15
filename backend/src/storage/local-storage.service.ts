import { Injectable } from '@nestjs/common';
import { StorageService } from './storage.interface';
import { ConfigService } from '@nestjs/config';
import { existsSync, mkdirSync } from 'fs';
import * as fs from 'fs/promises';
import { join } from 'path';

@Injectable()
export class LocalStorageService implements StorageService {
  private readonly uploadDir: string;

  constructor(private readonly configService: ConfigService) {
    this.uploadDir = join(process.cwd(), 'uploads');
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    const filename = `${Date.now()}-${file.originalname}`;
    const filepath = join(this.uploadDir, filename);
    await fs.writeFile(filepath, file.buffer);
    return filename;
  }

  getFileUrl(filename: string): string {
    const baseUrl =
      this.configService.get('BASE_URL') || 'http://localhost:3000';
    return `${baseUrl}/uploads/${filename}`;
  }

  async deleteFile(filename: string): Promise<void> {
    const filepath = join(this.uploadDir, filename);
    await fs.unlink(filepath);
  }
}
