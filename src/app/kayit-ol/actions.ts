'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type StudentEntry = {
  firstName: string; lastName: string; usernameOrEmail: string; password: string;
  levelId: string; examType: string;
}

/**
 * Kayıt — E-posta + Şifre
 * Adım 1 (kişisel) + Adım 2 (öğrenci/veli bilgileri + veli öğrenci ekleme)
 */
export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const role = (formData.get('role') as string) || 'student'

  // Öğrenciye özel
  const levelId = formData.get('levelId') as string | null
  const examType = formData.get('examType') as string | null
  const parentName = formData.get('parentName') as string | null
  const parentPhone = formData.get('parentPhone') as string | null

  // Veliye özel — öğrenci listesi
  const studentsRaw = formData.get('students') as string | null
  let studentsToAdd: StudentEntry[] = []
  if (studentsRaw) {
    try { studentsToAdd = JSON.parse(studentsRaw) } catch { /* ignore */ }
  }

  if (!email || !password || !firstName || !lastName) {
    return { error: 'Tüm zorunlu alanlar doldurulmalıdır.' }
  }

  // 1. Ana hesabı oluştur
  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        role,
      },
    },
  })

  if (error) {
    if (error.message.includes('already registered') || error.message.includes('User already registered')) {
      return { error: 'Bu e-posta adresi zaten kayıtlı. Giriş yapmayı deneyin.' }
    }
    return { error: error.message }
  }

  // 2. Öğrenci ek bilgi kaydet
  if (role === 'student' && data.user && (levelId || examType || parentName)) {
    const updatePayload: Record<string, any> = {}
    if (levelId) updatePayload.level_id = levelId
    if (examType) updatePayload.exam_type = examType
    if (parentName) updatePayload.parent_name = parentName
    if (parentPhone) updatePayload.parent_phone = parentPhone

    await new Promise(r => setTimeout(r, 1500))
    await supabase.from('students').update(updatePayload).eq('id', data.user.id)
  }

  // 3. Veli — öğrenci ekleme
  if (role === 'parent' && data.user && studentsToAdd.length > 0) {
    // Veli kayıt sonrası session oluşmuş mu? Confirm gerekiyorsa oluşmamış olabilir.
    // Admin client ile öğrenci hesapları oluşturmamız lazım.
    try {
      const { createAdminClient } = await import('@/lib/supabase/admin')
      const supabaseAdmin = createAdminClient()
      const parentId = data.user.id

      // Trigger'ın parents tablosuna kayıt eklemesi için bekle
      await new Promise(r => setTimeout(r, 2000))

      for (const s of studentsToAdd) {
        if (!s.firstName || !s.lastName || !s.usernameOrEmail || !s.password) continue

        const isEmail = s.usernameOrEmail.includes('@')
        const stuEmail = isEmail ? s.usernameOrEmail : `${s.usernameOrEmail.toLowerCase().replace(/\s+/g, '_')}@cozsen.local`
        const stuUsername = isEmail ? null : s.usernameOrEmail

        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: stuEmail,
          password: s.password,
          email_confirm: true,
          user_metadata: {
            first_name: s.firstName,
            last_name: s.lastName,
            role: 'student',
          },
        })

        if (authError) {
          console.warn('Student creation error:', authError.message)
          continue
        }

        const studentId = authData.user.id
        await new Promise(r => setTimeout(r, 1000))

        // Öğrenci bilgilerini güncelle
        const updateData: Record<string, any> = {}
        if (stuUsername) updateData.username = stuUsername
        if (s.levelId) updateData.level_id = s.levelId
        if (s.examType) updateData.exam_type = s.examType
        if (Object.keys(updateData).length > 0) {
          await supabaseAdmin.from('students').update(updateData).eq('id', studentId)
        }

        // Parent-Student ilişkisi
        await supabaseAdmin.from('parent_students').insert({
          parent_id: parentId,
          student_id: studentId,
          relationship: 'Veli',
        })
      }
    } catch (adminErr) {
      console.error('Admin client error during student creation:', adminErr)
      // Veli hesabı oluşturuldu ama öğrenciler eklenemedi — devam et
    }
  }

  // Email doğrulama gerekiyorsa
  if (!data.session) {
    redirect('/login?registered=1')
  }

  revalidatePath('/', 'layout')
  if (role === 'parent') {
    redirect('/veli')
  } else {
    redirect('/ogrenci')
  }
}

/**
 * Telefon (OTP) ile Kayıt — 1. Adım: SMS Gönder
 */
export async function sendPhoneOtp(formData: FormData) {
  const supabase = await createClient()
  const phone = formData.get('phone') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const role = (formData.get('role') as string) || 'student'

  if (!phone || !firstName || !lastName) return { error: 'Ad, soyad ve telefon numarası zorunludur.' }

  let formattedPhone = phone.trim()
  if (formattedPhone.startsWith('0')) formattedPhone = '+90' + formattedPhone.substring(1)
  if (!formattedPhone.startsWith('+')) formattedPhone = '+90' + formattedPhone

  const { error } = await supabase.auth.signInWithOtp({
    phone: formattedPhone,
    options: { data: { first_name: firstName, last_name: lastName, role } },
  })
  if (error) return { error: error.message }
  return { success: true, phone: formattedPhone }
}

/**
 * Google ile Kayıt/Giriş
 */
export async function signInWithGoogle(role: string = 'student') {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?role=${role}`,
      queryParams: { access_type: 'offline', prompt: 'consent' },
    },
  })
  if (error) return { error: error.message }
  if (data.url) redirect(data.url)
  return { error: 'Bir sorun oluştu.' }
}
