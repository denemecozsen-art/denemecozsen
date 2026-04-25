/**
 * Admin Panel Route Konfigürasyonu
 * 
 * Admin panel path değeri .env'den okunur.
 * Varsayılan: "uraz"
 * 
 * Tüm admin link, redirect ve matcher'lar bu dosyadan türetilir.
 * Hiçbir zaman hardcoded "/admin" kullanılmaz.
 */

// Server + Edge runtime uyumlu — process.env doğrudan kullanılır
export const ADMIN_PANEL_PATH = process.env.ADMIN_PANEL_PATH ?? 'uraz'

// Yaygın admin yolları — bunlara erişim kesinlikle engellensin
export const BLOCKED_ADMIN_PATHS = [
  '/admin',
  '/administrator',
  '/dashboard-admin',
  '/panel',
  '/control-panel',
  '/manage',
  '/wp-admin',
  '/backend',
]

/**
 * Admin paneli için path builder
 * @param sub - alt yol (örn: "/login", "/blog")
 * @returns tam admin path (örn: "/uraz/login")
 */
export function buildAdminPath(sub: string = ''): string {
  const base = `/${ADMIN_PANEL_PATH}`
  if (!sub || sub === '/') return base
  const normalized = sub.startsWith('/') ? sub : `/${sub}`
  return `${base}${normalized}`
}

/**
 * Internal Next.js rewrite için — dosya sistemindeki gerçek /admin/* path'i
 * Middleware tarafından kullanılır, asla kullanıcıya gösterilmez
 */
export function buildInternalAdminPath(sub: string = ''): string {
  const base = '/admin'
  if (!sub || sub === '/') return base
  const normalized = sub.startsWith('/') ? sub : `/${sub}`
  return `${base}${normalized}`
}
