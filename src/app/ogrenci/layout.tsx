import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { GraduationCap, LogOut, LayoutDashboard, ClipboardList, Award, BarChart3, MessageSquare, Bell, UserCircle, ArrowLeft, Home, Search, BookOpen, User } from 'lucide-react'
import Link from 'next/link'

export default async function OgrenciLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { session }, error } = await supabase.auth.getSession()

  if (error || !session) {
    redirect('/giris')
  }

  const userRole = session.user.user_metadata?.role

  // Admin kullanıcıları admin paneline yönlendir
  if (userRole === 'admin' || userRole === 'super_admin') {
    const { ADMIN_PANEL_PATH } = await import('@/lib/admin-config')
    redirect(`/${ADMIN_PANEL_PATH}`)
  }

  if (userRole !== 'student' && userRole !== 'parent') {
    redirect('/')
  }

  const navItems = [
    { href: '/profile/ogrenci', label: 'Ana Panel', icon: Home, active: true },
    { href: '/profile/ogrenci/sinavlarim', label: 'Sınavlar', icon: ClipboardList, active: false },
    { href: '/profile/ogrenci/sonuclarim', label: 'Raporlar', icon: Award, active: false },
    { href: '/profile/ogrenci/analizlerim', label: 'Analizler', icon: BarChart3, active: false },
  ]

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] bg-muted/20 md:bg-background overflow-hidden relative font-sans">
      
      {/* Background Decor (Desktop) */}
      <div className="hidden md:block absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />

      {/* MOBILE HEADER (App-like) */}
      <header className="md:hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 px-6 pt-12 pb-6 text-white rounded-b-[2rem] shadow-xl shrink-0 relative z-20 overflow-hidden">
         <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
         <div className="relative z-10 flex justify-between items-center">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md shadow-inner border border-white/30">
                  <GraduationCap className="w-6 h-6 text-white" />
               </div>
               <div>
                  <h1 className="font-black text-xl leading-none">Öğrenci</h1>
                  <span className="text-[10px] font-black tracking-widest text-white/80 uppercase">Bilgi Sistemi</span>
               </div>
            </div>
            
            <div className="flex gap-2">
               <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md shadow-inner">
                  <Bell className="w-5 h-5 text-white" />
               </button>
               {userRole === 'parent' && (
                  <Link href="/profile/veli" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md shadow-inner">
                     <ArrowLeft className="w-5 h-5 text-white" />
                  </Link>
               )}
            </div>
         </div>
      </header>

      {/* DESKTOP SIDEBAR (Drawer) */}
      <aside className="w-20 lg:w-[280px] bg-card border-r border-border shrink-0 flex flex-col items-center lg:items-stretch py-6 px-2 lg:px-6 hidden md:flex relative z-10 shadow-[0_0_40px_rgba(0,0,0,0.02)]">
         
         <div className="mb-10 flex items-center justify-center lg:justify-start lg:px-2 gap-4">
            <div className="w-12 h-12 rounded-[1rem] bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
               <GraduationCap className="w-6 h-6" />
            </div>
            <div className="hidden lg:block">
               <h1 className="font-black text-xl leading-tight uppercase tracking-wider text-foreground">Öğrenci</h1>
               <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Bilgi Sistemi</p>
            </div>
         </div>

         <nav className="flex-1 space-y-2">
            {navItems.map((item, i) => (
              <Link key={i} href={item.href} className={`flex items-center gap-3 w-full p-3.5 lg:px-5 rounded-[1rem] font-bold transition-all ${item.active ? 'bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                 <item.icon className={`w-5 h-5 shrink-0 ${item.active ? 'text-indigo-600' : ''}`} />
                 <span className="hidden lg:block text-sm">{item.label}</span>
              </Link>
            ))}
            <Link href="#" className="flex items-center gap-3 w-full p-3.5 lg:px-5 rounded-[1rem] text-muted-foreground hover:bg-muted hover:text-foreground font-bold transition-all">
               <MessageSquare className="w-5 h-5 shrink-0" />
               <span className="hidden lg:block text-sm">Rehberlik Görüşleri</span>
            </Link>
         </nav>

         <div className="mt-auto space-y-3">
            {userRole === 'parent' ? (
               <Link href="/profile/veli" className="flex items-center gap-3 w-full p-3.5 lg:px-5 rounded-[1rem] text-indigo-500 bg-indigo-500/10 hover:bg-indigo-500/20 font-bold transition-all border border-indigo-500/20 group">
                  <ArrowLeft className="w-5 h-5 shrink-0 group-hover:-translate-x-1 transition-transform" />
                  <span className="hidden lg:block text-sm leading-tight text-left">Veli Paneline<br/>Geri Dön</span>
               </Link>
            ) : (
               <>
                 <Link href="/profile/ogrenci/profil" className="flex items-center gap-3 w-full p-3.5 lg:px-5 rounded-[1rem] text-muted-foreground hover:bg-muted font-bold transition-all border border-transparent hover:border-border">
                    <UserCircle className="w-5 h-5 shrink-0" />
                    <span className="hidden lg:block text-sm">Hesabım</span>
                 </Link>
                 <form action="/auth/logout" method="post">
                    <button type="submit" className="flex items-center gap-3 w-full p-3.5 lg:px-5 rounded-[1rem] text-destructive hover:bg-destructive/10 font-bold transition-all border border-transparent hover:border-destructive/20">
                       <LogOut className="w-5 h-5 shrink-0" />
                       <span className="hidden lg:block text-sm">Oturumu Kapat</span>
                    </button>
                 </form>
               </>
            )}
         </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto w-full relative z-10 pb-28 md:pb-0 scroll-smooth">
        <div className="p-4 md:p-8 lg:p-12 w-full max-w-7xl mx-auto min-h-full">
            {children}
        </div>
      </main>

      {/* MOBILE BOTTOM NAV (App-like fixed) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-background border-t border-border/50 rounded-t-[1.5rem] shadow-[0_-15px_40px_rgba(0,0,0,0.06)] z-50 px-6 py-2.5 flex justify-between items-end pb-safe">
         <Link href="/profile/ogrenci" className="flex flex-col items-center gap-1.5 p-2 text-indigo-600">
            <div className="w-10 h-10 bg-indigo-500/10 rounded-full flex items-center justify-center">
               <Home className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black tracking-wider">Ana Sayfa</span>
         </Link>
         
         <Link href="/profile/ogrenci/sinavlarim" className="flex flex-col items-center gap-1.5 p-2 text-muted-foreground hover:text-foreground">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
               <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold tracking-wider">Sınavlar</span>
         </Link>

         {/* Center Floating Action Button */}
         <div className="relative -top-6">
            <Link href="/profile/ogrenci/analizlerim" className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 border-4 border-background focus:scale-95 transition-transform">
               <BarChart3 className="w-6 h-6" />
            </Link>
         </div>

         <Link href="/profile/ogrenci/sonuclarim" className="flex flex-col items-center gap-1.5 p-2 text-muted-foreground hover:text-foreground">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
               <Award className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold tracking-wider">Karneler</span>
         </Link>
         
         <Link href="/profile/ogrenci/profil" className="flex flex-col items-center gap-1.5 p-2 text-muted-foreground hover:text-foreground">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
               <User className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold tracking-wider">Profil</span>
         </Link>
      </nav>
      
    </div>
  )
}
