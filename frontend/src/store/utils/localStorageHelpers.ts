import type { RootState } from '../store'

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('appState')
    return serializedState ? JSON.parse(serializedState) : undefined
  } catch (err) {
    console.error('Failed to load state:', err)
    return undefined
  }
}

export const saveState = (state: RootState) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem('appState', serializedState)
  } catch (err) {
    console.error('Failed to save state:', err)
  }
}
