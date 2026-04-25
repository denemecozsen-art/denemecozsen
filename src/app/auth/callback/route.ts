import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Google OAuth Callback Handler
 * Supabase, Google girişinden sonra kullanıcıyı buraya yönlendirir.
 * code değişimi yapılır ve kullanıcı profil sayfasına yönlendirilir.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const role = searchParams.get('role') || 'student'
  const next = role === 'parent' ? '/veli' : '/ogrenci'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Google'dan gelen kullanıcının metadata'sına role ekle
      // (eğer ilk kez giriş yapıyorsa trigger tetiklenecek)
      const existingRole = data.user.user_metadata?.role
      if (!existingRole) {
        await supabase.auth.updateUser({
          data: {
            role: role,
            first_name: data.user.user_metadata?.full_name?.split(' ')[0] || data.user.user_metadata?.name?.split(' ')[0] || 'Yeni',
            last_name: data.user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || 'Kullanıcı',
          },
        })
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Hata durumunda login sayfasına yönlendir
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
