export interface CategoryMapping {
  allowed: { [key: string]: string[] };
  prohibited: { [key: string]: string[] };
}

export interface MatchedCategory {
  category: string;
  matches: string[];
  confidence: number;
  isProhibited: boolean;
}

export interface ImageAnalysisResult {
  isValid: boolean;
  matchedCategories: MatchedCategory[];
  detectedLabels: string[];
  rejectionReason?: string;
}
