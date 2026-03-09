import axios from 'axios'
import { API_BASE_URL, AUTH_TOKEN_STORAGE_KEY } from '../config/constants'

export const http = axios.create({
  baseURL: API_BASE_URL,
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
