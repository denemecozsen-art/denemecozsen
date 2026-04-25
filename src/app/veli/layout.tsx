import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { VeliSidebar } from '@/components/veli/veli-sidebar'
import { Home, Users, GraduationCap, Settings, Bell, ChevronLeft, CreditCard } from 'lucide-react'
import Link from 'next/link'

export default async function VeliLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { session }, error } = await supabase.auth.getSession()

  // Oturum yoksa login'e gönder
  if (error || !session) {
    redirect('/giris')
  }

  // Kullanıcı veli mi doğrula
  const userRole = session.user.user_metadata?.role
  if (userRole !== 'parent') {
    // Veli dışındaki herkesi kendi sayfalarına (veya anasayfaya) geri çevir
    redirect(userRole === 'student' ? '/profile/ogrenci' : '/')
  }

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] bg-muted/20 md:bg-background overflow-hidden relative font-sans">
      {/* MOBILE HEADER (App-like) */}
      <header className="md:hidden bg-gradient-to-br from-pink-500 via-fuchsia-600 to-purple-600 px-6 pt-12 pb-6 text-white rounded-b-[2rem] shadow-xl shrink-0 relative z-20 overflow-hidden">
         <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
         <div className="relative z-10 flex justify-between items-center">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md shadow-inner border border-white/30">
                  <Users className="w-6 h-6 text-white" />
               </div>
               <div>
                  <h1 className="font-black text-xl leading-none">Veli Portalı</h1>
                  <span className="text-[10px] font-black tracking-widest text-white/80 uppercase">Çözsen Bilgi Sistemi</span>
               </div>
            </div>
            
            <div className="flex gap-2">
               <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md shadow-inner relative">
                  <Bell className="w-5 h-5 text-white" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-rose-400 rounded-full"></span>
               </button>
               <Link href="/" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md shadow-inner">
                  <ChevronLeft className="w-5 h-5 text-white" />
               </Link>
            </div>
         </div>
      </header>

      {/* Sidebar (Sadece Parent / Velilere özel - Masaüstü) */}
      <VeliSidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto w-full bg-muted/20 pb-28 md:pb-0 scroll-smooth relative z-10">
        <div className="p-4 md:p-8 lg:p-10 w-full max-w-7xl mx-auto min-h-full">
            {children}
        </div>
      </main>

      {/* MOBILE BOTTOM NAV (App-like fixed) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-background border-t border-border/50 rounded-t-[1.5rem] shadow-[0_-15px_40px_rgba(0,0,0,0.06)] z-50 px-6 py-2.5 flex justify-between items-end pb-safe">
         <Link href="/profile/veli" className="flex flex-col items-center gap-1.5 p-2 text-pink-600">
            <div className="w-10 h-10 bg-pink-500/10 rounded-full flex items-center justify-center">
               <Home className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black tracking-wider">Ana Sayfa</span>
         </Link>
         
         <Link href="/profile/veli/ogrenciler" className="flex flex-col items-center gap-1.5 p-2 text-muted-foreground hover:text-foreground">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
               <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold tracking-wider">Öğrenciler</span>
         </Link>

         {/* Center Floating Action Button */}
         <div className="relative -top-6">
            <Link href="/profile/veli/gelisim" className="w-16 h-16 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-pink-500/30 border-4 border-background focus:scale-95 transition-transform">
               <GraduationCap className="w-6 h-6" />
            </Link>
         </div>

         <Link href="/profile/veli/odemeler" className="flex flex-col items-center gap-1.5 p-2 text-muted-foreground hover:text-foreground">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
               <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold tracking-wider">Ödemeler</span>
         </Link>
         
         <Link href="/profile/veli/ayarlar" className="flex flex-col items-center gap-1.5 p-2 text-muted-foreground hover:text-foreground">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
               <Settings className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold tracking-wider">Ayarlar</span>
         </Link>
      </nav>

    </div>
  )
}
