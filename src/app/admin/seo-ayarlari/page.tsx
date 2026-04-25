"use client"

import { Button } from "@/components/ui/button"
import { Globe, RefreshCw, Search, ArrowRightLeft, Plus } from "lucide-react"

export default function AdminSeoPage() {
  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="w-6 h-6 text-primary" />
            SEO ve Yönlendirmeler
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Sitenizin arama motorlarındaki görünürlüğünü, başlıklarını ve URL yönlendirmelerini yönetin.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Form */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl shadow-sm p-6 space-y-5">
             <h2 className="text-lg font-bold border-b border-border pb-3">Global SEO Değerleri</h2>
             
             <div className="space-y-2">
                <label className="text-sm font-semibold flex justify-between">
                   Site Ana Başlığı (Title) <span className="text-xs text-muted-foreground font-normal">Maks 60 Karakter</span>
                </label>
                <input type="text" defaultValue="Çözsen Deneme Kulübü | Türkiye Geneli LGS ve YKS Denemeleri" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50" />
             </div>

             <div className="space-y-2">
                <label className="text-sm font-semibold flex justify-between">
                   Site Açıklaması (Meta Description) <span className="text-xs text-muted-foreground font-normal">150 Karakter Önerilir</span>
                </label>
                <textarea rows={3} defaultValue="Türkiye geneli online ve basılı LGS, YKS deneme kulübü. Anlık analiz portalı ve videolu çözümlerle hedefinize bir adım daha yaklaşın." className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 resize-none"></textarea>
             </div>

             <div className="space-y-2">
                <label className="text-sm font-semibold flex justify-between">
                   Meta Keywords (Kelimeler) <span className="text-xs text-muted-foreground font-normal">Virgülle Ayırın</span>
                </label>
                <input type="text" defaultValue="lgs deneme, yks deneme, türkiye geneli deneme, çözsen, üniversite hazırlık, kurumsal deneme" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50" />
             </div>
             
             <Button className="w-full font-bold mt-4">
               <RefreshCw className="w-4 h-4 mr-2" />
               SEO Ayarlarını Kaydet
             </Button>
          </div>
        </div>

        {/* Right Column: SERP Preview & Redirects */}
        <div className="space-y-8">
           
           {/* Google SERP Preview Mock */}
           <div className="bg-card border border-border rounded-xl shadow-sm p-6 space-y-4">
              <h2 className="text-lg font-bold border-b border-border pb-3 flex items-center">
                 <Search className="w-5 h-5 mr-2 text-muted-foreground" /> Google Arama Önizlemesi
              </h2>
              
              <div className="bg-background border border-border rounded-lg p-5">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">Logo</div>
                    <div>
                       <div className="text-sm font-semibold text-foreground">Çözsen Deneme Kulübü</div>
                       <div className="text-xs text-muted-foreground">https://cozsen.com</div>
                    </div>
                 </div>
                 <h3 className="text-[#1a0dab] text-xl font-medium mt-3 hover:underline cursor-pointer">
                    Çözsen Deneme Kulübü | Türkiye Geneli LGS ve YKS Denemeleri
                 </h3>
                 <p className="text-sm text-[#4d5156] mt-1 leading-snug">
                    Türkiye geneli online ve basılı LGS, YKS deneme kulübü. Anlık analiz portalı ve videolu çözümlerle hedefinize bir adım daha yaklaşın.
                 </p>
              </div>
           </div>

           {/* Redirects Simulator */}
           <div className="bg-card border border-border rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center border-b border-border pb-3 mb-4">
                 <h2 className="text-lg font-bold flex items-center">
                    <ArrowRightLeft className="w-5 h-5 mr-2 text-muted-foreground" /> 301/302 Yönlendirmeler
                 </h2>
                 <Button variant="outline" size="sm" className="h-8 shadow-sm">
                    <Plus className="w-4 h-4 mr-1" /> Kural Ekle
                 </Button>
              </div>
              
              <div className="space-y-3">
                 {[ 
                   { from: "/eski-paketler", to: "/paketler", type: "301 Kalıcı" },
                   { from: "/lgs-deneme", to: "/paketler/lgs-deneme-paketi", type: "301 Kalıcı" },
                   { from: "/kampanya", to: "/paketini-kendin-sec", type: "302 Geçici" }
                 ].map((rule, i) => (
                   <div key={i} className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center bg-muted/40 p-3 rounded-lg border border-border text-sm">
                      <div className="font-mono text-muted-foreground truncate w-full sm:w-1/3 bg-background px-2 py-1 rounded border border-border">{rule.from}</div>
                      <ArrowRightLeft className="hidden sm:block w-4 h-4 text-primary shrink-0" />
                      <div className="font-mono text-foreground font-semibold truncate w-full sm:w-1/3 bg-background px-2 py-1 rounded border border-primary/20">{rule.to}</div>
                      <div className="ml-auto flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0 justify-between sm:justify-end">
                         <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${rule.type.includes("301") ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{rule.type}</span>
                         <button className="text-destructive hover:underline text-xs font-semibold">Sil</button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

        </div>
      </div>
    </div>
  )
}
