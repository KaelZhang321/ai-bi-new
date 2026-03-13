import React from 'react'
import { theme } from '../../styles/theme'

const MobileHeader: React.FC = () => (
  <div className="mobile-header">
    <span className="mobile-header-title">大会数据看板</span>
    <div className="mobile-header-live">
      <div style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: theme.colors.accentGreen,
        animation: 'pulse-glow 2s ease-in-out infinite',
      }} />
      <span style={{
        fontSize: 9,
        color: theme.colors.accentGreen,
        fontWeight: 700,
        fontFamily: theme.fontMono,
        letterSpacing: 1,
      }}>
        LIVE
      </span>
    </div>
  </div>
)

export default MobileHeader
