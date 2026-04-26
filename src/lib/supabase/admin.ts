import { createClient } from '@supabase/supabase-js'

/**
 * Server side functions specifically requiring admin privileges.
 * NEVER use this in the browser. NEVER expose this to the client.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    console.error('Supabase Admin environment variables are missing!')
    return {} as any
  }
  
  return createClient(
    url,
    key,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
