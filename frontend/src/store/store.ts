import { configureStore, combineReducers } from '@reduxjs/toolkit'
import uploadReducer from './slices/uploadSlice'
import { loadState } from './utils/localStorageHelpers'
import localStorageMiddleware from './middleware/localStorageMiddleware'

const rootReducer = combineReducers({
  upload: uploadReducer,
})

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: loadState(),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(localStorageMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
