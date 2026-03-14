import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import HeaderBar from '../components/sections/HeaderBar'
import CoreKpiRow from '../components/sections/CoreKpiRow'
import AiChatPanel from '../components/sections/AiChatPanel'
import PageCustomer from './PageCustomer'
import PageOperations from './PageOperations'
import PageAchievement from './PageAchievement'
import { theme } from '../styles/theme'
import aiIcon from '../styles/AI.png'

const pages = [PageCustomer, PageOperations, PageAchievement]

const pageTransition = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, x: -24, transition: { duration: 0.2 } },
}

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [aiOpen, setAiOpen] = useState(false)
  const ActivePage = pages[activeTab]

  return (
    <div style={{ maxWidth: 1600, margin: '0 auto', padding: '0 40px 48px', position: 'relative', zIndex: 1 }}>
      {/* 头部 + 导航 */}
      <HeaderBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* KPI 指标行 */}
      <div style={{ marginBottom: 24 }}>
        <CoreKpiRow />
      </div>

      {/* 页面内容 */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial="initial" animate="animate" exit="exit" variants={pageTransition}>
          <ActivePage />
        </motion.div>
      </AnimatePresence>

      {/* 底部 */}
      <div style={{ textAlign: 'center', padding: '40px 0 8px', opacity: 0.2 }}>
        <div style={{
          fontSize: 10,
          color: theme.colors.textTertiary,
          letterSpacing: 3,
          fontFamily: theme.fontMono,
          fontWeight: 500,
        }}>
          MEETING BI DASHBOARD v1.0
        </div>
      </div>

      {/* AI 浮动按钮 */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setAiOpen(true)}
        style={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          width: 64,
          height: 64,
          borderRadius: '50%',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          zIndex: 900,
        }}
      >
        <img src={aiIcon} alt="AI" style={{ width: 64, height: 64, borderRadius: '50%' }} />
      </motion.button>

      {/* AI 聊天面板 */}
      <AiChatPanel open={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  )
}

export default Dashboard
