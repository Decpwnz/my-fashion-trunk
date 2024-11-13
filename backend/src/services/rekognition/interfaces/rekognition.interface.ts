export interface RekognitionLabel {
  Name?: string;
  Confidence?: number;
}

export interface RekognitionResponse {
  Labels?: RekognitionLabel[];
}

export interface MatchedCategory {
  category: string;
  confidence: number;
  isProhibited: boolean;
}

export interface AnalysisResult {
  isValid: boolean;
  imageUrl: string;
  matchedCategories: MatchedCategory[];
  rejectionReason?: string;
}

export interface CategoryMapping {
  allowed: { [key: string]: string[] };
  prohibited: { [key: string]: string[] };
}
