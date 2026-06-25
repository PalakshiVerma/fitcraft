import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Dumbbell, Clock, Trash2, Filter, Search, ChevronDown, X, Target, Eye } from 'lucide-react'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import Button from '../components/Button'
import Modal from '../components/Modal'
import Loading from '../components/Loading'
import { useAuth } from '../context/AuthContext'
import { getWorkouts, deleteWorkout } from '../services/workoutService'

const goalFilters = [
  { id: 'all', label: 'All Goals' },
  { id: 'fat_loss', label: 'Fat Loss' },
  { id: 'muscle_gain', label: 'Muscle Gain' },
  { id: 'strength', label: 'Strength' },
  { id: 'general', label: 'General' },
]

export default function History() {
  const { user } = useAuth()
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [goalFilter, setGoalFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedWorkout, setSelectedWorkout] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [workoutToDelete, setWorkoutToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchWorkouts()
  }, [user])

  const fetchWorkouts = async () => {
    if (user) {
      try {
        const data = await getWorkouts(user.id)
        setWorkouts(data)
      } catch (err) {
        console.error('Failed to fetch workouts:', err)
      } finally {
        setLoading(false)
      }
    }
  }

  const filteredWorkouts = workouts.filter((workout) => {
    const matchesSearch = workout.name.toLowerCase().includes(search.toLowerCase())
    const matchesGoal = goalFilter === 'all' || workout.goal === goalFilter
    return matchesSearch && matchesGoal
  })

  const handleDelete = async () => {
    if (!workoutToDelete) return
    setDeleting(true)
    try {
      await deleteWorkout(workoutToDelete.id)
      setWorkouts((prev) => prev.filter((w) => w.id !== workoutToDelete.id))
      setDeleteModal(false)
      setWorkoutToDelete(null)
    } catch (err) {
      console.error('Failed to delete workout:', err)
    } finally {
      setDeleting(false)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getGoalColor = (goal) => {
    const colors = {
      fat_loss: 'bg-orange-500/20 text-orange-400',
      muscle_gain: 'bg-blue-500/20 text-blue-400',
      strength: 'bg-purple-500/20 text-purple-400',
      general: 'bg-green-500/20 text-green-400',
    }
    return colors[goal] || colors.general
  }

  return (
    <div className="min-h-screen bg-dark-400 pb-12">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-text-primary mb-2">Workout History</h1>
          <p className="text-text-secondary">
            Review and manage your past workouts.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search workouts..."
              className="w-full pl-10 pr-4 py-3 bg-dark-300 border border-border rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="relative">
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              icon={<Filter className="w-4 h-4" />}
              iconPosition="left"
            >
              {goalFilters.find((f) => f.id === goalFilter)?.label}
              <ChevronDown className="w-4 h-4" />
            </Button>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-48 bg-dark-200 border border-border rounded-xl shadow-lg overflow-hidden z-10"
              >
                {goalFilters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => {
                      setGoalFilter(filter.id)
                      setShowFilters(false)
                    }}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                      goalFilter === filter.id
                        ? 'bg-primary-500/20 text-primary-500'
                        : 'text-text-secondary hover:bg-surface hover:text-text-primary'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Workouts List */}
        {loading ? (
          <Loading text="Loading history..." />
        ) : filteredWorkouts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <AnimatePresence>
              {filteredWorkouts.map((workout, index) => (
                <motion.div
                  key={workout.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card hover className="cursor-pointer" onClick={() => setSelectedWorkout(workout)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
                          <Dumbbell className="w-6 h-6 text-primary-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-text-primary">{workout.name}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${getGoalColor(workout.goal)}`}>
                              {workout.goal.replace('_', ' ')}
                            </span>
                            <span className="flex items-center gap-1 text-text-muted text-sm">
                              <Clock className="w-3 h-3" />
                              {workout.duration_minutes} min
                            </span>
                            <span className="text-text-muted text-sm">
                              {workout.exercises?.length || 0} exercises
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right mr-4">
                          <p className="text-text-secondary text-sm">{formatDate(workout.created_at)}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setWorkoutToDelete(workout)
                            setDeleteModal(true)
                          }}
                          className="p-2 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <Card className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-surface mx-auto mb-4 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-text-muted" />
            </div>
            <h3 className="font-semibold text-text-primary mb-2">
              {workouts.length === 0 ? 'No workouts yet' : 'No matching workouts'}
            </h3>
            <p className="text-text-muted mb-6">
              {workouts.length === 0
                ? 'Your saved workouts will appear here'
                : 'Try adjusting your search or filters'}
            </p>
            {workouts.length === 0 && (
              <Button onClick={() => window.location.href = '/generate'} icon={<Target className="w-4 h-4" />}>
                Generate Workout
              </Button>
            )}
          </Card>
        )}

        {/* Stats Summary */}
        {workouts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            <Card>
              <p className="text-text-muted text-sm">Total Workouts</p>
              <p className="text-2xl font-bold text-text-primary">{workouts.length}</p>
            </Card>
            <Card>
              <p className="text-text-muted text-sm">Total Minutes</p>
              <p className="text-2xl font-bold text-text-primary">
                {workouts.reduce((sum, w) => sum + w.duration_minutes, 0)}
              </p>
            </Card>
            <Card>
              <p className="text-text-muted text-sm">Top Goal</p>
              <p className="text-2xl font-bold text-text-primary capitalize">
                {workouts.length > 0
                  ? workouts.reduce((acc, w) => {
                      acc[w.goal] = (acc[w.goal] || 0) + 1
                      return acc
                    }, {})[Object.keys(workouts.reduce((acc, w) => {
                      acc[w.goal] = (acc[w.goal] || 0) + 1
                      return acc
                    }, {})).reduce((a, b) =>
                      workouts.reduce((acc, w) => { acc[w.goal] = (acc[w.goal] || 0) + 1; return acc }, {})[a] >
                      workouts.reduce((acc, w) => { acc[w.goal] = (acc[w.goal] || 0) + 1; return acc }, {})[b] ? a : b
                    )].replace('_', ' ')
                  : '-'}
              </p>
            </Card>
            <Card>
              <p className="text-text-muted text-sm">This Week</p>
              <p className="text-2xl font-bold text-text-primary">
                {workouts.filter((w) => {
                  const weekAgo = new Date()
                  weekAgo.setDate(weekAgo.getDate() - 7)
                  return new Date(w.created_at) > weekAgo
                }).length}
              </p>
            </Card>
          </motion.div>
        )}
      </main>

      {/* Workout Detail Modal */}
      <Modal
        isOpen={!!selectedWorkout}
        onClose={() => setSelectedWorkout(null)}
        title={selectedWorkout?.name}
        size="lg"
      >
        {selectedWorkout && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getGoalColor(selectedWorkout.goal)}`}>
                {selectedWorkout.goal.replace('_', ' ')}
              </span>
              <span className="flex items-center gap-1 text-text-secondary text-sm">
                <Clock className="w-4 h-4" />
                {selectedWorkout.duration_minutes} min
              </span>
              <span className="text-text-muted text-sm">
                {formatDate(selectedWorkout.created_at)}
              </span>
            </div>

            <div className="space-y-3">
              {selectedWorkout.exercises?.map((exercise, index) => (
                <div key={index} className="bg-dark-300 rounded-xl p-4">
                  <h4 className="font-medium text-text-primary">
                    {index + 1}. {exercise.name}
                  </h4>
                  <div className="flex gap-4 mt-1 text-sm text-text-secondary">
                    <span>{exercise.sets} sets</span>
                    <span>{exercise.reps} reps</span>
                    <span>{exercise.rest} rest</span>
                  </div>
                  {exercise.notes && (
                    <p className="text-text-muted text-sm mt-2 italic">{exercise.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Workout"
        size="sm"
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/20 mx-auto mb-4 flex items-center justify-center">
            <Trash2 className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-text-secondary mb-6">
            Are you sure you want to delete "{workoutToDelete?.name}"? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setDeleteModal(false)} fullWidth>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={deleting} fullWidth>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
