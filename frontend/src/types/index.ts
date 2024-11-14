export interface MatchedCategory {
  category: string
  matches: string[]
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

export interface NewCategory {
  name: string
  keywords: string[]
  isProhibited: boolean
}

export interface Category extends NewCategory {
  _id: string
}

export interface CategoriesState {
  categories: Category[]
  loading: boolean
  error: string | null
}
