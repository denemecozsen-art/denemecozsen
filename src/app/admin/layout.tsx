import { ReactNode } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { headers } from "next/headers"
import { buildAdminPath, ADMIN_PANEL_PATH } from "@/lib/admin-config"

export const metadata = {
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const headersList = await headers()
  const pathname = headersList.get("x-pathname") || ""

  const adminLoginPath = buildAdminPath("/login")
  const adminBase = `/${ADMIN_PANEL_PATH}`

  // Login sayfasında sadece children döndür — sidebar ve auth check yok
  // (Middleware zaten login'e yönlendiriyor, bu sadece guard)
  if (pathname === adminLoginPath || pathname.startsWith(adminLoginPath)) {
    return (
      <>
        <meta name="robots" content="noindex, nofollow" />
        {children}
      </>
    )
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // İkinci katman güvenlik — middleware bypass edilirse de çalışır
  if (!user) {
    redirect(adminLoginPath)
  }

  // Rol kontrolü — admin değilse 404'e yönlendir
  const userRole = user.app_metadata?.role ?? user.user_metadata?.role
  if (userRole !== 'admin' && userRole !== 'super_admin') {
    redirect('/404')
  }

  const userEmail = user.email ?? "admin"

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* noindex meta tag */}
      <meta name="robots" content="noindex, nofollow" />

      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 md:ml-72 flex flex-col min-h-screen">
        <header className="h-16 border-b bg-background flex items-center px-6 justify-between shadow-sm sticky top-0 z-40">
          <h1 className="font-extrabold text-lg max-md:hidden tracking-tight text-foreground">
            Sistem Yönetimi{" "}
            <span className="text-muted-foreground font-medium ml-2 text-sm">
              / {userEmail.split('@')[0]}
            </span>
          </h1>
          {/* Mobile logo */}
          <Link
            href={adminBase}
            className="font-bold text-xl text-primary tracking-tight md:hidden flex items-center gap-2"
          >
            ÇÖZSEN LMS
          </Link>
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 border border-primary/20 cursor-pointer hover:bg-primary/20 transition-colors">
            {userEmail[0].toUpperCase()}
          </div>
        </header>
        <div className="p-6 md:p-8 flex-1 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  )
}
