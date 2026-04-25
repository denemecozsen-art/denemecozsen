"use client"

import { Button } from "@/components/ui/button"
import { Tags, Plus, Edit2, Trash2, GripVertical } from "lucide-react"

export default function AdminCategoryPage() {
  const mockCategories = [
    { id: 1, name: "5. Sınıf", slug: "5-sinif", type: "Ortaokul", packageCount: 2 },
    { id: 2, name: "6. Sınıf", slug: "6-sinif", type: "Ortaokul", packageCount: 4 },
    { id: 3, name: "7. Sınıf", slug: "7-sinif", type: "Ortaokul", packageCount: 3 },
    { id: 4, name: "8. Sınıf", slug: "8-sinif", type: "LGS Hazırlık", packageCount: 15 },
    { id: 5, name: "TYT", slug: "tyt", type: "Üniversite Hazırlık", packageCount: 8 },
    { id: 6, name: "YKS", slug: "yks", type: "Üniversite Hazırlık", packageCount: 12 },
    { id: 7, name: "Mezun", slug: "mezun", type: "Üniversite Hazırlık", packageCount: 6 },
  ]

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Tags className="w-6 h-6 text-primary" />
            Kategori Yönetimi
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Sınıf seviyelerini ve eğitim türlerini buradan belirleyin. Sitedeki filtrelemeler bu yapıya göre çalışır.</p>
        </div>
        <Button className="font-bold whitespace-nowrap">
           <Plus className="w-4 h-4 mr-2" /> Yeni Kategori
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* List View */}
         <div className="lg:col-span-2 space-y-4">
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
               <div className="p-4 border-b border-border bg-muted/30">
                  <h2 className="font-bold text-lg">Mevcut Kategoriler</h2>
                  <p className="text-xs text-muted-foreground mt-1">Sıralamayı değiştirmek için <GripVertical className="inline-block w-3 h-3"/> ikonundan tutup sürükleyin.</p>
               </div>
               
               <div className="divide-y divide-border">
                  {mockCategories.map((cat) => (
                    <div key={cat.id} className="flex flex-col sm:flex-row sm:items-center p-4 hover:bg-muted/10 transition group gap-4">
                       <div className="flex items-center gap-3 w-full sm:w-1/3">
                          <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab active:cursor-grabbing hover:text-foreground shrink-0" />
                          <div>
                             <h3 className="font-bold text-foreground">{cat.name}</h3>
                             <span className="text-xs font-mono text-muted-foreground">/{cat.slug}</span>
                          </div>
                       </div>
                       
                       <div className="w-full sm:w-1/3 px-8 sm:px-0">
                          <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-border">
                            {cat.type}
                          </span>
                       </div>
                       
                       <div className="w-full sm:w-1/3 px-8 sm:px-0 flex justify-between items-center sm:justify-end gap-6">
                          <div className="text-center">
                             <span className="block text-xs font-semibold text-muted-foreground">Bağlı Paket</span>
                             <span className="font-bold text-primary">{cat.packageCount}</span>
                          </div>
                          
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button className="p-2 text-muted-foreground hover:text-primary transition-colors bg-background border border-border rounded-md shadow-sm"><Edit2 className="w-4 h-4" /></button>
                             <button className="p-2 text-muted-foreground hover:text-destructive transition-colors bg-background border border-border rounded-md shadow-sm"><Trash2 className="w-4 h-4" /></button>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Form View */}
         <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl shadow-sm p-6 sticky top-24">
               <h2 className="text-lg font-bold border-b border-border pb-3 mb-6">Kategori Ekle/Düzenle</h2>
               
               <form className="space-y-5">
                  <div className="space-y-2">
                     <label className="text-sm font-semibold">Kategori Adı</label>
                     <input type="text" placeholder="Örn: 9. Sınıf" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  
                  <div className="space-y-2">
                     <label className="text-sm font-semibold">URL Sümüklüböceği (Slug)</label>
                     <input type="text" placeholder="orn-9-sinif" className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm outline-none font-mono text-muted-foreground" readOnly />
                     <p className="text-[10px] text-muted-foreground mt-1">İsimden otomatik oluşturulur.</p>
                  </div>
                  
                  <div className="space-y-2">
                     <label className="text-sm font-semibold">Eğitim Kademesi</label>
                     <select className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 appearance-none">
                        <option>Ortaokul</option>
                        <option>Lise (Ara Sınıf)</option>
                        <option>LGS Hazırlık</option>
                        <option>Üniversite Hazırlık (YKS)</option>
                     </select>
                  </div>
                  
                  <div className="pt-4 border-t border-border mt-6 flex gap-3">
                     <Button type="button" variant="outline" className="flex-1">İptal</Button>
                     <Button type="submit" className="flex-1 font-bold">Kaydet</Button>
                  </div>
               </form>
            </div>
         </div>
      </div>
    </div>
  )
}
