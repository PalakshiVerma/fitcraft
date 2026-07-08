import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Dumbbell, Clock, Target, TrendingUp, Plus, ArrowRight, Flame, Trophy } from 'lucide-react'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import Button from '../components/Button'
import Loading from '../components/Loading'
import { useAuth } from '../context/AuthContext'
import { getWorkouts } from '../services/workoutService'

const stats = [
  { label: 'Total Workouts', value: 0, icon: Dumbbell, color: 'text-primary-500' },
  { label: 'Minutes Trained', value: 0, icon: Clock, color: 'text-blue-400' },
  { label: 'Current Streak', value: 0, icon: Flame, color: 'text-orange-400' },
  { label: 'Goals Hit', value: 0, icon: Trophy, color: 'text-green-400' },
]

const quickActions = [
  {
    title: 'Generate New Workout',
    description: 'Create a personalized workout plan',
    icon: Plus,
    link: '/generate',
    primary: true,
  },
  {
    title: 'View History',
    description: 'Review your past workouts',
    icon: Target,
    link: '/history',
    primary: false,
  },
]

export default function Dashboard() {
  const { user, profile } = useAuth()
  const [recentWorkouts, setRecentWorkouts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchWorkouts() {
      if (user) {
        try {
          const workouts = await getWorkouts(user.id, { limit: 5 })
          setRecentWorkouts(workouts)
        } catch (err) {
          console.error('Failed to fetch workouts:', err)
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }
    fetchWorkouts()
  }, [user])

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="min-h-screen bg-dark-400 pb-12">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            {greeting()}, {user ? (profile?.full_name?.split(' ')[0] || 'Athlete') : 'Guest'}
          </h1>
          <p className="text-text-secondary">
            Ready to crush your fitness goals today?
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <Card key={index} hover className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-${stat.color}/20 flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                <p className="text-text-muted text-sm">{stat.label}</p>
              </div>
            </Card>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-4 mb-8"
        >
          {quickActions.map((action, index) => (
            <Link key={index} to={user ? action.link : '/login?mode=signup'}>
              <Card
                hover
                glow={action.primary}
                className={`flex items-center justify-between ${action.primary ? 'border-primary-500/30' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${action.primary ? 'bg-primary-500/20' : 'bg-surface'} flex items-center justify-center`}>
                    <action.icon className={`w-6 h-6 ${action.primary ? 'text-primary-500' : 'text-text-secondary'}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">{action.title}</h3>
                    <p className="text-text-muted text-sm">{action.description}</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-text-muted" />
              </Card>
            </Link>
          ))}
        </motion.div>

        {/* Recent Workouts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-text-primary">Recent Workouts</h2>
            <Link to={user ? "/history" : "/login?mode=signup"}>
              <Button variant="ghost" size="sm" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                View All
              </Button>
            </Link>
          </div>

          {loading ? (
            <Loading text="Loading workouts..." />
          ) : recentWorkouts.length > 0 ? (
            <div className="space-y-3">
              {recentWorkouts.map((workout, index) => (
                <Card key={workout.id} hover padding="sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                        <Dumbbell className="w-5 h-5 text-primary-500" />
                      </div>
                      <div>
                        <h4 className="font-medium text-text-primary">{workout.name}</h4>
                        <p className="text-text-muted text-sm">
                          {workout.goal.replace('_', ' ')} · {workout.duration_minutes} min
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-text-secondary text-sm">
                        {new Date(workout.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-surface mx-auto mb-4 flex items-center justify-center">
                <Dumbbell className="w-8 h-8 text-text-muted" />
              </div>
              <h3 className="font-semibold text-text-primary mb-2">No workouts yet</h3>
              <p className="text-text-muted mb-6">Generate your first workout to get started</p>
              <Link to={user ? "/generate" : "/login?mode=signup"}>
                <Button icon={<Plus className="w-4 h-4" />}>Generate Workout</Button>
              </Link>
            </Card>
          )}
        </motion.div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-5 h-5 text-primary-500" />
              <h3 className="font-semibold text-text-primary">Your Progress</h3>
            </div>
            <div className="text-center py-8">
              <p className="text-text-muted">Start working out to track your progress over time</p>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
