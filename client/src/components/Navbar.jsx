import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, User, LogOut, BarChart3 } from 'lucide-react'
import { useState } from 'react'
import Button from './Button'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { path: '/generate', label: 'Generate', icon: null },
  { path: '/history', label: 'History', icon: null },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const { user, signOut } = useAuth()

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-30 glass-strong border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />

          <div className="hidden md:flex items-center gap-1">
            {navLinks.filter(link => user || link.path === '/dashboard').map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium
                  transition-colors duration-200
                  ${location.pathname === link.path
                    ? 'text-primary-500 bg-primary-500/10'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/profile">
                  <Button variant="ghost" size="sm" icon={<User className="w-4 h-4" />}>
                    Profile
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={signOut} icon={<LogOut className="w-4 h-4" />}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link to="/login?mode=signup">
                  <Button variant="primary" size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-border"
        >
          <div className="px-4 py-4 space-y-2">
            {navLinks.filter(link => user || link.path === '/dashboard').map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`
                  block px-4 py-2 rounded-lg text-sm font-medium
                  ${location.pathname === link.path
                    ? 'text-primary-500 bg-primary-500/10'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-border space-y-2">
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" fullWidth icon={<User className="w-4 h-4" />}>
                      Profile
                    </Button>
                  </Link>
                  <Button variant="ghost" fullWidth onClick={signOut} icon={<LogOut className="w-4 h-4" />}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" fullWidth>Sign In</Button>
                  </Link>
                  <Link to="/login?mode=signup" onClick={() => setIsOpen(false)}>
                    <Button variant="primary" fullWidth>Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
