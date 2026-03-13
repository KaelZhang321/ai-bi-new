import { theme } from '../../styles/theme'

export const chartPalette = theme.chartPalette

export const baseOption = {
  backgroundColor: 'transparent',
  textStyle: { fontFamily: theme.fontFamily, color: theme.colors.textSecondary },
  tooltip: {
    backgroundColor: 'rgba(4, 10, 28, 0.96)',
    borderColor: 'rgba(34, 211, 238, 0.2)',
    borderWidth: 1,
    textStyle: { color: '#E8ECF4', fontSize: 12, fontFamily: theme.fontFamily },
    extraCssText: 'backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);box-shadow:0 8px 32px rgba(0,0,0,0.5),0 0 12px rgba(34,211,238,0.06);border-radius:8px;padding:10px 14px;',
  },
  legend: {
    textStyle: { color: '#8896B3', fontSize: 11, fontFamily: theme.fontFamily },
    icon: 'roundRect',
    itemWidth: 12,
    itemHeight: 3,
    itemGap: 16,
  },
  grid: { left: 56, right: 24, top: 40, bottom: 36, containLabel: false },
}

export const axisStyle = {
  axisLine: { lineStyle: { color: 'rgba(34,211,238,0.06)' } },
  axisTick: { show: false },
  axisLabel: { color: '#6B7A99', fontSize: 11, fontFamily: theme.fontFamily },
  splitLine: { lineStyle: { color: 'rgba(34,211,238,0.03)', type: 'dashed' as const } },
}
