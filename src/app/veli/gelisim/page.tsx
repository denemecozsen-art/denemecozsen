import { GraduationCap, BarChart3, Target, CalendarDays } from "lucide-react"

export default function VeliGelisimPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* BAŞLIK */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-8 rounded-[2.5rem] shadow-sm">
        <div>
           <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
              <div className="w-12 h-12 bg-fuchsia-500/10 text-fuchsia-600 rounded-xl flex items-center justify-center">
                 <GraduationCap className="w-6 h-6" />
              </div>
              Akademik Gelişim
           </h1>
           <p className="text-muted-foreground font-semibold mt-2">Öğrencinizin Türkiye geneli ve kurumsal sıralama raporları.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Çözülen Sınav */}
         <div className="bg-card border-none rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center">
            <BarChart3 className="w-10 h-10 text-fuchsia-500 mb-4" />
            <h3 className="text-sm font-black text-muted-foreground uppercase tracking-wider mb-2">Çözülen Denemeler</h3>
            <span className="text-3xl font-black text-foreground">Sıralanıyor...</span>
         </div>
         {/* Trend */}
         <div className="bg-card border-none rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center">
            <Target className="w-10 h-10 text-pink-500 mb-4" />
            <h3 className="text-sm font-black text-muted-foreground uppercase tracking-wider mb-2">Net Trendi</h3>
            <span className="text-3xl font-black text-foreground">Analiz Bekleniyor</span>
         </div>
         {/* Yaklaşan */}
         <div className="bg-card border-none rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center">
            <CalendarDays className="w-10 h-10 text-violet-500 mb-4" />
            <h3 className="text-sm font-black text-muted-foreground uppercase tracking-wider mb-2">Yaklaşan Sınav</h3>
            <span className="text-base font-black text-violet-600">Öğrenci Profiline Geçiniz</span>
         </div>
      </div>

      <div className="bg-card rounded-[2.5rem] p-8 border border-border/50 text-center min-h-[300px] flex flex-col items-center justify-center">
         <h2 className="text-2xl font-black mb-4">Grafikler Hazırlanıyor</h2>
         <p className="text-muted-foreground font-medium max-w-lg">
            Öğrenciniz ilk çevrimiçi denemesini tamamladıktan sonra burası renkli çizgi grafikleri ve karne çıktılarıyla dolacaktır. Lütfen öğrencinizin denemelerine katılmasını sağlayın.
         </p>
      </div>

    </div>
  )
}
