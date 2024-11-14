import { MatchedCategory } from 'src/image-analysis/dto/image-analysis.dto';

export interface RekognitionLabel {
  Name?: string;
  Confidence?: number;
}

export interface RekognitionResponse {
  Labels?: RekognitionLabel[];
}

export interface AnalysisResult {
  isValid: boolean;
  imageUrl: string;
  matchedCategories: MatchedCategory[];
  rejectionReason?: string;
}
