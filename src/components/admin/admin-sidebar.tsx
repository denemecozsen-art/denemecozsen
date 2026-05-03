"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import {
  LayoutDashboard,
  ChevronDown,
  ChevronRight,
  LogOut,
  MonitorPlay,
  LibraryBig,
  Newspaper,
  Settings,
  Layers,
  Users,
  Home,
  ClipboardList,
  Package,
  Bell
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { buildAdminPath, ADMIN_PANEL_PATH } from "@/lib/admin-config"
import { logout } from "@/app/auth/logout/actions"

type NavItem = {
  title: string
  href?: string
  icon: any
  subItems?: { title: string; href: string }[]
}

// Tüm path'ler config'den türetilir — hardcoded /admin YOK
const getAdminNav = (): NavItem[] => [
  { title: "Dashboard", href: buildAdminPath(), icon: LayoutDashboard },

  {
    title: "Kayıt Yönetimi (ÖBS)",
    icon: Users,
    subItems: [
      { title: "Kayıt Dashboard", href: buildAdminPath("/kayitlar/dashboard") },
      { title: "Öğrenciler", href: buildAdminPath("/kayitlar/ogrenciler") },
      { title: "Veliler", href: buildAdminPath("/kayitlar/veliler") },
      { title: "Sınıflar", href: buildAdminPath("/kayitlar/siniflar") },
    ],
  },

  {
    title: "Sipariş & Kargo Yönetimi",
    icon: Package,
    subItems: [
      { title: "Tüm Siparişler", href: buildAdminPath("/siparisler") },
      { title: "Ödeme Bekleyenler", href: buildAdminPath("/siparisler?status=pending") },
      { title: "Onaylı Siparişler", href: buildAdminPath("/siparisler?status=confirmed") },
      { title: "Kargodakiler", href: buildAdminPath("/siparisler?status=shipped") },
      { title: "İptal & İadeler", href: buildAdminPath("/siparisler?status=cancelled") },
    ],
  },

  {
    title: "Web Sistem Yönetimi",
    icon: MonitorPlay,
    subItems: [
      { title: "Sınıfını Seç Paketleri (Yıllık)", href: buildAdminPath("/paketler?type=yillik") },
      { title: "Tüm Deneme Paketleri", href: buildAdminPath("/paketler") },
      { title: "Kendin Seç Sayfası", href: buildAdminPath("/sayfalar/kendin-sec") },
      { title: "Erken Kayıt Kampanyası", href: buildAdminPath("/sayfalar/erken-kayit") },
      { title: "Nasıl Çalışır Eğitimleri", href: buildAdminPath("/sayfalar/nasil-calisir") },
      { title: "Hakkımızda (Biz Kimiz)", href: buildAdminPath("/sayfalar/hakkimizda") },
    ],
  },

  {
    title: "Sınav Yönetimi",
    icon: ClipboardList,
    subItems: [
      { title: "Denemeler / Sınavlar", href: buildAdminPath("/sinav-yonetimi/denemeler") },
      { title: "Parametreler", href: buildAdminPath("/sinav-yonetimi/parametreler") },
      { title: "Soru Bankası (Yakında)", href: buildAdminPath("/sinav-yonetimi/soru-bankasi") },
    ],
  },

  {
    title: "Müfredat & Kategoriler",
    icon: LibraryBig,
    subItems: [
      { title: "Kategoriler (Sınıflar)", href: buildAdminPath("/kategori-yonetimi") },
      { title: "Deneme Setleri Modülleri", href: buildAdminPath("/denemeler") },
    ],
  },

  {
    title: "İçerik & Pazarlama",
    icon: Newspaper,
    subItems: [
      { title: "Makale/Blog Yönetimi", href: buildAdminPath("/blog") },
      { title: "Hero Slider", href: buildAdminPath("/ana-sayfa-yonetimi/slider") },
      { title: "Instagram Gömme", href: buildAdminPath("/ana-sayfa-yonetimi/instagram") },
      { title: "Medya Gelişmiş Kütüphane", href: buildAdminPath("/medya") },
      { title: "Global SEO Metrikleri", href: buildAdminPath("/seo-ayarlari") },
    ],
  },

  { title: "Bildirim Yönetimi", href: buildAdminPath("/bildirimler"), icon: Bell },

  { title: "Genel Sistem Ayarları", href: buildAdminPath("/ayarlar"), icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const adminNav = useMemo(() => getAdminNav(), [])
  const adminBase = `/${ADMIN_PANEL_PATH}`

  // Build current full URL for comparison
  const currentUrl = pathname + (searchParams.toString() ? '?' + searchParams.toString() : '')

  // Convert external hrefs to internal paths for comparison (middleware rewrites /uraz to /admin)
  const toInternalPath = (href: string) => {
    return href.replace(adminBase, '/admin') || '/admin'
  }

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
    const defaultOpen: Record<string, boolean> = {}
    adminNav.forEach(item => {
      // Open menu if current URL matches any sub-item (convert to internal path for comparison)
      if (item.subItems?.some(sub => toInternalPath(sub.href) === currentUrl)) {
        defaultOpen[item.title] = true
      }
    })
    return defaultOpen
  })

  const toggleMenu = (title: string) => {
    setOpenMenus(prev => ({ ...prev, [title]: !prev[title] }))
  }

  // Auto-open menu when URL changes
  useEffect(() => {
    const newOpenMenus: Record<string, boolean> = {}
    adminNav.forEach(item => {
      // Open menu if current URL matches any sub-item (convert to internal path for comparison)
      if (item.subItems?.some(sub => toInternalPath(sub.href) === currentUrl)) {
        newOpenMenus[item.title] = true
      }
    })
    setOpenMenus(newOpenMenus)
  }, [currentUrl, adminNav])

  return (
    <aside className="fixed max-md:hidden w-72 border-r bg-card h-full flex flex-col z-50 shadow-sm custom-scrollbar overflow-y-auto">
      <div className="p-6 border-b bg-muted/20 sticky top-0 z-10 backdrop-blur-md">
        <Link
          href={adminBase}
          className="font-black text-2xl text-primary tracking-tight flex items-center gap-2 hover:scale-[1.02] transition-transform"
        >
          <Layers className="w-8 h-8 fill-primary/20" />
          ÇÖZSEN LMS
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2 relative">
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-card to-transparent pointer-events-none" />
        {adminNav.map((item, i) => {
          const isActive = item.href ? toInternalPath(item.href) === currentUrl : false
          const isOpen = openMenus[item.title]

          if (item.subItems) {
            // Parent menu is active if current URL matches any sub-item (convert to internal path)
            const hasActiveChild = item.subItems.some(sub => toInternalPath(sub.href) === currentUrl)
            return (
              <div key={i} className="space-y-1">
                <button
                  onClick={() => toggleMenu(item.title)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold text-sm ${hasActiveChild ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:bg-muted/80'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 opacity-80" />
                    {item.title}
                  </div>
                  {isOpen ? <ChevronDown className="w-4 h-4 opacity-70" /> : <ChevronRight className="w-4 h-4 opacity-70" />}
                </button>

                {isOpen && (
                  <div className="pl-11 pr-2 py-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    {item.subItems.map((sub, j) => {
                      const isActive = currentUrl === toInternalPath(sub.href)

                      return (
                        <Link
                          key={j}
                          href={sub.href}
                          className={`block px-4 py-2 rounded-lg text-sm font-semibold transition-all group ${isActive
                              ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20 pointer-events-none'
                              : 'text-muted-foreground hover:bg-primary/10 hover:text-primary relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-0 before:bg-primary before:transition-all hover:before:h-4 before:rounded-r-md pl-5'
                            }`}
                        >
                          {sub.title}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          }

          return (
            <Link
              key={i}
              href={item.href!}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${isActive
                  ? 'bg-primary text-primary-foreground shadow-md pointer-events-none'
                  : 'text-muted-foreground hover:bg-muted/80'
                }`}
            >
              <item.icon className="w-5 h-5 opacity-80" />
              <span>{item.title}</span>
            </Link>
          )
        })}
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-card to-transparent pointer-events-none" />
      </nav>

      <div className="p-4 border-t bg-muted/10">
        <form action={logout}>
          <Button type="submit" variant="ghost" className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive font-bold">
            <LogOut className="w-5 h-5 mr-3" />
            Oturumu Kapat
          </Button>
        </form>
      </div>
    </aside>
  )
}
