import React from 'react'
import { motion } from 'framer-motion'
import OperationsSection from '../components/sections/OperationsSection'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

const PageOperations: React.FC = () => (
  <motion.div initial="hidden" animate="visible" variants={fadeUp}>
    <OperationsSection />
  </motion.div>
)

export default PageOperations
