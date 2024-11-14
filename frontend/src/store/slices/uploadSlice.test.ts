import { describe, it, expect, beforeEach, vi } from 'vitest'
import uploadReducer, { resetUpload, analyzeImage } from './uploadSlice'
import { UploadState } from '../../types'

vi.mock('../../services/api', () => ({
  uploadImage: vi.fn(),
}))

describe('uploadSlice', () => {
  const initialState: UploadState = {
    loading: false,
    error: null,
    result: null,
  }

  const mockAnalysisResult = {
    isValid: true,
    imageUrl: 'http://example.com/image.jpg',
    matchedCategories: [
      {
        category: 'Apparel',
        matches: ['clothing'],
        confidence: 95.5,
        isProhibited: false,
      },
    ],
    rejectionReason: undefined,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should handle initial state', () => {
    expect(uploadReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  describe('resetUpload', () => {
    it('should reset state to initial values', () => {
      const state: UploadState = {
        loading: true,
        error: 'Some error',
        result: mockAnalysisResult,
      }

      expect(uploadReducer(state, resetUpload())).toEqual(initialState)
    })
  })

  describe('analyzeImage', () => {
    it('should set loading state while analyzing', () => {
      const action = { type: analyzeImage.pending.type }
      const state = uploadReducer(initialState, action)

      expect(state.loading).toBe(true)
      expect(state.error).toBeNull()
    })

    it('should handle successful image analysis', () => {
      const action = {
        type: analyzeImage.fulfilled.type,
        payload: mockAnalysisResult,
      }
      const state = uploadReducer(initialState, action)

      expect(state.loading).toBe(false)
      expect(state.result).toEqual(mockAnalysisResult)
      expect(state.error).toBeNull()
    })

    it('should handle failed image analysis', () => {
      const error = 'Failed to analyze image'
      const action = {
        type: analyzeImage.rejected.type,
        error: { message: error },
      }
      const state = uploadReducer(initialState, action)

      expect(state.loading).toBe(false)
      expect(state.error).toBe(error)
      expect(state.result).toBeNull()
    })
  })
})
