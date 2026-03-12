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

export type SseEventType = 'sql' | 'data' | 'chart' | 'answer' | 'error'

export interface SseCallback {
  onSql?: (sql: string) => void
  onData?: (columns: string[], rows: Record<string, any>[]) => void
  onChart?: (chart: ChartConfig) => void
  onAnswer?: (answer: string) => void
  onError?: (message: string) => void
}

export async function streamAiQuery(question: string, callbacks: SseCallback) {
  const response = await fetch('/api/v1/ai/query/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  })

  if (!response.ok || !response.body) {
    callbacks.onError?.(`请求失败: ${response.status}`)
    return
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    let currentEvent = ''
    for (const line of lines) {
      if (line.startsWith('event:')) {
        currentEvent = line.slice(6).trim()
      } else if (line.startsWith('data:')) {
        const raw = line.slice(5).trim()
        if (!raw || !currentEvent) continue
        try {
          const parsed = JSON.parse(raw)
          switch (currentEvent as SseEventType) {
            case 'sql':
              callbacks.onSql?.(parsed.sql)
              break
            case 'data':
              callbacks.onData?.(parsed.columns, parsed.rows)
              break
            case 'chart':
              callbacks.onChart?.(parsed.chart)
              break
            case 'answer':
              callbacks.onAnswer?.(parsed.answer)
              break
            case 'error':
              callbacks.onError?.(parsed.message)
              break
          }
        } catch {
          // 忽略解析错误
        }
        currentEvent = ''
      }
    }
  }
}
