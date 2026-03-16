import React, { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { AnimatePresence, motion } from 'framer-motion'
import DistributionBarChart from '../components/charts/DistributionBarChart'
import GroupedBarChart from '../components/charts/GroupedBarChart'
import HorizontalBarChart from '../components/charts/HorizontalBarChart'
import MultiLineChart from '../components/charts/MultiLineChart'
import PieChart from '../components/charts/PieChart'
import DataTable from '../components/common/DataTable'
import LoadingSkeleton from '../components/common/LoadingSkeleton'
import AiChatPanel from '../components/sections/AiChatPanel'
import type { MatrixRow } from '../api/registration'
import {
  useCustomerProfile,
  useKpiOverview,
  useProgress,
  useRegistrationMatrix,
  useSourceDistribution,
  useTrendData,
} from '../hooks/useApi'
import '../styles/bigscreen.css'
import aiIcon from '../styles/AI.png'

const matrixColumns = [
  { title: '大区', dataIndex: 'region', key: 'region', fixed: 'left' as const, width: 80 },
  { title: '千万(报)', dataIndex: 'qianwan_register', key: 'qianwan_register', width: 82 },
  { title: '千万(到)', dataIndex: 'qianwan_arrive', key: 'qianwan_arrive', width: 82 },
  { title: '百万(报)', dataIndex: 'baiwan_register', key: 'baiwan_register', width: 82 },
  { title: '百万(到)', dataIndex: 'baiwan_arrive', key: 'baiwan_arrive', width: 82 },
  { title: '普通(报)', dataIndex: 'putong_register', key: 'putong_register', width: 82 },
  { title: '普通(到)', dataIndex: 'putong_arrive', key: 'putong_arrive', width: 82 },
  { title: '总报名', dataIndex: 'total_register', key: 'total_register', width: 86 },
  { title: '总抵达', dataIndex: 'total_arrive', key: 'total_arrive', width: 86 },
]

const progressColumns = [
  { title: '区域', dataIndex: 'region', key: 'region', width: 90 },
  { title: '达成金额', dataIndex: 'deal_amount', key: 'deal_amount', width: 110, render: (v: number) => formatCurrency(v) },
  { title: '成交高限', dataIndex: 'high_limit', key: 'high_limit', width: 110, render: (v: number) => formatCurrency(v) },
  { title: '完成率', dataIndex: 'completion_rate', key: 'completion_rate', width: 90, render: (v: number | null) => (v == null ? '--' : `${v.toFixed(2)}%`) },
]

const entryTabs = [
  { id: 'customer', label: '客户总览' },
  { id: 'ops', label: '运营数据' },
  { id: 'goal', label: '目标达成' },
] as const

type EntryTab = (typeof entryTabs)[number]['id']

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return '--'
  if (Math.abs(value) >= 10000) return value.toLocaleString('zh-CN')
  if (Number.isInteger(value)) return value.toLocaleString('zh-CN')
  return value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatCurrency(value: number, unit = '万'): string {
  if (!Number.isFinite(value)) return '--'
  return `¥${formatNumber(value)}${unit}`
}

const Dashboard: React.FC = () => {
  const [aiOpen, setAiOpen] = useState(false)
  const [entryTab, setEntryTab] = useState<EntryTab>('customer')

  const updateTime = dayjs().format('YYYY/MM/DD HH:mm:ss')

  const { data: kpiData, isLoading: kpiLoading } = useKpiOverview()
  const { data: registrationData, isLoading: registrationLoading } = useRegistrationMatrix()
  const { data: trendData, isLoading: trendLoading } = useTrendData()
  const { data: customerProfile, isLoading: profileLoading } = useCustomerProfile()
  const { data: sourceData, isLoading: sourceLoading } = useSourceDistribution()
  const { data: progressData, isLoading: progressLoading } = useProgress()

  const dealAmountItem = kpiData?.deal_amount
  const receivedAmountItem = kpiData?.received_amount

  const dealAmountLabel = dealAmountItem?.label || '已成交金额'
  const receivedAmountLabel = receivedAmountItem?.label || '已收款金额'

  const centerAmount = useMemo(() => {
    if (!dealAmountItem) return '--'
    return `${dealAmountItem.prefix || ''}${formatNumber(dealAmountItem.value)}`
  }, [dealAmountItem])

  const centerUnit = useMemo(() => (dealAmountItem?.unit ? `${dealAmountItem.unit}` : ''), [dealAmountItem])

  const monthAmount = useMemo(() => {
    if (!receivedAmountItem) return '--'
    return `${receivedAmountItem.prefix || ''}${formatNumber(receivedAmountItem.value)}${receivedAmountItem.unit || ''}`
  }, [receivedAmountItem])

  const sceneCards = useMemo(() => {
    const fallback = [
      { label: '新规划消耗', value: '--' },
      { label: '已收款金额', value: '--' },
      { label: '总投资回报率', value: '--' },
    ]

    if (!kpiData) return fallback

    const picked = [kpiData.consumed_budget, kpiData.received_amount, kpiData.roi]
    return picked.map((item, idx) => {
      if (!item) return fallback[idx]
      const suffix = item.unit || ''
      const formatted = suffix === '%'
        ? `${formatNumber(item.value)}${suffix}`
        : `${item.prefix || ''}${formatNumber(item.value)}${suffix}`
      return {
        label: item.label || fallback[idx].label,
        value: formatted,
      }
    })
  }, [kpiData])

  const topStats = useMemo(() => {
    const registeredCustomers = kpiData?.registered_customers.value ?? 0
    const arrivedCustomers = kpiData?.arrived_customers.value ?? 0
    const arrivalRate = registeredCustomers > 0 ? (arrivedCustomers / registeredCustomers) * 100 : 0

    return [
      { label: '报名客户', value: formatNumber(registeredCustomers) },
      { label: '已抵达客户', value: formatNumber(arrivedCustomers) },
      { label: '报名抵达率', value: `${arrivalRate.toFixed(2)}%` },
    ]
  }, [kpiData?.arrived_customers.value, kpiData?.registered_customers.value])

  const registrationChart = useMemo(() => {
    if (!registrationData || registrationData.length === 0) {
      return { categories: [] as string[], series: [] as { name: string; data: number[] }[] }
    }
    return {
      categories: registrationData.map((item) => item.region),
      series: [
        { name: '报名人数', data: registrationData.map((item) => item.total_register) },
        { name: '抵达人数', data: registrationData.map((item) => item.total_arrive) },
      ],
    }
  }, [registrationData])

  const sourceDistribution = useMemo(() => {
    if (!sourceData || sourceData.length === 0) return []
    const total = sourceData.reduce((sum, item) => sum + item.customer_count, 0) || 1
    return sourceData
      .map((item) => ({
        name: `${item.region} · ${item.source_type}`,
        value: item.customer_count,
        percentage: (item.customer_count / total) * 100,
      }))
      .sort((a, b) => b.value - a.value)
  }, [sourceData])

  const trendChart = useMemo(() => {
    if (!trendData || trendData.length === 0) {
      return { categories: [] as string[], series: [{ name: '客流趋势', data: [] as number[] }] }
    }

    const periodOrder: Record<string, number> = { 上午: 1, 下午: 2, 晚上: 3 }
    const grouped = new Map<string, number>()

    for (const item of trendData) {
      const key = `${item.schedule_date} ${item.day_time_period}`
      grouped.set(key, (grouped.get(key) ?? 0) + item.people_count)
    }

    const sortedEntries = [...grouped.entries()]
      .sort((a, b) => {
        const [aDate, aPeriod] = a[0].split(' ')
        const [bDate, bPeriod] = b[0].split(' ')
        if (aDate !== bDate) return aDate.localeCompare(bDate)
        return (periodOrder[aPeriod] ?? 99) - (periodOrder[bPeriod] ?? 99)
      })
      .slice(-16)

    return {
      categories: sortedEntries.map(([key]) => key.slice(5)),
      series: [{ name: '客流趋势', data: sortedEntries.map(([, value]) => value) }],
    }
  }, [trendData])

  const progressChart = useMemo(() => {
    if (!progressData) {
      return { categories: [] as string[], series: [] as { name: string; data: number[] }[], completionRates: [] as Array<number | null | undefined> }
    }
    return {
      categories: progressData.items.map((item) => item.region),
      series: [
        { name: '达成金额', data: progressData.items.map((item) => item.deal_amount) },
        { name: '成交高限', data: progressData.items.map((item) => item.high_limit) },
      ],
      completionRates: progressData.items.map((item) => item.completion_rate),
    }
  }, [progressData])

  return (
    <div className="bigscreen-root">
      <div className="bigscreen-header">
        <div className="bigscreen-brand">
          <div className="bigscreen-brand-dot" />
          <div>
            <div className="bigscreen-brand-title">会议数据分析驾驶舱</div>
            <div className="bigscreen-brand-sub">数据更新时间 {updateTime}</div>
          </div>
        </div>
        <div className="bigscreen-center-pill">
          <span className="bigscreen-center-indicator" />
          318梅赛尔国际健康节
        </div>
        <div className="entry-switch">
          {entryTabs.map((tab) => (
            <button
              key={tab.id}
              className={`panel-tab-btn ${entryTab === tab.id ? 'active' : ''}`}
              onClick={() => setEntryTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bigscreen-grid">
        <motion.aside
          className="panel-shell"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="panel-header">
            <div className="panel-title">客户画像分析</div>
            <div className="panel-subtitle">金额等级 / 身份类型 / 新老客户</div>
          </div>

          <div className="side-panel-body">
            {profileLoading || !customerProfile ? (
              <LoadingSkeleton />
            ) : (
              <div className="chart-stack chart-stack--left">
                <div className="mini-chart-card">
                  <div className="mini-chart-title">身份类型分布</div>
                  <div className="mini-chart-content">
                    <PieChart data={customerProfile.role_distribution} height="100%" />
                  </div>
                </div>
                <div className="mini-chart-card">
                  <div className="mini-chart-title">新老客户对比</div>
                  <div className="mini-chart-content">
                    <PieChart data={customerProfile.new_old_distribution} height="100%" />
                  </div>
                </div>
                <div className="mini-chart-card">
                  <div className="mini-chart-title">金额等级分布</div>
                  <div className="mini-chart-content">
                    <DistributionBarChart data={customerProfile.level_distribution} height="100%" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.aside>

        <main className="stage-main">
          <motion.section
            className="hero-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="hero-headline">
              <div className="hero-caption">{dealAmountLabel}</div>
              <div className="hero-amount">
                {kpiLoading ? '--' : centerAmount}
                <span className="hero-unit">{centerUnit}</span>
              </div>
              <div className="hero-subamount">{receivedAmountLabel} {monthAmount}</div>
            </div>
            <div className="hero-divider" />
            <div className="hero-channels">
              {sceneCards.map((item) => (
                <div className="hero-channel" key={item.label}>
                  <div className="hero-channel-label">{item.label}</div>
                  <div className="hero-channel-value">{item.value}</div>
                </div>
              ))}
            </div>
          </motion.section>

          <section className="stat-row">
            {topStats.map((stat) => (
              <article className="stat-card" key={stat.label}>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value">{stat.value}</div>
              </article>
            ))}
          </section>

          <section className="trend-card">
            {entryTab === 'customer' && (
              <>
                <div className="trend-title">报名/抵达统计</div>
                <div className="trend-subtitle">按区域查看报名与抵达人数对比</div>
                {registrationLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <>
                    <GroupedBarChart categories={registrationChart.categories} series={registrationChart.series} height={330} />
                    <div style={{ marginTop: 20 }}>
                      <div className="trend-subtitle" style={{ marginBottom: 8 }}>金额等级矩阵</div>
                      <DataTable<MatrixRow>
                        columns={matrixColumns}
                        dataSource={registrationData || []}
                        rowKey="region"
                        pagination={{ pageSize: 8, showSizeChanger: false }}
                      />
                    </div>
                  </>
                )}
              </>
            )}
            {entryTab === 'ops' && (
              <>
                <div className="trend-title">运营趋势</div>
                <div className="trend-subtitle">按会期时间段聚合 · 近16个时段</div>
                {trendLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <MultiLineChart categories={trendChart.categories} series={trendChart.series} height={420} />
                )}
              </>
            )}
            {entryTab === 'goal' && (
              <>
                <div className="trend-title">目标达成进展</div>
                <div className="trend-subtitle">各区域达成金额与成交高限对比</div>
                {progressLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <>
                    <HorizontalBarChart
                      categories={progressChart.categories}
                      series={progressChart.series}
                      completionRates={progressChart.completionRates}
                      height={320}
                    />
                    <div style={{ marginTop: 16 }}>
                      <DataTable
                        columns={progressColumns}
                        dataSource={progressData?.items || []}
                        rowKey="region"
                        pagination={{ pageSize: 8, showSizeChanger: false }}
                      />
                    </div>
                  </>
                )}
              </>
            )}
          </section>
        </main>

        <motion.aside
          className="panel-shell"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="panel-header">
            <div className="panel-title">客户来源 + 任务进展</div>
            <div className="panel-subtitle">来源渠道结构与区域完成度</div>
          </div>

          <div className="side-panel-body">
            <div className="chart-stack chart-stack--right">
              <div className="mini-chart-card">
                <div className="mini-chart-title">客户来源分布</div>
                {sourceLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <div className="mini-chart-content">
                    <DistributionBarChart data={sourceDistribution} height="100%" seriesName="客户数" />
                  </div>
                )}
              </div>
              <div className="mini-chart-card">
                <div className="mini-chart-title">
                  任务进展
                  {progressData?.avg_completion_rate != null ? ` · 平均完成率 ${progressData.avg_completion_rate.toFixed(2)}%` : ''}
                </div>
                {progressLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <div className="mini-chart-content">
                    <HorizontalBarChart
                      categories={progressChart.categories}
                      series={progressChart.series}
                      completionRates={progressChart.completionRates}
                      height="100%"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.aside>
      </div>

      <motion.button
        className="ai-float-btn"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setAiOpen(true)}
      >
        <img src={aiIcon} alt="AI" style={{ width: 64, height: 64, borderRadius: '50%' }} />
      </motion.button>

      <AnimatePresence>
        <AiChatPanel open={aiOpen} onClose={() => setAiOpen(false)} />
      </AnimatePresence>
    </div>
  )
}

export default Dashboard
