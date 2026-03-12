import React from 'react'
import { motion } from 'framer-motion'
import AchievementSection from '../components/sections/AchievementSection'
import ProgressSection from '../components/sections/ProgressSection'
import ProposalSection from '../components/sections/ProposalSection'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  }),
}

const PageAchievement: React.FC = () => (
  <div>
    <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp} style={{ marginBottom: 24 }}>
      <AchievementSection />
    </motion.div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp}>
        <ProgressSection />
      </motion.div>
      <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp}>
        <ProposalSection />
      </motion.div>
    </div>
  </div>
)

export default PageAchievement
