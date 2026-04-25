"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Settings, 
  LogOut, 
  Bell,
  CreditCard,
  MessageSquare,
  UserPlus
} from "lucide-react"

const menuItems = [
  { icon: LayoutDashboard, label: "Ana Panel", href: "/profile/veli" },
  { icon: Users, label: "Öğrencilerim", href: "/profile/veli/ogrenciler" },
  { icon: UserPlus, label: "Öğrenci Ekle", href: "/profile/veli/ogrenci-ekle" },
  { icon: GraduationCap, label: "Akademik Gelişim", href: "/profile/veli/gelisim" },
  { icon: CreditCard, label: "Ödemeler & Paketler", href: "/profile/veli/odemeler" },
  { icon: MessageSquare, label: "Danışman Mesajları", href: "/profile/veli/mesajlar" },
  { icon: Settings, label: "Ayarlar", href: "/profile/veli/ayarlar" },
]

export function VeliSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-72 bg-card border-r border-border h-screen flex flex-col p-6 hidden lg:flex sticky top-0">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-lg shadow-pink-500/20">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-black text-foreground leading-none">Veli Portalı</h1>
          <p className="text-xs font-semibold text-muted-foreground mt-1">Çözsen Bilgi Sistemi</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/veli')
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all cursor-pointer font-bold ${
                  isActive
                    ? "bg-pink-500/10 text-pink-600 dark:text-pink-400"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto space-y-4 pt-6 border-t border-border">
        <div className="bg-muted/30 p-4 rounded-2xl border border-border">
          <div className="flex justify-between items-center mb-2">
             <span className="text-xs font-black uppercase text-muted-foreground">Aktif Öğrenci Sayısı</span>
          </div>
          <div className="flex items-baseline gap-2">
             <span className="text-2xl font-black text-foreground">0</span>
             <span className="text-xs font-semibold text-muted-foreground">Kayıtlı</span>
          </div>
        </div>
        
        <form action="/auth/logout" method="post">
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-destructive hover:bg-destructive/10 transition-colors font-bold"
          >
            <LogOut className="w-5 h-5" />
            <span>Çıkış Yap</span>
          </button>
        </form>
      </div>
    </div>
  )
}
