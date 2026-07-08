import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

function createSupabaseClient() {
  if (!isSupabaseConfigured) {
    if (import.meta.env.DEV) {
      console.warn(
        'FitCraft: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. ' +
          'Create a .env file in the project root to enable auth and data storage.'
      )
    }
    return null
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = createSupabaseClient()
