import React from 'react'
import { theme } from '../../styles/theme'

interface SectionTitleProps {
  title: string
  subtitle?: string
  accentColor?: string
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  accentColor = theme.colors.accentCyan,
}) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 16, position: 'relative' }}>
    {/* 竖条 + 菱形 */}
    <div style={{ display: 'flex', alignItems: 'center', marginRight: 12 }}>
      <div style={{ width: 3, height: 18, background: accentColor, borderRadius: 1, boxShadow: `0 0 8px ${accentColor}60` }} />
      <div style={{ width: 5, height: 5, background: accentColor, transform: 'rotate(45deg)', marginLeft: 5, boxShadow: `0 0 6px ${accentColor}` }} />
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: theme.colors.textPrimary, letterSpacing: 0.5 }}>
          {title}
        </span>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${accentColor}25, transparent)` }} />
      </div>
      {subtitle && (
        <div style={{ fontSize: 10, color: theme.colors.textSecondary, marginTop: 3 }}>{subtitle}</div>
      )}
    </div>
  </div>
)

export default SectionTitle
