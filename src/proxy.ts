import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Edge runtime'da @/lib alias ÇALIŞMIYOR — değerleri burada tanımlıyoruz
// Değiştirmek için bunu ve .env.local'daki ADMIN_PANEL_PATH değerini güncelleyin
const ADMIN_PANEL_PATH = process.env.NEXT_PUBLIC_ADMIN_PANEL_PATH ?? 'uraz'

const BLOCKED_ADMIN_PATHS = [
  '/admin',
  '/administrator',
  '/dashboard-admin',
  '/panel',
  '/control-panel',
  '/manage',
  '/wp-admin',
  '/backend',
]

// Rate limiting için in-memory store
// Production'da Upstash Redis kullanılmalı
const loginAttempts = new Map<string, { count: number; resetAt: number }>()

const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 dakika

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = loginAttempts.get(ip)
  if (!record || now > record.resetAt) return false
  return record.count >= RATE_LIMIT_MAX
}

function recordFailedAttempt(ip: string): void {
  const now = Date.now()
  const record = loginAttempts.get(ip)
  if (!record || now > record.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
  } else {
    record.count++
  }
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ─── 1. Yaygın admin path'lerini 404'e at ──────────────────────────────
  const isBlockedPath = BLOCKED_ADMIN_PATHS.some(
    (blocked) => pathname === blocked || pathname.startsWith(`${blocked}/`)
  )
  if (isBlockedPath) {
    // Projede /404 sayfası olmadığı için rewrite yerine direkt 404 status dönüyoruz
    return new NextResponse(null, { status: 404 })
  }

  // ─── 2. Admin panel path işleme ────────────────────────────────────────
  const adminBase = `/${ADMIN_PANEL_PATH}`
  const adminLoginPath = `${adminBase}/login`
  const isAdminPath = pathname === adminBase || pathname.startsWith(`${adminBase}/`)
  const isAdminLogin = pathname === adminLoginPath || pathname.startsWith(`${adminLoginPath}/`)

  if (isAdminPath) {
    // Supabase session oku
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-pathname', pathname)

    let supabaseResponse = NextResponse.next({
      request: { headers: requestHeaders },
    })

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
      return NextResponse.next()
    }

    const supabase = createServerClient(url, key, {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({ request: { headers: requestHeaders } })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // ─── Login sayfası ─────────────────────────────────────────────────────
    if (isAdminLogin) {
      // Rate limit kontrolü
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        ?? request.headers.get('x-real-ip')
        ?? '127.0.0.1'

      if (checkRateLimit(ip)) {
        return new NextResponse(
          JSON.stringify({ error: 'Çok fazla başarısız deneme. 15 dakika sonra tekrar deneyin.' }),
          { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '900' } }
        )
      }

      // Zaten giriş yapmışsa admin ana sayfasına yönlendir
      if (user) {
        return NextResponse.redirect(new URL(adminBase, request.url))
      }

      // Login sayfasını /admin/login'e rewrite et (internal)
      const internalLoginUrl = new URL('/admin/login', request.url)
      const rewriteRes = NextResponse.rewrite(internalLoginUrl)
      rewriteRes.headers.set('X-Robots-Tag', 'noindex, nofollow')
      rewriteRes.headers.set('x-pathname', pathname)
      supabaseResponse.cookies.getAll().forEach(c => rewriteRes.cookies.set(c.name, c.value))
      return rewriteRes
    }

    // ─── Diğer admin sayfaları: session zorunlu ────────────────────────────
    if (!user) {
      return NextResponse.redirect(new URL(adminLoginPath, request.url))
    }

    // Rol kontrolü
    const userRole = user.app_metadata?.role ?? user.user_metadata?.role
    if (userRole !== 'admin' && userRole !== 'super_admin') {
      // Yetkisiz erişim: direkt 404 status dönüyoruz
      return new NextResponse(null, { status: 404 })
    }

    // Yetkili kullanıcı: /uraz/* → /admin/* internal rewrite
    const internalPath = pathname.replace(adminBase, '/admin')
    const rewriteUrl = new URL(internalPath, request.url)
    rewriteUrl.search = request.nextUrl.search

    const rewriteRes = NextResponse.rewrite(rewriteUrl)
    rewriteRes.headers.set('X-Robots-Tag', 'noindex, nofollow')
    rewriteRes.headers.set('x-pathname', pathname)
    supabaseResponse.cookies.getAll().forEach(c => rewriteRes.cookies.set(c.name, c.value))
    return rewriteRes
  }

  // ─── 3. Normal sayfalar: session refresh + korumalı rota kontrolü ────────
  return updatePublicSession(request)
}

async function updatePublicSession(request: NextRequest): Promise<NextResponse> {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', request.nextUrl.pathname)

  let response = NextResponse.next({ request: { headers: requestHeaders } })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    return response
  }

  const supabase = createServerClient(url, key, {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request: { headers: requestHeaders } })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user && (
    request.nextUrl.pathname.startsWith('/profil') ||
    request.nextUrl.pathname.startsWith('/cevap-anahtari')
  )) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
