import React from 'react'
import ReactECharts from 'echarts-for-react'
import { baseOption, axisStyle, chartPalette } from './echarts-config'

interface HorizontalBarChartProps {
  categories: string[]
  series: { name: string; data: number[] }[]
  height?: number
}

const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({ categories, series, height = 350 }) => {
  const option = {
    ...baseOption,
    color: chartPalette,
    tooltip: { ...baseOption.tooltip, trigger: 'axis' as const },
    legend: { ...baseOption.legend, top: 0 },
    grid: { ...baseOption.grid, left: 100, right: 24 },
    xAxis: { type: 'value' as const, ...axisStyle },
    yAxis: {
      type: 'category' as const,
      data: categories,
      ...axisStyle,
      inverse: true,
      axisLabel: { ...axisStyle.axisLabel, width: 85, overflow: 'truncate' as const },
    },
    series: series.map((s, i) => ({
      ...s,
      type: 'bar' as const,
      barWidth: i === 0 ? '40%' : '40%',
      barGap: '-100%',
      z: i === 0 ? 2 : 1,
      itemStyle: {
        borderRadius: [0, 4, 4, 0],
        color: i === 0
          ? {
              type: 'linear' as const,
              x: 0, y: 0, x2: 1, y2: 0,
              colorStops: [
                { offset: 0, color: chartPalette[0] },
                { offset: 1, color: `${chartPalette[0]}60` },
              ],
            }
          : 'rgba(34,211,238,0.06)',
        shadowBlur: i === 0 ? 8 : 0,
        shadowColor: i === 0 ? 'rgba(34,211,238,0.15)' : 'transparent',
      },
    })),
  }

  return <ReactECharts option={option} style={{ height }} />
}

export default HorizontalBarChart
