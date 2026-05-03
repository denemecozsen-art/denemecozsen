"use client"

import Link from "next/link"
import {
  BookOpen,
  Award,
  BarChart3,
  MessageSquare,
  Settings,
  LogOut,
  UserCircle,
  Plus,
  Users,
  GraduationCap,
  CreditCard,
  Bell,
  ClipboardList,
  TrendingUp,
  HelpCircle,
  ShoppingCart,
  CalendarCheck,
  Sparkles,
} from "lucide-react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface MenuItem {
  label: string
  href: string
  icon: any
  gradient: string
  shadow: string
}

interface ProfileGridDashboardProps {
  role: 'student' | 'parent' | string
}

export function ProfileGridDashboard({ role }: ProfileGridDashboardProps) {
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const studentMenu: MenuItem[] = [
    { label: "Sınavlarım", href: "/profile/ogrenci/sinavlarim", icon: BookOpen, gradient: "from-sky-400 to-blue-500", shadow: "shadow-blue-200" },
    { label: "Sonuçlar", href: "/profile/ogrenci/sonuclarim", icon: Award, gradient: "from-violet-400 to-purple-500", shadow: "shadow-violet-200" },
    { label: "Analizler", href: "/profile/ogrenci/analizlerim", icon: BarChart3, gradient: "from-emerald-400 to-teal-500", shadow: "shadow-emerald-200" },
    { label: "Gelişim", href: "/profile/ogrenci", icon: TrendingUp, gradient: "from-amber-400 to-orange-500", shadow: "shadow-amber-200" },
    { label: "Profilim", href: "/profile/ogrenci/profil", icon: UserCircle, gradient: "from-indigo-400 to-violet-500", shadow: "shadow-indigo-200" },
    { label: "Bildirimler", href: "#", icon: Bell, gradient: "from-rose-400 to-pink-500", shadow: "shadow-rose-200" },
    { label: "Takvim", href: "#", icon: CalendarCheck, gradient: "from-cyan-400 to-sky-500", shadow: "shadow-cyan-200" },
    { label: "Yardım", href: "/sss", icon: HelpCircle, gradient: "from-slate-400 to-gray-500", shadow: "shadow-slate-200" },
  ]

  const parentMenu: MenuItem[] = [
    { label: "Öğrenciler", href: "/profile/veli/ogrenciler", icon: Users, gradient: "from-sky-400 to-blue-500", shadow: "shadow-blue-200" },
    { label: "Ekle", href: "/profile/veli/ogrenci-ekle", icon: Plus, gradient: "from-emerald-400 to-green-500", shadow: "shadow-emerald-200" },
    { label: "Gelişim", href: "/profile/veli/gelisim", icon: GraduationCap, gradient: "from-violet-400 to-purple-500", shadow: "shadow-violet-200" },
    { label: "Ödemeler", href: "/profile/veli/odemeler", icon: CreditCard, gradient: "from-amber-400 to-orange-500", shadow: "shadow-amber-200" },
    { label: "Mesajlar", href: "/profile/veli/mesajlar", icon: MessageSquare, gradient: "from-rose-400 to-pink-500", shadow: "shadow-rose-200" },
    { label: "Ayarlar", href: "/profile/veli/ayarlar", icon: Settings, gradient: "from-slate-400 to-gray-500", shadow: "shadow-slate-200" },
    { label: "Siparişler", href: "/profile/veli/siparislerim", icon: ClipboardList, gradient: "from-cyan-400 to-sky-500", shadow: "shadow-cyan-200" },
    { label: "Sepet", href: "/sepet", icon: ShoppingCart, gradient: "from-orange-400 to-red-500", shadow: "shadow-orange-200" },
  ]

  const menu = role === 'parent' ? parentMenu : studentMenu

  async function handleLogout() {
    setLoggingOut(true)
    const form = document.createElement('form')
    form.method = 'post'
    form.action = '/auth/logout'
    document.body.appendChild(form)
    form.submit()
  }

  return (
    <div className="space-y-5">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 rounded-3xl p-5 text-white shadow-lg shadow-violet-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full blur-xl -ml-5 -mb-5" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="font-black text-lg">Hoş Geldin!</p>
            <p className="text-white/80 text-xs font-medium">
              {role === 'parent' ? 'Öğrencilerinin gelişimini takip et.' : 'Sınav yolculuğuna devam et.'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        {role === 'parent' ? (
          <>
            <div className="bg-white rounded-2xl p-3.5 text-center border border-border/60 shadow-sm shadow-blue-100">
              <p className="text-xl font-black bg-gradient-to-br from-blue-500 to-indigo-600 bg-clip-text text-transparent">2</p>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mt-1">Öğrenci</p>
            </div>
            <div className="bg-white rounded-2xl p-3.5 text-center border border-border/60 shadow-sm shadow-violet-100">
              <p className="text-xl font-black bg-gradient-to-br from-violet-500 to-purple-600 bg-clip-text text-transparent">5</p>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mt-1">Deneme</p>
            </div>
            <div className="bg-white rounded-2xl p-3.5 text-center border border-border/60 shadow-sm shadow-emerald-100">
              <p className="text-xl font-black bg-gradient-to-br from-emerald-500 to-teal-600 bg-clip-text text-transparent">%78</p>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mt-1">Başarı</p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white rounded-2xl p-3.5 text-center border border-border/60 shadow-sm shadow-blue-100">
              <p className="text-xl font-black bg-gradient-to-br from-blue-500 to-indigo-600 bg-clip-text text-transparent">12</p>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mt-1">Sınav</p>
            </div>
            <div className="bg-white rounded-2xl p-3.5 text-center border border-border/60 shadow-sm shadow-violet-100">
              <p className="text-xl font-black bg-gradient-to-br from-violet-500 to-purple-600 bg-clip-text text-transparent">#452</p>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mt-1">Sıralama</p>
            </div>
            <div className="bg-white rounded-2xl p-3.5 text-center border border-border/60 shadow-sm shadow-emerald-100">
              <p className="text-xl font-black bg-gradient-to-br from-emerald-500 to-teal-600 bg-clip-text text-transparent">%84</p>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mt-1">Net</p>
            </div>
          </>
        )}
      </div>

      {/* Menu Grid - Modern */}
      <div>
        <p className="text-[11px] font-black text-muted-foreground/70 uppercase tracking-widest mb-3 px-1">
          {role === 'parent' ? 'Veli Menüsü' : 'Öğrenci Menüsü'}
        </p>
        <div className="grid grid-cols-4 gap-3">
          {menu.map((item, i) => {
            const Icon = item.icon
            return (
              <Link
                key={i}
                href={item.href}
                className="flex flex-col items-center gap-2 p-2.5 rounded-2xl bg-white border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all active:scale-90 duration-200"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} ${item.shadow} shadow-lg flex items-center justify-center text-white`}>
                  <Icon className="w-6 h-6" strokeWidth={2.2} />
                </div>
                <span className="text-[10px] font-bold text-center leading-tight text-foreground/80">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={() => setLogoutOpen(true)}
        className="w-full flex items-center justify-center gap-2 bg-white border border-border/60 text-destructive font-bold py-3.5 rounded-2xl hover:bg-destructive/5 hover:border-destructive/30 transition-all active:scale-[0.98] shadow-sm"
      >
        <LogOut className="w-4 h-4" />
        Çıkış Yap
      </button>

      {/* Logout Confirmation */}
      <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader className="space-y-3">
            <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-rose-100 rounded-2xl flex items-center justify-center mx-auto">
              <LogOut className="w-7 h-7 text-destructive" />
            </div>
            <DialogTitle className="text-center text-xl font-black">
              Çıkış Yapmak İstiyor musunuz?
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground font-medium">
              Oturumunuzu sonlandırmak üzeresiniz. Tekrar giriş yapmanız gerekecek.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setLogoutOpen(false)}
              className="w-full sm:w-auto rounded-xl font-bold h-12"
            >
              Vazgeç
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full sm:w-auto rounded-xl font-bold h-12"
            >
              {loggingOut ? "Çıkış Yapılıyor..." : "Evet, Çıkış Yap"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
