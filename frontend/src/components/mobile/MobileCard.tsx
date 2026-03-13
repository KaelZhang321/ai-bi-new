import React from 'react'

interface MobileCardProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  glowColor?: string
  extra?: React.ReactNode
  style?: React.CSSProperties
}

const MobileCard: React.FC<MobileCardProps> = ({ children, title, subtitle, glowColor, extra, style }) => {
  const color = glowColor || '#3B82F6'
  return (
    <div className="mobile-card" style={style}>
      {title && (
        <div style={{
          marginBottom: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
            <div style={{
              width: 3,
              height: 16,
              borderRadius: 2,
              background: color,
              flexShrink: 0,
            }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1D2E', letterSpacing: 0.2 }}>
                {title}
              </div>
              {subtitle && (
                <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2, letterSpacing: 0.1 }}>
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
