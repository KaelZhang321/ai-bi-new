import React from 'react'
import { theme } from '../../styles/theme'

interface MobileCardProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  glowColor?: string
  extra?: React.ReactNode
  style?: React.CSSProperties
}

const MobileCard: React.FC<MobileCardProps> = ({ children, title, subtitle, glowColor, extra, style }) => {
  const color = glowColor || theme.colors.accentCyan
  return (
    <div
      className="mobile-card"
      style={{ borderColor: `${color}18`, ...style }}
    >
      {/* 顶部光线 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 14,
        right: 14,
        height: 1,
        background: `linear-gradient(90deg, transparent, ${color}25, transparent)`,
      }} />
      {title && (
        <div style={{
          marginBottom: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
            <div style={{
              width: 3,
              height: 14,
              borderRadius: 2,
              background: `linear-gradient(180deg, ${color}, ${color}50)`,
              flexShrink: 0,
            }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.colors.textPrimary, letterSpacing: 0.2 }}>
                {title}
              </div>
              {subtitle && (
                <div style={{ fontSize: 10, color: theme.colors.textSecondary, marginTop: 2, letterSpacing: 0.1 }}>
                  {subtitle}
                </div>
              )}
            </div>
          </div>
          {extra}
        </div>
      )}
      {children}
    </div>
  )
}

export default MobileCard
