import client, { type ApiResponse } from './client'

export interface ChartConfig {
  chart_type: 'pie' | 'bar' | 'grouped_bar' | 'horizontal_bar' | 'line' | 'none'
  categories: string[]
  series: { name: string; data: any[] }[]
}

export interface AiQueryResponse {
  sql: string
  columns: string[]
  rows: Record<string, any>[]
  answer: string
  chart: ChartConfig | null
}

export const postAiQuery = (question: string) =>
  client.post<ApiResponse<AiQueryResponse>>('/v1/ai/query', { question }).then(r => r.data.data)
