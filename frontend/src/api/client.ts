import axios from 'axios'

const client = axios.create({
  baseURL: '/api',
  timeout: 30000,
})

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export default client
