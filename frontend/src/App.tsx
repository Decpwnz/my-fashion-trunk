import { ImageUpload } from './components/ImageUpload/ImageUpload'
import { AnalysisResult } from './components/AnalysisResult/AnalysisResult'
import styles from './App.module.css'

function App() {
  return (
    <div className={styles.container}>
      <h1>Image Analysis Tool</h1>
      <ImageUpload />
      <AnalysisResult />
    </div>
  )
}

export default App
