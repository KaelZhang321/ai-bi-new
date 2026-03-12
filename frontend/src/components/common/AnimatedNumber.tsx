import { useEffect, useRef, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

interface AnimatedNumberProps {
  value: number
  prefix?: string
  unit?: string
  duration?: number
  style?: React.CSSProperties
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  prefix = '',
  unit = '',
  duration = 1.5,
  style,
}) => {
  const spring = useSpring(0, { duration: duration * 1000 })
  const display = useTransform(spring, (v) => {
    if (value >= 10000) {
      return `${prefix}${(v / 10000).toFixed(2)}万${unit}`
    }
    if (Number.isInteger(value)) {
      return `${prefix}${Math.round(v).toLocaleString()}${unit}`
    }
    return `${prefix}${v.toFixed(2)}${unit}`
  })

  useEffect(() => {
    spring.set(value)
  }, [value, spring])

  return <motion.span style={style}>{display}</motion.span>
}

export default AnimatedNumber
