import axios from 'axios'
import type { Category, UploadResponse, NewCategory } from '../types'

const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://my-fashion-trunk-backend-alb-203446907.eu-north-1.elb.amazonaws.com'

export const uploadImage = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData()
  formData.append('image', file)

  const response = await axios.post<UploadResponse>(`${API_URL}/analyze`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

export const fetchCategories = async () => {
  const response = await axios.get(`${API_URL}/categories`)
  return response.data
}

export const addCategory = async (category: NewCategory) => {
  const response = await axios.post<{ category: Category }>(`${API_URL}/categories`, category)
  return response.data
}

export const removeCategory = async (categoryId: string) => {
  await axios.delete(`${API_URL}/categories/${categoryId}`)
}
