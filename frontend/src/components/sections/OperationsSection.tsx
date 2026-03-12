import React, { useMemo } from 'react'
import { useOperationsKpi, useTrendData } from '../../hooks/useApi'
import DashboardCard from '../common/DashboardCard'
import SectionTitle from '../common/SectionTitle'
import LoadingSkeleton from '../common/LoadingSkeleton'
import KpiCard from '../common/KpiCard'
import MultiLineChart from '../charts/MultiLineChart'
import { theme } from '../../styles/theme'

const OperationsSection: React.FC = () => {
  const { data: kpiData, isLoading: kpiLoading } = useOperationsKpi()
  const { data: trendData, isLoading: trendLoading } = useTrendData()

  const trendChart = useMemo(() => {
    if (!trendData) return { categories: [], series: [] }
    const timeLabels = [...new Set(trendData.map((d) => `${d.schedule_date.slice(5)} ${d.day_time_period}`))]
    const sceneLabels = [...new Set(trendData.map((d) => d.scene_label))]
    const series = sceneLabels.map((scene) => ({
      name: scene,
      data: timeLabels.map((t) => {
        const [date, period] = t.split(' ')
        return trendData.find((d) => d.schedule_date.slice(5) === date && d.day_time_period === period && d.scene_label === scene)?.people_count || 0
      }),
    }))
    return { categories: timeLabels, series }
  }, [trendData])

  if (kpiLoading) return <LoadingSkeleton />

  return (
    <div>
      <SectionTitle title="会议运营数据" subtitle="实时运营概况与时间维度趋势分析" accentColor={theme.colors.accentGreen} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        <KpiCard label="签到人数" value={kpiData?.checkin_count ?? 0} unit="人" color={theme.colors.accentCyan} />
        <KpiCard label="接机人数" value={kpiData?.pickup_count ?? 0} unit="人" color={theme.colors.accentGreen} />
        <KpiCard label="离开人数" value={kpiData?.leave_count ?? 0} unit="人" color={theme.colors.accentRed} />
        <KpiCard label="到院人数" value={kpiData?.hospital_count ?? 0} unit="人" color={theme.colors.accentPurple} />
      </div>
      <DashboardCard glowColor={theme.colors.accentGreen} title="时间维度数据分析" subtitle="人流热力图 · 会期时间段（上午/下午/晚上）× 关键场景">
        {trendLoading ? <LoadingSkeleton /> : <MultiLineChart categories={trendChart.categories} series={trendChart.series} height={380} />}
      </DashboardCard>
    </div>
  )
}

export default OperationsSection
