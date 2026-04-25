"use client"

import { Button } from "@/components/ui/button"
import { Monitor, Image as ImageIcon, Save, AlignLeft, MousePointerClick, TrendingUp } from "lucide-react"

export default function AdminHomePageManagement() {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
              <Monitor className="w-6 h-6 text-primary" />
              Ana Sayfa Yönetimi
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Ana sayfada yer alan afiş, metinler ve istatistikleri buradan düzenleyebilirsiniz.</p>
        </div>
        <Button className="font-bold whitespace-nowrap">
           <Save className="w-4 h-4 mr-2" /> Değişiklikleri Kaydet
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Hero Section Config */}
         <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl shadow-sm p-6 space-y-6">
               <h2 className="text-lg font-bold border-b border-border pb-3 flex items-center">
                  <AlignLeft className="w-5 h-5 mr-2 text-primary" /> Hero Bölümü (Üst Kısım)
               </h2>
               
               <div className="space-y-3">
                  <label className="text-sm font-semibold">Ana Başlık (H1)</label>
                  <input type="text" defaultValue="Yeni Nesil Sorularla Başarıya Ulaşın" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 font-bold text-lg" />
               </div>
               <div className="space-y-3">
                  <label className="text-sm font-semibold">Açıklama Metni</label>
                  <textarea rows={3} defaultValue="Türkiye geneli LGS ve TYT/AYT deneme paketleri ile anlık başarı analizini cebinizde taşıyın. Uzman kadro ve video çözümlerle hedefinize bir adım daha yaklaşın." className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 resize-none"></textarea>
               </div>
               <div className="space-y-3">
                  <label className="text-sm font-semibold">Buton Metni ve Yönlendirme</label>
                  <div className="flex gap-4">
                     <input type="text" defaultValue="Paketleri İncele" className="w-1/2 bg-background border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50" />
                     <input type="text" defaultValue="/paketini-kendin-sec" className="w-1/2 bg-background border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 font-mono text-muted-foreground" />
                  </div>
               </div>
            </div>

            <div className="bg-card border border-border rounded-xl shadow-sm p-6 space-y-6">
               <h2 className="text-lg font-bold border-b border-border pb-3 flex items-center">
                  <ImageIcon className="w-5 h-5 mr-2 text-primary" /> Banner Görseli
               </h2>
               <div className="border-2 border-dashed border-border rounded-2xl h-48 flex flex-col items-center justify-center bg-muted/30 hover:bg-muted/50 transition cursor-pointer group">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                     <ImageIcon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm font-bold text-foreground">Yeni Görsel Yükle</span>
                  <span className="text-xs text-muted-foreground mt-1">Önerilen: 1920x1080px (PNG, WEBP)</span>
               </div>
            </div>
         </div>

         {/* Call to Actions & Stats */}
         <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl shadow-sm p-6 space-y-6">
               <h2 className="text-lg font-bold border-b border-border pb-3 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary" /> İstatistik Barı
               </h2>
               
               <p className="text-sm text-muted-foreground">Ana sayfada sayısal değerlerle güven vermek için bu rakamları güncel tutun.</p>
               
               <div className="space-y-4">
                  {[
                     { label: "Aktif Öğrenci", value: "24,500+" },
                     { label: "Çözülen Deneme", value: "150,000+" },
                     { label: "Kurumsal Yayın", value: "25+" },
                     { label: "Video Çözüm", value: "10,000+" }
                  ].map((stat, i) => (
                     <div key={i} className="flex gap-4 items-center">
                        <input type="text" defaultValue={stat.label} className="w-1/2 bg-background border border-border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50" />
                        <input type="text" defaultValue={stat.value} className="w-1/2 bg-background border border-border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50 font-bold" />
                     </div>
                  ))}
               </div>
            </div>

            <div className="bg-card border border-border rounded-xl shadow-sm p-6 space-y-6">
               <h2 className="text-lg font-bold border-b border-border pb-3 flex items-center">
                  <MousePointerClick className="w-5 h-5 mr-2 text-primary" /> Çağrı (Call to Action)
               </h2>
               <div className="space-y-3">
                  <label className="text-sm font-semibold">Ara Başlık</label>
                  <input type="text" defaultValue="Hala Karar Veremedin mi?" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50" />
               </div>
               <div className="space-y-3">
                  <label className="text-sm font-semibold">Tıklama Yönlendirmesi</label>
                  <input type="text" defaultValue="/iletisim" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 font-mono text-muted-foreground" />
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}
