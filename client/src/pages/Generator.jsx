import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Target, Clock, Dumbbell, Sparkles, Check, ChevronRight, ChevronLeft,
  RefreshCw, Save, Share2, Zap, Flame, Weight
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Button from '../components/Button'
import Card from '../components/Card'
import Modal from '../components/Modal'
import { useAuth } from '../context/AuthContext'
import { createWorkout } from '../services/workoutService'
import { N8N_WEBHOOK_URL } from '../config/app'

const steps = [
  { id: 'goal', title: 'Select Your Goal', icon: Target },
  { id: 'duration', title: 'Choose Duration', icon: Clock },
  { id: 'equipment', title: 'Pick Equipment', icon: Dumbbell },
  { id: 'generate', title: 'Your Workout', icon: Sparkles },
]

const goals = [
  { id: 'fat_loss', label: 'Fat Loss', desc: 'Burn calories, boost metabolism', icon: Flame },
  { id: 'muscle_gain', label: 'Muscle Gain', desc: 'Build size and strength', icon: Weight },
  { id: 'strength', label: 'Strength', desc: 'Increase power and performance', icon: Zap },
  { id: 'general', label: 'General Fitness', desc: 'Overall health and wellness', icon: Target },
]

const durations = [
  { id: 15, label: '15 min', desc: 'Quick session' },
  { id: 30, label: '30 min', desc: 'Standard' },
  { id: 45, label: '45 min', desc: 'Extended' },
  { id: 60, label: '60 min', desc: 'Full workout' },
]

const equipmentOptions = [
  { id: 'bodyweight', label: 'Bodyweight Only', desc: 'No equipment needed' },
  { id: 'dumbbells', label: 'Dumbbells', desc: 'Free weights' },
  { id: 'barbell', label: 'Barbell', desc: 'Olympic bar' },
  { id: 'kettlebell', label: 'Kettlebell', desc: 'Swing & press' },
  { id: 'resistance_bands', label: 'Resistance Bands', desc: 'Portable bands' },
  { id: 'pull_up_bar', label: 'Pull-Up Bar', desc: 'Upper body' },
  { id: 'bench', label: 'Bench', desc: 'Press & flyes' },
  { id: 'gym_full', label: 'Full Gym Access', desc: 'All equipment' },
]

