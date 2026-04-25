'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

/**
 * E-posta + Şifre ile Giriş
 */
export async function login(formData: FormData) {
  const supabase = await createClient()

  let emailOrUsername = (formData.get('emailOrUsername') as string || formData.get('email') as string).trim()
  const password = formData.get('password') as string
  
  // username kontrolü: eğer içinde @ yoksa username kabul et ve students tablosunda emailini bul
  if (!emailOrUsername.includes('@')) {
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('email')
      .eq('username', emailOrUsername)
      .single()
      
    if (studentError || !student?.email) {
      return { error: 'Girdiğiniz kullanıcı adına ait bir hesap bulunamadı.' }
    }
    emailOrUsername = student.email
  }

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: emailOrUsername,
    password,
  })

  if (error) {
    // Email doğrulanmamış — özel mesaj + resend flag
    if (
      error.message.includes('Email not confirmed') ||
      error.message.includes('email_not_confirmed') ||
      error.message.toLowerCase().includes('not confirmed')
    ) {
      return {
        error: 'E-posta adresiniz henüz doğrulanmamış. Lütfen e-postanıza gelen aktivasyon linkine tıklayın.',
        emailNotConfirmed: true,
        email: emailOrUsername,
      }
    }
    return { error: 'E-posta veya şifre hatalı. Lütfen bilgilerinizi kontrol edin.' }
  }

  revalidatePath('/', 'layout')
  
  const role = authData.user?.user_metadata?.role || 'student'
  if (role === 'parent') {
    redirect('/veli')
  } else {
    redirect('/ogrenci')
  }
}

/**
 * Doğrulama e-postasını tekrar gönder
 */
export async function resendVerificationEmail(email: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.resend({ type: 'signup', email })
  if (error) return { error: 'E-posta gönderilemedi: ' + error.message }
  return { success: true }
}

/**
 * Şifremi unuttum — sıfırlama e-postası gönder
 */
export async function sendPasswordReset(formData: FormData) {
  const supabase = await createClient()
  const email = (formData.get('email') as string).trim()
  if (!email) return { error: 'E-posta adresi zorunludur.' }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/sifremi-unuttum/yeni-sifre`,
  })

  if (error) return { error: error.message }
  return { success: true }
}

/**
 * Yeni şifre kaydet (reset token üzerinden)
 */
export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!password || password.length < 6) return { error: 'Şifre en az 6 karakter olmalıdır.' }
  if (password !== confirmPassword) return { error: 'Şifreler eşleşmiyor.' }

  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  redirect('/login?passwordUpdated=1')
}

/**
 * Telefon + OTP ile Giriş — Adım 1: SMS Gönder
 */
export async function sendLoginOtp(formData: FormData) {
  const supabase = await createClient()

  let phone = (formData.get('phone') as string).trim()
  if (phone.startsWith('0')) phone = '+90' + phone.substring(1)
  if (!phone.startsWith('+')) phone = '+90' + phone

  const { error } = await supabase.auth.signInWithOtp({ phone })

  if (error) {
    return { error: error.message }
  }

  return { success: true, phone }
}

/**
 * Telefon + OTP ile Giriş — Adım 2: Kodu Doğrula
 */
export async function verifyLoginOtp(formData: FormData) {
  const supabase = await createClient()

  const phone = formData.get('phone') as string
  const token = formData.get('token') as string

  const { error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  })

  if (error) {
    if (error.message.includes('expired')) {
      return { error: 'Doğrulama kodunun süresi dolmuş. Lütfen yeni kod isteyin.' }
    }
    return { error: 'Doğrulama kodu hatalı.' }
  }

  const role = (await supabase.auth.getUser()).data.user?.user_metadata?.role || 'student'

  revalidatePath('/', 'layout')
  if (role === 'parent') {
    redirect('/veli')
  } else {
    redirect('/ogrenci')
  }
}

/**
 * Google ile Giriş
 */
export async function loginWithGoogle() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }

  return { error: 'Bir sorun oluştu.' }
}
