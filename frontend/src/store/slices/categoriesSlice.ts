import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { NewCategory, CategoriesState } from '../../types'
import { fetchCategories, addCategory, removeCategory } from '../../services/api'

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,
}

export const getCategories = createAsyncThunk('categories/getCategories', async () => {
  const response = await fetchCategories()
  return Array.isArray(response) ? response : []
})

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (category: NewCategory, { dispatch }) => {
    const response = await addCategory(category)
    await dispatch(getCategories())
    return response
  }
)

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (categoryId: string) => {
    await removeCategory(categoryId)
    return categoryId
  }
)

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false
        state.categories = action.payload.filter((category) => category !== null)
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch categories'
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((category) => category._id !== action.payload)
      })
  },
})

export default categoriesSlice.reducer
