"use client"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Layers, Plus, Search, Edit2, Trash2, CheckCircle2, X, GripVertical, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

type Level = { id: string; name: string; created_at: string; sort_order?: number }

export default function ClassesManagementPage() {
  const supabase = createClient()
  const [levels, setLevels] = useState<Level[]>([])
  const [loading, setLoading] = useState(true)

  // Add & Edit states
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [className, setClassName] = useState("")

  // Drag & Drop states
  const dragItem = useRef<number | null>(null)
  const dragOverItem = useRef<number | null>(null)
  const [isSavingOrder, setIsSavingOrder] = useState(false)

  // Akıllı Regex Sınıf Seviye Hesaplayıcı
  const calculateSortOrder = (name: string) => {
    const text = name.toUpperCase();
    const match = text.match(/\d+/);
    if (match) {
      return parseInt(match[0], 10) * 10;
    }
    // Özel isimlendirme eşleştirme
    if (text.includes("ÖNCESİ") || text.includes("KREŞ") || text.includes("ANAOKUL") || text.includes("İLKOKUL")) return 0;
    if (text.includes("LGS") || text.includes("ORTAOKUL")) return 80;
    if (text.includes("LİSE")) return 90;
    if (text.includes("TYT") || text.includes("YKS") || text.includes("AYT")) return 120;
    if (text.includes("MEZUN")) return 130;
    if (text.includes("KPSS") || text.includes("DGS") || text.includes("ALES")) return 140;
    return 9999; // Bulunamayanlar en alta
  }

  useEffect(() => {
    fetchLevels()
  }, [])

  // Drag & Drop Events
  const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    dragItem.current = index
  }

  const handleDragEnter = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    dragOverItem.current = index
  }

  const handleDragEnd = async () => {
    if (dragItem.current === null || dragOverItem.current === null) return
    if (dragItem.current === dragOverItem.current) {
        dragItem.current = null
        dragOverItem.current = null
        return
    }

    const copyListItems = [...levels]
    const dragItemContent = copyListItems[dragItem.current]
    copyListItems.splice(dragItem.current, 1)
    copyListItems.splice(dragOverItem.current, 0, dragItemContent)
    
    dragItem.current = null
    dragOverItem.current = null
    setLevels(copyListItems) // Hemen UI'yı güncelle (Optimistic)

    setIsSavingOrder(true)
    for (let i = 0; i < copyListItems.length; i++) {
       await supabase.from('levels').update({ sort_order: (i + 1) * 10 }).eq('id', copyListItems[i].id)
    }
    setIsSavingOrder(false)
  }

  async function fetchLevels() {
    setLoading(true)
    const { data } = await supabase.from('levels').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: true })
    if (data) setLevels(data)
    setLoading(false)
  }

  async function handleSave() {
    if (!className.trim()) {
      alert("Lütfen bir sınıf adı girin.")
      return
    }

    const sortNum = calculateSortOrder(className);

    if (editId) {
      // Update
      const { error } = await supabase.from('levels').update({ name: className, sort_order: sortNum }).eq('id', editId)
      if (error) alert(error.message)
    } else {
      // Insert
      const { error } = await supabase.from('levels').insert([{ name: className, sort_order: sortNum }])
      if (error) alert(error.message)
    }

    setShowForm(false)
    setClassName("")
    setEditId(null)
    fetchLevels()
  }

  function handleEdit(lvl: Level) {
    setClassName(lvl.name)
    setEditId(lvl.id)
    setShowForm(true)
  }

  async function handleDelete(id: string) {
    if (confirm("Bu sınıfı silerseniz, bu sınıfa bağlı ÖĞRENCİLERİN ve PAKETLERİN sınıf bilgileri boşa düşebilir! Yinede silmek istediğinize emin misiniz?")) {
      await supabase.from('levels').delete().eq('id', id)
      fetchLevels()
    }
  }

  return (
    <div className="space-y-8 pb-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
         <div>
            <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
               <Layers className="w-8 h-8 text-primary" /> Sınıf & Kategori Yönetimi
               {isSavingOrder && (
                  <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full animate-pulse ml-2 flex items-center gap-2">
                     <Loader2 className="w-4 h-4 animate-spin"/> Sıralama Kaydediliyor...
                  </span>
               )}
            </h1>
            <p className="text-sm font-medium text-muted-foreground mt-2 max-w-2xl">
               Burada eklediğiniz veya düzenlediğiniz sınıflar; hem Öğrenci Kayıt aşamasında hem de "Tüm Deneme Paketleri" oluşturma ekranındaki filtre/kategori (Sınıf) menüsüne otomatik dahil olur.
            </p>
         </div>
         <div className="flex items-center gap-3 shrink-0">
             <Button onClick={() => { setShowForm(true); setEditId(null); setClassName("") }} className="font-bold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
                <Plus className="w-5 h-5 mr-2" /> Yeni Sınıf Ekle
             </Button>
         </div>
      </div>

      {/* FORM MODAL / INLINE */}
      {showForm && (
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex flex-col sm:flex-row items-end gap-4 animate-in fade-in slide-in-from-top-4">
           <div className="flex-1 w-full space-y-2">
              <label className="text-xs font-black uppercase text-primary tracking-widest">Sınıf / Kategori Adı</label>
              <input 
                 type="text" 
                 value={className} 
                 onChange={e => setClassName(e.target.value)}
                 autoFocus
                 placeholder="Örn: 8. Sınıf (LGS)" 
                 className="w-full bg-background border-2 border-border focus:border-primary rounded-xl px-4 py-3 font-bold outline-none" 
              />
           </div>
           <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button onClick={() => setShowForm(false)} variant="outline" className="flex-1 sm:w-auto py-6 font-bold">İptal</Button>
              <Button onClick={handleSave} className="flex-1 sm:w-auto py-6 font-black bg-primary">
                 <CheckCircle2 className="w-5 h-5 mr-2" /> {editId ? "Güncelle" : "Kaydet"}
              </Button>
           </div>
        </div>
      )}

      {/* LIST SECTION */}
      <div className="bg-card border-2 border-border rounded-3xl p-6 shadow-sm overflow-hidden">
         <div className="flex items-center gap-4 mb-6 border-b border-border pb-6">
            <div className="relative flex-1 max-w-sm">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
               <input type="text" placeholder="Sınıf ara..." className="w-full bg-background border-2 border-border rounded-xl px-12 py-3 text-sm font-bold outline-none focus:border-primary" />
            </div>
         </div>

         <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-muted/50 border-b border-border text-xs uppercase tracking-widest text-muted-foreground font-black">
                    <th className="p-4 w-16 text-center">İD</th>
                    <th className="p-4">Sınıf / Kategori Adı</th>
                    <th className="p-4">Oluşturulma</th>
                    <th className="p-4 text-right">İşlemler</th>
                 </tr>
               </thead>
               <tbody>
                  {loading ? (
                    <tr><td colSpan={4} className="p-10 text-center font-bold text-muted-foreground">Sınıflar yükleniyor...</td></tr>
                  ) : levels.length === 0 ? (
                    <tr><td colSpan={4} className="p-10 text-center font-bold text-muted-foreground">Hiç sınıf eklenmemiş. "Yeni Sınıf Ekle" butonunu kullanın.</td></tr>
                  ) : levels.map((lvl, idx) => (
                    <tr 
                       key={lvl.id} 
                       draggable 
                       onDragStart={(e) => handleDragStart(e, idx)}
                       onDragEnter={(e) => handleDragEnter(e, idx)}
                       onDragEnd={handleDragEnd}
                       className="border-b last:border-0 border-border hover:bg-muted/20 transition-colors group cursor-move"
                    >
                       <td className="p-4 text-center text-xs font-bold text-muted-foreground">
                          <div className="flex items-center justify-center gap-2">
                             <GripVertical className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors cursor-grab active:cursor-grabbing" />
                             {idx + 1}
                          </div>
                       </td>
                       <td className="p-4 font-black text-foreground text-lg flex items-center gap-3">
                          <Layers className="w-5 h-5 text-primary opacity-50" /> {lvl.name}
                       </td>
                       <td className="p-4 text-sm font-medium text-muted-foreground">
                          {new Date(lvl.created_at).toLocaleDateString('tr-TR')}
                       </td>
                       <td className="p-4 text-right space-x-2">
                          <Button onClick={() => handleEdit(lvl)} size="icon" variant="ghost" className="text-primary hover:bg-primary/10">
                             <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button onClick={() => handleDelete(lvl.id)} size="icon" variant="ghost" className="text-destructive hover:bg-destructive/10">
                             <Trash2 className="w-4 h-4" />
                          </Button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

    </div>
  )
}
