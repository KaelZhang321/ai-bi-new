import React, { useMemo } from 'react'
import { useRegistrationChart, useRegistrationMatrix } from '../../hooks/useApi'
import DashboardCard from '../common/DashboardCard'
import SectionTitle from '../common/SectionTitle'
import LoadingSkeleton from '../common/LoadingSkeleton'
import StackedBarChart from '../charts/StackedBarChart'
import DataTable from '../common/DataTable'
import type { MatrixRow } from '../../api/registration'
import { theme } from '../../styles/theme'

const columns = [
  { title: '大区', dataIndex: 'region', key: 'region', fixed: 'left' as const, width: 100 },
  { title: '千万(报名)', dataIndex: 'qianwan_register', key: 'qr', width: 85 },
  { title: '千万(抵达)', dataIndex: 'qianwan_arrive', key: 'qa', width: 85, render: (v: number) => <span style={{ color: v > 0 ? theme.colors.accentGreen : theme.colors.textSecondary, fontWeight: v > 0 ? 600 : 400 }}>{v}</span> },
  { title: '百万(报名)', dataIndex: 'baiwan_register', key: 'br', width: 85 },
  { title: '百万(抵达)', dataIndex: 'baiwan_arrive', key: 'ba', width: 85, render: (v: number) => <span style={{ color: v > 0 ? theme.colors.accentGreen : theme.colors.textSecondary, fontWeight: v > 0 ? 600 : 400 }}>{v}</span> },
  { title: '普通(报名)', dataIndex: 'putong_register', key: 'pr', width: 85 },
  { title: '普通(抵达)', dataIndex: 'putong_arrive', key: 'pa', width: 85, render: (v: number) => <span style={{ color: v > 0 ? theme.colors.accentGreen : theme.colors.textSecondary, fontWeight: v > 0 ? 600 : 400 }}>{v}</span> },
  { title: '总报名', dataIndex: 'total_register', key: 'tr', width: 75, render: (v: number) => <strong style={{ color: theme.colors.accentCyan }}>{v}</strong> },
  { title: '总抵达', dataIndex: 'total_arrive', key: 'ta', width: 75, render: (v: number) => <strong style={{ color: theme.colors.accentGreen }}>{v}</strong> },
]

const RegistrationSection: React.FC = () => {
  const { data: chartData, isLoading: chartLoading } = useRegistrationChart()
  const { data: matrixData, isLoading: matrixLoading } = useRegistrationMatrix()

  const { categories, series } = useMemo(() => {
    if (!chartData) return { categories: [], series: [] }
    const regionSet = [...new Set(chartData.map((d) => d.region))]
    const levelSet = [...new Set(chartData.map((d) => d.customer_level_name || '未分类'))]
    const registerSeries = levelSet.map((level) => ({
      name: `${level}`,
      data: regionSet.map((region) => chartData.find((d) => d.region === region && (d.customer_level_name || '未分类') === level)?.register_count || 0),
    }))
    return { categories: regionSet, series: registerSeries }
  }, [chartData])

  if (chartLoading) return <LoadingSkeleton />

  return (
    <div>
      <SectionTitle title="报名 VS 签到情况" subtitle="各区域按金额等级的报名与抵达对比" accentColor={theme.colors.accentCyan} />
      <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: 20 }}>
        <DashboardCard title="报名/抵达统计" subtitle="按大区·金额等级" fill>
          <StackedBarChart categories={categories} series={series} height="100%" />
        </DashboardCard>
        <DashboardCard title="金额等级矩阵" subtitle="各大区报名与抵达明细">
          {matrixLoading ? <LoadingSkeleton /> : <DataTable<MatrixRow> columns={columns} dataSource={matrixData || []} rowKey="region" />}
        </DashboardCard>
      </div>
    </div>
  )
}

export default RegistrationSection
