import React, { useMemo } from 'react'
import { useRegistrationChart, useRegistrationMatrix } from '../../hooks/useApi'
import DashboardCard from '../common/DashboardCard'
import SectionTitle from '../common/SectionTitle'
import LoadingSkeleton from '../common/LoadingSkeleton'
import RegistrationComparisonChart from '../charts/RegistrationComparisonChart'
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

  const chart = useMemo(() => {
    if (!chartData) {
      return {
        categories: [] as string[],
        levels: [] as string[],
        registerSeries: [] as number[][],
        arriveSeries: [] as number[][],
      }
    }

    const regionMap = new Map<string, {
      region: string
      totalRegister: number
      totalArrive: number
      levelMap: Record<string, { register: number; arrive: number }>
    }>()
    const levelTotals = new Map<string, number>()

    chartData.forEach((item) => {
      const level = item.customer_level_name || '未分类'
      const regionEntry = regionMap.get(item.region) || {
        region: item.region,
        totalRegister: 0,
        totalArrive: 0,
        levelMap: {},
      }

      regionEntry.totalRegister += item.register_count
      regionEntry.totalArrive += item.arrive_count
      regionEntry.levelMap[level] = {
        register: item.register_count,
        arrive: item.arrive_count,
      }
      regionMap.set(item.region, regionEntry)
      levelTotals.set(level, (levelTotals.get(level) || 0) + item.register_count)
    })

    const levels = [...levelTotals.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([level]) => level)
    const sortedRegions = [...regionMap.values()].sort((a, b) => b.totalRegister - a.totalRegister)
    const categories = sortedRegions.map((item) => item.region)
    const registerSeries = levels.map((level) => (
      sortedRegions.map((region) => region.levelMap[level]?.register || 0)
    ))
    const arriveSeries = levels.map((level) => (
      sortedRegions.map((region) => region.levelMap[level]?.arrive || 0)
    ))

    return {
      categories,
      levels,
      registerSeries,
      arriveSeries,
    }
  }, [chartData])

  if (chartLoading) return <LoadingSkeleton />

  return (
    <div>
      <SectionTitle title="报名 VS 签到情况" subtitle="各区域按金额等级的报名与抵达对比" accentColor={theme.colors.accentCyan} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <DashboardCard title="报名/抵达统计" subtitle="按大区·金额等级（浅色为报名，实色为抵达）" fill>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
            <div style={{ marginBottom: 12, flexShrink: 0 }}>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '8px 18px',
                  width: '100%',
                }}
              >
                {chart.levels.map((level, index) => (
                  <div
                    key={level}
                    title={level}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      minWidth: 0,
                      maxWidth: 132,
                      fontSize: 11,
                      color: theme.colors.textSecondary,
                    }}
                  >
                    <span style={{ width: 12, height: 4, borderRadius: 999, background: theme.chartPalette[index % theme.chartPalette.length], boxShadow: `0 0 6px ${theme.chartPalette[index % theme.chartPalette.length]}55`, flexShrink: 0 }} />
                    <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{level}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <RegistrationComparisonChart
                categories={chart.categories}
                levels={chart.levels}
                registerSeries={chart.registerSeries}
                arriveSeries={chart.arriveSeries}
                height="100%"
              />
            </div>
          </div>
        </DashboardCard>
        <DashboardCard title="金额等级矩阵" subtitle="各大区报名与抵达明细">
          {matrixLoading ? <LoadingSkeleton /> : <DataTable<MatrixRow> columns={columns} dataSource={matrixData || []} rowKey="region" />}
        </DashboardCard>
      </div>
    </div>
  )
}

export default RegistrationSection
