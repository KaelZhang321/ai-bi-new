import React from 'react'
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
  color = '#3B82F6',
}) => (
  <div className="mobile-kpi-card" style={{ border: `1px solid rgba(0,0,0,0.04)` }}>
    <div className="mobile-kpi-card__top-bar" style={{
      background: `linear-gradient(90deg, ${color}, ${color}80)`,
    }} />
    <div className="mobile-kpi-card__bg-num" style={{ color }}>
      {Math.round(value)}
    </div>
    <div className="mobile-kpi-card__label">{label}</div>
    <AnimatedNumber
      value={value}
      prefix={prefix}
      unit={unit}
      style={{
        fontSize: 24,
        fontWeight: 800,
        fontFamily: "'MiSans-Heavy', 'Orbitron', 'JetBrains Mono', monospace",
        color,
        letterSpacing: -0.5,
        lineHeight: 1.1,
      }}
      unitStyle={{
        fontSize: 12,
        fontWeight: 600,
        color,
        opacity: 0.65,
        marginLeft: 3,
        fontFamily: "'Noto Sans SC', 'Inter', sans-serif",
      }}
    />
  </div>
)

export default MobileKpiCard