const sampleWorkouts = {
  fat_loss: {
    name: 'Fat Burning HIIT Circuit',
    exercises: [
      { name: 'Jump Squats', sets: 4, reps: '15', rest: '30s', notes: 'Explosive upward movement' },
      { name: 'Burpees', sets: 4, reps: '10', rest: '30s', notes: 'Full body engagement' },
      { name: 'Mountain Climbers', sets: 4, reps: '20', rest: '20s', notes: 'Keep hips low' },
      { name: 'High Knees', sets: 3, reps: '30s', rest: '20s', notes: 'Quick feet' },
      { name: 'Jumping Lunges', sets: 3, reps: '12 each', rest: '30s', notes: 'Alternate legs' },
    ],
  },
  muscle_gain: {
    name: 'Hypertrophy Strength Split',
    exercises: [
      { name: 'Bench Press', sets: 4, reps: '8-10', rest: '90s', notes: 'Control eccentric' },
      { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', rest: '60s', notes: 'Full range of motion' },
      { name: 'Lat Pulldown', sets: 4, reps: '10-12', rest: '60s', notes: 'Squeeze at bottom' },
      { name: 'Shoulder Press', sets: 3, reps: '10', rest: '60s', notes: 'Keep core tight' },
      { name: 'Tricep Dips', sets: 3, reps: '12', rest: '45s', notes: 'Lean forward for chest' },
    ],
  },
  strength: {
    name: 'Power Building Routine',
    exercises: [
      { name: 'Deadlift', sets: 5, reps: '5', rest: '180s', notes: 'Perfect form essential' },
      { name: 'Back Squat', sets: 5, reps: '5', rest: '180s', notes: 'Depth to parallel' },
      { name: 'Overhead Press', sets: 4, reps: '6', rest: '120s', notes: 'Brace core' },
      { name: 'Weighted Pull-ups', sets: 4, reps: '6', rest: '90s', notes: 'Full extension' },
      { name: 'Barbell Rows', sets: 4, reps: '8', rest: '90s', notes: 'Squeeze back' },
    ],
  },
  general: {
    name: 'Full Body Conditioning',
    exercises: [
      { name: 'Goblet Squats', sets: 3, reps: '12', rest: '45s', notes: 'Keep chest up' },
      { name: 'Push-ups', sets: 3, reps: '15', rest: '30s', notes: 'Core engaged' },
      { name: 'Dumbbell Rows', sets: 3, reps: '10 each', rest: '45s', notes: 'Control movement' },
      { name: 'Plank Hold', sets: 3, reps: '45s', rest: '30s', notes: 'Don\'t let hips sag' },
      { name: ' Walking Lunges', sets: 3, reps: '10 each', rest: '45s', notes: 'Step forward' },
    ],
  },
}

export default function Generator() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [selections, setSelections] = useState({
    goal: null,
    duration: null,
    equipment: [],
  })
  const [loading, setLoading] = useState(false)
  const [generatedWorkout, setGeneratedWorkout] = useState(null)
  const [saveModal, setSaveModal] = useState(false)
  const [workoutName, setWorkoutName] = useState('')
  const [saving, setSaving] = useState(false)

  const canProceed = () => {
    switch (currentStep) {
      case 0: return selections.goal !== null
      case 1: return selections.duration !== null
      case 2: return selections.equipment.length > 0
      default: return true
    }
  }

  const handleNext = () => {
    if (currentStep === 2) {
      generateWorkout()
    } else if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setGeneratedWorkout(null)
    }
  }

  const toggleEquipment = (id) => {
    setSelections((prev) => ({
      ...prev,
      equipment: prev.equipment.includes(id)
        ? prev.equipment.filter((e) => e !== id)
        : [...prev.equipment, id],
    }))
  }

  const generateWorkout = async () => {
    setLoading(true)
    setCurrentStep(3)

    try {
      if (N8N_WEBHOOK_URL) {
        const response = await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            goal: selections.goal,
            duration: selections.duration,
            equipment: selections.equipment,
            userId: user?.id,
          }),
        })
        const data = await response.json()
        setGeneratedWorkout(data)
      } else {
        await new Promise((r) => setTimeout(r, 1500))
        const template = sampleWorkouts[selections.goal] || sampleWorkouts.general
        setGeneratedWorkout(template)
        setWorkoutName(template.name)
      }
    } catch (err) {
      const template = sampleWorkouts[selections.goal] || sampleWorkouts.general
      setGeneratedWorkout(template)
      setWorkoutName(template.name)
    } finally {
      setLoading(false)
    }
  }

  const saveWorkout = async () => {
    if (!user || !generatedWorkout || !workoutName) return

    setSaving(true)
    try {
      const workoutData = {
        user_id: user.id,
        name: workoutName,
        goal: selections.goal,
        duration_minutes: selections.duration,
        equipment: selections.equipment,
        exercises: generatedWorkout.exercises,
      }
      console.log('Saving workout data:', workoutData)
      await createWorkout(workoutData)
      setSaveModal(false)
      navigate('/history')
    } catch (err) {
      console.error('Failed to save workout:', err)
      console.error('Error details:', JSON.stringify(err, null, 2))
      alert('Failed to save workout. Check console for details.')
    } finally {
      setSaving(false)
    }
  }

  const resetGenerator = () => {
    setCurrentStep(0)
    setSelections({ goal: null, duration: null, equipment: [] })
    setGeneratedWorkout(null)
  }

  return (
    <div className="min-h-screen bg-dark-400 pb-12">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex-1 flex items-center">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${index < currentStep
                        ? 'bg-primary-500 text-white'
                        : index === currentStep
                          ? 'bg-primary-500/20 border-2 border-primary-500 text-primary-500'
                          : 'bg-dark-300 border border-border text-text-muted'
                      }`}
                  >
                    {index < currentStep ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span
                    className={`text-xs text-center hidden sm:block ${index <= currentStep ? 'text-text-primary' : 'text-text-muted'
                      }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 transition-colors ${index < currentStep ? 'bg-primary-500' : 'bg-border'
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Step Content */}
        <Card className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {/* Step 1: Goal Selection */}
            {currentStep === 0 && (
              <motion.div
                key="goal"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-xl font-semibold text-text-primary mb-2">
                  What's your primary fitness goal?
                </h2>
                <p className="text-text-secondary mb-6">
                  This helps us tailor your workout to your objectives.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {goals.map((goal) => (
                    <motion.button
                      key={goal.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelections((s) => ({ ...s, goal: goal.id }))}
                      className={`p-4 rounded-xl text-left transition-all ${selections.goal === goal.id
                          ? 'bg-primary-500/20 border-2 border-primary-500'
                          : 'bg-dark-300 border border-border hover:border-primary-500/50'
                        }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <goal.icon
                          className={`w-6 h-6 ${selections.goal === goal.id ? 'text-primary-500' : 'text-text-muted'
                            }`}
                        />
                        <span
                          className={`font-semibold ${selections.goal === goal.id ? 'text-primary-500' : 'text-text-primary'
                            }`}
                        >
                          {goal.label}
                        </span>
                      </div>
                      <p className="text-text-muted text-sm">{goal.desc}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Duration Selection */}
            {currentStep === 1 && (
              <motion.div
                key="duration"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-xl font-semibold text-text-primary mb-2">
                  How much time do you have?
                </h2>
                <p className="text-text-secondary mb-6">
                  We'll adjust the workout intensity to fit your schedule.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {durations.map((dur) => (
                    <motion.button
                      key={dur.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelections((s) => ({ ...s, duration: dur.id }))}
                      className={`p-6 rounded-xl text-center transition-all ${selections.duration === dur.id
                          ? 'bg-primary-500/20 border-2 border-primary-500'
                          : 'bg-dark-300 border border-border hover:border-primary-500/50'
                        }`}
                    >
                      <Clock
                        className={`w-8 h-8 mx-auto mb-2 ${selections.duration === dur.id ? 'text-primary-500' : 'text-text-muted'
                          }`}
                      />
                      <p
                        className={`text-2xl font-bold ${selections.duration === dur.id ? 'text-primary-500' : 'text-text-primary'
                          }`}
                      >
                        {dur.label}
                      </p>
                      <p className="text-text-muted text-sm mt-1">{dur.desc}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Equipment Selection */}
            {currentStep === 2 && (
              <motion.div
                key="equipment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-xl font-semibold text-text-primary mb-2">
                  What equipment do you have?
                </h2>
                <p className="text-text-secondary mb-6">
                  Select all that apply to your available setup.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {equipmentOptions.map((eq) => (
                    <motion.button
                      key={eq.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleEquipment(eq.id)}
                      className={`p-4 rounded-xl text-left transition-all ${selections.equipment.includes(eq.id)
                          ? 'bg-primary-500/20 border-2 border-primary-500'
                          : 'bg-dark-300 border border-border hover:border-primary-500/50'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-md flex items-center justify-center ${selections.equipment.includes(eq.id)
                              ? 'bg-primary-500'
                              : 'bg-dark-200 border border-border'
                            }`}
                        >
                          {selections.equipment.includes(eq.id) && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">{eq.label}</p>
                          <p className="text-text-muted text-sm">{eq.desc}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 4: Generated Workout */}
            {currentStep === 3 && (
              <motion.div
                key="generate"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full"
                    />
                    <p className="mt-4 text-text-secondary">Generating your workout...</p>
                    <p className="text-text-muted text-sm mt-2">AI is crafting the perfect plan</p>
                  </div>
                ) : generatedWorkout ? (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-semibold text-text-primary">
                          {generatedWorkout.name}
                        </h2>
                        <p className="text-text-secondary text-sm">
                          {selections.goal.replace('_', ' ')} · {selections.duration} min · {generatedWorkout.exercises.length} exercises
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={resetGenerator}
                          icon={<RefreshCw className="w-4 h-4" />}
                        >
                          Regenerate
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      {generatedWorkout.exercises.map((exercise, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-dark-300 rounded-xl p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-text-primary">
                                {index + 1}. {exercise.name}
                              </h4>
                              <div className="flex gap-4 mt-1 text-sm text-text-secondary">
                                <span>{exercise.sets} sets</span>
                                <span>{exercise.reps} reps</span>
                                <span>{exercise.rest} rest</span>
                              </div>
                            </div>
                            {exercise.notes && (
                              <span className="text-text-muted text-sm italic">
                                {exercise.notes}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="primary"
                        onClick={() => setSaveModal(true)}
                        icon={<Save className="w-4 h-4" />}
                      >
                        Save Workout
                      </Button>
                      <Button
                        variant="secondary"
                        icon={<Share2 className="w-4 h-4" />}
                      >
                        Share
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-16">
                    <p className="text-text-secondary">Failed to generate workout</p>
                    <Button onClick={resetGenerator} className="mt-4">
                      Try Again
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Navigation Buttons */}
        {currentStep < 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-between mt-6"
          >
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0}
              icon={<ChevronLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={!canProceed()}
              icon={<ChevronRight className="w-4 h-4" />}
              iconPosition="right"
            >
              {currentStep === 2 ? 'Generate Workout' : 'Continue'}
            </Button>
          </motion.div>
        )}
      </main>

      {/* Save Modal */}
      <Modal
        isOpen={saveModal}
        onClose={() => setSaveModal(false)}
        title="Save Workout"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Workout Name
            </label>
            <input
              type="text"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              className="w-full px-4 py-3 bg-dark-300 border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              placeholder="Enter a name for this workout"
            />
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setSaveModal(false)} fullWidth>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={saveWorkout}
              loading={saving}
              disabled={!workoutName}
              fullWidth
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
