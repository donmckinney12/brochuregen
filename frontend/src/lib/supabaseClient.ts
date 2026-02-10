import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase Environment Variables')
}

// Check if we are on the server or client to avoid hydration errors if accessed prematurely
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
