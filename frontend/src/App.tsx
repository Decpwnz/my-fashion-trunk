import { ImageUpload } from './components/ImageUpload/ImageUpload'
import { AnalysisResult } from './components/AnalysisResult/AnalysisResult'
import { CategoryManager } from './components/CategoryManager/CategoryManager'
import { Spinner } from './components/common/Spinner/Spinner'
import { useAppSelector } from './hooks/redux'
import styles from './App.module.css'

function App() {
  const { loading } = useAppSelector((state) => state.upload)

  return (
    <div className={styles.container}>
      <h1>My Fashion Trunk</h1>
      <div className={styles.content}>
        <div className={styles.leftPanel}>
          <h2>Image Analysis Tool</h2>
          <ImageUpload />
          <AnalysisResult />
        </div>
        <div className={styles.rightPanel}>
          <CategoryManager />
        </div>
      </div>
      {loading && <Spinner />}
    </div>
  )
}

export default App
