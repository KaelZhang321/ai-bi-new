import React from 'react'
import AnimatedNumber from '../common/AnimatedNumber'

interface MobileKpiCardProps {
  label: string
  value: number
  prefix?: string
  unit?: string
  color?: string
  featured?: boolean
  compact?: boolean
}

const MobileKpiCard: React.FC<MobileKpiCardProps> = ({
  label,
  value,
  prefix = '',
  unit = '',
  color = '#3B82F6',
  featured = false,
  compact = false,
}) => (
  <div
    className={`mobile-kpi-card ${featured ? 'mobile-kpi-card--featured' : ''} ${compact ? 'mobile-kpi-card--compact' : ''}`}
    style={{
      border: `1px solid ${featured ? `${color}55` : 'rgba(61, 93, 172, 0.14)'}`,
      background: featured
        ? `linear-gradient(145deg, ${color}, ${color}D0)`
        : '#FFFFFF',
    }}
  >
    <div
      className="mobile-kpi-card__top-bar"
      style={{
        background: featured
          ? 'linear-gradient(90deg, rgba(255,255,255,0.9), rgba(255,255,255,0.35))'
          : `linear-gradient(90deg, ${color}, ${color}80)`,
      }}
    />
    <div className="mobile-kpi-card__bg-num" style={{ color }}>
      {Math.round(value)}
    </div>
    <div className="mobile-kpi-card__label">{label}</div>
    <AnimatedNumber
      value={value}
      prefix={prefix}
      unit={unit}
      style={{
        fontSize: compact ? 20 : 24,
        fontWeight: 800,
        fontFamily: "'MiSans-Heavy', 'Orbitron', 'JetBrains Mono', monospace",
        color: featured ? '#FFFFFF' : color,
        letterSpacing: -0.5,
        lineHeight: 1.1,
      }}
      unitStyle={{
        fontSize: compact ? 11 : 12,
        fontWeight: 600,
        color: featured ? '#EAF3FF' : color,
        opacity: featured ? 0.88 : 0.65,
        marginLeft: 3,
        fontFamily: "'Noto Sans SC', 'PingFang SC', sans-serif",
      }}
    />
  </div>
)

export default MobileKpiCard
