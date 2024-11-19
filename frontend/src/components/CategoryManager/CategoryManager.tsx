import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { getCategories, createCategory, deleteCategory } from '../../store/slices/categoriesSlice'
import type { NewCategory } from '../../types'
import styles from './CategoryManager.module.css'

export const CategoryManager = () => {
  const dispatch = useAppDispatch()
  const { categories, loading, error } = useAppSelector((state) => state.categories)
  const [newCategory, setNewCategory] = useState<NewCategory>({
    name: '',
    keywords: [],
    isProhibited: false,
  })
  const [keywordsInput, setKeywordsInput] = useState('')

  useEffect(() => {
    dispatch(getCategories())
  }, [dispatch])

  const handleAddCategory = () => {
    const categoryToAdd: NewCategory = {
      name: newCategory.name.trim(),
      keywords: newCategory.keywords,
      isProhibited: Boolean(newCategory.isProhibited),
    }

    dispatch(createCategory(categoryToAdd))
    setNewCategory({
      name: '',
      keywords: [],
      isProhibited: false,
    })
    setKeywordsInput('')
  }

  const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keywords = e.target.value
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean)
    setKeywordsInput(e.target.value)
    setNewCategory((prev) => ({
      ...prev,
      keywords,
    }))
  }

  if (loading) return <div>Loading categories...</div>
  if (error) return <div className={styles.error}>{error}</div>

  return (
    <div className={styles.container}>
      <h2>Category Management</h2>

      <div className={styles.addCategory}>
        <input
          type="text"
          placeholder="Category name"
          value={newCategory.name}
          onChange={(e) => setNewCategory((prev) => ({ ...prev, name: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Keywords (comma-separated)"
          value={keywordsInput}
          onChange={handleKeywordsChange}
        />
        <label>
          <input
            type="checkbox"
            checked={newCategory.isProhibited}
            onChange={(e) =>
              setNewCategory((prev) => ({
                ...prev,
                isProhibited: e.target.checked,
              }))
            }
          />
          Prohibited
        </label>
        <button
          onClick={handleAddCategory}
          disabled={!newCategory.name || newCategory.keywords.length === 0}
        >
          Add Category
        </button>
      </div>

      <div className={styles.categoryList}>
        {categories && categories.length > 0 ? (
          categories.map((category) => {
            if (!category) return null

            return (
              <div
                key={category._id}
                className={`${styles.category} ${
                  category.isProhibited ? styles.prohibited : styles.allowed
                }`}
              >
                <h3>{category.name}</h3>
                <p>Keywords: {category.keywords.join(', ')}</p>
                <button onClick={() => dispatch(deleteCategory(category._id))}>Remove</button>
              </div>
            )
          })
        ) : (
          <div>No categories available</div>
        )}
      </div>
    </div>
  )
}
