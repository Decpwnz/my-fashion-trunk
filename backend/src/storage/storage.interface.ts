export const STORAGE_SERVICE = 'STORAGE_SERVICE';

export interface StorageService {
  saveFile(file: Express.Multer.File): Promise<string>;
  getFileUrl(filename: string): string;
  deleteFile(filename: string): Promise<void>;
}
