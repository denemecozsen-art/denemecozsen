import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ADMIN_PANEL_PATH } from '@/lib/admin-config'

export default async function ProfileRootPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/giris')
  }

  const role = session.user.user_metadata?.role
  const email = session.user.email

  // Admin kullanıcıları admin paneline yönlendir
  if (role === 'admin' || email === 'teknocash16@gmail.com') {
    redirect(`/${ADMIN_PANEL_PATH}`)
  }

  if (role === 'parent') {
    redirect('/profile/veli')
  } else {
    redirect('/profile/ogrenci')
  }
}
