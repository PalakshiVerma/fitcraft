import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  User, Mail, Target, LogOut, Save, Camera, Trophy, Clock, Dumbbell, Loader2
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import { useAuth } from '../context/AuthContext'

const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  fitnessGoal: z.enum(['fat_loss', 'muscle_gain', 'strength', 'general'], {
    required_error: 'Please select a fitness goal',
  }),
})

const fitnessGoals = [
  { id: 'fat_loss', label: 'Fat Loss', desc: 'Burn calories, boost metabolism', icon: Trophy },
  { id: 'muscle_gain', label: 'Muscle Gain', desc: 'Build size and strength' },
  { id: 'strength', label: 'Strength', desc: 'Increase power and performance' },
  { id: 'general', label: 'General Fitness', desc: 'Overall health and wellness' },
]

export default function Profile() {
  const navigate = useNavigate()
  const { user, profile, updateProfile, signOut } = useAuth()
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: profile?.full_name || '',
      fitnessGoal: profile?.fitness_goal || 'general',
    },
  })

  const selectedGoal = watch('fitnessGoal')

  const onSubmit = async (data) => {
    setSaving(true)
    setSuccess('')
    try {
      await updateProfile({
        full_name: data.fullName,
        fitness_goal: data.fitnessGoal,
      })
      setSuccess('Profile updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Failed to update profile:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (err) {
      console.error('Failed to sign out:', err)
    }
  }

  return (
    <div className="min-h-screen bg-dark-400 pb-12">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-text-primary mb-2">Profile Settings</h1>
          <p className="text-text-secondary">
            Manage your account and fitness preferences.
          </p>
        </motion.div>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-primary-500/20 flex items-center justify-center">
                  <User className="w-10 h-10 text-primary-500" />
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-primary">
                  {profile?.full_name || 'Athlete'}
                </h2>
                <p className="text-text-secondary">{user?.email}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Profile Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Card className="mb-6">
            <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary-500" />
              Personal Information
            </h3>
            <div className="space-y-4">
              <Input
                {...register('fullName')}
                label="Full Name"
                placeholder="John Doe"
                icon={<User className="w-4 h-4" />}
                error={errors.fullName?.message}
              />
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Email Address
                </label>
                <div className="flex items-center gap-2 px-4 py-3 bg-dark-300 border border-border rounded-xl text-text-muted">
                  <Mail className="w-4 h-4" />
                  {user?.email}
                </div>
              </div>
            </div>
          </Card>

          <Card className="mb-6">
            <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary-500" />
              Fitness Goal
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {fitnessGoals.map((goal) => (
                <motion.button
                  key={goal.id}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setValue('fitnessGoal', goal.id, { shouldDirty: true })}
                  className={`p-4 rounded-xl text-left transition-all ${
                    selectedGoal === goal.id
                      ? 'bg-primary-500/20 border-2 border-primary-500'
                      : 'bg-dark-300 border border-border hover:border-primary-500/50'
                  }`}
                >
                  <span
                    className={`font-medium ${
                      selectedGoal === goal.id ? 'text-primary-500' : 'text-text-primary'
                    }`}
                  >
                    {goal.label}
                  </span>
                  <p className="text-text-muted text-sm mt-1">{goal.desc}</p>
                </motion.button>
              ))}
            </div>
            {errors.fitnessGoal && (
              <p className="mt-2 text-sm text-red-400">{errors.fitnessGoal.message}</p>
            )}
          </Card>

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm"
            >
              {success}
            </motion.div>
          )}

          <div className="flex gap-3 mb-8">
            <Button
              type="submit"
              variant="primary"
              loading={saving}
              disabled={!isDirty}
              icon={<Save className="w-4 h-4" />}
            >
              Save Changes
            </Button>
          </div>
        </motion.form>

        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="mb-6">
            <h3 className="font-semibold text-text-primary mb-4">Your Stats</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-primary-500/20 mx-auto mb-2 flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-primary-500" />
                </div>
                <p className="text-2xl font-bold text-text-primary">0</p>
                <p className="text-text-muted text-sm">Workouts</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 mx-auto mb-2 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-400" />
                </div>
                <p className="text-2xl font-bold text-text-primary">0</p>
                <p className="text-text-muted text-sm">Minutes</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 mx-auto mb-2 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-purple-400" />
                </div>
                <p className="text-2xl font-bold text-text-primary">0</p>
                <p className="text-text-muted text-sm">Goals Hit</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Sign Out */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-text-primary">Sign Out</h3>
                <p className="text-text-muted text-sm">Sign out of your account</p>
              </div>
              <Button
                variant="ghost"
                onClick={handleSignOut}
                icon={<LogOut className="w-4 h-4" />}
              >
                Sign Out
              </Button>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
