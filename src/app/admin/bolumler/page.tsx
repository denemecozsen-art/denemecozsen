"use client"

import { useState } from "react"
import { Save, Layers, LayoutTemplate, MessageSquareText, Image as ImageIcon, Link2, Type, Megaphone, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminSectionsManagement() {
  const [activeTab, setActiveTab] = useState("top-banner")

  const tabs = [
    { id: "top-banner", label: "Üst Kayan Şerit (Top Bar)", icon: Megaphone },
    { id: "hero", label: "Giriş (Hero) Alanı", icon: LayoutTemplate },
    { id: "hakkimizda", label: "Hakkımızda & Kulüp", icon: MessageSquareText },
    { id: "ara-banner", label: "Ara Reklam Bannerları", icon: ImageIcon },
    { id: "alt-cta", label: "Footer Öncesi Afiş (CTA)", icon: Flag },
  ]

  return (
    <div className="space-y-6 pb-20">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
               <Layers className="w-6 h-6 text-primary" />
               Web Bölümleri Yönetimi
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Web sitesinde gördüğünüz tüm alanları (Bölümleri) detaylı olarak buradan kontrol edebilirsiniz.</p>
          </div>
          <Button className="font-bold whitespace-nowrap bg-primary text-primary-foreground shadow-md hover:scale-105 transition-transform h-12 px-6">
             <Save className="w-4 h-4 mr-2" /> Değişiklikleri Yayınla
          </Button>
       </div>

       <div className="flex flex-col xl:flex-row gap-8">
          
          {/* Sidebar Menu */}
          <div className="w-full xl:w-72 shrink-0 bg-card border border-border rounded-2xl shadow-sm p-3 h-fit sticky top-24">
             <div className="space-y-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all font-semibold text-sm ${
                      activeTab === tab.id 
                        ? "bg-primary text-primary-foreground shadow-sm pointer-events-none" 
                        : "bg-transparent text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <tab.icon className={`w-4 h-4 mr-3 ${activeTab === tab.id ? "opacity-100" : "opacity-70"}`} />
                    {tab.label}
                  </button>
                ))}
             </div>
          </div>

          {/* Tab Contents */}
          <div className="flex-1 space-y-6">
             
             {activeTab === "top-banner" && (
                <div className="bg-card border border-border rounded-2xl shadow-sm p-6 lg:p-8 animate-in fade-in zoom-in-95 duration-200">
                   <h2 className="text-xl font-bold mb-6 flex items-center border-b border-border pb-4">
                      <Megaphone className="w-5 h-5 mr-3 text-primary" /> Üst Kayan Şerit (Top Bar) Ayarları
                   </h2>
                   
                   <div className="space-y-6">
                      <div className="flex items-center gap-4 bg-muted/50 p-4 rounded-xl border border-border">
                         <div className="flex items-center gap-2">
                           <input type="checkbox" id="showTopBar" defaultChecked className="w-4 h-4 rounded border-border" />
                           <label htmlFor="showTopBar" className="font-bold text-sm cursor-pointer">Sitede Göster</label>
                         </div>
                         <p className="text-xs text-muted-foreground ml-auto">Kapatılırsa sitede ince şerit görünmez.</p>
                      </div>

                      <div className="space-y-3">
                         <label className="text-sm font-bold flex items-center"><Type className="w-4 h-4 mr-2 text-muted-foreground" /> Şerit Kayan Metni</label>
                         <input type="text" defaultValue="🚨 2026 Erken Kayıt Dönemi Başladı! LGS ve YKS Paketlerinde %30 İndirimi Kaçırmayın!" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
                      </div>

                      <div className="space-y-3">
                         <label className="text-sm font-bold flex items-center"><Link2 className="w-4 h-4 mr-2 text-muted-foreground" /> Şerit Tıklama Linki (İsteğe Bağlı)</label>
                         <input type="text" defaultValue="/paketler/erken-kayit" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none font-mono text-muted-foreground" />
                      </div>

                      <div className="space-y-3 pt-4">
                         <label className="text-sm font-bold">Arka Plan Rengi</label>
                         <div className="flex gap-3">
                            {['bg-primary', 'bg-accent', 'bg-destructive', 'bg-foreground'].map((color, i) => (
                               <div key={color} className={`w-10 h-10 rounded-lg cursor-pointer flex items-center justify-center ${color} ring-offset-2 ${i === 0 ? 'ring-2 ring-primary' : ''}`} />
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
             )}

             {activeTab === "hero" && (
                <div className="bg-card border border-border rounded-2xl shadow-sm p-6 lg:p-8 animate-in fade-in zoom-in-95 duration-200">
                   <h2 className="text-xl font-bold mb-6 flex items-center border-b border-border pb-4">
                      <LayoutTemplate className="w-5 h-5 mr-3 text-primary" /> Giriş (Hero) Alanı
                   </h2>
                   
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-6">
                         <div className="space-y-3">
                            <label className="text-sm font-bold">Büyük Başlık (H1)</label>
                            <input type="text" defaultValue="Yeni Nesil Sorularla Başarıya Ulaşın" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none font-bold" />
                         </div>
                         <div className="space-y-3">
                            <label className="text-sm font-bold">Alt Açıklama (Paragraf)</label>
                            <textarea rows={4} defaultValue="Türkiye geneli LGS ve TYT/AYT deneme paketleri ile anlık başarı analizini cebinizde taşıyın. Uzman kadro ve video çözümlerle hedefinize bir adım daha yaklaşın." className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none resize-none"></textarea>
                         </div>
                         
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                               <label className="text-sm font-bold">1. Buton Metni</label>
                               <input type="text" defaultValue="Paketleri İncele" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
                            </div>
                            <div className="space-y-3">
                               <label className="text-sm font-bold">1. Buton Linki</label>
                               <input type="text" defaultValue="/paketini-kendin-sec" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-mono text-muted-foreground outline-none" />
                            </div>
                         </div>
                      </div>

                      <div className="space-y-6 border-l border-border pl-0 lg:pl-8">
                         <div className="space-y-3">
                            <label className="text-sm font-bold">Hero Sağ Görsel Veya Video</label>
                            <div className="border-2 border-dashed border-border rounded-2xl h-56 flex flex-col items-center justify-center bg-muted/30 hover:bg-muted/50 transition cursor-pointer group object-cover overflow-hidden relative">
                               <div className="absolute inset-0 bg-primary/5"></div>
                               <ImageIcon className="w-8 h-8 text-muted-foreground mb-3 group-hover:scale-110 transition-transform relative z-10" />
                               <span className="text-sm font-bold text-foreground relative z-10">Görsel Değiştir</span>
                               <span className="text-xs text-muted-foreground mt-1 relative z-10">Tavsiye: 800x800px Şeffaf PNG</span>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             )}

             {activeTab === "hakkimizda" && (
                <div className="bg-card border border-border rounded-2xl shadow-sm p-6 lg:p-8 animate-in fade-in zoom-in-95 duration-200 space-y-8">
                   <h2 className="text-xl font-bold flex items-center border-b border-border pb-4">
                      <MessageSquareText className="w-5 h-5 mr-3 text-primary" /> Hakkımızda & Kulüp Ayrıcalıkları
                   </h2>

                   <div className="space-y-6">
                      <div className="space-y-3">
                         <label className="text-sm font-bold">Bölüm Başlığı</label>
                         <input type="text" defaultValue="Neden Çözsen Deneme Kulübü?" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none font-bold" />
                      </div>
                      
                      {/* Özellik Kutuları Array Simulation */}
                      <div className="space-y-4">
                         <label className="text-sm font-bold">Özellik Kutucukları (Grid)</label>
                         {[
                           { title: "Türkiye Geneli Sıralama", desc: "Optiği okuttuğunuz anda binlerce kişi içindeki yerinizi görün." },
                           { title: "Uzman Çözüm Videoları", desc: "Her sorunun profesyonel eğitmenlerce hazırlanmış akıllı tahta çözümleri." },
                           { title: "Kurumsal Yayınlar", desc: "Evinize gönderilen paketlerde daima Türkiye'nin en seçkin yayınları." },
                         ].map((item, i) => (
                           <div key={i} className="flex gap-4 items-center bg-muted/30 p-4 border border-border rounded-xl group relative">
                              <div className="absolute -left-2 -top-2 w-6 h-6 bg-primary text-primary-foreground font-bold flex items-center justify-center rounded-full text-xs shadow-md">{i+1}</div>
                              <input type="text" defaultValue={item.title} className="w-1/3 bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none font-semibold" />
                              <input type="text" defaultValue={item.desc} className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none" />
                              <button className="text-destructive font-bold text-xs px-2 hover:underline">Sil</button>
                           </div>
                         ))}
                         <Button variant="outline" size="sm" className="w-full mt-2 font-bold border-dashed border-2">
                           + Yeni Kutu Ekle
                         </Button>
                      </div>
                   </div>
                </div>
             )}

             {activeTab === "ara-banner" && (
                <div className="bg-card border border-border rounded-2xl shadow-sm p-6 lg:p-8 animate-in fade-in zoom-in-95 duration-200">
                   <h2 className="text-xl font-bold mb-6 flex items-center border-b border-border pb-4">
                      <ImageIcon className="w-5 h-5 mr-3 text-primary" /> Ara Reklam Bannerları
                   </h2>
                   
                   <p className="text-sm text-muted-foreground mb-6">Sitenin orta kısımlarında yer alan tam genişlikteki dikkat çekici afişler.</p>

                   <div className="space-y-8">
                     
                     <div className="p-6 border border-border rounded-xl bg-muted/10 relative">
                        <span className="absolute -top-3 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold shadow-sm">Banner Alanı 1</span>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                           <div className="space-y-4">
                              <div className="space-y-2">
                                 <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Banner Başlığı</label>
                                 <input type="text" defaultValue="Dijital Karnen Cebinde!" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none font-bold" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Alt Başlık</label>
                                 <textarea rows={2} defaultValue="Uygulamamızı indirin, mobil optik okuyucu ile sonucunuzu anında alın." className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none resize-none"></textarea>
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Afiş / Arka Plan Görseli</label>
                              <div className="border border-border rounded-lg h-24 bg-muted/50 flex items-center justify-center cursor-pointer hover:bg-muted transition">
                                <span className="text-xs font-bold text-foreground">Görseli Yenile</span>
                              </div>
                           </div>
                        </div>
                     </div>

                   </div>
                </div>
             )}

             {activeTab === "alt-cta" && (
                <div className="bg-card border border-border rounded-2xl shadow-sm p-6 lg:p-8 animate-in fade-in zoom-in-95 duration-200">
                   <h2 className="text-xl font-bold mb-6 flex items-center border-b border-border pb-4">
                      <Flag className="w-5 h-5 mr-3 text-primary" /> Footer Öncesi Harekete Geçirici Afiş
                   </h2>
                   
                   <p className="text-sm text-muted-foreground mb-8">Sayfanın en altındaki büyük ve dikkat dağıtmayan, son karar verdirici modül.</p>

                   <div className="space-y-6 max-w-2xl">
                       <div className="space-y-3">
                          <label className="text-sm font-bold">Başlık Metni</label>
                          <input type="text" defaultValue="Binlerce Başarılı Öğrenci Arasında Yerinizi Alın" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none font-bold text-lg" />
                       </div>
                       
                       <div className="space-y-3">
                          <label className="text-sm font-bold">Açıklama</label>
                          <textarea rows={3} defaultValue="Özel deneme paketlerimizi inceleyin ve size uygun kutuyu seçerek üyeliğinizi hemen başlatın." className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none resize-none"></textarea>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4 border-t border-border pt-6 mt-6">
                            <div className="space-y-3">
                               <label className="text-sm font-bold">CTA Buton Yazısı</label>
                               <input type="text" defaultValue="Hemen Başla" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none font-bold text-primary" />
                            </div>
                            <div className="space-y-3">
                               <label className="text-sm font-bold">Yönlendirme Linki</label>
                               <input type="text" defaultValue="/paketler" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-mono text-muted-foreground focus:ring-2 focus:ring-primary/50 outline-none" />
                            </div>
                         </div>
                   </div>
                </div>
             )}

          </div>
       </div>
    </div>
  )
}
