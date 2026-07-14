import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import LiquidGlass from './LiquidGlass'

const variants = {
  primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700',
  secondary: 'bg-dark-surface border border-border text-text-primary hover:bg-surface-hover',
  ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface',
  danger: 'bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600/30',
  // Tint and border come from the .glass class LiquidGlass applies.
  glass: 'text-text-primary hover:bg-white/5',
}

// The library's defaults (scale -112, mapBlur 12) are tuned for big cards:
// the refraction band is a fraction of the element's SMALLER side, so on a
// 48px-tall control it swallows the whole thing and the label swims. Small
// glass needs a shorter throw and a tighter edge.
export const SMALL_GLASS = { scale: -48, chroma: 4, border: 0.18, mapBlur: 6, blur: 3 }

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}) {
  const shared = {
    whileHover: { scale: disabled ? 1 : 1.02 },
    whileTap: { scale: disabled ? 1 : 0.98 },
    disabled: disabled || loading,
    className: `
      ${variants[variant]}
      ${sizes[size]}
      ${fullWidth ? 'w-full' : ''}
      inline-flex items-center justify-center gap-2
      font-medium rounded-xl
      transition-all duration-200
      disabled:opacity-50 disabled:cursor-not-allowed
      focus:outline-none focus:ring-2 focus:ring-primary-500/50
      ${className}
    `,
    ...props,
  }

  const content = (
    <>
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!loading && icon && iconPosition === 'left' && icon}
      {children}
      {!loading && icon && iconPosition === 'right' && icon}
    </>
  )

  if (variant === 'glass') {
    return (
      <LiquidGlass as={motion.button} glassOptions={SMALL_GLASS} {...shared}>
        {content}
      </LiquidGlass>
    )
  }

  return <motion.button {...shared}>{content}</motion.button>
}
