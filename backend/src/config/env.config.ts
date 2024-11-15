import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  storage: {
    type: process.env.STORAGE_TYPE || 'local',
    s3: {
      bucket: process.env.AWS_S3_BUCKET,
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    local: {
      uploadDir: 'uploads',
      baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    },
  },
  aws: {
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
}));
