import client, { type ApiResponse } from './client'

export interface SourceCount {
  region: string
  source_type: string
  customer_count: number
}

export interface TargetArrival {
  region: string
  target_count: number
  arrive_count: number
}

export const fetchSourceDistribution = () =>
  client.get<ApiResponse<SourceCount[]>>('/v1/source/distribution').then(r => r.data.data)

export const fetchTargetArrival = () =>
  client.get<ApiResponse<TargetArrival[]>>('/v1/source/target-arrival').then(r => r.data.data)
