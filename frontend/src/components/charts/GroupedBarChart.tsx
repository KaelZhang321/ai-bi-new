import React from 'react'
import ReactECharts from 'echarts-for-react'
import { baseOption, axisStyle, chartPalette } from './echarts-config'

interface GroupedBarChartProps {
  categories: string[]
  series: { name: string; data: number[] }[]
  height?: number | string
  showLegend?: boolean
  xAxisLabelFormatter?: (value: string) => string
  onBarClick?: (params: { name?: string }) => void
}

const GroupedBarChart: React.FC<GroupedBarChartProps> = ({
  categories,
  series,
  height = 320,
  showLegend = true,
  xAxisLabelFormatter,
  onBarClick,
}) => {
  const option = {
    ...baseOption,
    color: chartPalette,
    tooltip: { ...baseOption.tooltip, trigger: 'axis' as const },
    legend: { ...baseOption.legend, show: showLegend, top: 0, itemGap: 14 },
    xAxis: {
      type: 'category' as const,
      data: categories,
      ...axisStyle,
      axisLabel: {
        ...axisStyle.axisLabel,
        rotate: xAxisLabelFormatter ? 0 : categories.length > 8 ? 30 : 0,
        interval: 0,
        formatter: xAxisLabelFormatter,
      },
    },
    yAxis: { type: 'value' as const, ...axisStyle },
    series: series.map((s, i) => ({
      ...s,
      type: 'bar' as const,
      barWidth: '22%',
      barGap: '30%',
      itemStyle: {
        borderRadius: [4, 4, 0, 0],
        color: {
          type: 'linear' as const,
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: chartPalette[i % chartPalette.length] },
            { offset: 1, color: `${chartPalette[i % chartPalette.length]}60` },
          ],
        },
        shadowBlur: 8,
        shadowColor: `${chartPalette[i % chartPalette.length]}20`,
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
  return (
    <ReactECharts
      option={option}
      notMerge
      style={{ height }}
      onEvents={onBarClick ? { click: onBarClick } : undefined}
      {...(isFluid ? { opts: { height: 'auto' } } : {})}
    />
  )
}

export default GroupedBarChart
