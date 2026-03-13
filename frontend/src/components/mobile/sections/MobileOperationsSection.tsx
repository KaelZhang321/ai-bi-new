import React, { useMemo, useState } from 'react'
import { DatePicker, Select } from 'antd'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { useOperationsKpi, useTrendData } from '../../../hooks/useApi'
import MobileSectionTitle from '../MobileSectionTitle'
import MobileCard from '../MobileCard'
import MobileKpiCard from '../MobileKpiCard'
import LoadingSkeleton from '../../common/LoadingSkeleton'
import MultiLineChart from '../../charts/MultiLineChart'
import { theme } from '../../../styles/theme'

const MobileOperationsSection: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(dayjs().format('YYYY-MM-DD'))
  const [selectedScene, setSelectedScene] = useState<string>('all')

  const { data: kpiData, isLoading: kpiLoading } = useOperationsKpi(selectedDate, selectedDate)
  const { data: trendData, isLoading: trendLoading } = useTrendData()

  const sceneOptions = useMemo(() => {
    if (!trendData) return []
    const labels = [...new Set(trendData.map((d) => d.scene_label))]
    return [{ value: 'all', label: '全部场景' }, ...labels.map((s) => ({ value: s, label: s }))]
  }, [trendData])

  const trendChart = useMemo(() => {
    if (!trendData) return { categories: [], series: [] }
    const timeLabels = [...new Set(trendData.map((d) => `${d.schedule_date.slice(5)} ${d.day_time_period}`))]
    const sceneLabels = selectedScene === 'all'
      ? [...new Set(trendData.map((d) => d.scene_label))]
      : [selectedScene]
    const series = sceneLabels.map((scene) => ({
      name: scene,
      data: timeLabels.map((t) => {
        const [date, period] = t.split(' ')
        return trendData.find((d) => d.schedule_date.slice(5) === date && d.day_time_period === period && d.scene_label === scene)?.people_count || 0
      }),
    }))
    return { categories: timeLabels, series }
  }, [trendData, selectedScene])

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date ? date.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'))
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <MobileSectionTitle title="会议运营数据" subtitle="实时运营概况" accentColor={theme.colors.accentGreen} />
        <DatePicker
          defaultValue={dayjs()}
          onChange={handleDateChange}
          allowClear={false}
          size="small"
          style={{ flexShrink: 0 }}
        />
      </div>
      {kpiLoading ? <LoadingSkeleton /> : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          <MobileKpiCard label="签到人数" value={kpiData?.checkin_count ?? 0} unit="人" color={theme.colors.accentCyan} />
          <MobileKpiCard label="接机人数" value={kpiData?.pickup_count ?? 0} unit="人" color={theme.colors.accentGreen} />
          <MobileKpiCard label="离开人数" value={kpiData?.leave_count ?? 0} unit="人" color={theme.colors.accentRed} />
          <MobileKpiCard label="到院人数" value={kpiData?.hospital_count ?? 0} unit="人" color={theme.colors.accentPurple} />
        </div>
      )}
      <MobileCard
        glowColor={theme.colors.accentGreen}
        title="时间维度数据分析"
        subtitle="人流趋势 · 按场景"
        extra={
          <Select
            value={selectedScene}
            onChange={setSelectedScene}
            options={sceneOptions}
            size="small"
            style={{ width: 100, flexShrink: 0 }}
          />
        }
      >
        {trendLoading ? <LoadingSkeleton /> : <MultiLineChart categories={trendChart.categories} series={trendChart.series} height={280} />}
      </MobileCard>
    </div>
  )
}

export default MobileOperationsSection
