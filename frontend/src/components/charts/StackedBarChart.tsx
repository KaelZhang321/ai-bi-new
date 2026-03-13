import React from 'react'
import ReactECharts from 'echarts-for-react'
import { baseOption, axisStyle, chartPalette } from './echarts-config'

interface StackedBarChartProps {
  categories: string[]
  series: { name: string; data: number[]; stack?: string }[]
  height?: number | string
}

const StackedBarChart: React.FC<StackedBarChartProps> = ({ categories, series, height = 320 }) => {
  const option = {
    ...baseOption,
    color: chartPalette,
    tooltip: { ...baseOption.tooltip, trigger: 'axis' as const },
    legend: { ...baseOption.legend, top: 0, itemGap: 14 },
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
      stack: s.stack ?? 'total',
      barWidth: 16,
      barGap: '30%',
      barCategoryGap: '45%',
      itemStyle: {
        borderRadius: [4, 4, 0, 0],
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
  return <ReactECharts option={option} notMerge style={{ height }} {...(isFluid ? { opts: { height: 'auto' } } : {})} />
}

export default StackedBarChart
