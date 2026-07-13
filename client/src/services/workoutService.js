import api from '../config/api'

export async function createWorkout(workout) {
  const { data } = await api.post('/workouts', workout)
  return data
}

export async function getWorkouts(userId, options = {}) {
  // Pass query params for filtering
  const { data } = await api.get('/workouts', { params: options })
  return data
}

export async function getWorkoutById(workoutId) {
  const { data } = await api.get(`/workouts/${workoutId}`)
  return data
}

export async function deleteWorkout(workoutId) {
  const { data } = await api.delete(`/workouts/${workoutId}`)
  return data
}

export async function updateWorkout(workoutId, updates) {
  const { data } = await api.put(`/workouts/${workoutId}`, updates)
  return data
}
