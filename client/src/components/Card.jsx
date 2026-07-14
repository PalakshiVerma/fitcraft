import LiquidGlass from './LiquidGlass'

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
    <LiquidGlass
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
      className={`
        rounded-2xl
        ${paddings[padding]}
        ${glow ? 'glow-primary' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </LiquidGlass>
  )
}
