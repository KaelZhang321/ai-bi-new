import React, { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactECharts from 'echarts-for-react'
import { theme } from '../../styles/theme'
import { postAiQuery, type AiQueryResponse, type ChartConfig } from '../../api/ai'

const PALETTE = theme.chartPalette

interface ChatMessage {
  id: number
  role: 'user' | 'ai'
  content: string
  data?: AiQueryResponse
  loading?: boolean
  error?: boolean
}

const EXAMPLES = [
  '各大区报名人数是多少？',
  '新老客户比例是多少？',
  '各区域目标完成情况如何？',
  '客户金额等级分布是什么？',
  '各场景参与人数是多少？',
  '总成交金额是多少？',
]

/* ========== 图表渲染 ========== */
function buildChartOption(chart: ChartConfig) {
  const base = {
    backgroundColor: 'transparent',
    color: PALETTE,
    textStyle: { fontFamily: theme.fontFamily, color: '#94A3B8' },
    tooltip: {
      backgroundColor: 'rgba(4,10,25,0.95)',
      borderColor: 'rgba(34,211,238,0.2)',
      textStyle: { color: '#E2E8F0', fontSize: 11 },
      extraCssText: 'backdrop-filter:blur(12px);border-radius:6px;',
    },
    grid: { left: 50, right: 16, top: 30, bottom: 30 },
  }

  if (chart.chart_type === 'pie') {
    return {
      ...base,
      tooltip: { ...base.tooltip, trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      legend: { orient: 'vertical', right: 4, top: 'middle', textStyle: { color: '#94A3B8', fontSize: 10 }, icon: 'circle', itemWidth: 8, itemHeight: 8 },
      series: [{ type: 'pie', radius: ['35%', '60%'], center: ['40%', '50%'], data: chart.series[0]?.data || [], label: { show: true, formatter: '{d}%', color: '#94A3B8', fontSize: 10 }, labelLine: { lineStyle: { color: 'rgba(148,163,184,0.2)' } }, itemStyle: { borderColor: 'rgba(4,10,25,0.9)', borderWidth: 2 }, emphasis: { scale: true, scaleSize: 4, itemStyle: { shadowBlur: 16, shadowColor: 'rgba(34,211,238,0.3)' } } }],
    }
  }

  const axisStyle = { axisLine: { lineStyle: { color: 'rgba(34,211,238,0.08)' } }, axisTick: { show: false }, axisLabel: { color: '#64748B', fontSize: 9 }, splitLine: { lineStyle: { color: 'rgba(34,211,238,0.03)', type: 'dashed' as const } } }

  if (chart.chart_type === 'horizontal_bar') {
    return {
      ...base,
      grid: { left: 90, right: 16, top: 20, bottom: 20 },
      tooltip: { ...base.tooltip, trigger: 'axis' },
      xAxis: { type: 'value', ...axisStyle },
      yAxis: { type: 'category', data: chart.categories, inverse: true, ...axisStyle, axisLabel: { ...axisStyle.axisLabel, width: 80, overflow: 'truncate' } },
      series: chart.series.map((s, i) => ({ ...s, type: 'bar', barWidth: '50%', itemStyle: { borderRadius: [0, 4, 4, 0], color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: PALETTE[i % PALETTE.length] }, { offset: 1, color: `${PALETTE[i % PALETTE.length]}60` }] } } })),
    }
  }

  if (chart.chart_type === 'line') {
    return {
      ...base,
      tooltip: { ...base.tooltip, trigger: 'axis' },
      legend: { textStyle: { color: '#94A3B8', fontSize: 10 }, top: 0 },
      xAxis: { type: 'category', data: chart.categories, boundaryGap: false, ...axisStyle },
      yAxis: { type: 'value', ...axisStyle },
      series: chart.series.map((s, i) => ({ ...s, type: 'line', smooth: 0.4, symbolSize: 4, lineStyle: { width: 2, shadowBlur: 8, shadowColor: `${PALETTE[i % PALETTE.length]}30` }, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: `${PALETTE[i % PALETTE.length]}20` }, { offset: 1, color: `${PALETTE[i % PALETTE.length]}02` }] } } })),
    }
  }

  // bar / grouped_bar
  return {
    ...base,
    tooltip: { ...base.tooltip, trigger: 'axis' },
    legend: chart.series.length > 1 ? { textStyle: { color: '#94A3B8', fontSize: 10 }, top: 0, itemWidth: 10, itemHeight: 3 } : undefined,
    xAxis: { type: 'category', data: chart.categories, ...axisStyle, axisLabel: { ...axisStyle.axisLabel, rotate: chart.categories.length > 6 ? 25 : 0, interval: 0 } },
    yAxis: { type: 'value', ...axisStyle },
    series: chart.series.map((s, i) => ({ ...s, type: 'bar', barWidth: chart.series.length > 1 ? '22%' : '40%', barGap: '30%', itemStyle: { borderRadius: [3, 3, 0, 0], color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: PALETTE[i % PALETTE.length] }, { offset: 1, color: `${PALETTE[i % PALETTE.length]}60` }] } } })),
  }
}

