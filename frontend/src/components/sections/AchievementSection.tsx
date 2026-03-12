import React, { useMemo } from 'react'
import { useAchievementChart, useAchievementTable } from '../../hooks/useApi'
import DashboardCard from '../common/DashboardCard'
import SectionTitle from '../common/SectionTitle'
import LoadingSkeleton from '../common/LoadingSkeleton'
import GroupedBarChart from '../charts/GroupedBarChart'
import DataTable from '../common/DataTable'
import { theme } from '../../styles/theme'
import type { AchievementRow } from '../../api/achievement'

const tableColumns = [
  { title: '#', dataIndex: 'row_num', key: 'n', width: 40 },
  { title: '区域', dataIndex: 'region', key: 'r' },
  { title: '达成', dataIndex: 'actual_amount', key: 'a', render: (v: number) => <span style={{ color: theme.colors.accentCyan, fontWeight: 600 }}>¥{v.toLocaleString()}</span> },
  { title: '目标', dataIndex: 'target_amount', key: 't', render: (v: number) => `¥${v.toLocaleString()}` },
  { title: '达成率', dataIndex: 'achievement_rate', key: 'rt', render: (v: number | null) => v !== null ? <span style={{ color: v >= 100 ? theme.colors.accentGreen : theme.colors.accentRed, fontWeight: 600 }}>{v}%</span> : '-' },
  { title: '差值', dataIndex: 'difference', key: 'd', render: (v: number) => <span style={{ color: v >= 0 ? theme.colors.accentGreen : theme.colors.accentRed, fontWeight: 600 }}>{v >= 0 ? '+' : ''}{v.toLocaleString()}</span> },
]

const AchievementSection: React.FC = () => {
  const { data: chartData, isLoading: chartLoading } = useAchievementChart()
  const { data: tableData, isLoading: tableLoading } = useAchievementTable()

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

  if (chartLoading) return <LoadingSkeleton />

  return (
    <div>
      <SectionTitle title="目标 VS 达成" subtitle="各区域成交目标完成情况" accentColor={theme.colors.accentRed} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <DashboardCard glowColor={theme.colors.accentRed} title="目标 VS 达成对比图">
          <GroupedBarChart categories={chart.categories} series={chart.series} />
        </DashboardCard>
        <DashboardCard glowColor={theme.colors.accentRed} title="达成率明细表">
          {tableLoading ? <LoadingSkeleton /> : <DataTable<AchievementRow> columns={tableColumns} dataSource={tableData || []} rowKey="row_num" />}
        </DashboardCard>
      </div>
    </div>
  )
}

export default AchievementSection
