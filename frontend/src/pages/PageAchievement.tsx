import React from 'react'
import { motion } from 'framer-motion'
import AchievementSection from '../components/sections/AchievementSection'
import ProgressSection from '../components/sections/ProgressSection'
import ProposalSection from '../components/sections/ProposalSection'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
}

const PageAchievement: React.FC = () => (
  <div>
    <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp} style={{ marginBottom: 24 }}>
      <AchievementSection />
    </motion.div>
    <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp} style={{ marginBottom: 20 }}>
      <ProgressSection />
    </motion.div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'stretch' }}>
      <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp} style={{ height: '100%' }}>
        <ProposalSection showOverview showCross={false} showSectionTitle />
      </motion.div>
      <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp} style={{ height: '100%' }}>
        <ProposalSection showOverview={false} showCross showSectionTitle={false} reserveSectionTitleSpace />
      </motion.div>
    </div>
  </div>
)

export default PageAchievement
