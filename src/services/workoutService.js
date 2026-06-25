import { supabase } from '../config/supabase'

export async function createWorkout(workout) {
  const { data, error } = await supabase
    .from('workouts')
    .insert(workout)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getWorkouts(userId, options = {}) {
  let query = supabase
    .from('workouts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (options.limit) {
    query = query.limit(options.limit)
  }

  if (options.goal) {
    query = query.eq('goal', options.goal)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

export async function getWorkoutById(workoutId) {
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('id', workoutId)
    .single()

  if (error) throw error
  return data
}

export async function deleteWorkout(workoutId) {
  const { error } = await supabase
    .from('workouts')
    .delete()
    .eq('id', workoutId)

  if (error) throw error
}

export async function updateWorkout(workoutId, updates) {
  const { data, error } = await supabase
    .from('workouts')
    .update(updates)
    .eq('id', workoutId)
    .select()
    .single()

  if (error) throw error
  return data
}
