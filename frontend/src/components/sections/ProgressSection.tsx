import React, { useMemo } from 'react'
import { useProgress } from '../../hooks/useApi'
import DashboardCard from '../common/DashboardCard'
import SectionTitle from '../common/SectionTitle'
import LoadingSkeleton from '../common/LoadingSkeleton'
import HorizontalBarChart from '../charts/HorizontalBarChart'
import { theme } from '../../styles/theme'

const ProgressSection: React.FC = () => {
  const { data, isLoading } = useProgress()

  const chart = useMemo(() => {
    if (!data) return { categories: [], series: [] }
    return {
      categories: data.items.map((d) => d.region),
      series: [
        { name: '达成金额', data: data.items.map((d) => d.deal_amount) },
        { name: '成交高限', data: data.items.map((d) => d.high_limit) },
      ],
    }
  }, [data])

  if (isLoading || !data) return <LoadingSkeleton />

  return (
    <div>
      <SectionTitle title="完成进度排行" subtitle="前景柱=成交金额 | 底条=高限" accentColor={theme.colors.accentAmber} />
      <DashboardCard glowColor={theme.colors.accentAmber} title="各区域完成度" subtitle={`平均完成率: ${data.avg_completion_rate ?? 0}%`}>
        <HorizontalBarChart categories={chart.categories} series={chart.series} height={Math.max(280, data.items.length * 36)} />
      </DashboardCard>
    </div>
  )
}

export default ProgressSection
