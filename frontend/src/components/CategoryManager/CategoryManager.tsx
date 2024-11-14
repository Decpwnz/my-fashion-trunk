import { useState } from 'react'
import styles from './CategoryManager.module.css'
import { Category } from '../../types'

export const CategoryManager = () => {
  const [categories, setCategories] = useState<Category[]>([
    {
      name: 'Fashion accessories',
      keywords: ['Accessory', 'Jewelry', 'Watch'],
      isProhibited: false,
    },
    { name: 'Food products', keywords: ['Food', 'Beverage', 'Drink'], isProhibited: true },
  ])

  const [newCategory, setNewCategory] = useState<Category>({
    name: '',
    keywords: [],
    isProhibited: false,
  })

  const handleAddCategory = () => {
    if (newCategory.name && newCategory.keywords.length > 0) {
      setCategories([...categories, newCategory])
      setNewCategory({ name: '', keywords: [], isProhibited: false })
    }
  }

  const handleRemoveCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index))
  }

  return (
    <div className={styles.container}>
      <h2>Category Management</h2>

      <div className={styles.addCategory}>
        <input
          type="text"
          placeholder="Category name"
          value={newCategory.name}
          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Keywords (comma-separated)"
          onChange={(e) =>
            setNewCategory({
              ...newCategory,
              keywords: e.target.value.split(',').map((k) => k.trim()),
            })
          }
        />
        <label>
          <input
            type="checkbox"
            checked={newCategory.isProhibited}
            onChange={(e) => setNewCategory({ ...newCategory, isProhibited: e.target.checked })}
          />
          Prohibited
        </label>
        <button onClick={handleAddCategory}>Add Category</button>
      </div>

      <div className={styles.categoryList}>
        {categories.map((category, index) => (
          <div
            key={index}
            className={`${styles.category} ${category.isProhibited ? styles.prohibited : styles.allowed}`}
          >
            <h3>{category.name}</h3>
            <p>Keywords: {category.keywords.join(', ')}</p>
            <button onClick={() => handleRemoveCategory(index)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  )
}
