import { motion } from 'framer-motion'

export default function Card({
  children,
  className = '',
  hover = false,
  glow = false,
  padding = 'md',
  ...props
}) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  return (
    <motion.div
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
      className={`
        glass rounded-2xl
        ${paddings[padding]}
        ${glow ? 'glow-primary' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  )
}
