import React from 'react'
import { theme } from '../../styles/theme'
import AnimatedNumber from '../common/AnimatedNumber'

interface MobileKpiCardProps {
  label: string
  value: number
  prefix?: string
  unit?: string
  color?: string
}

const MobileKpiCard: React.FC<MobileKpiCardProps> = ({
  label,
  value,
  prefix = '',
  unit = '',
  color = theme.colors.accentCyan,
}) => (
  <div className="mobile-kpi-card" style={{ border: `1px solid ${color}20` }}>
    <div className="mobile-kpi-card__top-bar" style={{
      background: `linear-gradient(90deg, ${color}cc, ${color}40, transparent)`,
      boxShadow: `0 0 6px ${color}20`,
    }} />
    <div className="mobile-kpi-card__bg-num" style={{ color: `${color}05` }}>
      {Math.round(value)}
    </div>
    <div className="mobile-kpi-card__label">{label}</div>
    <AnimatedNumber
      value={value}
      prefix={prefix}
      unit={unit}
      style={{
        fontSize: 22,
        fontWeight: 700,
        fontFamily: theme.fontDisplay,
        background: `linear-gradient(175deg, ${color}, ${color}80)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        letterSpacing: -0.5,
        filter: `drop-shadow(0 0 8px ${color}30)`,
        lineHeight: 1.1,
      }}
      unitStyle={{
        fontSize: 11,
        fontWeight: 600,
        color,
        opacity: 0.6,
        marginLeft: 3,
        fontFamily: theme.fontFamily,
      }}
    />
  </div>
)

export default MobileKpiCard
