import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import OgrenciDashboardPage from '@/app/ogrenci/page'
import VeliDashboardPage from '@/app/veli/page'
import { ProfileGridDashboard } from '@/components/profile/profile-grid-dashboard'
import { LogOut, Settings, Bell, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { logout } from '@/app/auth/logout/actions'

export const metadata = {
   title: 'Profilim | Çözsen Deneme',
   description: 'Öğrenci ve Veli Paneli',
}

interface ProfilPageProps {
   searchParams: Promise<{ studentId?: string }>;
}

export default async function ProfilPage(props: ProfilPageProps) {
   const supabase = await createClient()
   const { data: { session }, error } = await supabase.auth.getSession()

   if (error || !session) redirect('/giris')

   const role = session.user.user_metadata?.role

   return (
      <div className="bg-gray-50 md:bg-transparent min-h-screen pb-24 md:pb-0">

         {/* MOBILE APPLICATION HEADER - App-like layout for mobile/tablet */}
         <div className="md:hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 rounded-b-[2.5rem] pt-12 pb-24 px-6 text-white shadow-xl relative overflow-hidden">
            {/* Decorative App UI Elements */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl -ml-5 -mb-5"></div>

            <div className="relative z-10 flex justify-between items-center mb-8">
               <Link href="/" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md shadow-inner transition-transform active:scale-95">
                  <ChevronLeft className="w-6 h-6 text-white" />
               </Link>
               <h1 className="text-lg font-black tracking-widest uppercase">Profilim</h1>
               <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md relative shadow-inner">
                  <Bell className="w-5 h-5 text-white" />
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-pink-500 rounded-full border border-violet-600"></span>
               </div>
            </div>

            <div className="relative z-10 flex items-center gap-4">
               <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md p-1 border border-white/40 shadow-inner shrink-0">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}&backgroundColor=transparent`} alt="Avatar" className="w-full h-full rounded-full object-cover" />
               </div>
               <div>
                  <h2 className="text-2xl font-black text-white drop-shadow-md">{session.user.user_metadata?.first_name || 'Kullanıcı'} {session.user.user_metadata?.last_name || ''}</h2>
                  <div className="inline-flex items-center mt-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[10px] font-black tracking-wider text-white border border-white/10">
                     {role === 'parent' ? 'VELİ HESABI' : 'ÖĞRENCİ HESABI'}
                  </div>
               </div>
            </div>
         </div>

         {/* DESKTOP HEADER - Senior Level Web View */}
         <div className="hidden md:block container mx-auto px-4 max-w-7xl pt-10 pb-6">
            <div className="flex justify-between items-center bg-card rounded-[2rem] p-6 lg:p-8 shadow-sm border border-border/80 mb-8 overflow-hidden relative">
               <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-br from-indigo-500/5 to-fuchsia-500/5 rounded-bl-full pointer-events-none"></div>

               <div className="flex items-center gap-5 relative z-10">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white font-black text-3xl shadow-lg shadow-indigo-500/20">
                     {session.user.user_metadata?.first_name?.charAt(0) || 'U'}
                  </div>
                  <div>
                     <h1 className="text-3xl font-black text-foreground mb-1">{session.user.user_metadata?.first_name || 'Kullanıcı'} Profili</h1>
                     <p className="text-muted-foreground font-semibold text-sm">Eğitim yolculuğunuzu ve tüm akademik verilerinizi buradan yönetin.</p>
                  </div>
               </div>

               <div className="flex items-center gap-3 relative z-10">
                  <Link href="/ayar" className="bg-background border-2 border-border text-foreground font-bold px-6 py-3.5 rounded-xl hover:border-indigo-500/50 hover:bg-muted/50 transition-colors flex items-center shadow-sm">
                     <Settings className="w-4 h-4 mr-2" /> Ayarlar
                  </Link>
                  <form action={logout}>
                     <button type="submit" className="bg-destructive/10 text-destructive font-bold px-6 py-3.5 rounded-xl hover:bg-destructive hover:text-white transition-colors flex items-center shadow-sm">
                        <LogOut className="w-4 h-4 mr-2" /> Güvenli Çıkış
                     </button>
                  </form>
               </div>
            </div>
         </div>

         {/* PANELS CONTENT AREA */}
         <div className="px-3 sm:px-4 container mx-auto max-w-7xl -mt-10 md:mt-0 relative z-20">
            {/* Web'de transparan, mobilde kart görünümü */}
            <div className="bg-background md:bg-transparent rounded-[2rem] md:rounded-none p-4 sm:p-6 md:p-0 shadow-[0_8px_30px_rgb(0,0,0,0.06)] md:shadow-none border border-border/40 md:border-none min-h-[50vh]">

               {/* MOBILE/TABLET: Grid Dashboard */}
               <div className="md:hidden">
                  <ProfileGridDashboard role={role || 'student'} />
               </div>

               {/* DESKTOP: Existing panels */}
               <div className="hidden md:block">
                  {role === 'parent' ? (
                     <VeliDashboardPage />
                  ) : (
                     <OgrenciDashboardPage searchParams={props.searchParams} />
                  )}
               </div>

            </div>

            {/* Mobile Extra Controls */}
            <div className="md:hidden mt-6 pb-6">
               <div className="text-center mt-6">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Çözsen Deneme App Versiyon 1.0</span>
               </div>
            </div>
         </div>

      </div>
   )
}

