import React from 'react'
import dayjs from 'dayjs'

const MobileHeader: React.FC = () => {
  const todayStr = dayjs().format('YYYY-MM-DD')
  return (
  <div className="mobile-header">
    <span className="mobile-header-title">大会数据分析看板</span>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{
        fontSize: 10,
        color: '#9CA3AF',
        fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: 0.3,
      }}>
        {todayStr}
      </span>
      <div style={{ width: 1, height: 10, background: 'rgba(16,185,129,0.15)' }} />
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
  </div>
  )
}

export default MobileHeader
