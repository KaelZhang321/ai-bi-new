import React from 'react'
import { theme } from '../../styles/theme'

interface MobileSectionTitleProps {
  title: string
  subtitle?: string
  accentColor?: string
}

const MobileSectionTitle: React.FC<MobileSectionTitleProps> = ({
  title,
  subtitle,
  accentColor = theme.colors.accentCyan,
}) => (
  <div className="mobile-section-title">
    <div
      className="mobile-section-title__bar"
      style={{
        background: `linear-gradient(180deg, ${accentColor}, ${accentColor}40)`,
        boxShadow: `0 0 6px ${accentColor}40`,
      }}
    />
    <div>
      <div className="mobile-section-title__text">{title}</div>
      {subtitle && <div className="mobile-section-title__sub">{subtitle}</div>}
    </div>
  </div>
)

export default MobileSectionTitle
