import React from 'react'

const MobileHeader: React.FC = () => (
  <div className="mobile-header">
    <span className="mobile-header-title">大会数据看板</span>
    <div className="mobile-header-live">
      <div style={{
        width: 7,
        height: 7,
        borderRadius: '50%',
        background: '#10B981',
        boxShadow: '0 0 6px rgba(16, 185, 129, 0.5)',
        animation: 'pulse-glow 2s ease-in-out infinite',
      }} />
      <span style={{
        fontSize: 10,
        color: '#10B981',
        fontWeight: 700,
        fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: 0.5,
      }}>
        LIVE
      </span>
    </div>
  </div>
)

export default MobileHeader
