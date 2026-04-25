"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Save, Eye, Bold, Italic, List, Link as LinkIcon, Image as ImageIcon, Heading1, Heading2 } from "lucide-react"
import Link from "next/link"
import { buildAdminPath } from "@/lib/admin-config"

export default function AdminNewBlogPost() {
  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-4">
           <Link href={buildAdminPath("/blog")} className="w-10 h-10 bg-background border border-border rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition">
              <ArrowLeft className="w-5 h-5" />
           </Link>
           <div>
              <h1 className="text-2xl font-bold">Yeni Yazı Ekle</h1>
              <p className="text-sm text-muted-foreground">SEO uyumlu yeni bir içerik oluşturuyorsunuz.</p>
           </div>
        </div>
        
        <div className="flex w-full sm:w-auto gap-3">
           <Button variant="outline" className="flex-1 sm:w-auto font-bold text-muted-foreground">
              <Eye className="w-4 h-4 mr-2" />
              Önizle
           </Button>
           <Button className="flex-1 sm:w-auto font-bold bg-primary text-primary-foreground shadow-md hover:scale-105 transition-transform">
              <Save className="w-4 h-4 mr-2" />
              Yayınla
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
               <div className="p-4 border-b border-border bg-muted/20">
                  <input type="text" placeholder="Göz Alıcı Bir Başlık Yazın..." className="w-full bg-transparent text-2xl font-bold placeholder:text-muted-foreground/50 border-none outline-none focus:ring-0" />
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                     Kalıcı Bağlantı: <span className="text-primary font-mono bg-primary/5 px-2 rounded-md">/blog/goz-alici-bir-baslik</span> <button className="underline hover:text-foreground">Düzenle</button>
                  </div>
               </div>

               {/* Toolbar */}
               <div className="flex items-center gap-1 border-b border-border p-2 bg-muted/30 px-4">
                  <button className="p-2 hover:bg-background rounded-lg text-muted-foreground hover:text-foreground transition"><Heading1 className="w-4 h-4" /></button>
                  <button className="p-2 hover:bg-background rounded-lg text-muted-foreground hover:text-foreground transition"><Heading2 className="w-4 h-4" /></button>
                  <div className="w-px h-6 bg-border mx-2"></div>
                  <button className="p-2 hover:bg-background rounded-lg text-muted-foreground hover:text-foreground transition"><Bold className="w-4 h-4" /></button>
                  <button className="p-2 hover:bg-background rounded-lg text-muted-foreground hover:text-foreground transition"><Italic className="w-4 h-4" /></button>
                  <div className="w-px h-6 bg-border mx-2"></div>
                  <button className="p-2 hover:bg-background rounded-lg text-muted-foreground hover:text-foreground transition"><List className="w-4 h-4" /></button>
                  <button className="p-2 hover:bg-background rounded-lg text-muted-foreground hover:text-foreground transition"><LinkIcon className="w-4 h-4" /></button>
                  <button className="p-2 hover:bg-background rounded-lg text-muted-foreground hover:text-foreground transition"><ImageIcon className="w-4 h-4" /></button>
               </div>
               
               <div className="p-4 flex-1 min-h-[400px]">
                  <textarea placeholder="İçeriğinizi buraya yazmaya başlayın. Seçtiğiniz alanları renklendirebilir, görsel ekleyebilirsiniz..." className="w-full h-full bg-transparent text-sm placeholder:text-muted-foreground border-none outline-none focus:ring-0 resize-none font-medium leading-relaxed"></textarea>
               </div>
               
               <div className="bg-muted p-2 text-xs font-semibold text-muted-foreground text-right border-t border-border">
                  Kelime Sayısı: 0
               </div>
            </div>
         </div>

         <div className="lg:col-span-1 space-y-6">
            
            <div className="bg-card border border-border rounded-xl shadow-sm p-4 space-y-5 sticky top-24">
               
               <div className="space-y-2">
                  <label className="text-sm font-bold flex justify-between">Kategori</label>
                  <div className="bg-background border border-border rounded-lg p-3 max-h-40 overflow-y-auto custom-scrollbar space-y-2">
                     <label className="flex items-center gap-2 text-sm text-muted-foreground"><input type="checkbox" className="rounded border-muted checked:bg-primary" /> Duyurular</label>
                     <label className="flex items-center gap-2 text-sm text-muted-foreground"><input type="checkbox" className="rounded border-muted checked:bg-primary" /> Rehberlik</label>
                     <label className="flex items-center gap-2 text-sm text-foreground font-bold"><input type="checkbox" className="rounded border-muted checked:bg-primary" defaultChecked /> YKS Hazırlık</label>
                     <label className="flex items-center gap-2 text-sm text-muted-foreground"><input type="checkbox" className="rounded border-muted checked:bg-primary" /> LGS Sınav Taktikleri</label>
                  </div>
                  <button className="text-xs text-primary font-bold hover:underline mt-1">+ Yeni Kategori Ekle</button>
               </div>

               <div className="border-t border-border pt-4 space-y-2">
                  <label className="text-sm font-bold flex justify-between text-foreground">Öne Çıkan Görsel</label>
                  <div className="border-2 border-dashed border-border rounded-2xl h-32 flex flex-col items-center justify-center bg-muted/30 hover:bg-muted/50 transition cursor-pointer group">
                     <ImageIcon className="w-6 h-6 text-muted-foreground mb-2 group-hover:scale-110 transition-transform" />
                     <span className="text-xs font-bold text-muted-foreground">Tıklayıp Yükleyin (1200x630px)</span>
                  </div>
               </div>

               <div className="border-t border-border pt-4 space-y-2">
                  <label className="text-sm font-bold flex justify-between">SEO Ayarları</label>
                  <div className="space-y-3">
                     <input type="text" placeholder="Odak Anahtar Kelime (Örn: LGS deneme)" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/50" />
                     <textarea rows={3} placeholder="Meta Açıklaması (Arama sonuçlarında görünecek 150 karakterlik özet)" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/50 resize-none"></textarea>
                     <div className="bg-success/10 text-success text-xs font-semibold p-2 rounded-md flex items-center justify-between">
                        <span>SEO Puanı (Öngörülen):</span> <strong>İyi (85/100)</strong>
                     </div>
                  </div>
               </div>

            </div>

         </div>

      </div>
    </div>
  )
}
