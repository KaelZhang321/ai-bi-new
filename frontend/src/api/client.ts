import axios from 'axios'

const apiBase = import.meta.env.BASE_URL === '/'
  ? '/api'
  : `${import.meta.env.BASE_URL}api`

const client = axios.create({
  baseURL: apiBase,
  timeout: 30000,
})

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export default client
