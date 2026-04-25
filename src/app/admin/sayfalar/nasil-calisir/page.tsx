"use client"

import { Button } from "@/components/ui/button"
import { HelpCircle, Save, Layers, ListOrdered, GripVertical, Trash2 } from "lucide-react"

export default function AdminNasilCalisir() {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-primary" />
            "Nasıl Çalışır?" Sayfası Yönetimi
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Öğrencilere sistemi adım adım anlattığınız rehber sayfadaki tüm metin ve akışları güncelleyin.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
           <Button className="w-full sm:w-auto font-bold bg-primary text-primary-foreground shadow-md"><Save className="w-4 h-4 mr-2" /> Yayına Al</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl shadow-sm p-6 space-y-5">
               <h2 className="text-lg font-bold border-b border-border pb-3 flex items-center">
                  <Layers className="w-5 h-5 mr-2 text-primary" /> Sayfa Ana Tanıtımı
               </h2>
               
               <div className="space-y-2">
                  <label className="text-sm font-semibold">Ana Başlık</label>
                  <input type="text" defaultValue="Sistemimiz Nasıl İşler?" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 font-bold" />
               </div>

               <div className="space-y-2">
                  <label className="text-sm font-semibold">Giriş Metni</label>
                  <textarea rows={3} defaultValue="Türkiye'nin en yenilikçi deneme kulübüne katıldığınız andan itibaren sizi neler bekliyor, adım adım inceleyin." className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 resize-none"></textarea>
               </div>
               
               <div className="space-y-2 pt-4">
                  <label className="text-sm font-semibold flex items-center">Videolu Anlatım URL (Opsiyonel)</label>
                  <input type="url" placeholder="https://youtube.com/..." className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50" />
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl shadow-sm p-6 space-y-5">
               <div className="flex justify-between items-center border-b border-border pb-3">
                  <h2 className="text-lg font-bold flex items-center text-primary">
                     <ListOrdered className="w-5 h-5 mr-2" /> İşleyiş Adımları
                  </h2>
                  <Button variant="outline" size="sm" className="h-8 shadow-sm">
                     + Adım Ekle
                  </Button>
               </div>
               
               <div className="space-y-4">
                  {[
                     { no: "1", title: "Paketinizi Oluşturun", desc: "Seviyenize ve tercihlerinize en uygun deneme setini seçip ödemenizi tamamlayın." },
                     { no: "2", title: "Evinize Teslim", desc: "Siparişiniz özenle paketlenir ve Türkiye'nin her yerine kargo ile gönderilir." },
                     { no: "3", title: "Çözün ve Optiği Okutun", desc: "Gerçek sınav hissiyatıyla denemenizi çözün ve mobil uygulamadan optiği okutun." },
                     { no: "4", title: "Detaylı Analiz", desc: "Anında netlerinizi görün, saniyeler içinde eksik olduğunuz konuları tespit edin." },
                  ].map((step, i) => (
                     <div key={i} className="flex gap-4 items-start bg-muted/30 p-4 border border-border rounded-xl group relative">
                        <GripVertical className="w-5 h-5 text-muted-foreground mr-1 mt-1 cursor-grab" />
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 border border-primary/20">{step.no}</div>
                        <div className="flex-1 space-y-2">
                           <input type="text" defaultValue={step.title} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none font-bold" />
                           <textarea rows={2} defaultValue={step.desc} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none resize-none"></textarea>
                        </div>
                        <button className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}
