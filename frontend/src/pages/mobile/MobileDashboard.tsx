import React, { useState } from 'react'
import { ConfigProvider } from 'antd'
import { motion, AnimatePresence } from 'framer-motion'
import { useKpiOverview } from '../../hooks/useApi'
import MobileHeader from '../../components/mobile/MobileHeader'
import MobileTabBar from '../../components/mobile/MobileTabBar'
import MobileKpiCard from '../../components/mobile/MobileKpiCard'
import LoadingSkeleton from '../../components/common/LoadingSkeleton'
import MobilePageCustomer from './MobilePageCustomer'
import MobilePageOperations from './MobilePageOperations'
import MobilePageAchievement from './MobilePageAchievement'
import AiChatPanel from '../../components/sections/AiChatPanel'
import aiIcon from '../../styles/AI.png'
import '../../styles/mobile.css'

const mobileKpiColors: Record<string, string> = {
  报名客户: '#3B82F6',
  已抵达客户: '#10B981',
  已成交金额: '#F59E0B',
  新规划消耗: '#EF4444',
  已收款金额: '#8B5CF6',
  总投资回报率: '#06B6D4',
}

const pages = [MobilePageCustomer, MobilePageOperations, MobilePageAchievement]

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
}

const mobileLightTheme = {
  token: {
    colorPrimary: '#3B82F6',
    colorBgContainer: '#FFFFFF',
    colorBgElevated: '#FFFFFF',
    colorBgLayout: '#F2F4F8',
    colorText: '#1A1D2E',
    colorTextSecondary: '#6B7280',
    colorBorder: '#E5E7EB',
    colorBorderSecondary: '#F3F4F6',
    borderRadius: 10,
    fontFamily: "'Noto Sans SC', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: 13,
  },
  components: {
    Table: {
      headerBg: '#F8F9FB',
      headerColor: '#6B7280',
      rowHoverBg: '#F8FAFC',
      borderColor: '#F3F4F6',
      colorBgContainer: '#FFFFFF',
      cellFontSize: 13,
      headerFontSize: 11,
    },
    Skeleton: {
      color: '#F3F4F6',
      colorGradientEnd: '#E5E7EB',
    },
    Select: {
      optionSelectedBg: '#EFF6FF',
      optionSelectedColor: '#3B82F6',
      optionActiveBg: '#F8FAFC',
      selectorBg: '#F8F9FB',
      colorBorder: '#E5E7EB',
    },
    DatePicker: {
      colorBgContainer: '#F8F9FB',
      colorBorder: '#E5E7EB',
    },
    Drawer: {
      colorBgElevated: '#FFFFFF',
    },
  },
}

const MobileDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [aiOpen, setAiOpen] = useState(false)
  const { data: kpiData, isLoading: kpiLoading } = useKpiOverview()
  const ActivePage = pages[activeTab]

  const kpiItems = kpiData
    ? [kpiData.registered_customers, kpiData.arrived_customers, kpiData.deal_amount, kpiData.consumed_budget, kpiData.received_amount, kpiData.roi]
    : []

  return (
    <ConfigProvider theme={mobileLightTheme}>
      <div className="mobile-container">
        <MobileHeader />
        <div className="mobile-content">
          {/* KPI 网格 2x3 */}
          {kpiLoading ? (
            <div style={{ padding: '8px 0 20px' }}>
              <div style={{ background: '#fff', borderRadius: 14, padding: 24 }}>
                <div style={{ height: 60, background: '#F3F4F6', borderRadius: 8, animation: 'skeleton-pulse 1.8s ease-in-out infinite' }} />
              </div>
            </div>
          ) : (
            <div className="mobile-kpi-grid">
              {kpiItems.map((item) => (
                <MobileKpiCard
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  prefix={item.prefix}
                  unit={item.unit}
                  color={mobileKpiColors[item.label]}
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

        {/* AI 浮动按钮 */}
        <button className="mobile-ai-fab" onClick={() => setAiOpen(true)}>
          <img src={aiIcon} alt="AI" style={{ width: 52, height: 52 }} />
        </button>

        {/* AI 聊天面板 */}
        <AiChatPanel open={aiOpen} onClose={() => setAiOpen(false)} light />
      </div>
    </ConfigProvider>
  )
}

export default MobileDashboard
