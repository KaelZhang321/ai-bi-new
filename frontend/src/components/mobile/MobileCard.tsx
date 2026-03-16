import React from 'react'

interface MobileCardProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  glowColor?: string
  extra?: React.ReactNode
  style?: React.CSSProperties
}

const MobileCard: React.FC<MobileCardProps> = ({ children, title, subtitle, glowColor: _glowColor, extra, style }) => {
  const matrixBaseColor = '#3B82F6'
  const color = matrixBaseColor
  return (
    <div className="mobile-card" style={{ ...style, ['--mobile-card-accent' as string]: color }}>
      {title && (
        <div className="mobile-card-head">
          <div className="mobile-card-head-main">
            <div className="mobile-card-head-accent" />
            <div style={{ minWidth: 0 }}>
              <div className="mobile-card-title">
                {title}
              </div>
              {subtitle && (
                <div className="mobile-card-subtitle">
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
