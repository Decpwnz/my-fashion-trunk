import styles from './Spinner.module.css'

export const Spinner = () => {
  return (
    <div className={styles.spinnerOverlay}>
      <div className={styles.spinner} />
      <div className={styles.text}>Analyzing image...</div>
    </div>
  )
}
