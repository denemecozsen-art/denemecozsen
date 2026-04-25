import { createClient } from '@/lib/supabase/server'
import { Plus, GraduationCap, Award, BrainCircuit, BarChart3, Clock, ChevronRight, PlayCircle, Users, AtSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function VeliDashboardPage() {
   const supabase = await createClient()

   // Kullanıcı bilgileri
   const { data: { user } } = await supabase.auth.getUser()
   const firstName = user?.user_metadata?.first_name || 'Veli'
   const parentId = user?.id

   // Veliye bağlı öğrencileri çek
   const { data: parentStudents } = await supabase
      .from('parent_students')
      .select(`
      student_id,
      students (
        id,
        first_name,
        last_name,
        username,
        email,
        membership_status
      )
    `)
      .eq('parent_id', parentId)

   const students = parentStudents?.map((ps: any) => ps.students) || []

   return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

         {/* BAŞLIK & EKLEME BUTONU */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] p-8 rounded-[2.5rem]">
            <div>
               <div className="inline-flex items-center space-x-2 bg-pink-500/10 text-pink-600 px-3 py-1 rounded-full text-xs font-black mb-3">
                  <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                  <span>YENİ DÖNEM AKTİF</span>
               </div>
               <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
                  Hoş Geldiniz, <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">{firstName}</span> 👋
               </h1>
               <p className="text-sm font-semibold text-muted-foreground mt-2">Öğrencinizin gelişimini yakından takip edin ve destekleyin.</p>
            </div>

            <Link href="/profile/veli/ogrenci-ekle">
               <Button size="lg" className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-bold rounded-2xl shadow-lg shadow-violet-500/25 h-14 px-8 group shrink-0 w-full md:w-auto mt-4 md:mt-0">
                  <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" /> Yeni Öğrenci Ekle
               </Button>
            </Link>
         </div>

         {/* DASHBOARD KARTLARI */}
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Çözülen Denemeler / İlerleme */}
            <div className="bg-card border-2 border-border/50 rounded-3xl p-6 shadow-sm hover:border-pink-500/30 transition-all group">
               <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-600 group-hover:scale-110 transition-transform">
                     <BarChart3 className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-black text-pink-500 bg-pink-500/10 px-2.5 py-1 rounded-lg">+12% Artış</span>
               </div>
               <h3 className="text-sm font-black text-muted-foreground uppercase tracking-wider mb-1">Toplam Çözülen Deneme</h3>
               <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-foreground">18</span>
                  <span className="text-sm font-bold text-muted-foreground">/ 45 Kitapçık</span>
               </div>
               <div className="w-full bg-muted/50 h-2 rounded-full mt-4 overflow-hidden">
                  <div className="bg-gradient-to-r from-pink-500 to-violet-500 w-[40%] h-full rounded-full" />
               </div>
            </div>

            {/* Türkiye Geneli Sıralama Trendi */}
            <div className="bg-card border-2 border-border/50 rounded-3xl p-6 shadow-sm hover:border-violet-500/30 transition-all group">
               <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-600 group-hover:scale-110 transition-transform">
                     <Award className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-black text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-lg">Yükselişte</span>
               </div>
               <h3 className="text-sm font-black text-muted-foreground uppercase tracking-wider mb-1">Ortalama Net Trendi</h3>
               <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-foreground">76.5</span>
                  <span className="text-sm font-bold text-muted-foreground">Net (TYT)</span>
               </div>
               <p className="text-xs font-bold text-muted-foreground mt-3 flex items-center">
                  <BrainCircuit className="w-3.5 h-3.5 mr-1" /> Bir önceki sınava göre 4.25 net arttı.
               </p>
            </div>

            {/* Aktif Paket / Abonelik Durumu */}
            <div className="bg-card border-2 border-border/50 rounded-3xl p-6 shadow-sm hover:border-blue-500/30 transition-all group lg:col-span-2">
               <div className="flex flex-col md:flex-row gap-6 h-full items-center">
                  <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
                     <GraduationCap className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                     <div className="inline-block bg-blue-500/10 text-blue-600 text-[10px] font-black uppercase px-2 py-1 rounded-md mb-2">Aktif Abonelik (YKS 2026)</div>
                     <h3 className="text-xl font-black text-foreground mb-1">Süper Set Kurumsal Deneme Paketi</h3>
                     <p className="text-sm font-semibold text-muted-foreground">Limit, Özdebir, Töder Kurumsal Karma Serisi (12 Kutu Kargo)</p>
                  </div>
                  <div className="shrink-0 text-center flex flex-col items-center">
                     <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-1">Gelecek Kargo</span>
                     <div className="bg-background border-2 border-border font-black text-foreground px-4 py-2 rounded-xl">
                        14 Ekim Cuma
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* ÖĞRENCİLERİM VE ONLİNE SINAVLAR BÖLÜMÜ */}
         <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Sol Sütun: Kayıtlı Öğrenciler */}
            <div className="xl:col-span-2 space-y-6">
               <h2 className="text-2xl font-black flex items-center text-foreground mb-6">
                  Öğrencilerim
                  <span className="ml-3 bg-pink-500/10 text-pink-500 text-xs px-2.5 py-1 rounded-full">{students.length} Kayıtlı</span>
               </h2>

               {students.length === 0 ? (
                  /* ŞU AN ÖĞRENCİ YOK SKELETON'U */
                  <div className="border-2 border-dashed border-border/60 bg-muted/10 rounded-[2rem] p-12 text-center flex flex-col items-center justify-center max-h-[400px]">
                     <div className="w-20 h-20 bg-background rounded-[1.5rem] shadow-sm flex items-center justify-center mb-6">
                        <Users className="w-10 h-10 text-muted-foreground/30" />
                     </div>
                     <h3 className="text-lg font-black text-foreground mb-2">Henüz Bir Öğrenci Ekli Değil</h3>
                     <p className="text-sm text-muted-foreground font-medium max-w-sm mb-6">Paket satın almak, deneme sonuçlarına veya analiz raporlarına ulaşmak için sisteme öğrencinizi eklemelisiniz.</p>

                     <Link href="/profile/veli/ogrenci-ekle">
                        <Button variant="outline" className="border-2 border-violet-500/20 text-violet-600 hover:bg-violet-500/5 font-bold rounded-xl h-12 px-6">
                           Hemen Öğrenci Ekle
                        </Button>
                     </Link>
                  </div>
               ) : (
                  /* ÖĞRENCİ KARTLARI LİSTESİ */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {students.map((student: any) => (
                        <div key={student.id} className="bg-card border-2 border-border/50 rounded-3xl p-6 shadow-sm hover:border-violet-500/30 transition-all flex flex-col">
                           <div className="flex items-center gap-4 mb-4">
                              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-violet-500/20">
                                 {student.first_name?.charAt(0)}{student.last_name?.charAt(0)}
                              </div>
                              <div>
                                 <h4 className="font-black text-foreground text-lg leading-tight">{student.first_name} {student.last_name}</h4>
                                 <p className="text-xs font-bold text-muted-foreground flex items-center gap-1 mt-1">
                                    <AtSign className="w-3 h-3" /> {student.username || student.email || 'Giriş bilgisi yok'}
                                 </p>
                              </div>
                           </div>

                           <div className="bg-muted/30 rounded-2xl p-3 flex justify-between items-center mb-6">
                              <span className="text-xs font-bold text-muted-foreground">Aktif Durum:</span>
                              <span className="text-xs font-black text-emerald-500 bg-emerald-500/10 px-2 rounded-md">{student.membership_status || 'Platform Üyesi'}</span>
                           </div>

                           <div className="mt-auto grid grid-cols-2 gap-2">
                              <Link href={`/profile/ogrenci/sonuclarim?studentId=${student.id}`} className="col-span-1">
                                 <Button variant="outline" className="w-full font-bold border-2 hover:bg-muted rounded-xl h-10 text-[11px]">
                                    Raporlar
                                 </Button>
                              </Link>
                              <Link href={`/profile/veli/ogrenci-duzenle?id=${student.id}`} className="col-span-1">
                                 <Button variant="outline" className="w-full font-bold border-2 hover:bg-muted rounded-xl h-10 text-[11px]">
                                    Düzenle
                                 </Button>
                              </Link>
                              <Link href={`/profile/ogrenci?studentId=${student.id}`} className="col-span-2 mt-1">
                                 <Button className="w-full font-black bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-md shadow-violet-600/20 rounded-xl h-11 text-xs">
                                    Paneline Git <ChevronRight className="w-4 h-4 ml-1" />
                                 </Button>
                              </Link>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>

            {/* Sağ Sütun: Yaklaşan Etkinlikler & Online Sınavlar */}
            <div className="space-y-6">
               <h2 className="text-2xl font-black text-foreground">Online Sınavlar</h2>

               <div className="bg-card border-2 border-border/50 rounded-[2rem] p-6 shadow-sm space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-bl-full pointer-events-none" />

                  <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-2xl border border-border group hover:border-emerald-500/30 transition-all cursor-pointer">
                     <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <PlayCircle className="w-6 h-6" />
                     </div>
                     <div className="flex-1">
                        <h4 className="font-black text-sm text-foreground">Özdebir Türkiye Geneli (TG-1)</h4>
                        <div className="flex items-center text-[10px] font-bold text-muted-foreground mt-1">
                           <Clock className="w-3 h-3 mr-1" /> Başlangıç: 12 Kasım 10:00
                        </div>
                     </div>
                     <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
                  </div>

                  <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-2xl border border-border group hover:border-emerald-500/30 transition-all cursor-pointer">
                     <div className="w-12 h-12 bg-emerald-500/5 text-emerald-600/50 rounded-xl flex items-center justify-center shrink-0">
                        <PlayCircle className="w-6 h-6" />
                     </div>
                     <div className="flex-1 opacity-70">
                        <h4 className="font-black text-sm text-foreground">Limit Kronometre Denemesi</h4>
                        <div className="flex items-center text-[10px] font-bold text-muted-foreground mt-1">
                           Sınav Süresi Sona Erdi (Kaçırıldı)
                        </div>
                     </div>
                     <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold">Karnemi Gör</Button>
                  </div>
               </div>

               {/* Yaklaşan Kargo / Duyuru */}
               <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-[2rem] p-6 text-white shadow-lg shadow-indigo-500/20 relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none">
                     <BrainCircuit className="w-40 h-40" />
                  </div>
                  <h3 className="font-black text-lg mb-2 flex items-center"><Award className="w-5 h-5 mr-2" /> Veli Gelişim Raporu</h3>
                  <p className="text-sm font-medium text-white/80 mb-4 leading-relaxed">Öğrencinizin son 3 denemesindeki net grafiği <b>matematik geometrisinde</b> 2 netlik bir düşüş gösteriyor. Destek paketi inceleyin.</p>
                  <Button className="bg-white/20 text-white border-0 hover:bg-white/30 font-bold backdrop-blur-sm w-full rounded-xl">
                     Detaylı Analizi Gör
                  </Button>
               </div>
            </div>
         </div>

      </div>
   )
}
