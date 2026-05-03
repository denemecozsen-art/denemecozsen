"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  MonitorPlay,
  LibraryBig,
  Newspaper,
  Settings,
  Layers,
  Users,
  ClipboardList,
  Package,
  Bell,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { buildAdminPath } from "@/lib/admin-config"
import { logout } from "@/app/auth/logout/actions"

type NavItem = {
  title: string
  href?: string
  icon: any
}

const getFlatNav = (): NavItem[] => [
  { title: "Dashboard", href: buildAdminPath(), icon: LayoutDashboard },
  { title: "Kayıt Dashboard", href: buildAdminPath("/kayitlar/dashboard"), icon: Users },
  { title: "Öğrenciler", href: buildAdminPath("/kayitlar/ogrenciler"), icon: Users },
  { title: "Veliler", href: buildAdminPath("/kayitlar/veliler"), icon: Users },
  { title: "Tüm Siparişler", href: buildAdminPath("/siparisler"), icon: Package },
  { title: "Deneme Paketleri", href: buildAdminPath("/paketler"), icon: Package },
  { title: "Kendin Seç Sayfası", href: buildAdminPath("/sayfalar/kendin-sec"), icon: MonitorPlay },
  { title: "Erken Kayıt", href: buildAdminPath("/sayfalar/erken-kayit"), icon: MonitorPlay },
  { title: "Sınav Yönetimi", href: buildAdminPath("/sinav-yonetimi/denemeler"), icon: ClipboardList },
  { title: "Kategoriler", href: buildAdminPath("/kategori-yonetimi"), icon: LibraryBig },
  { title: "Blog Yönetimi", href: buildAdminPath("/blog"), icon: Newspaper },
  { title: "Hero Slider", href: buildAdminPath("/ana-sayfa-yonetimi/slider"), icon: Newspaper },
  { title: "Instagram", href: buildAdminPath("/ana-sayfa-yonetimi/instagram"), icon: Newspaper },
  { title: "Bildirim Yönetimi", href: buildAdminPath("/bildirimler"), icon: Bell },
  { title: "SEO Ayarları", href: buildAdminPath("/seo-ayarlari"), icon: Settings },
  { title: "Sistem Ayarları", href: buildAdminPath("/ayarlar"), icon: Settings },
]

export function AdminMobileDrawer() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const nav = getFlatNav()

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-10 h-10 rounded-xl border border-border bg-background flex items-center justify-center hover:bg-muted transition md:hidden"
        aria-label="Menüyü Aç"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden animate-in fade-in duration-200"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-[280px] bg-card border-r z-50 md:hidden flex flex-col transition-transform duration-300 ease-out ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
          <Link
            href={buildAdminPath()}
            onClick={() => setOpen(false)}
            className="font-black text-xl text-primary tracking-tight flex items-center gap-2"
          >
            <Layers className="w-7 h-7 fill-primary/20" />
            ÇÖZSEN LMS
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {nav.map((item, i) => {
            const isActive = pathname === item.href?.replace('/uraz', '/admin')
            const Icon = item.icon
            return (
              <Link
                key={i}
                href={item.href || '#'}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${isActive
                    ? 'bg-primary text-primary-foreground shadow-sm pointer-events-none'
                    : 'text-muted-foreground hover:bg-muted/80'
                  }`}
              >
                <Icon className="w-5 h-5 opacity-80" />
                <span>{item.title}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t bg-muted/10">
          <form action={logout}>
            <Button type="submit" variant="ghost" className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive font-bold">
              <LogOut className="w-5 h-5 mr-3" />
              Oturumu Kapat
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
