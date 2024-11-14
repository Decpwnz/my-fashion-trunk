import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { CategoryManager } from './CategoryManager'
import categoriesReducer, {
  getCategories,
  createCategory,
  deleteCategory,
} from '../../store/slices/categoriesSlice'

vi.mock('../../store/slices/categoriesSlice', async () => {
  const actual = await vi.importActual('../../store/slices/categoriesSlice')
  return {
    ...actual,
    getCategories: vi.fn(() => ({
      type: 'categories/getCategories/fulfilled',
      payload: [],
    })),
    createCategory: vi.fn(() => ({
      type: 'categories/createCategory/fulfilled',
      payload: {},
    })),
    deleteCategory: vi.fn(() => ({
      type: 'categories/deleteCategory/fulfilled',
      payload: '',
    })),
  }
})

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      categories: categoriesReducer,
    },
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: true,
        serializableCheck: false,
      }),
  })
}

describe('CategoryManager', () => {
  const mockCategories = [
    {
      _id: '1',
      name: 'Electronics',
      keywords: ['phone', 'laptop'],
      isProhibited: false,
    },
    {
      _id: '2',
      name: 'Weapons',
      keywords: ['knife', 'gun'],
      isProhibited: true,
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render categories list', async () => {
    ;(getCategories as any).mockImplementationOnce(() => ({
      type: 'categories/getCategories/fulfilled',
      payload: mockCategories,
    }))

    const store = createMockStore({
      categories: {
        categories: mockCategories,
        loading: false,
        error: null,
      },
    })

    render(
      <Provider store={store}>
        <CategoryManager />
      </Provider>
    )

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Electronics' })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Weapons' })).toBeInTheDocument()
    })
  })

  it('should fetch categories on mount', () => {
    const store = createMockStore()
    render(
      <Provider store={store}>
        <CategoryManager />
      </Provider>
    )

    expect(getCategories).toHaveBeenCalled()
  })

  it('should create a new category', async () => {
    const store = createMockStore()
    render(
      <Provider store={store}>
        <CategoryManager />
      </Provider>
    )

    fireEvent.change(screen.getByPlaceholderText('Category name'), {
      target: { value: 'Toys' },
    })
    fireEvent.change(screen.getByPlaceholderText('Keywords (comma-separated)'), {
      target: { value: 'doll,car' },
    })
    fireEvent.click(screen.getByLabelText('Prohibited'))

    fireEvent.click(screen.getByText('Add Category'))

    await waitFor(() => {
      expect(createCategory).toHaveBeenCalledWith({
        name: 'Toys',
        keywords: ['doll', 'car'],
        isProhibited: true,
      })
    })
  })

  it('should delete a category', async () => {
    ;(getCategories as any).mockImplementationOnce(() => ({
      type: 'categories/getCategories/fulfilled',
      payload: mockCategories,
    }))

    const store = createMockStore({
      categories: {
        categories: mockCategories,
        loading: false,
        error: null,
      },
    })

    render(
      <Provider store={store}>
        <CategoryManager />
      </Provider>
    )

    await waitFor(() => {
      const removeButtons = screen.getAllByText('Remove')
      fireEvent.click(removeButtons[0])
    })

    expect(deleteCategory).toHaveBeenCalledWith('1')
  })

  it('should show loading state', () => {
    ;(getCategories as any).mockImplementationOnce(() => ({
      type: 'categories/getCategories/pending',
    }))

    const store = createMockStore({
      categories: {
        categories: [],
        loading: true,
        error: null,
      },
    })

    render(
      <Provider store={store}>
        <CategoryManager />
      </Provider>
    )

    expect(screen.getByText('Loading categories...')).toBeInTheDocument()
  })

  it('should show error state', () => {
    const store = createMockStore({
      categories: {
        categories: [],
        loading: false,
        error: 'Failed to fetch categories',
      },
    })

    render(
      <Provider store={store}>
        <CategoryManager />
      </Provider>
    )

    expect(screen.getByText('Failed to fetch categories')).toBeInTheDocument()
  })
})
