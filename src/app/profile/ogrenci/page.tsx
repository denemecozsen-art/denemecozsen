import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BookOpen, Target, CheckCircle2, Clock, Calendar, BarChart3, AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function OgrenciDashboardPage(
   props: { searchParams?: Promise<{ studentId?: string }> }
) {
  const supabase = await createClient()
  const searchParams = props.searchParams ? await props.searchParams : undefined;

  const { data: { session }, error } = await supabase.auth.getSession()
  if (error || !session) redirect('/giris')

  const userId = session.user.id
  const userRole = session.user.user_metadata?.role

  // Admin kullanıcıları admin paneline yönlendir
  if (userRole === 'admin' || userRole === 'super_admin') {
    const { ADMIN_PANEL_PATH } = await import('@/lib/admin-config')
    redirect(`/${ADMIN_PANEL_PATH}`)
  }

  let studentId = userRole === 'student' ? userId : searchParams?.studentId
  let studentData = null

  if (userRole === 'parent') {
    if (!studentId) {
      // Veli, öğrenci seçmeden buraya girdiyse geri gönder
      redirect('/profile/veli')
    }

    // Yetki kontrolü: Bu veli gerçekten bu öğrencinin velisi mi?
    const { data: relation } = await supabase
      .from('parent_students')
      .select('student_id')
      .eq('parent_id', userId)
      .eq('student_id', studentId)
      .single()

    if (!relation) {
      redirect('/profile/veli?error=unauthorized')
    }
  }

  // Öğrenci verisini çek
  const { data: student } = await supabase
    .from('students')
    .select('*')
    .eq('id', studentId)
    .single()

  if (!student) {
    return (
       <div className="flex flex-col items-center justify-center h-[60vh] text-center max-w-lg mx-auto">
          <AlertCircle className="w-16 h-16 text-destructive/50 mb-6" />
          <h2 className="text-2xl font-black mb-2">Öğrenci Kaydı Bulunamadı</h2>
          <p className="text-muted-foreground font-medium mb-8">Sistemsel bir hata oluştu veya öğrencinin verisi silinmiş.</p>
          {userRole === 'parent' && (
             <a href="/profile/veli" className="text-indigo-500 font-bold hover:underline">Veli Paneline Dön</a>
          )}
       </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Veli Görüntüleme Uyarı Bandı - MUHTEŞEM TASARIM */}
      {userRole === 'parent' && (
         <div className="bg-gradient-to-r from-pink-500/10 via-violet-500/10 to-transparent border border-pink-500/30 p-6 rounded-[2rem] flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-pink-500 to-violet-500" />
            <div className="flex items-center gap-4">
               <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-violet-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-pink-500/20">
                  <UserCircleIndicator />
               </div>
               <div>
                 <h4 className="text-lg font-black text-foreground mb-0.5 tracking-tight flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                    </span>
                    Veli Modu Aktif
                 </h4>
                 <p className="text-sm font-semibold text-muted-foreground leading-snug">
                    Şu anda <b>{student.first_name} {student.last_name}</b> adlı öğrenciniz olarak giriş yaptınız.<br className="hidden md:block" /> Sınavları başlatabilir, performansını doğrudan takip edebilirsiniz.
                 </p>
               </div>
            </div>
            
            <a href="/profile/veli" className="w-full md:w-auto shrink-0 bg-background border-2 border-border hover:border-violet-500/50 text-foreground font-black px-6 py-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all hover:shadow-lg shadow-sm group">
               <ArrowLeft className="w-4 h-4 text-violet-500 group-hover:-translate-x-1 transition-transform" />
               Veli Hesabına Dön
            </a>
         </div>
      )}

      {/* BAŞLIK */}
      <div className="flex flex-col gap-2">
         <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
            Merhaba, {student.first_name}! 👋
         </h1>
         <p className="text-muted-foreground font-bold text-sm md:text-base max-w-2xl leading-relaxed">
            Sınava hazırlık serüveninde harika gidiyorsun. Yeni gelen denemelerini aşağıdaki takvimden takip edebilir, sonuç kartlarından gelişimini inceleyebilirsin.
         </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
         {/* Çözülen Denemeler / İlerleme */}
         <div className="bg-card border border-border/60 rounded-[2rem] p-6 shadow-sm shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center text-center group cursor-default hover:border-indigo-500/30 transition-all">
            <div className="w-16 h-16 rounded-[1.2rem] bg-indigo-500/10 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
               <Target className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-black text-muted-foreground uppercase tracking-wider mb-2">Çözülen Sınav</h3>
            <span className="text-5xl font-black text-foreground mb-2">12</span>
            <span className="text-xs font-bold text-indigo-500 bg-indigo-500/10 px-3 py-1 rounded-lg">Hedef: %45 Tamamlandı</span>
         </div>

         {/* Ortalama Net (TYT) */}
         <div className="bg-card border border-border/60 rounded-[2rem] p-6 shadow-sm shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center text-center group cursor-default hover:border-fuchsia-500/30 transition-all">
            <div className="w-16 h-16 rounded-[1.2rem] bg-fuchsia-500/10 text-fuchsia-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
               <BarChart3 className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-black text-muted-foreground uppercase tracking-wider mb-2">Ortalama (TYT)</h3>
            <span className="text-5xl font-black text-foreground mb-2">68.5</span>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-lg">+3.5 Net Artış</span>
         </div>

         {/* Yaklaşan Sınav Bildirimi */}
         <div className="bg-gradient-to-br from-violet-600 to-indigo-700 border-none rounded-[2rem] p-8 shadow-xl shadow-indigo-600/20 md:col-span-2 text-white relative overflow-hidden flex flex-col justify-center">
            {/* Dekoratif Arka Plan İkonu */}
            <Clock className="w-48 h-48 absolute -right-8 -bottom-10 text-white/10 pointer-events-none" />
            
            <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-md w-max mb-4 backdrop-blur-sm border border-white/20">
               <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-wider">Cumartesi 10:15 / CANLI</span>
            </div>
            
            <h2 className="text-2xl font-black mb-2">Özdebir Türkiye Geneli (TYT-1)</h2>
            <p className="font-semibold text-white/80 max-w-sm leading-relaxed mb-6 text-sm">
               Sınav evrakların sana ulaştıysa Cumartesi günü yapılacak ortak değerlendirme sınavına katılmayı unutma.
            </p>
            
            <div className="flex gap-4">
               <Button className="font-bold bg-white text-indigo-700 hover:bg-neutral-100 rounded-xl px-6 h-12 shadow-lg">
                  Sınav Ekranına Git
               </Button>
               <Button variant="outline" className="font-bold border-white/30 text-white hover:bg-white/10 rounded-xl px-6 h-12">
                  Detaylar
               </Button>
            </div>
         </div>
      </div>

      {/* SİPARİŞLER / KARGO DURUMU */}
      <div>
         <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-black text-foreground">Abonelik & Paket Bilgisi</h2>
            <a href="#" className="text-indigo-500 font-bold text-sm hover:underline">Tümünü İncele</a>
         </div>
         
         <div className="bg-card border-2 border-border/50 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
               {/* Görsel Temsili */}
               <div className="w-40 h-40 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 rounded-[2rem] shrink-0 flex items-center justify-center p-6 border-4 border-background shadow-inner">
                  <BookOpen className="w-16 h-16 text-indigo-500" />
               </div>
               
               {/* İçerik */}
               <div className="flex-1 space-y-3 text-center md:text-left">
                  <span className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-lg">Ana Paket (Aktif)</span>
                  <h3 className="text-2xl font-black text-foreground">2026 Süper Set Kurumsal YKS Kampı</h3>
                  <p className="text-muted-foreground font-medium text-sm lg:text-base leading-relaxed max-w-2xl">
                     Sınav yılına kadar limit, özdebir ve töder dahil toplam 45 adet deneme paketi, cevap anahtarı, video çözümleri ve koçluk raporları sunulmaktadır. (Her ay sonu fiziksel teslimat).
                  </p>
                  
                  <div className="pt-4 flex flex-wrap gap-4 justify-center md:justify-start">
                     <div className="flex items-center gap-2 bg-muted/40 px-4 py-2 rounded-xl text-sm font-bold text-foreground">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 16 Ekim Kargosu Teslim Edildi
                     </div>
                     <div className="flex items-center gap-2 bg-muted/40 px-4 py-2 rounded-xl text-sm font-bold text-foreground">
                        <Calendar className="w-4 h-4 text-indigo-500" /> Bir sonraki kargo: 15 Kasım
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

    </div>
  )
}

function UserCircleIndicator() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 shrink-0">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )
}
