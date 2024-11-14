export interface MatchedCategory {
  category: string
  confidence: number
  isProhibited: boolean
}

export interface AnalysisResult {
  isValid: boolean
  imageUrl: string
  matchedCategories: MatchedCategory[]
  rejectionReason?: string
}

export interface UploadState {
  loading: boolean
  error: string | null
  result: AnalysisResult | null
}

export interface UploadResponse {
  imageUrl: string
  analysis: AnalysisResult
}

export interface Category {
  name: string
  keywords: string[]
  isProhibited: boolean
}
