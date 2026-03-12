import React from 'react'
import { theme } from '../../styles/theme'

interface HeaderBarProps {
  activeTab: number
  onTabChange: (tab: number) => void
}

const tabs = [
  { id: 0, label: '一 · 客户总览' },
  { id: 1, label: '二 · 运营数据' },
  { id: 2, label: '三 · 目标达成' },
]

const HeaderBar: React.FC<HeaderBarProps> = ({ activeTab, onTabChange }) => (
  <div style={{ position: 'relative', padding: '16px 0 12px', marginBottom: 8 }}>
    {/* 背景 */}
    <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 50% 100% at 50% 0%, rgba(34,100,238,0.08) 0%, transparent 60%)`, pointerEvents: 'none' }} />

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
      {/* 左侧: 标题 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* 装饰图标 */}
        <div style={{ position: 'relative', width: 36, height: 36 }}>
          <div style={{ position: 'absolute', inset: 0, border: `2px solid ${theme.colors.accentCyan}40`, borderRadius: 6, transform: 'rotate(45deg)' }} />
          <div style={{ position: 'absolute', inset: 4, border: `1px solid ${theme.colors.accentCyan}60`, borderRadius: 4, transform: 'rotate(45deg)', background: `${theme.colors.accentCyan}08` }} />
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={theme.colors.accentCyan} strokeWidth="2" style={{ position: 'absolute', top: 9, left: 9 }}>
            <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>
          </svg>
        </div>
        <div>
          <h1
            className="glow-text"
            style={{
              fontSize: 26,
              fontWeight: 800,
              fontFamily: theme.fontDisplay,
              color: theme.colors.accentCyan,
              margin: 0,
              letterSpacing: 4,
              lineHeight: 1.2,
            }}
          >
            大会数据分析看板
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={theme.colors.textSecondary} strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span style={{ fontSize: 11, color: theme.colors.textSecondary }}>2024-12-14 ~ 2024-12-20</span>
            <div style={{ width: 1, height: 10, background: 'rgba(34,211,238,0.15)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: theme.colors.accentGreen, animation: 'pulse-glow 2s ease-in-out infinite' }} />
              <span style={{ fontSize: 10, color: theme.colors.accentGreen, fontWeight: 600, fontFamily: theme.fontDisplay }}>LIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* 右侧: 导航菜单 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>

    {/* 底部装饰线 */}
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent 5%, rgba(34,211,238,0.2) 30%, rgba(34,211,238,0.35) 50%, rgba(34,211,238,0.2) 70%, transparent 95%)` }} />
  </div>
)

export default HeaderBar
