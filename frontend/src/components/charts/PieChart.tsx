import React from 'react'
import ReactECharts from 'echarts-for-react'
import { baseOption, chartPalette } from './echarts-config'
import { theme } from '../../styles/theme'

interface PieChartProps {
  data: { name: string; value: number }[]
  title?: string
  height?: number
}

const PieChart: React.FC<PieChartProps> = ({ data, title, height = 260 }) => {
  const option = {
    ...baseOption,
    color: chartPalette,
    title: title
      ? { text: title, left: 'center', top: 0, textStyle: { color: theme.colors.textPrimary, fontSize: 13, fontWeight: 600, fontFamily: theme.fontFamily } }
      : undefined,
    tooltip: {
      ...baseOption.tooltip,
      trigger: 'item' as const,
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      ...baseOption.legend,
      orient: 'vertical' as const,
      right: 4,
      top: 'middle',
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 10,
      icon: 'circle',
    },
    series: [
      {
        type: 'pie' as const,
        radius: ['40%', '65%'],
        center: ['38%', '55%'],
        avoidLabelOverlap: true,
        data,
        label: {
          show: true,
          formatter: '{d}%',
          color: '#94A3B8',
          fontSize: 10,
          fontFamily: theme.fontFamily,
        },
        labelLine: {
          lineStyle: { color: 'rgba(148,163,184,0.25)' },
          length: 6,
          length2: 10,
        },
        itemStyle: {
          borderColor: 'rgba(5,10,24,0.9)',
          borderWidth: 2,
          shadowBlur: 16,
          shadowColor: 'rgba(0,0,0,0.4)',
        },
        emphasis: {
          scale: true,
          scaleSize: 5,
          itemStyle: {
            shadowBlur: 24,
            shadowColor: 'rgba(34,211,238,0.4)',
          },
        },
      },
    ],
  }

  return <ReactECharts option={option} style={{ height }} />
}

export default PieChart
