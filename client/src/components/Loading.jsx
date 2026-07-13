import { motion } from 'framer-motion'

export default function Loading({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full"
      />
      <p className="mt-4 text-text-secondary">{text}</p>
    </div>
  )
}
