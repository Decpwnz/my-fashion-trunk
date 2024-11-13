import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { UploadState } from '../../types'
import { uploadImage } from '../../services/api'

const initialState: UploadState = {
  loading: false,
  error: null,
  result: null,
}

export const analyzeImage = createAsyncThunk('upload/analyzeImage', async (file: File) => {
  const response = await uploadImage(file)
  return response.analysis
})

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    resetUpload: (state) => {
      state.loading = false
      state.error = null
      state.result = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(analyzeImage.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(analyzeImage.fulfilled, (state, action) => {
        state.loading = false
        state.result = action.payload
      })
      .addCase(analyzeImage.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Something went wrong'
      })
  },
})

export const { resetUpload } = uploadSlice.actions
export default uploadSlice.reducer
