import React, { useMemo, useState, useCallback } from 'react'
import { useRegistrationChart, useRegistrationMatrix } from '../../../hooks/useApi'
import MobileSectionTitle from '../MobileSectionTitle'
import MobileCard from '../MobileCard'
import MobileDataTable from '../MobileDataTable'
import MobileDrillDrawer from '../MobileDrillDrawer'
import LoadingSkeleton from '../../common/LoadingSkeleton'
import StackedBarChart from '../../charts/StackedBarChart'
import { fetchRegistrationDetail, type RegistrationDetail } from '../../../api/registration'
import type { MatrixRow } from '../../../api/registration'

const columns = [
  { title: '大区', dataIndex: 'region', key: 'region', fixed: 'left' as const, width: 60 },
  { title: '千万(报)', dataIndex: 'qianwan_register', key: 'qr', width: 62 },
  { title: '千万(到)', dataIndex: 'qianwan_arrive', key: 'qa', width: 62, render: (v: number) => <span style={{ color: v > 0 ? '#10B981' : '#9CA3AF', fontWeight: v > 0 ? 600 : 400 }}>{v}</span> },
  { title: '百万(报)', dataIndex: 'baiwan_register', key: 'br', width: 62 },
  { title: '百万(到)', dataIndex: 'baiwan_arrive', key: 'ba', width: 62, render: (v: number) => <span style={{ color: v > 0 ? '#10B981' : '#9CA3AF', fontWeight: v > 0 ? 600 : 400 }}>{v}</span> },
  { title: '总报名', dataIndex: 'total_register', key: 'tr', width: 56, render: (v: number) => <strong style={{ color: '#3B82F6' }}>{v}</strong> },
  { title: '总抵达', dataIndex: 'total_arrive', key: 'ta', width: 56, render: (v: number) => <strong style={{ color: '#10B981' }}>{v}</strong> },
]

const detailColumns = [
  { title: '客户姓名', dataIndex: 'customer_name', key: 'name', width: 80 },
  { title: '签到状态', dataIndex: 'sign_in_status', key: 'status', width: 70, render: (v: string) => <span style={{ color: v === '已签到' ? '#10B981' : '#9CA3AF' }}>{v || '-'}</span> },
  { title: '金额等级', dataIndex: 'customer_level_name', key: 'level', width: 70, render: (v: string | null) => v || '未分类' },
  { title: '参会角色', dataIndex: 'attendee_role', key: 'role', width: 70 },
]

const MobileRegistrationSection: React.FC = () => {
  const { data: chartData, isLoading: chartLoading } = useRegistrationChart()
  const { data: matrixData, isLoading: matrixLoading } = useRegistrationMatrix()
  const [drillOpen, setDrillOpen] = useState(false)
  const [drillRegion, setDrillRegion] = useState<string>()
  const [drillLevel, setDrillLevel] = useState<string>()

  const { categories, series } = useMemo(() => {
    if (!chartData) return { categories: [], series: [] }
    const regionSet = [...new Set(chartData.map((d) => d.region))]
    const levelSet = [...new Set(chartData.map((d) => d.customer_level_name || '未分类'))]
    const registerSeries = levelSet.map((level) => ({
      name: `${level}(报名)`,
      stack: 'register',
      data: regionSet.map((region) => chartData.find((d) => d.region === region && (d.customer_level_name || '未分类') === level)?.register_count || 0),
    }))
    const arriveSeries = levelSet.map((level) => ({
      name: `${level}(抵达)`,
      stack: 'arrive',
      data: regionSet.map((region) => chartData.find((d) => d.region === region && (d.customer_level_name || '未分类') === level)?.arrive_count || 0),
    }))
    return { categories: regionSet, series: [...registerSeries, ...arriveSeries] }
  }, [chartData])

  const handleChartClick = useCallback((params: { name?: string; seriesName?: string }) => {
    if (params.name && params.seriesName) {
      setDrillRegion(params.name)
      setDrillLevel(params.seriesName)
      setDrillOpen(true)
    }
  }, [])

  const fetchDetail = useCallback(
    () => fetchRegistrationDetail(drillRegion, drillLevel === '未分类' ? '未分类' : drillLevel),
    [drillRegion, drillLevel],
  )

  if (chartLoading) return <LoadingSkeleton />

  return (
    <div>
      <MobileSectionTitle title="报名 VS 签到" subtitle="各区域按金额等级对比" accentColor="#3B82F6" />
      <MobileCard title="报名/抵达统计" subtitle="点击柱体查看明细" glowColor="#3B82F6">
        <StackedBarChart categories={categories} series={series} height={260} onBarClick={handleChartClick} />
      </MobileCard>
      <div style={{ height: 12 }} />
      <MobileCard title="金额等级矩阵" glowColor="#3B82F6">
        {matrixLoading ? <LoadingSkeleton /> : <MobileDataTable<MatrixRow> columns={columns} dataSource={matrixData || []} rowKey="region" />}
      </MobileCard>
      <MobileDrillDrawer<RegistrationDetail>
        open={drillOpen}
        title={`客户明细 — ${drillRegion || ''}`}
        onClose={() => setDrillOpen(false)}
        fetchData={fetchDetail}
        columns={detailColumns}
        rowKey={(r) => `${r.customer_name}-${r.store_name}`}
      />
    </div>
  )
}

export default MobileRegistrationSection
