import client, { type ApiResponse } from './client'

export interface AchievementBar {
  region: string
  low_limit: number
  high_limit: number
  deal_amount: number
}

export interface AchievementRow {
  row_num: number
  region: string
  actual_amount: number
  target_amount: number
  min_limit: number
  max_limit: number
  achievement_rate: number | null
  difference: number
}

export const fetchAchievementChart = () =>
  client.get<ApiResponse<AchievementBar[]>>('/v1/achievement/chart').then(r => r.data.data)

export const fetchAchievementTable = () =>
  client.get<ApiResponse<AchievementRow[]>>('/v1/achievement/table').then(r => r.data.data)
