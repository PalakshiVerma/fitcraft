import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Logo({ size = 'md', showText = true, link = true }) {
  const sizes = {
    sm: { logo: 'w-8 h-8', text: 'text-lg' },
    md: { logo: 'w-10 h-10', text: 'text-xl' },
    lg: { logo: 'w-14 h-14', text: 'text-2xl' },
  }

  const content = (
    <div className="flex items-center gap-3">
      <motion.div
        whileHover={{ rotate: 5, scale: 1.05 }}
        className={`${sizes[size].logo} relative`}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ee9460" />
              <stop offset="100%" stopColor="#C78149" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="45" stroke="url(#logoGradient)" strokeWidth="4" fill="none" />
          <path
            d="M30 50 L45 65 L70 35"
            stroke="url(#logoGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M50 25 L50 75"
            stroke="url(#logoGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.5"
          />
          <path
            d="M25 50 L75 50"
            stroke="url(#logoGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
      </motion.div>
      {showText && (
        <span className={`${sizes[size].text} font-bold text-text-primary tracking-tight`}>
          Fit<span className="text-primary-500">Craft</span>
        </span>
      )}
    </div>
  )

  if (link) {
    return <Link to="/">{content}</Link>
  }

  return content
}
