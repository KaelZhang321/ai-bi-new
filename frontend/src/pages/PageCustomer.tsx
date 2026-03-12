import React from 'react'
import { motion } from 'framer-motion'
import RegistrationSection from '../components/sections/RegistrationSection'
import CustomerProfileSection from '../components/sections/CustomerProfileSection'
import CustomerSourceSection from '../components/sections/CustomerSourceSection'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  }),
}

const PageCustomer: React.FC = () => (
  <div>
    <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp} style={{ marginBottom: 24 }}>
      <RegistrationSection />
    </motion.div>
    <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp} style={{ marginBottom: 24 }}>
      <CustomerProfileSection />
    </motion.div>
    <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp}>
      <CustomerSourceSection />
    </motion.div>
  </div>
)

export default PageCustomer
