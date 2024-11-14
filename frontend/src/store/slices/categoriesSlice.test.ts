import { describe, it, expect, beforeEach, vi } from 'vitest'
import categoriesReducer, { getCategories, createCategory, deleteCategory } from './categoriesSlice'
import { CategoriesState, Category } from '../../types'

vi.mock('../../services/api', () => ({
  fetchCategories: vi.fn(),
  addCategory: vi.fn(),
  removeCategory: vi.fn(),
}))

describe('categoriesSlice', () => {
  const initialState: CategoriesState = {
    categories: [],
    loading: false,
    error: null,
  }

  const mockCategory: Category = {
    _id: '123',
    name: 'Apparel',
    keywords: ['clothing', 'shirt'],
    isProhibited: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should handle initial state', () => {
    expect(categoriesReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  describe('getCategories', () => {
    it('should set loading state while fetching', () => {
      const action = { type: getCategories.pending.type }
      const state = categoriesReducer(initialState, action)

      expect(state.loading).toBe(true)
      expect(state.error).toBeNull()
    })

    it('should handle successful categories fetch', () => {
      const categories = [mockCategory]
      const action = {
        type: getCategories.fulfilled.type,
        payload: categories,
      }
      const state = categoriesReducer(initialState, action)

      expect(state.loading).toBe(false)
      expect(state.categories).toEqual(categories)
      expect(state.error).toBeNull()
    })

    it('should handle failed categories fetch', () => {
      const error = 'Failed to fetch categories'
      const action = {
        type: getCategories.rejected.type,
        error: { message: error },
      }
      const state = categoriesReducer(initialState, action)

      expect(state.loading).toBe(false)
      expect(state.error).toBe(error)
    })
  })

  describe('createCategory', () => {
    it('should handle successful category creation', () => {
      const action = {
        type: createCategory.fulfilled.type,
        payload: mockCategory,
      }
      const state = categoriesReducer(initialState, action)

      expect(state).toEqual(initialState)
    })

    it('should handle failed category creation', () => {
      const error = 'Failed to create category'
      const action = {
        type: createCategory.rejected.type,
        error: { message: error },
      }
      const state = categoriesReducer(initialState, action)

      expect(state).toEqual(initialState)
    })
  })

  describe('deleteCategory', () => {
    it('should handle successful category deletion', () => {
      const stateWithCategory = {
        ...initialState,
        categories: [mockCategory],
      }

      const action = {
        type: deleteCategory.fulfilled.type,
        payload: mockCategory._id,
      }
      const state = categoriesReducer(stateWithCategory, action)

      expect(state.categories).toEqual([])
      expect(state.error).toBeNull()
    })

    it('should handle failed category deletion', () => {
      const error = 'Failed to delete category'
      const action = {
        type: deleteCategory.rejected.type,
        error: { message: error },
      }
      const state = categoriesReducer(initialState, action)

      expect(state).toEqual(initialState)
    })
  })
})
