import { createClient } from '@supabase/supabase-js'

/**
 * Server side functions specifically requiring admin privileges.
 * NEVER use this in the browser. NEVER expose this to the client.
 */
export function createAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase Service Role Key eksik. .env dosyasını kontrol edin.')
  }
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
