'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { buildAdminPath } from '@/lib/admin-config'
import { headers } from 'next/headers'

// In-memory başarısız giriş sayacı (server action context)
// Production'da Upstash Redis ile değiştirin
const failedAttempts = new Map<string, { count: number; resetAt: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 dakika

function getClientIp(headersList: Awaited<ReturnType<typeof headers>>): string {
  return (
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headersList.get('x-real-ip') ??
    '127.0.0.1'
  )
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const record = failedAttempts.get(ip)
  if (!record || now > record.resetAt) return false
  return record.count >= MAX_ATTEMPTS
}

function recordFailure(ip: string): void {
  const now = Date.now()
  const record = failedAttempts.get(ip)
  if (!record || now > record.resetAt) {
    failedAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
  } else {
    record.count++
    console.warn(`[ADMIN AUTH] Başarısız giriş: IP=${ip} Deneme=${record.count}/${MAX_ATTEMPTS}`)
  }
}

function clearAttempts(ip: string): void {
  failedAttempts.delete(ip)
}

export async function adminLogin(formData: FormData) {
  const headersList = await headers()
  const ip = getClientIp(headersList)

  // Rate limit kontrolü
  if (isRateLimited(ip)) {
    return {
      error: 'Çok fazla başarısız deneme. Lütfen 15 dakika sonra tekrar deneyin.',
      rateLimited: true,
    }
  }

  const supabase = await createClient()

  const data = {
    email: (formData.get('email') as string).trim().toLowerCase(),
    password: formData.get('password') as string,
  }

  if (!data.email || !data.password) {
    return { error: 'E-posta ve şifre zorunludur.' }
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    recordFailure(ip)
    console.warn(`[ADMIN AUTH] Başarısız giriş: email=${data.email} IP=${ip} hata=${error.message}`)
    return { error: 'E-posta veya şifre hatalı.' }
  }

  // Başarılı giriş — sayacı sıfırla
  clearAttempts(ip)
  console.info(`[ADMIN AUTH] Başarılı giriş: email=${data.email} IP=${ip}`)

  const adminRoot = buildAdminPath()
  revalidatePath(adminRoot, 'layout')
  redirect(adminRoot)
}
