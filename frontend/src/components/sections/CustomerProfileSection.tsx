import React from 'react'
import { useCustomerProfile } from '../../hooks/useApi'
import DashboardCard from '../common/DashboardCard'
import SectionTitle from '../common/SectionTitle'
import LoadingSkeleton from '../common/LoadingSkeleton'
import PieChart from '../charts/PieChart'
import DistributionBarChart from '../charts/DistributionBarChart'
import { theme } from '../../styles/theme'

const CustomerProfileSection: React.FC = () => {
  const { data, isLoading } = useCustomerProfile()
  if (isLoading || !data) return <LoadingSkeleton />
  return (
    <div>
      <SectionTitle title="客户画像分析" subtitle="客户金额等级、身份类型、新老客户三维画像" accentColor={theme.colors.accentPurple} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
        <DashboardCard glowColor={theme.colors.accentCyan} title="金额等级分布">
          <DistributionBarChart data={data.level_distribution} height={280} />
        </DashboardCard>
        <DashboardCard glowColor={theme.colors.accentPurple} title="身份类型分布">
          <PieChart data={data.role_distribution} height={280} />
        </DashboardCard>
        <DashboardCard glowColor={theme.colors.accentGreen} title="新老客户对比">
          <PieChart data={data.new_old_distribution} height={280} />
        </DashboardCard>
      </div>
    </div>
  )
}

export default CustomerProfileSection