function AiChart({ chart }: { chart: ChartConfig }) {
  const option = useMemo(() => buildChartOption(chart), [chart])
  const h = chart.chart_type === 'horizontal_bar' ? Math.max(200, chart.categories.length * 32) : chart.chart_type === 'pie' ? 240 : 260
  return (
    <div style={{ marginTop: 10, borderRadius: 6, border: `1px solid ${theme.colors.borderSubtle}`, overflow: 'hidden', background: 'rgba(0,0,0,0.15)' }}>
      <ReactECharts option={option} style={{ height: h }} />
    </div>
  )
}

/* ========== 面板 ========== */
const AiChatPanel: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])
  useEffect(() => { if (open) inputRef.current?.focus() }, [open])

  const sendQuery = async (question: string) => {
    if (!question.trim() || loading) return
    const userMsg: ChatMessage = { id: Date.now(), role: 'user', content: question }
    const aiMsg: ChatMessage = { id: Date.now() + 1, role: 'ai', content: '', loading: true }
    setMessages((p) => [...p, userMsg, aiMsg])
    setInput('')
    setLoading(true)
    try {
      const result = await postAiQuery(question)
      setMessages((p) => p.map((m) => m.id === aiMsg.id ? { ...m, content: result.answer, data: result, loading: false } : m))
    } catch (err: any) {
      setMessages((p) => p.map((m) => m.id === aiMsg.id ? { ...m, content: `查询失败: ${err?.message || '网络错误'}`, loading: false, error: true } : m))
    } finally { setLoading(false) }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendQuery(input) } }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }} />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 560, background: 'linear-gradient(180deg, #040d20 0%, #030b1a 100%)', borderLeft: `1px solid ${theme.colors.accentCyan}25`, zIndex: 1000, display: 'flex', flexDirection: 'column', boxShadow: `-8px 0 40px rgba(0,0,0,0.5)` }}
          >
            {/* 头部 */}
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${theme.colors.accentCyan}15`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 6, background: `${theme.colors.accentCyan}15`, border: `1px solid ${theme.colors.accentCyan}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.colors.accentCyan} strokeWidth="2"><path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><path d="M18 14a6 6 0 0 1-12 0"/><path d="M12 18v4"/><path d="M8 22h8"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: theme.colors.textPrimary }}>AI 数据助手</div>
                  <div style={{ fontSize: 10, color: theme.colors.textSecondary }}>Vanna.ai + DeepSeek-v3</div>
                </div>
              </div>
              <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 4, border: `1px solid ${theme.colors.borderSubtle}`, background: 'transparent', color: theme.colors.textSecondary, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>&times;</button>
            </div>

            {/* 消息 */}
            <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px' }}>
              {messages.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={theme.colors.accentCyan} strokeWidth="1.5" style={{ opacity: 0.3, marginBottom: 16 }}><path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><path d="M18 14a6 6 0 0 1-12 0"/><path d="M12 18v4"/><path d="M8 22h8"/></svg>
                  <div style={{ fontSize: 13, color: theme.colors.textSecondary, marginBottom: 20 }}>用自然语言查询数据库，自动生成图表</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                    {EXAMPLES.map((q) => (
                      <button key={q} onClick={() => sendQuery(q)} style={{ padding: '6px 12px', borderRadius: 4, border: `1px solid ${theme.colors.accentCyan}20`, background: `${theme.colors.accentCyan}08`, color: theme.colors.accentCyan, fontSize: 11, cursor: 'pointer', fontFamily: theme.fontFamily, transition: 'all 0.2s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${theme.colors.accentCyan}50`; e.currentTarget.style.background = `${theme.colors.accentCyan}15` }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${theme.colors.accentCyan}20`; e.currentTarget.style.background = `${theme.colors.accentCyan}08` }}
                      >{q}</button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <div key={msg.id} style={{ marginBottom: 16 }}>
                  {msg.role === 'user' ? (
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <div style={{ maxWidth: '80%', padding: '10px 14px', borderRadius: '8px 2px 8px 8px', background: `${theme.colors.accentCyan}15`, border: `1px solid ${theme.colors.accentCyan}25`, fontSize: 13, color: theme.colors.textPrimary }}>{msg.content}</div>
                    </div>
                  ) : msg.loading ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0' }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {[0, 1, 2].map((i) => <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} style={{ width: 6, height: 6, borderRadius: '50%', background: theme.colors.accentCyan }} />)}
                      </div>
                      <span style={{ fontSize: 11, color: theme.colors.textSecondary }}>正在分析并生成图表...</span>
                    </div>
                  ) : (
                    <div style={{ padding: '12px 16px', borderRadius: '2px 8px 8px 8px', background: 'rgba(8,20,48,0.8)', border: `1px solid ${msg.error ? theme.colors.accentRed : theme.colors.borderSubtle}` }}>
                      {/* 回答 */}
                      <div style={{ fontSize: 13, color: theme.colors.textPrimary, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{msg.content}</div>

                      {/* 图表 */}
                      {msg.data?.chart && msg.data.chart.chart_type !== 'none' && <AiChart chart={msg.data.chart} />}

                      {/* SQL */}
                      {msg.data?.sql && (
                        <details style={{ marginTop: 10 }}>
                          <summary style={{ fontSize: 11, color: theme.colors.accentCyan, cursor: 'pointer', fontFamily: theme.fontFamily, userSelect: 'none' }}>SQL 查询</summary>
                          <pre style={{ marginTop: 6, padding: 8, borderRadius: 4, background: 'rgba(0,0,0,0.3)', border: `1px solid ${theme.colors.borderSubtle}`, fontSize: 10, color: theme.colors.accentCyan, overflow: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontFamily: theme.fontFamily }}>{msg.data.sql}</pre>
                        </details>
                      )}

                      {/* 数据表 */}
                      {msg.data && msg.data.rows.length > 0 && (
                        <details style={{ marginTop: 6 }}>
                          <summary style={{ fontSize: 11, color: theme.colors.accentCyan, cursor: 'pointer', fontFamily: theme.fontFamily, userSelect: 'none' }}>原始数据 ({msg.data.rows.length} 行)</summary>
                          <div style={{ marginTop: 6, overflow: 'auto', maxHeight: 240 }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10, fontFamily: theme.fontFamily }}>
                              <thead><tr>{msg.data.columns.map((c) => <th key={c} style={{ textAlign: 'left', padding: '5px 6px', borderBottom: `1px solid ${theme.colors.accentCyan}20`, color: theme.colors.accentCyan, fontWeight: 600, whiteSpace: 'nowrap' }}>{c}</th>)}</tr></thead>
                              <tbody>{msg.data.rows.slice(0, 50).map((row, i) => <tr key={i}>{msg.data!.columns.map((c) => <td key={c} style={{ padding: '4px 6px', borderBottom: `1px solid ${theme.colors.borderSubtle}`, color: theme.colors.textPrimary, whiteSpace: 'nowrap' }}>{row[c] ?? '-'}</td>)}</tr>)}</tbody>
                            </table>
                          </div>
                        </details>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* 输入 */}
            <div style={{ padding: '12px 20px 16px', borderTop: `1px solid ${theme.colors.accentCyan}10` }}>
              <div style={{ display: 'flex', gap: 8, padding: '8px 12px', borderRadius: 6, border: `1px solid ${theme.colors.accentCyan}20`, background: 'rgba(8,20,48,0.6)' }}>
                <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="输入问题，自动生成图表..." disabled={loading}
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: theme.colors.textPrimary, fontSize: 13, fontFamily: theme.fontFamily }} />
                <button onClick={() => sendQuery(input)} disabled={loading || !input.trim()}
                  style={{ width: 32, height: 32, borderRadius: 4, border: 'none', background: loading || !input.trim() ? `${theme.colors.accentCyan}15` : theme.colors.accentCyan, color: loading || !input.trim() ? theme.colors.textSecondary : '#030b1a', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/></svg>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default AiChatPanel
