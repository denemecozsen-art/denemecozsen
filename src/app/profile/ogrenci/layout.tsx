'use client'

import { usePathname } from 'next/navigation'
import { GraduationCap, LogOut, ClipboardList, Award, BarChart3, MessageSquare, Bell, UserCircle, ArrowLeft, Home, BookOpen, ChevronRight, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const navItems = [
  { href: '/profile/ogrenci', label: 'Ana Panel', icon: Home, color: 'text-indigo-600', bg: 'bg-indigo-50', exact: true },
  { href: '/profile/ogrenci/sinavlarim', label: 'Sınavlarım', icon: ClipboardList, color: 'text-violet-600', bg: 'bg-violet-50', exact: false },
  { href: '/profile/ogrenci/sonuclarim', label: 'Karnelerim', icon: Award, color: 'text-amber-600', bg: 'bg-amber-50', exact: false },
  { href: '/profile/ogrenci/analizlerim', label: 'Analizler', icon: BarChart3, color: 'text-emerald-600', bg: 'bg-emerald-50', exact: false },
  { href: '/profile/ogrenci/mesajlar', label: 'Mesajlar', icon: MessageSquare, color: 'text-sky-600', bg: 'bg-sky-50', exact: false },
]

export default function OgrenciLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (item: typeof navItems[0]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)

  return (
    <div className="flex h-[100dvh] bg-[#F4F6FB] overflow-hidden font-sans">

      {/* ── MOBILE OVERLAY ──────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/25 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── SIDEBAR ─────────────────────────────────────── */}
      {/*  • Mobile: slide-over drawer (z-50)
           • Tablet (md): narrow icon rail (72px), always visible
           • Desktop (lg): wide sidebar (260px)               */}
      <aside
        className={`
          fixed md:relative top-0 left-0 h-full z-50 md:z-auto
          flex flex-col
          bg-white border-r border-slate-100 shadow-[2px_0_24px_rgba(0,0,0,0.04)]
          transition-transform duration-300 ease-in-out
          w-[260px] md:w-[72px] lg:w-[260px]
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Logo / Brand */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-100 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200 shrink-0">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div className="lg:block hidden overflow-hidden">
            <span className="font-black text-sm text-slate-800 leading-tight block">Öğrenci Paneli</span>
            <span className="text-[10px] font-semibold text-indigo-500 tracking-widest uppercase">Çözsen ÖBS</span>
          </div>
          {/* Mobile close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto md:hidden w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150
                  ${active
                    ? `${item.bg} ${item.color}`
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
                `}
              >
                <item.icon className={`w-[18px] h-[18px] shrink-0 ${active ? item.color : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span className="lg:block hidden truncate">{item.label}</span>
                {active && <span className="lg:block hidden ml-auto w-1.5 h-1.5 rounded-full bg-current opacity-60" />}
              </Link>
            )
          })}
        </nav>

        {/* Bottom actions */}
        <div className="border-t border-slate-100 p-3 space-y-0.5 shrink-0">
          <Link
            href="/profile/ogrenci/hesabim"
            onClick={() => setMobileOpen(false)}
            className="group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl font-semibold text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all"
          >
            <UserCircle className="w-[18px] h-[18px] shrink-0 text-slate-400 group-hover:text-slate-600" />
            <span className="lg:block hidden">Hesabım</span>
          </Link>
          <form action="/auth/logout" method="post">
            <button type="submit" className="group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl font-semibold text-sm text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all">
              <LogOut className="w-[18px] h-[18px] shrink-0 text-slate-400 group-hover:text-red-500" />
              <span className="lg:block hidden">Çıkış Yap</span>
            </button>
          </form>
        </div>
      </aside>

      {/* ── MAIN ────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-6 shrink-0 shadow-[0_1px_4px_rgba(0,0,0,0.03)] z-30">
          <div className="flex items-center gap-3">
            {/* Hamburger (mobile only) */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-600" />
            </button>

            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center gap-1.5 text-sm text-slate-400">
              <span className="font-semibold text-slate-600">ÖBS</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-medium text-slate-800">
                {navItems.find(n => isActive(n))?.label ?? 'Ana Panel'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <button className="relative w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-colors">
              <Bell className="w-4.5 h-4.5 text-slate-500" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-white" />
            </button>
            {/* Avatar */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-indigo-100">
              Ö
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
