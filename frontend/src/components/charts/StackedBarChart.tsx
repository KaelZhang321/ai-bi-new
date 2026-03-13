import React from 'react'
import ReactECharts from 'echarts-for-react'
import { baseOption, axisStyle, chartPalette } from './echarts-config'

interface StackedBarChartProps {
  categories: string[]
  series: { name: string; data: number[] }[]
  height?: number | string
  onBarClick?: (params: { name?: string; seriesName?: string }) => void
}

const StackedBarChart: React.FC<StackedBarChartProps> = ({ categories, series, height = 320, onBarClick }) => {
  const manyLegends = series.length > 6
  const option = {
    ...baseOption,
    color: chartPalette,
    tooltip: { ...baseOption.tooltip, trigger: 'axis' as const },
    legend: {
      ...baseOption.legend,
      top: 0,
      itemGap: manyLegends ? 8 : 14,
      ...(manyLegends ? { type: 'scroll' as const, pageIconColor: '#94A3B8', pageTextStyle: { color: '#94A3B8' } } : {}),
    },
    grid: { ...baseOption.grid, top: manyLegends ? 36 : 40 },
    xAxis: {
      type: 'category' as const,
      data: categories,
      ...axisStyle,
      axisLabel: { ...axisStyle.axisLabel, rotate: categories.length > 8 ? 30 : 0, interval: 0 },
    },
    yAxis: { type: 'value' as const, ...axisStyle },
    series: series.map((s, i) => ({
      ...s,
      type: 'bar' as const,
      stack: 'total',
      barWidth: '50%',
      itemStyle: {
        borderRadius: i === series.length - 1 ? [4, 4, 0, 0] : 0,
        shadowBlur: 6,
        shadowColor: 'rgba(0,0,0,0.3)',
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 16,
          shadowColor: `${chartPalette[i % chartPalette.length]}40`,
        },
      },
    })),
  }

  const isFluid = height === '100%'
  const onEvents = onBarClick ? { click: (p: { name?: string; seriesName?: string }) => onBarClick(p) } : undefined
  return <ReactECharts option={option} style={{ height, cursor: onBarClick ? 'pointer' : undefined }} onEvents={onEvents} {...(isFluid ? { opts: { height: 'auto' } } : {})} />
}

export default StackedBarChart
