import React, { useMemo } from 'react'
import { useSourceDistribution, useTargetArrival } from '../../hooks/useApi'
import DashboardCard from '../common/DashboardCard'
import SectionTitle from '../common/SectionTitle'
import LoadingSkeleton from '../common/LoadingSkeleton'
import StackedBarChart from '../charts/StackedBarChart'
import GroupedBarChart from '../charts/GroupedBarChart'
import { theme } from '../../styles/theme'

const CustomerSourceSection: React.FC = () => {
  const { data: sourceData, isLoading: srcLoading } = useSourceDistribution()
  const { data: targetData, isLoading: tgtLoading } = useTargetArrival()

  const sourceChart = useMemo(() => {
    if (!sourceData) return { categories: [], series: [] }
    const regions = [...new Set(sourceData.map((d) => d.region))]
    const types = [...new Set(sourceData.map((d) => d.source_type))]
    const series = types.map((t) => ({
      name: t,
      data: regions.map((r) => sourceData.find((d) => d.region === r && d.source_type === t)?.customer_count || 0),
    }))
    return { categories: regions, series }
  }, [sourceData])

  const targetChart = useMemo(() => {
    if (!targetData) return { categories: [], series: [] }
    const regions = targetData.map((d) => d.region)
    return {
      categories: regions,
      series: [
        { name: '目标客户', data: targetData.map((d) => d.target_count) },
        { name: '已抵达', data: targetData.map((d) => d.arrive_count) },
      ],
    }
  }, [targetData])

  if (srcLoading) return <LoadingSkeleton />

  return (
    <div>
      <SectionTitle title="客户来源 + 任务进展" subtitle="按大区·来源维度分析客户报名渠道与目标客户抵达" accentColor={theme.colors.accentGreen} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <DashboardCard glowColor={theme.colors.accentCyan} title="客户报名统计" subtitle="按大区·来源类型">
          <StackedBarChart categories={sourceChart.categories} series={sourceChart.series} />
        </DashboardCard>
        <DashboardCard glowColor={theme.colors.accentGreen} title="优质目标客户抵达" subtitle="目标 vs 实际抵达">
          {tgtLoading ? <LoadingSkeleton /> : <GroupedBarChart categories={targetChart.categories} series={targetChart.series} />}
        </DashboardCard>
      </div>
    </div>
  )
}

export default CustomerSourceSection
