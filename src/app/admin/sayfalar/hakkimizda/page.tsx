"use client"

import { Button } from "@/components/ui/button"
import { MessageSquareText, Save, LayoutTemplate, Image as ImageIcon, Users, Bold, Italic, Link2, List, Type, Maximize } from "lucide-react"

export default function AdminHakkimizda() {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-3 text-primary">
            <MessageSquareText className="w-8 h-8" />
            "Hakkımızda" Sayfası Yönetimi
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">Kurumsal kimliğinizi, ekibinizi ve vizyonunuzu anlattığınız "Biz Kimiz?" sayfasını zengin metin editörleriyle düzenleyin.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
           <Button className="w-full sm:w-auto h-14 px-8 text-lg font-bold bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
              <Save className="w-5 h-5 mr-3" /> Canlıya Al
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
         {/* Kurum Bilgisi Devasa Editör Alanı */}
         <div className="xl:col-span-2 space-y-8">
            <div className="bg-card border-2 border-border rounded-3xl shadow-sm overflow-hidden flex flex-col">
               <div className="p-6 border-b border-border bg-muted/20 flex items-center gap-4">
                  <LayoutTemplate className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-bold">Vizyon & Misyon Metinleri</h2>
               </div>
               
               <div className="p-6 md:p-8 space-y-8 flex-1">
                  <div className="space-y-3">
                     <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground block">Sayfa Ana Başlığı (H1)</label>
                     <input type="text" defaultValue="Çözsen Eğitim Teknolojileri" className="w-full bg-background border-2 border-border rounded-2xl px-6 py-4 text-2xl font-black focus:ring-4 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/30 focus:border-primary" />
                  </div>

                  <div className="space-y-3">
                     <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground block">Biz Kimiz? (Detaylı Kurum Metni)</label>
                     
                     {/* Modern WYSIWYG Mockup */}
                     <div className="border-2 border-border rounded-2xl overflow-hidden focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/20 transition-all bg-background">
                        <div className="flex items-center gap-1 border-b border-border p-2 bg-muted/40 px-4">
                           <button className="p-2 transition-colors hover:bg-background rounded-lg text-foreground"><Type className="w-4 h-4" /></button>
                           <div className="w-px h-6 bg-border mx-2"></div>
                           <button className="p-2 transition-colors hover:bg-background rounded-lg text-muted-foreground hover:text-foreground"><Bold className="w-4 h-4" /></button>
                           <button className="p-2 transition-colors hover:bg-background rounded-lg text-muted-foreground hover:text-foreground"><Italic className="w-4 h-4" /></button>
                           <div className="w-px h-6 bg-border mx-2"></div>
                           <button className="p-2 transition-colors hover:bg-background rounded-lg text-muted-foreground hover:text-foreground"><List className="w-4 h-4" /></button>
                           <button className="p-2 transition-colors hover:bg-background rounded-lg text-muted-foreground hover:text-foreground"><Link2 className="w-4 h-4" /></button>
                           <button className="p-2 transition-colors hover:bg-background rounded-lg text-muted-foreground hover:text-foreground"><ImageIcon className="w-4 h-4" /></button>
                           <div className="ml-auto">
                              <button className="p-2 transition-colors hover:bg-background rounded-lg text-muted-foreground hover:text-foreground"><Maximize className="w-4 h-4" /></button>
                           </div>
                        </div>
                        <textarea rows={10} defaultValue="2018 yılından bu yana eğitim teknolojilerine yön veren, Türkiye genelinde 10.000'den fazla öğrencinin başarıya ulaşmasına aracılık eden dijital bir deneme platformuyuz. Yenilikçi tarama altyapımız ve uzman hocalarımızla süreci iyileştiriyoruz. Eğitimi her zaman yeni nesil yöntemlerle destekliyor ve basılı yayıncılıkla dijital ölçmeyi mükemmel bir şekilde harmanlıyoruz." className="w-full bg-transparent p-6 text-base md:text-lg leading-relaxed outline-none resize-y min-h-[300px] font-medium"></textarea>
                        <div className="bg-muted px-4 py-2 text-xs font-semibold text-muted-foreground text-right border-t border-border">
                           Son Kaydedilme: 2 dakika önce | 342 Kelime
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Takım / Medya / İstatistikler Sidebar */}
         <div className="xl:col-span-1 space-y-8">
            <div className="bg-card border-2 border-border rounded-3xl shadow-sm p-6 lg:p-8 space-y-6">
               <div className="space-y-4">
                  <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground block border-b border-border pb-2">Kurumsal Tanıtım Görseli / Ofis Fotoğrafı</label>
                  <div className="border-4 border-dashed border-border rounded-2xl h-64 flex flex-col items-center justify-center bg-muted/20 hover:bg-primary/5 transition-all cursor-pointer group shadow-inner">
                     <ImageIcon className="w-12 h-12 text-muted-foreground mb-4 group-hover:scale-110 group-hover:text-primary transition-all duration-300" />
                     <span className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">Sürükle veya Göz At</span>
                     <span className="text-xs font-bold text-muted-foreground mt-2 uppercase tracking-widest bg-background px-3 py-1 rounded-full border border-border">Maks: 5MB • 1920x1080px</span>
                  </div>
               </div>
            </div>

            <div className="bg-card border-2 border-border rounded-3xl shadow-sm p-6 lg:p-8 space-y-6 sticky top-24">
               <h2 className="text-lg font-bold border-b border-border pb-3 flex items-center text-primary">
                  <Users className="w-6 h-6 mr-3" /> İstatistikler & Rakamlar
               </h2>
               
               <p className="text-sm text-muted-foreground font-medium leading-relaxed">Sayfanın ortasında dev puntolarla gösterilecek güven aşılayıcı rakamlar. Burayı ne kadar kalabalık tutarsanız sayfa o kadar kurumsal hissedilir.</p>

               <div className="space-y-4">
                  {[
                     { label: "Kayıtlı Öğrenci", number: "15.000+" },
                     { label: "Çözülen Soru", number: "1M+" },
                     { label: "İş Birliği Yapılan Yayın", number: "24" },
                     { label: "Ödüllü Eğitmen", number: "50+" },
                  ].map((stat, i) => (
                     <div key={i} className="flex flex-col gap-2 bg-background p-4 rounded-2xl border-2 border-border group focus-within:border-primary transition-colors hover:shadow-md">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Başlık</label>
                        <input type="text" defaultValue={stat.label} className="w-full bg-transparent text-sm font-bold outline-none" />
                        <div className="flex justify-between items-center border-t border-border pt-2 mt-2">
                           <input type="text" defaultValue={stat.number} className="w-1/2 bg-transparent text-2xl font-black text-primary outline-none" />
                           <button className="text-xs font-bold px-3 py-1.5 rounded bg-muted hover:bg-destructive hover:text-white transition-colors">Kaldır</button>
                        </div>
                     </div>
                  ))}
               </div>
               
               <div className="pt-4 border-t border-border">
                  <Button variant="outline" className="w-full h-12 border-dashed border-2 font-bold text-primary hover:bg-primary/5">
                     <Users className="w-4 h-4 mr-2" /> Yeni İstatistik Ekle
                  </Button>
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}
