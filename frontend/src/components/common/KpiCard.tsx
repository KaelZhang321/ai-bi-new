import React from 'react'
import { theme } from '../../styles/theme'
import AnimatedNumber from './AnimatedNumber'

interface KpiCardProps {
  label: string
  value: number
  prefix?: string
  unit?: string
  color?: string
  icon?: React.ReactNode
}

const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  prefix = '',
  unit = '',
  color = theme.colors.accentCyan,
}) => {
  const colorAttr = color === theme.colors.accentRed ? 'red'
    : color === theme.colors.accentAmber ? 'amber'
    : color === theme.colors.accentGreen ? 'green'
    : color === theme.colors.accentPurple ? 'purple'
    : undefined

  return (
    <div
      className="dashboard-card"
      style={{
        background: theme.colors.bgCard,
        borderRadius: theme.cardRadius,
        border: `1px solid ${color}25`,
        padding: '20px 18px',
        flex: 1,
        minWidth: 0,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* HUD角标 */}
      <div className="hud-corner hud-corner--tl" data-color={colorAttr} />
      <div className="hud-corner hud-corner--tr" data-color={colorAttr} />
      <div className="hud-corner hud-corner--bl" data-color={colorAttr} />
      <div className="hud-corner hud-corner--br" data-color={colorAttr} />
      {/* 顶部色条 */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${color}, ${color}30)`, boxShadow: `0 0 10px ${color}30` }} />
      {/* 背景装饰 */}
      <div style={{ position: 'absolute', bottom: -20, right: -10, fontSize: 72, fontWeight: 900, fontFamily: theme.fontDisplay, color: `${color}06`, lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>
        {Math.round(value)}
      </div>
      <div style={{ fontSize: 11, color: theme.colors.textSecondary, marginBottom: 16, fontWeight: 500, letterSpacing: 0.5 }}>
        {label}
      </div>
      <AnimatedNumber
        value={value}
        prefix={prefix}
        unit={unit}
        style={{
          fontSize: 36,
          fontWeight: 700,
          fontFamily: theme.fontDisplay,
          background: `linear-gradient(180deg, ${color}, ${color}90)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: -0.5,
          filter: `drop-shadow(0 0 12px ${color}40)`,
        }}
        unitStyle={{
          fontSize: 14,
          fontWeight: 600,
          color,
          opacity: 0.65,
          marginLeft: 3,
        }}
      />
    </div>
  )
}

export default KpiCard
