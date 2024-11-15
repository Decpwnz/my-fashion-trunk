import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { STORAGE_SERVICE } from './storage.interface';
import { LocalStorageService } from './local-storage.service';
import { S3StorageService } from './s3-storage.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: STORAGE_SERVICE,
      useFactory: (configService: ConfigService) => {
        const useS3 = configService.get('STORAGE_TYPE') === 's3';
        return useS3
          ? new S3StorageService(configService)
          : new LocalStorageService(configService);
      },
      inject: [ConfigService],
    },
  ],
  exports: [STORAGE_SERVICE],
})
export class StorageModule {}
