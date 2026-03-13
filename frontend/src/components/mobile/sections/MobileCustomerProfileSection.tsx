import React from 'react'
import { useCustomerProfile } from '../../../hooks/useApi'
import MobileSectionTitle from '../MobileSectionTitle'
import MobileCard from '../MobileCard'
import LoadingSkeleton from '../../common/LoadingSkeleton'
import PieChart from '../../charts/PieChart'
import { theme } from '../../../styles/theme'

const MobileCustomerProfileSection: React.FC = () => {
  const { data, isLoading } = useCustomerProfile()
  if (isLoading || !data) return <LoadingSkeleton />

  return (
    <div>
      <MobileSectionTitle title="客户画像分析" subtitle="金额等级·身份类型·新老客户" accentColor={theme.colors.accentPurple} />
      <MobileCard glowColor={theme.colors.accentCyan} title="金额等级分布">
        <PieChart data={data.level_distribution} height={220} />
      </MobileCard>
      <div style={{ height: 12 }} />
      <MobileCard glowColor={theme.colors.accentPurple} title="身份类型分布">
        <PieChart data={data.role_distribution} height={220} />
      </MobileCard>
      <div style={{ height: 12 }} />
      <MobileCard glowColor={theme.colors.accentGreen} title="新老客户对比">
        <PieChart data={data.new_old_distribution} height={220} />
      </MobileCard>
    </div>
  )
}

export default MobileCustomerProfileSection
