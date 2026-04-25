"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Users, GraduationCap, Briefcase, Plus, UserPlus, FileSignature, PieChart, Activity, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function RegistrationDashboard() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  
  // States
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    totalTeachers: 0,
    totalClasses: 0
  })

  const [genderData, setGenderData] = useState({ male: 0, female: 0, none: 0 })
  const [classData, setClassData] = useState<any[]>([])
  const [recentStudents, setRecentStudents] = useState<any[]>([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    setLoading(true)
    
    // Execute calls in parallel
    const [
       { count: totalStudents }, 
       { count: activeStudents },
       { count: totalTeachers },
       { data: levels },
       { data: students }
    ] = await Promise.all([
       supabase.from('students').select('*', { count: 'exact', head: true }),
       supabase.from('students').select('*', { count: 'exact', head: true }).eq('is_active', true),
       supabase.from('teachers').select('*', { count: 'exact', head: true }),
       supabase.from('levels').select('id, name').order('created_at', { ascending: true }),
       supabase.from('students').select('id, first_name, last_name, gender, level_id, created_at, is_active').order('created_at', { ascending: false })
    ])

    const totalClasses = levels?.length || 0
    setStats({
       totalStudents: totalStudents || 0,
       activeStudents: activeStudents || 0,
       totalTeachers: totalTeachers || 0,
       totalClasses: totalClasses
    })

    if (students && students.length > 0) {
       // Gender distribution
       const male = students.filter(s => s.gender === 'Erkek').length
       const female = students.filter(s => s.gender === 'Kız').length
       const none = students.filter(s => !s.gender).length
       setGenderData({ male, female, none })
       
       setRecentStudents(students.slice(0, 5))
    }

    // Class distribution
    if (levels) {
       const mappedClassData = levels.map(lvl => {
          const studentCount = students?.filter(s => s.level_id === lvl.id).length || 0
          return { name: lvl.name, count: studentCount }
       })
       setClassData(mappedClassData)
    }

    setLoading(false)
  }

  // A tiny custom pie chart for gender
  const totalGenders = genderData.male + genderData.female + genderData.none;
  const malePerc = totalGenders > 0 ? (genderData.male / totalGenders) * 100 : 0;
  const femalePerc = totalGenders > 0 ? (genderData.female / totalGenders) * 100 : 0;

  return (
    <div className="space-y-8 pb-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-3xl border border-border shadow-sm">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
               <GraduationCap className="w-6 h-6" />
            </div>
            <div>
               <h1 className="text-2xl font-black text-foreground">Kayıt Dashboard</h1>
               <p className="text-sm font-semibold text-muted-foreground tracking-wide uppercase mt-1">Öğrenci, Öğretmen ve Sınıf İstatistikleri</p>
            </div>
         </div>
         <div className="flex items-center gap-3">
             <div className="bg-muted px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 border border-border">
                <span className="text-muted-foreground uppercase text-xs tracking-wider">Dönem</span> 2025-2026
             </div>
             <Link href="/uraz/kayitlar/ogrenciler/yeni">
                 <Button className="font-bold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" /> Yeni Öğrenci
                 </Button>
             </Link>
         </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center text-muted-foreground">
           <Activity className="w-10 h-10 animate-spin mb-4 text-primary" />
           <p className="font-bold">Veriler Yükleniyor...</p>
        </div>
      ) : (
        <>
          {/* TOP METRICS GRIDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-card rounded-3xl p-6 shadow-sm border border-border flex flex-col gap-2 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform"></div>
               <div className="w-10 h-10 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center mb-2">
                  <Users className="w-5 h-5" />
               </div>
               <h2 className="text-4xl font-black text-foreground">{stats.totalStudents}</h2>
               <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Toplam Öğrenci</p>
            </div>

            <div className="bg-card rounded-3xl p-6 shadow-sm border border-border flex flex-col gap-2 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform"></div>
               <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center mb-2">
                  <UserCheck className="w-5 h-5" />
               </div>
               <h2 className="text-4xl font-black text-foreground">{stats.activeStudents}</h2>
               <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Aktif Öğrenci</p>
            </div>

            <div className="bg-card rounded-3xl p-6 shadow-sm border border-border flex flex-col gap-2 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-2xl -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform"></div>
               <div className="w-10 h-10 bg-pink-500/10 text-pink-500 rounded-xl flex items-center justify-center mb-2">
                  <Briefcase className="w-5 h-5" />
               </div>
               <h2 className="text-4xl font-black text-foreground">{stats.totalTeachers}</h2>
               <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Toplam Öğretmen</p>
            </div>

            <div className="bg-card rounded-3xl p-6 shadow-sm border border-border flex flex-col gap-2 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform"></div>
               <div className="w-10 h-10 bg-sky-500/10 text-sky-500 rounded-xl flex items-center justify-center mb-2">
                  <PieChart className="w-5 h-5" />
               </div>
               <h2 className="text-4xl font-black text-foreground">{stats.totalClasses}</h2>
               <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Toplam Sınıf</p>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             
             {/* LEFT COLUMN: GENDER & STATUS */}
             <div className="space-y-6">
                
                {/* Gender Widget */}
                <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center relative min-h-[300px]">
                   <h3 className="absolute top-6 left-6 text-sm font-black text-foreground">Cinsiyet Dağılımı</h3>
                   <span className="absolute top-10 left-6 text-xs text-muted-foreground">Aktif öğrenciler</span>
                   
                   {totalGenders === 0 ? (
                      <p className="text-muted-foreground text-sm font-medium">Veri Yok</p>
                   ) : (
                      <div className="flex flex-col items-center gap-8 w-full mt-10">
                         {/* Visual Chart Bars representing Pie */}
                         <div className="w-full h-4 rounded-full flex gap-1 overflow-hidden px-8">
                            <div className="h-full bg-blue-500 transition-all" style={{ width: `${malePerc}%` }}></div>
                            <div className="h-full bg-pink-500 transition-all" style={{ width: `${femalePerc}%` }}></div>
                         </div>
                         <div className="flex gap-10 w-full justify-center text-sm font-bold">
                            <div className="flex items-center gap-2">
                               <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                               <div className="flex flex-col"><span className="text-foreground">Erkek</span><span className="text-xs text-muted-foreground">{genderData.male} Öğrenci</span></div>
                            </div>
                            <div className="flex items-center gap-2">
                               <span className="w-3 h-3 rounded-full bg-pink-500"></span>
                               <div className="flex flex-col"><span className="text-foreground">Kız</span><span className="text-xs text-muted-foreground">{genderData.female} Öğrenci</span></div>
                            </div>
                         </div>
                      </div>
                   )}
                </div>

                {/* Status / Type Widget */}
                <div className="bg-card border border-border rounded-3xl p-6 shadow-sm min-h-[250px] flex flex-col relative">
                   <h3 className="text-sm font-black text-foreground">Kayıt Türüne Göre Dağılım</h3>
                   <span className="text-xs text-muted-foreground block mb-8">Öğrenci durumları</span>
                   
                   <div className="flex items-center justify-center flex-1">
                      <div className="w-32 h-32 rounded-full border-[10px] border-muted relative flex items-center justify-center">
                         <div className="text-center">
                            <span className="text-2xl font-black block">{stats.totalStudents}</span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">TÜMÜ</span>
                         </div>
                      </div>
                   </div>
                </div>

             </div>

             {/* RIGTH COLUMN: CLASS OCCUPANCY & RECENT */}
             <div className="lg:col-span-2 space-y-6 flex flex-col">
                
                {/* Classes Doluluk */}
                <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex-1">
                   <div className="flex justify-between items-end mb-6">
                      <div>
                         <h3 className="text-sm font-black text-foreground">Sınıf Doluluk Oranları</h3>
                         <span className="text-xs text-muted-foreground">Sınıf düzeyine göre gruplandırılmış (Örn Limit: 100)</span>
                      </div>
                      <Link href="/uraz/kayitlar/siniflar" className="text-xs font-bold text-primary hover:underline">Tümünü Gör</Link>
                   </div>
                   
                   <div className="space-y-4">
                      {classData.length === 0 ? (
                         <div className="text-center text-muted-foreground py-10 font-medium">Bekleyen sınıf verisi yok. Sınıflar menüsünden ekleyin.</div>
                      ) : classData.map((c, i) => {
                         const maxOccupancy = 100; // Fake cap for visuals as per image
                         const perc = Math.min(100, Math.round((c.count / maxOccupancy) * 100));
                         return (
                           <div key={i} className="flex flex-col gap-2">
                              <div className="flex justify-between items-center text-xs font-bold">
                                 <span className="text-foreground">{c.name}</span>
                                 <div className="flex items-center gap-4">
                                    <span className="text-muted-foreground">{c.count} / {maxOccupancy} öğrenci</span>
                                    <span className="text-emerald-500 w-8 text-right">%{perc}</span>
                                 </div>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                                 <div className="bg-emerald-500 h-2.5 rounded-full transition-all" style={{ width: `${perc}%` }}></div>
                              </div>
                           </div>
                         )
                      })}
                   </div>
                </div>

                {/* Quick Actions & Recent */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                      <h3 className="text-sm font-black text-foreground mb-4">Hızlı İşlemler</h3>
                      <div className="grid grid-cols-2 gap-4">
                         <Link href="/uraz/kayitlar/ogrenciler/yeni" className="bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 transition-colors text-primary min-h-[120px]">
                            <UserPlus className="w-8 h-8" />
                            <span className="text-xs font-black uppercase text-center">Yeni Öğrenci</span>
                         </Link>
                         <Link href="/uraz/kayitlar/ogrenciler" className="bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 transition-colors text-emerald-600 min-h-[120px]">
                            <FileSignature className="w-8 h-8" />
                            <span className="text-xs font-black uppercase text-center">Kayıt Listesi</span>
                         </Link>
                      </div>
                   </div>

                   <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                      <div className="flex justify-between items-end mb-4">
                         <div>
                            <h3 className="text-sm font-black text-foreground">Son Kayıtlar</h3>
                            <span className="text-xs text-muted-foreground">En son eklenen öğrenciler</span>
                         </div>
                      </div>
                      <div className="space-y-3">
                         {recentStudents.length === 0 ? (
                            <p className="text-xs font-medium text-muted-foreground text-center py-4">Son kayıt bulunamadı</p>
                         ) : recentStudents.map(s => (
                            <div key={s.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg">
                               <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-xs">
                                     {s.first_name[0]}{s.last_name[0]}
                                  </div>
                                  <div>
                                     <div className="text-sm font-bold text-foreground">{s.first_name} {s.last_name}</div>
                                     <div className="text-[10px] text-muted-foreground uppercase">{classData.find(c => c.id === s.level_id)?.name || 'Şube Yok'}</div>
                                  </div>
                               </div>
                               <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${s.is_active ? 'bg-success/20 text-success' : 'bg-destructive/10 text-destructive'}`}>
                                  {s.is_active ? 'Aktif' : 'Pasif'}
                               </span>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>

             </div>

          </div>
        </>
      )}

    </div>
  )
}
