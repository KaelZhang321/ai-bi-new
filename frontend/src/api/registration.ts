import client, { type ApiResponse } from './client'

export interface RegionLevelCount {
  region: string
  customer_level_name: string | null
  register_count: number
  arrive_count: number
}

export interface MatrixRow {
  region: string
  qianwan_register: number
  qianwan_arrive: number
  baiwan_register: number
  baiwan_arrive: number
  putong_register: number
  putong_arrive: number
  total_register: number
  total_arrive: number
}

export const fetchRegistrationChart = () =>
  client.get<ApiResponse<RegionLevelCount[]>>('/v1/registration/chart').then(r => r.data.data)

export const fetchRegistrationMatrix = () =>
  client.get<ApiResponse<MatrixRow[]>>('/v1/registration/matrix').then(r => r.data.data)
