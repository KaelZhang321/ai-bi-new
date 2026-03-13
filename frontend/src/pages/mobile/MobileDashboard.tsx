import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useKpiOverview } from '../../hooks/useApi'
import MobileHeader from '../../components/mobile/MobileHeader'
import MobileTabBar from '../../components/mobile/MobileTabBar'
import MobileKpiCard from '../../components/mobile/MobileKpiCard'
import LoadingSkeleton from '../../components/common/LoadingSkeleton'
import MobilePageCustomer from './MobilePageCustomer'
import MobilePageOperations from './MobilePageOperations'
import MobilePageAchievement from './MobilePageAchievement'
import { theme } from '../../styles/theme'
import '../../styles/mobile.css'

const colorMap: Record<string, string> = {
  报名客户: theme.colors.accentCyan,
  已抵达客户: theme.colors.accentGreen,
  已成交金额: theme.colors.accentAmber,
  已消耗预算: theme.colors.accentRed,
  已收款金额: theme.colors.accentPurple,
  总投资回报率: '#38BDF8',
}

const pages = [MobilePageCustomer, MobilePageOperations, MobilePageAchievement]

const pageVariants = {
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, x: -16, transition: { duration: 0.15 } },
}

const MobileDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0)
  const { data: kpiData, isLoading: kpiLoading } = useKpiOverview()
  const ActivePage = pages[activeTab]

  const kpiItems = kpiData
    ? [kpiData.registered_customers, kpiData.arrived_customers, kpiData.deal_amount, kpiData.consumed_budget, kpiData.received_amount, kpiData.roi]
    : []

  return (
    <div className="mobile-container">
      <MobileHeader />
      <div className="mobile-content">
        {/* KPI 网格 2x3 */}
        {kpiLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className="mobile-kpi-grid">
            {kpiItems.map((item) => (
              <MobileKpiCard
                key={item.label}
                label={item.label}
                value={item.value}
                prefix={item.prefix}
                unit={item.unit}
                color={colorMap[item.label]}
              />
            ))}
          </div>
        )}

        {/* 页面内容 */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <ActivePage />
          </motion.div>
        </AnimatePresence>
      </div>
      <MobileTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}

export default MobileDashboard
