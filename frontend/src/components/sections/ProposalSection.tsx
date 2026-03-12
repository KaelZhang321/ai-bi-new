import React from 'react'
import { useProposalOverview } from '../../hooks/useApi'
import DashboardCard from '../common/DashboardCard'
import SectionTitle from '../common/SectionTitle'
import LoadingSkeleton from '../common/LoadingSkeleton'
import DataTable from '../common/DataTable'
import { theme } from '../../styles/theme'
import type { ProposalRow } from '../../api/proposal'

const columns = [
  { title: '大区', dataIndex: 'region', key: 'region' },
  { title: '方案类型', dataIndex: 'proposal_type', key: 'type' },
  { title: '目标数量', dataIndex: 'target_count', key: 'target' },
  {
    title: '达成数量',
    dataIndex: 'achieved_count',
    key: 'achieved',
    render: (v: number, record: ProposalRow) => (
      <span style={{ color: v >= record.target_count ? theme.colors.accentGreen : theme.colors.accentRed, fontWeight: 600 }}>{v}</span>
    ),
  },
]

const ProposalSection: React.FC = () => {
  const { data, isLoading } = useProposalOverview()
  if (isLoading) return <LoadingSkeleton />

  return (
    <div>
      <SectionTitle title="VS方案情报" subtitle="各成交方案目标与达成" accentColor={theme.colors.accentAmber} />
      <DashboardCard glowColor={theme.colors.accentAmber}>
        {data && data.length > 0 ? (
          <DataTable<ProposalRow> columns={columns} dataSource={data} rowKey={(r) => `${r.region}-${r.proposal_type}`} />
        ) : (
          <div style={{ textAlign: 'center', padding: 48 }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={theme.colors.textSecondary} strokeWidth="1.5" style={{ opacity: 0.3, marginBottom: 12 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            <div style={{ color: theme.colors.textSecondary, fontSize: 12 }}>方案目标数据待录入</div>
          </div>
        )}
      </DashboardCard>
    </div>
  )
}

export default ProposalSection
