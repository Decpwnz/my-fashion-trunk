import { useAppSelector } from '../../hooks/redux'
import styles from './AnalysisResult.module.css'

export const AnalysisResult = () => {
  const { result } = useAppSelector((state) => state.upload)

  if (!result) return null

  const { isValid, imageUrl, matchedCategories, rejectionReason } = result

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <img src={imageUrl} alt="Analyzed" className={styles.image} />
      </div>

      <div className={styles.resultStatus}>
        <div className={`${styles.status} ${isValid ? styles.valid : styles.invalid}`}>
          {isValid ? 'Item Allowed' : 'Item Prohibited'}
        </div>
        {rejectionReason && <div className={styles.reason}>{rejectionReason}</div>}
      </div>

      <div className={styles.categories}>
        <h3>Detected Categories:</h3>
        {matchedCategories.map((category, index) => (
          <div
            key={`${category.category}-${index}`}
            className={`${styles.category} ${category.isProhibited ? styles.prohibited : styles.allowed}`}
          >
            <span>{category.category}</span>
            <span className={styles.confidence}>{Math.round(category.confidence)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
