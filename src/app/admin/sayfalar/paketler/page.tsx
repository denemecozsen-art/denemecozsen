"use client"

import { Button } from "@/components/ui/button"
import { Package, Save, LayoutTemplate, Globe, EyeOff, LayoutList, GripVertical } from "lucide-react"

export default function AdminPaketlerSayfasi() {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-3 text-primary">
            <Package className="w-8 h-8" />
            "Paketler" Sayfakurucusu
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">Öğrencilerin tüm ürünlerinizi gördüğü o kritik "Paketler" vitrininin genel düzenini, sıralamasını ve SEO başlıklarını yönetin.</p>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
           <Button variant="outline" className="w-full sm:w-auto h-14 px-6 text-lg font-bold border-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-colors"><EyeOff className="w-5 h-5 mr-3" /> Sayfayı Gizle</Button>
           <Button className="w-full sm:w-auto h-14 px-8 text-lg font-bold bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:scale-105 transition-transform"><Save className="w-5 h-5 mr-3" /> Canlıya Al</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12 gap-8">
         {/* Hero Section settings - Dev Kutu */}
         <div className="space-y-8">
            <div className="bg-card border-2 border-border rounded-3xl shadow-sm p-8 sm:p-10 space-y-8">
               <h2 className="text-2xl font-black border-b border-border pb-4 flex items-center">
                  <LayoutTemplate className="w-7 h-7 mr-4 text-primary" /> Sayfa Üst Başlık (Hero) Vitrini
               </h2>
               
               <div className="space-y-4">
                  <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground block">Sayfa Ana Başlığı (H1)</label>
                  <input type="text" defaultValue="Kurumsal Deneme Paketlerimiz" className="w-full bg-background border-2 border-border rounded-2xl px-6 py-5 text-xl font-black outline-none focus:ring-4 focus:ring-primary/20 transition-all focus:border-primary placeholder:text-muted-foreground/30" />
               </div>

               <div className="space-y-4">
                  <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground block">Sayfa Alt Açıklaması (Alt Başlık)</label>
                  <textarea rows={4} defaultValue="Öğrencinin seviyesine özel hazırlanmış, MEB ve ÖSYM müfredatına %100 uyumlu, çözüm videolu deneme setlerini hemen inceleyin." className="w-full bg-background border-2 border-border rounded-2xl px-6 py-5 text-lg outline-none focus:ring-4 focus:ring-primary/20 resize-none transition-all focus:border-primary leading-relaxed font-medium"></textarea>
               </div>
            </div>

            <div className="bg-card border-2 border-border rounded-3xl shadow-sm p-8 sm:p-10 space-y-8">
               <h2 className="text-2xl font-black border-b border-border pb-4 flex items-center">
                  <Globe className="w-7 h-7 mr-4 text-primary" /> Sayfa SEO Ayarları (Global)
               </h2>
               
               <div className="space-y-4">
                  <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground block">URL (Erişim Linki)</label>
                  <div className="flex bg-muted/50 border-2 border-border rounded-2xl overflow-hidden focus-within:ring-4 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                     <span className="flex items-center px-6 text-muted-foreground font-black bg-muted border-r border-border">cozsen.com/</span>
                     <input type="text" defaultValue="paketler" className="w-full bg-transparent px-4 py-4 text-lg outline-none font-mono text-foreground font-bold" readOnly />
                  </div>
               </div>
               <div className="space-y-4">
                  <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground block">Google Arama Başlığı (Meta Title)</label>
                  <input type="text" defaultValue="LGS ve YKS Deneme Paketleri | Çözsen Deneme Kulübü" className="w-full bg-background border-2 border-border rounded-2xl px-6 py-4 text-lg outline-none focus:ring-4 focus:ring-primary/20 transition-all focus:border-primary font-bold" />
               </div>
            </div>
         </div>

         {/* Content Block Manager (Drag and Drop Mockup) */}
         <div className="space-y-8">
            <div className="bg-card border-2 border-primary/20 rounded-3xl shadow-xl shadow-primary/5 p-8 sm:p-10 space-y-8 sticky top-24">
               <h2 className="text-2xl font-black border-b border-border pb-4 flex items-center text-primary">
                  <LayoutList className="w-7 h-7 mr-4" /> Kategori Sıralaması (Vitrini)
               </h2>
               
               <p className="text-base text-muted-foreground font-medium leading-relaxed mb-6 block">Kullanıcı sayfayı aşağı kaydırdıkça hangi sınıf bloklarının ("5. Sınıf Paketleri", "LGS Paketleri" vb.) hangi sırayla dizileceğini sürükle-bırak yöntemiyle tayin edin.</p>
               
               <div className="space-y-4">
                  {[
                    "Ortaokul Paketleri (5,6,7. Sınıf)",
                    "LGS Hazırlık (8. Sınıf) Paketleri",
                    "YKS (TYT-AYT) Paketleri",
                    "Mezun Özel Paketleri",
                    "Yaz Kampı Paketleri (Arşiv)"
                  ].map((cat, i) => (
                    <div key={i} className={`flex items-center gap-5 p-5 rounded-2xl border-2 transition-all cursor-grab hover:shadow-md ${i === 4 ? 'bg-muted/40 border-border opacity-60' : 'bg-background border-border hover:border-primary/50'}`}>
                       <GripVertical className="w-6 h-6 text-muted-foreground shrink-0" />
                       <input type="checkbox" defaultChecked={i !== 4} className="w-6 h-6 rounded-md border-2 border-muted-foreground accent-primary cursor-pointer shrink-0" />
                       
                       <div className="flex-1 flex flex-col justify-center">
                          <span className={`font-black tracking-tight text-lg ${i === 4 ? 'text-muted-foreground line-through decoration-muted-foreground/50' : 'text-foreground'}`}>{cat}</span>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                             {i === 4 ? 'Görünmez (Draft)' : 'Yayında (Aktif Modül)'}
                          </span>
                       </div>
                    </div>
                  ))}
               </div>
               
               <div className="pt-6 border-t border-border mt-8">
                  <p className="text-sm font-bold text-muted-foreground text-center animate-pulse">Sıralamayı Değiştirmek İçin Tutup Sürükleyin</p>
               </div>
            </div>
         </div>

      </div>
    </div>
  )
}
