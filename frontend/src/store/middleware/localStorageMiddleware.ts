import { Middleware } from '@reduxjs/toolkit'
import { saveState } from '../utils/localStorageHelpers'

const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action)
  saveState(store.getState())
  return result
}

export default localStorageMiddleware
