import React from 'react'
import { useCustomerProfile } from '../../../hooks/useApi'
import MobileSectionTitle from '../MobileSectionTitle'
import MobileCard from '../MobileCard'
import LoadingSkeleton from '../../common/LoadingSkeleton'
import PieChart from '../../charts/PieChart'

const MobileCustomerProfileSection: React.FC = () => {
  const { data, isLoading } = useCustomerProfile()
  if (isLoading || !data) return <LoadingSkeleton />

  return (
    <div>
      <MobileSectionTitle title="客户画像分析" subtitle="金额等级·身份类型·新老客户" accentColor="#8B5CF6" />
      <MobileCard glowColor="#3B82F6" title="金额等级分布">
        <PieChart data={data.level_distribution} height={220} />
      </MobileCard>
      <div style={{ height: 12 }} />
      <MobileCard glowColor="#8B5CF6" title="身份类型分布">
        <PieChart data={data.role_distribution} height={220} />
      </MobileCard>
      <div style={{ height: 12 }} />
      <MobileCard glowColor="#10B981" title="新老客户对比">
        <PieChart data={data.new_old_distribution} height={220} />
      </MobileCard>
    </div>
  )
}

export default MobileCustomerProfileSection
