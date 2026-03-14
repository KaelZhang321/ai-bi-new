import React, { useMemo } from 'react'
import { useProposalOverview, useProposalCrossTable } from '../../../hooks/useApi'
import MobileSectionTitle from '../MobileSectionTitle'
import MobileCard from '../MobileCard'
import MobileDataTable from '../MobileDataTable'
import LoadingSkeleton from '../../common/LoadingSkeleton'
import type { ProposalRow, ProposalCrossRow } from '../../../api/proposal'

const mono = "'JetBrains Mono', monospace"

const EmptyPlaceholder = () => (
  <div style={{ textAlign: 'center', padding: 32 }}>
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" style={{ marginBottom: 8 }}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
    <div style={{ color: '#9CA3AF', fontSize: 13 }}>方案目标数据待录入</div>
  </div>
)

const MobileProposalSection: React.FC = () => {
  const { data: overviewData, isLoading: overviewLoading } = useProposalOverview()
  const { data: crossData, isLoading: crossLoading } = useProposalCrossTable()

  const overviewColumns = useMemo(() => [
    { title: '方案', dataIndex: 'proposal_type', key: 'type', width: 70 },
    { title: '目标', dataIndex: 'target_count', key: 'target', width: 50 },
    {
      title: '实际数',
      dataIndex: 'actual_count',
      key: 'actual_count',
      width: 60,
      render: (v: number, record: ProposalRow) => (
        <span style={{ color: v >= record.target_count ? '#10B981' : '#EF4444', fontWeight: 600 }}>
          {v}
        </span>
      ),
    },
    {
      title: '实际金额',
      dataIndex: 'actual_amount',
      key: 'actual_amount',
      width: 88,
      render: (v: number) => <span style={{ color: '#10B981', fontWeight: 600, fontFamily: mono }}>¥{Number(v ?? 0).toLocaleString()}</span>,
    },
  ], [])

  const crossColumns = useMemo(() => {
    if (!crossData || crossData.length === 0) return []
    const proposalTypes = [...new Set(crossData.flatMap((r) => Object.keys(r.proposals)))]
    return [
      { title: '大区', dataIndex: 'region', key: 'region', fixed: 'left' as const, width: 60 },
      ...proposalTypes.map((pt) => ({
        title: pt,
        key: pt,
        dataIndex: ['proposals', pt] as [string, string],
        width: 60,
        render: (v: number) => <span style={{ color: v > 0 ? '#3B82F6' : '#9CA3AF', fontWeight: v > 0 ? 600 : 400, fontFamily: mono }}>{v ?? 0}</span>,
      })),
    ]
  }, [crossData])

  if (overviewLoading && crossLoading) return <LoadingSkeleton />

  return (
    <div>
      <MobileSectionTitle title="VS方案情报" subtitle="各方案目标与达成" accentColor="#F59E0B" />
      <MobileCard glowColor="#F59E0B" title="方案概览表" subtitle="各方案目标配置与实际达成">
        {overviewLoading ? <LoadingSkeleton /> : overviewData && overviewData.length > 0 ? (
          <MobileDataTable<ProposalRow> columns={overviewColumns} dataSource={overviewData} rowKey={(r) => `${r.proposal_type}-${r.sub_proposal_type || 'default'}`} />
        ) : (
          <EmptyPlaceholder />
        )}
      </MobileCard>
      <div style={{ height: 12 }} />
      <MobileCard glowColor="#F59E0B" title="多维交叉明细表" subtitle="各方案在各区域的达成矩阵">
        {crossLoading ? <LoadingSkeleton /> : crossData && crossData.length > 0 ? (
          <MobileDataTable<ProposalCrossRow> columns={crossColumns} dataSource={crossData} rowKey="region" />
        ) : (
          <EmptyPlaceholder />
        )}
      </MobileCard>
    </div>
  )
}

export default MobileProposalSection
