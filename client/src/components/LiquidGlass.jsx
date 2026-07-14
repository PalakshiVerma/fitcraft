import { useLayoutEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { liquidGlass } from '../lib/liquidGlass'

// Drop-in replacement for .glass / .glass-strong panels: keeps the same
// tint + border classes and upgrades the flat backdrop blur to liquid-glass
// refraction (frosted-blur fallback on Safari/Firefox). Renders a framer
// motion element so animation props pass straight through; use
// `as={motion.nav}` etc. for other tags.
export default function LiquidGlass({
  as: Tag = motion.div,
  strong = false,
  className = '',
  glassOptions,
  children,
  ...props
}) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    // Interior blur is kept low on purpose: heavy blur smears the backdrop
    // into a flat wash, and refraction that bends nothing legible reads as
    // nothing at all. fallbackBlur stays high — browsers without refraction
    // get the old frosted look, where a thin panel would just look murky.
    const fx = liquidGlass(ref.current, {
      blur: strong ? 7 : 4,
      fallbackBlur: strong ? 20 : 12,
      ...glassOptions,
    })
    return () => fx.destroy()
    // ponytail: keyed on `strong` only — pass a new element (remount) if
    // glassOptions ever needs to change at runtime; nothing does today
  }, [strong])

  return (
    <Tag
      ref={ref}
      className={`${strong ? 'glass-strong' : 'glass'} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}
