import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { ImageUpload } from './ImageUpload'
import uploadReducer, { analyzeImage, resetUpload } from '../../store/slices/uploadSlice'

vi.mock('../../store/slices/uploadSlice', async () => {
  const actual = await vi.importActual('../../store/slices/uploadSlice')
  return {
    ...actual,
    analyzeImage: vi.fn(() => ({
      type: 'upload/analyzeImage/fulfilled',
      payload: null,
    })),
    resetUpload: vi.fn(() => ({
      type: 'upload/resetUpload',
      payload: undefined,
    })),
  }
})

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      upload: uploadReducer,
    },
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: true,
        serializableCheck: false,
      }),
  })
}

describe('ImageUpload', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render upload button', () => {
    const store = createMockStore()
    render(
      <Provider store={store}>
        <ImageUpload />
      </Provider>
    )

    expect(screen.getByText('Upload Image')).toBeInTheDocument()
  })

  it('should handle file upload', async () => {
    const store = createMockStore()
    const { container } = render(
      <Provider store={store}>
        <ImageUpload />
      </Provider>
    )

    const file = new File(['dummy content'], 'test.png', { type: 'image/png' })
    const input = container.querySelector('input[type="file"]') as HTMLInputElement

    if (!input) throw new Error('File input not found')

    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(analyzeImage).toHaveBeenCalledWith(file)
    })
  })

  it('should show loading state during upload', () => {
    const store = createMockStore({
      upload: {
        loading: true,
        error: null,
        result: null,
      },
    })

    render(
      <Provider store={store}>
        <ImageUpload />
      </Provider>
    )

    expect(screen.getByText('Uploading...')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('should show error message', () => {
    const errorMessage = 'Failed to upload image'
    const store = createMockStore({
      upload: {
        loading: false,
        error: errorMessage,
        result: null,
      },
    })

    render(
      <Provider store={store}>
        <ImageUpload />
      </Provider>
    )

    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  it('should show reset button when result exists', () => {
    const store = createMockStore({
      upload: {
        loading: false,
        error: null,
        result: { someData: 'test' },
      },
    })

    render(
      <Provider store={store}>
        <ImageUpload />
      </Provider>
    )

    const resetButton = screen.getByText('Reset')
    expect(resetButton).toBeInTheDocument()

    fireEvent.click(resetButton)
    expect(resetUpload).toHaveBeenCalled()
  })

  it('should handle reset action', () => {
    const store = createMockStore({
      upload: {
        loading: false,
        error: null,
        result: { someData: 'test' },
      },
    })

    render(
      <Provider store={store}>
        <ImageUpload />
      </Provider>
    )

    const resetButton = screen.getByText('Reset')
    fireEvent.click(resetButton)

    expect(resetUpload).toHaveBeenCalled()
  })

  it('should trigger file input when upload button is clicked', () => {
    const store = createMockStore()
    const { container } = render(
      <Provider store={store}>
        <ImageUpload />
      </Provider>
    )

    const uploadButton = screen.getByText('Upload Image')
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement

    if (!fileInput) throw new Error('File input not found')

    const clickSpy = vi.spyOn(fileInput, 'click')

    fireEvent.click(uploadButton)
    expect(clickSpy).toHaveBeenCalled()
  })
})
