import React from 'react'
import { theme } from '../../styles/theme'

interface DashboardCardProps {
  children: React.ReactNode
  style?: React.CSSProperties
  glowColor?: string
  noPadding?: boolean
  title?: string
  subtitle?: string
  extra?: React.ReactNode
  fill?: boolean
}

const DashboardCard: React.FC<DashboardCardProps> = ({ children, style, glowColor, noPadding, title, subtitle, extra, fill }) => {
  const color = glowColor || theme.colors.accentCyan
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
        border: `1px solid ${color}30`,
        padding: noPadding ? 0 : '20px 22px',
        boxShadow: `${theme.shadows.card}, 0 0 20px ${color}08`,
        position: 'relative',
        overflow: 'hidden',
        ...(fill ? { display: 'flex', flexDirection: 'column' as const } : {}),
        ...style,
      }}
    >
      {/* HUD 角标 */}
      <div className="hud-corner hud-corner--tl" data-color={colorAttr} />
      <div className="hud-corner hud-corner--tr" data-color={colorAttr} />
      <div className="hud-corner hud-corner--bl" data-color={colorAttr} />
      <div className="hud-corner hud-corner--br" data-color={colorAttr} />
      {/* 顶部光线 */}
      <div style={{ position: 'absolute', top: 0, left: 16, right: 16, height: 1, background: `linear-gradient(90deg, transparent, ${color}35, transparent)` }} />
      {/* 标题区域 */}
      {title && (
        <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 3, height: 14, borderRadius: 1, background: color, boxShadow: `0 0 6px ${color}` }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.colors.textPrimary }}>{title}</div>
              {subtitle && <div style={{ fontSize: 10, color: theme.colors.textSecondary, marginTop: 2 }}>{subtitle}</div>}
            </div>
          </div>
          {extra}
        </div>
      )}
      {fill ? <div style={{ flex: 1, minHeight: 0 }}>{children}</div> : children}
    </div>
  )
}

export default DashboardCard
