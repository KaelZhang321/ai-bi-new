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
      itemGap: 12,
      icon: 'circle',
      textStyle: { color: '#8896B3', fontSize: 11, fontFamily: theme.fontFamily },
    },
    series: [
      {
        type: 'pie' as const,
        radius: ['42%', '66%'],
        center: ['38%', '52%'],
        avoidLabelOverlap: true,
        data,
        label: {
          show: true,
          formatter: '{d}%',
          color: '#8896B3',
          fontSize: 10,
          fontFamily: theme.fontMono,
        },
        labelLine: {
          lineStyle: { color: 'rgba(136,150,179,0.2)' },
          length: 8,
          length2: 12,
        },
        itemStyle: {
          borderColor: 'rgba(2,10,24,0.9)',
          borderWidth: 2,
          shadowBlur: 12,
          shadowColor: 'rgba(0,0,0,0.3)',
        },
        emphasis: {
          scale: true,
          scaleSize: 4,
          itemStyle: {
            shadowBlur: 20,
            shadowColor: 'rgba(34,211,238,0.3)',
          },
        },
      },
    ],
  }

  return <ReactECharts option={option} style={{ height }} />
}

export default PieChart
