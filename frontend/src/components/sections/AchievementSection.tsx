import React, { useMemo, useState, useCallback } from 'react'
import { useAchievementChart, useAchievementTable } from '../../hooks/useApi'
import DashboardCard from '../common/DashboardCard'
import SectionTitle from '../common/SectionTitle'
import LoadingSkeleton from '../common/LoadingSkeleton'
import GroupedBarChart from '../charts/GroupedBarChart'
import DataTable from '../common/DataTable'
import DrillDownModal from '../common/DrillDownModal'
import { fetchAchievementDetail, type AchievementDetail } from '../../api/achievement'
import type { AchievementRow } from '../../api/achievement'
import { theme } from '../../styles/theme'

const tableColumns = [
  { title: '#', dataIndex: 'row_num', key: 'n', width: 40 },
  { title: '区域', dataIndex: 'region', key: 'r' },
  { title: '达成', dataIndex: 'actual_amount', key: 'a', render: (v: number) => <span style={{ color: theme.colors.accentCyan, fontWeight: 600 }}>¥{v.toLocaleString()}</span> },
  { title: '目标', dataIndex: 'target_amount', key: 't', render: (v: number) => `¥${v.toLocaleString()}` },
  { title: '达成率', dataIndex: 'achievement_rate', key: 'rt', render: (v: number | null) => v !== null ? <span style={{ color: v >= 100 ? theme.colors.accentGreen : theme.colors.accentRed, fontWeight: 600 }}>{v}%</span> : '-' },
  { title: '差值', dataIndex: 'difference', key: 'd', render: (v: number) => <span style={{ color: v >= 0 ? theme.colors.accentGreen : theme.colors.accentRed, fontWeight: 600 }}>{v >= 0 ? '+' : ''}{v.toLocaleString()}</span> },
]

const detailColumns = [
  { title: '客户姓名', dataIndex: 'customer_name', key: 'name' },
  { title: '区域', dataIndex: 'region', key: 'region' },
  { title: '分公司', dataIndex: 'branch', key: 'branch' },
  { title: '成交类型', dataIndex: 'deal_type', key: 'type' },
  { title: '成交内容', dataIndex: 'deal_content', key: 'content', width: 200 },
  { title: '新成交金额', dataIndex: 'new_deal_amount', key: 'amount', render: (v: number) => <span style={{ color: theme.colors.accentCyan, fontWeight: 600 }}>¥{v.toLocaleString()}</span> },
  { title: '收款金额', dataIndex: 'received_amount', key: 'received', render: (v: number) => `¥${v.toLocaleString()}` },
  { title: '方案类型', dataIndex: 'plan_type', key: 'plan' },
  { title: '日期', dataIndex: 'record_date', key: 'date' },
]

const AchievementSection: React.FC = () => {
  const { data: chartData, isLoading: chartLoading } = useAchievementChart()
  const { data: tableData, isLoading: tableLoading } = useAchievementTable()
  const [drillOpen, setDrillOpen] = useState(false)
  const [drillRegion, setDrillRegion] = useState<string>()

  const chart = useMemo(() => {
    if (!chartData) return { categories: [], series: [] }
    return {
      categories: chartData.map((d) => d.region),
      series: [
        { name: '达成金额', data: chartData.map((d) => d.deal_amount) },
        { name: '成交低限', data: chartData.map((d) => d.low_limit) },
        { name: '成交高限', data: chartData.map((d) => d.high_limit) },
      ],
    }
  }, [chartData])

  const handleChartClick = useCallback((params: { name?: string }) => {
    if (params.name) {
      setDrillRegion(params.name)
      setDrillOpen(true)
    }
  }, [])

  const fetchDetail = useCallback(
    () => fetchAchievementDetail(drillRegion),
    [drillRegion],
  )

  if (chartLoading) return <LoadingSkeleton />

  return (
    <div>
      <SectionTitle title="目标 VS 达成" subtitle="各区域成交目标完成情况" accentColor={theme.colors.accentRed} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <DashboardCard glowColor={theme.colors.accentRed} title="目标 VS 达成对比图" subtitle="点击柱体查看成交明细" fill>
          <GroupedBarChart categories={chart.categories} series={chart.series} height="100%" onBarClick={handleChartClick} />
        </DashboardCard>
        <DashboardCard glowColor={theme.colors.accentRed} title="达成率明细表">
          {tableLoading ? <LoadingSkeleton /> : <DataTable<AchievementRow> columns={tableColumns} dataSource={tableData || []} rowKey="row_num" />}
        </DashboardCard>
      </div>
      <DrillDownModal<AchievementDetail>
        open={drillOpen}
        title={`成交明细 — ${drillRegion || ''}`}
        onClose={() => setDrillOpen(false)}
        fetchData={fetchDetail}
        columns={detailColumns}
        rowKey={(r) => `${r.customer_name}-${r.record_date}`}
      />
    </div>
  )
}

export default AchievementSection
