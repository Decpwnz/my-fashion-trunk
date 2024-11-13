import axios from 'axios'
import type { UploadResponse } from '../types'

const API_URL = 'http://localhost:3000'

export const uploadImage = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData()
  formData.append('image', file)

  const response = await axios.post<UploadResponse>(`${API_URL}/items/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}
