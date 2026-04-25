'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function addStudent(formData: FormData) {
  // 1. Session ve Veli Doğrulaması
  const supabase = await createClient()
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()

  if (sessionError || !session) {
    return { error: 'Oturum süreniz doldu. Lütfen tekrar giriş yapın.' }
  }

  const parentId = session.user.id
  if (session.user.user_metadata?.role !== 'parent') {
    return { error: 'Öğrenci eklemek için Veli hesabıyla giriş yapmanız gerekir.' }
  }

  // 2. Form verileri
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const usernameOrEmail = formData.get('username') as string
  const rawPassword = formData.get('password') as string
  const levelId = formData.get('levelId') as string | null
  const examType = formData.get('examType') as string | null
  const period = formData.get('period') as string | null

  if (!firstName || !lastName || !usernameOrEmail || !rawPassword) {
    return { error: 'Ad, soyad, kullanıcı adı/e-posta ve şifre zorunludur.' }
  }
  if (rawPassword.length < 6) {
    return { error: 'Şifre en az 6 karakter olmalıdır.' }
  }

  // E-posta mı yoksa kullanıcı adı mı kontrol et
  const isEmail = usernameOrEmail.includes('@')
  const email = isEmail ? usernameOrEmail : `${usernameOrEmail.toLowerCase().replace(/\s+/g, '_')}@cozsen.local`
  const username = isEmail ? null : usernameOrEmail

  // 3. Admin Client ile yeni Auth kullanıcısını oluştur
  let supabaseAdmin: ReturnType<typeof createAdminClient>
  try {
    supabaseAdmin = createAdminClient()
  } catch {
    return { error: 'Sistem yapılandırma hatası. Lütfen yönetici ile iletişime geçin.' }
  }

  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: rawPassword,
    email_confirm: true, // E-posta doğrulaması gerekmez (veli eklediği için trusted)
    user_metadata: {
      first_name: firstName,
      last_name: lastName,
      role: 'student',
    },
  })

  if (authError) {
    if (authError.message.includes('already registered') || authError.message.includes('already exists')) {
      return { error: 'Bu kullanıcı adı veya e-posta zaten sistemde kayıtlı.' }
    }
    return { error: authError.message }
  }

  const studentId = authData.user.id

  // 4. Trigger'ın students tablosunu oluşturması için bekle
  await new Promise(r => setTimeout(r, 1500))

  // 5. Öğrenci bilgilerini güncelle
  const studentUpdate: Record<string, any> = {}
  if (username) studentUpdate.username = username
  if (levelId) studentUpdate.level_id = levelId
  if (examType) studentUpdate.exam_type = examType
  if (period) studentUpdate.period = period

  if (Object.keys(studentUpdate).length > 0) {
    const { error: updateError } = await supabaseAdmin
      .from('students')
      .update(studentUpdate)
      .eq('id', studentId)

    if (updateError) {
      console.warn('Student update warning:', updateError.message)
      // Kritik değil, devam et
    }
  }

  // 6. Parent-Student ilişkisini ekle
  const { error: relationError } = await supabaseAdmin
    .from('parent_students')
    .insert({
      parent_id: parentId,
      student_id: studentId,
      relationship: 'Veli',
    })

  if (relationError) {
    // İlişki kurulamazsa öğrenci oluşturuldu ama bağlanamadı
    console.error('Relation error:', relationError.message)
    return { error: 'Öğrenci hesabı oluşturuldu ancak profilinize bağlanamadı. Lütfen destek alın.' }
  }

  revalidatePath('/veli', 'layout')
  return { success: true }
}
