import { useRef, ChangeEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { analyzeImage, resetUpload } from '../../store/slices/uploadSlice'
import styles from './ImageUpload.module.css'

export const ImageUpload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dispatch = useAppDispatch()
  const { loading, error, result } = useAppSelector((state) => state.upload)

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      await dispatch(analyzeImage(file)).unwrap()
    } catch (err) {
      console.error('Failed to upload image:', err)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleReset = () => {
    dispatch(resetUpload())
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={styles.container}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className={styles.fileInput}
      />
      <div className={styles.buttonGroup}>
        <button onClick={handleButtonClick} disabled={loading} className={styles.uploadButton}>
          {loading ? 'Uploading...' : 'Upload Image'}
        </button>
        {result && (
          <button onClick={handleReset} className={styles.resetButton}>
            Reset
          </button>
        )}
      </div>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  )
}
