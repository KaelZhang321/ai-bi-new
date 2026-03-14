import React, { useMemo } from 'react'
import { useProgress } from '../../../hooks/useApi'
import MobileSectionTitle from '../MobileSectionTitle'
import MobileCard from '../MobileCard'
import LoadingSkeleton from '../../common/LoadingSkeleton'
import HorizontalBarChart from '../../charts/HorizontalBarChart'

const MobileProgressSection: React.FC = () => {
  const { data, isLoading } = useProgress()

  const chart = useMemo(() => {
    if (!data) return { categories: [], series: [], completionRates: [] as (number | null | undefined)[] }
    return {
      categories: data.items.map((d) => d.region),
      series: [
        { name: '达成金额', data: data.items.map((d) => d.deal_amount) },
        { name: '成交高限', data: data.items.map((d) => d.high_limit) },
      ],
      completionRates: data.items.map((d) => d.completion_rate),
    }
  }, [data])

  if (isLoading || !data) return <LoadingSkeleton />

  return (
    <div>
      <MobileSectionTitle title="完成进度排行" subtitle="前景柱=成交金额 | 底条=高限" accentColor="#F59E0B" />
      <MobileCard glowColor="#F59E0B" title="各区域完成度" subtitle={`平均完成率: ${data.avg_completion_rate ?? 0}%`}>
        <HorizontalBarChart categories={chart.categories} series={chart.series} completionRates={chart.completionRates} height={Math.max(240, data.items.length * 32)} />
      </MobileCard>
    </div>
  )
}

export default MobileProgressSection
