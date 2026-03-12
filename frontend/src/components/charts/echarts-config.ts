import { theme } from '../../styles/theme'

export const chartPalette = theme.chartPalette

export const baseOption = {
  backgroundColor: 'transparent',
  textStyle: { fontFamily: theme.fontFamily, color: theme.colors.textSecondary },
  tooltip: {
    backgroundColor: 'rgba(4, 10, 25, 0.95)',
    borderColor: 'rgba(34, 211, 238, 0.25)',
    borderWidth: 1,
    textStyle: { color: '#E2E8F0', fontSize: 12, fontFamily: theme.fontFamily },
    extraCssText: 'backdrop-filter:blur(16px);box-shadow:0 8px 32px rgba(0,0,0,0.6),0 0 15px rgba(34,211,238,0.08);border-radius:6px;',
  },
  legend: {
    textStyle: { color: '#94A3B8', fontSize: 11, fontFamily: theme.fontFamily },
    icon: 'roundRect',
    itemWidth: 10,
    itemHeight: 3,
  },
  grid: { left: 56, right: 20, top: 40, bottom: 36, containLabel: false },
}

export const axisStyle = {
  axisLine: { lineStyle: { color: 'rgba(34,211,238,0.08)' } },
  axisTick: { show: false },
  axisLabel: { color: '#64748B', fontSize: 10, fontFamily: theme.fontFamily },
  splitLine: { lineStyle: { color: 'rgba(34,211,238,0.035)', type: 'dashed' as const } },
}
