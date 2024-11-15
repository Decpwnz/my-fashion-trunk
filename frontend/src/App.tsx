import { ImageUpload } from './components/ImageUpload/ImageUpload'
import { AnalysisResult } from './components/AnalysisResult/AnalysisResult'
import { CategoryManager } from './components/CategoryManager/CategoryManager'
import { Spinner } from './components/common/Spinner/Spinner'
import { useAppSelector } from './hooks/redux'
import styles from './App.module.css'

function App() {
  const { loading } = useAppSelector((state) => state.upload)
  // deploy test 6
  return (
    <div className={styles.container}>
      <h1>Image Analysis Tool</h1>
      <ImageUpload />
      <AnalysisResult />
      <CategoryManager />
      {loading && <Spinner />}
    </div>
  )
}

export default App
