import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase' // Adjust path as needed

// Use environment variables from .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error("VITE_SUPABASE_URL is not defined in .env file")
}
if (!supabaseAnonKey) {
  throw new Error("VITE_SUPABASE_ANON_KEY is not defined in .env file")
}

// Create and export the Supabase client instance
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
