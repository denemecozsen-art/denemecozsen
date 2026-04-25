"use client"

import { useState } from "react"
import { Settings, Save, Smartphone, MapPin, Mail, Phone, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("genel")

  return (
    <div className="space-y-6">
       <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
             <Settings className="w-6 h-6 text-primary" />
             Genel Ayarlar
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Platformun temel yapılandırmasını, logoları ve iletişim bilgilerini güncelleyin.</p>
       </div>

       <div className="flex flex-col md:flex-row gap-6">
          {/* Settings Sidebar */}
          <div className="w-full md:w-64 shrink-0 space-y-1">
             {[
               { id: "genel", label: "Genel Bilgiler", icon: Settings },
               { id: "iletisim", label: "İletişim & Sosyal", icon: Phone },
               { id: "tasarim", label: "Marka & Logo", icon: ImageIcon },
             ].map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`w-full flex items-center px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                   activeTab === tab.id 
                     ? "bg-primary text-primary-foreground shadow-md pointer-events-none" 
                     : "bg-transparent text-muted-foreground hover:bg-muted"
                 }`}
               >
                 <tab.icon className={`w-4 h-4 mr-3 ${activeTab === tab.id ? "opacity-100" : "opacity-70"}`} />
                 {tab.label}
               </button>
             ))}
          </div>

          {/* Settings Content */}
          <div className="flex-1 bg-card border border-border rounded-xl shadow-sm p-6 lg:p-8">
             {activeTab === "genel" && (
               <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
                  <div>
                     <h2 className="text-lg font-bold">Genel Bilgiler</h2>
                     <p className="text-sm text-muted-foreground mt-1">Kurumun resmi adı ve vergi detayları.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-sm font-semibold">Resmi Kurum Adı</label>
                        <input type="text" defaultValue="Çözsen Eğitim Teknolojileri A.Ş." className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-semibold">Vergi Numarası</label>
                        <input type="text" defaultValue="1234567890" className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition" />
                     </div>
                     <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-semibold">Sistem Mesajı (Bakım vb.)</label>
                        <textarea rows={3} placeholder="Mevcut bir sistem duyurusu yok." className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition resize-none"></textarea>
                     </div>
                  </div>
               </div>
             )}

             {activeTab === "iletisim" && (
               <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
                  <div>
                     <h2 className="text-lg font-bold">İletişim & Sosyal Medya</h2>
                     <p className="text-sm text-muted-foreground mt-1">Öğrencilerin ve velilerin size ulaşabileceği kanallar.</p>
                  </div>

                  <div className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-sm font-semibold flex items-center"><Mail className="w-4 h-4 mr-2 text-muted-foreground" /> E-posta Adresi</label>
                        <input type="email" defaultValue="destek@cozsen.com" className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-semibold flex items-center"><Phone className="w-4 h-4 mr-2 text-muted-foreground" /> Müşteri Hizmetleri</label>
                        <input type="text" defaultValue="0850 123 45 67" className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-semibold flex items-center"><Smartphone className="w-4 h-4 mr-2 text-muted-foreground" /> WhatsApp Destek Hattı</label>
                        <input type="text" defaultValue="+90 555 123 45 67" className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-semibold flex items-center"><MapPin className="w-4 h-4 mr-2 text-muted-foreground" /> Merkez Adres</label>
                        <textarea rows={2} defaultValue="Eğitim Mah. 136. Sk. No:4 Kadıköy / İstanbul" className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition resize-none"></textarea>
                     </div>
                  </div>
               </div>
             )}

             {activeTab === "tasarim" && (
               <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
                  <div>
                     <h2 className="text-lg font-bold">Marka & Logo</h2>
                     <p className="text-sm text-muted-foreground mt-1">Sitenin her yerinde kullanılacak logoları güncelleyin.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div className="space-y-3">
                        <label className="text-sm font-semibold">Ana Logo (Açık Zemin İçin)</label>
                        <div className="border-2 border-dashed border-border rounded-2xl h-32 flex flex-col items-center justify-center bg-muted/30 hover:bg-muted/50 transition cursor-pointer">
                           <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
                           <span className="text-xs font-bold text-muted-foreground">Logo Yükle (SVG/PNG)</span>
                        </div>
                     </div>
                     <div className="space-y-3">
                        <label className="text-sm font-semibold">Alternatif Logo (Koyu Zemin İçin)</label>
                        <div className="border-2 border-dashed border-border rounded-2xl h-32 flex flex-col items-center justify-center bg-primary/5 hover:bg-primary/10 transition cursor-pointer">
                           <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
                           <span className="text-xs font-bold text-primary">Logo Yükle (SVG/PNG)</span>
                        </div>
                     </div>
                  </div>
               </div>
             )}

             <div className="mt-8 pt-6 border-t border-border flex justify-end">
                <Button className="font-bold sm:w-auto w-full">
                   <Save className="w-4 h-4 mr-2" />
                   {activeTab === "genel" ? "Bilgileri Kaydet" : activeTab === "iletisim" ? "İletişimi Güncelle" : "Tasarımı Kaydet"}
                </Button>
             </div>
          </div>
       </div>
    </div>
  )
}
