"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, Lock, FileText, ChevronRight, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const classes = ["Tümü", "5. Sınıf", "6. Sınıf", "7. Sınıf", "8. Sınıf (LGS)", "TYT", "YKS"]

export default function AnswerKeysPage() {
  const supabase = createClient()
  const [answerKeys, setAnswerKeys] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClass, setSelectedClass] = useState("Tümü")

  useEffect(() => {
    fetchAnswerKeys()
  }, [])

  async function fetchAnswerKeys() {
    setLoading(true)
    const { data } = await supabase.from('cevap_anahtarlari').select('*').order('created_at', { ascending: false })
    if (data) setAnswerKeys(data)
    setLoading(false)
  }

  const filteredKeys = useMemo(() => {
    return answerKeys.filter(key => {
      const matchSearch = key.deneme_adi.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          key.seri.toLowerCase().includes(searchTerm.toLowerCase())
      const matchClass = selectedClass === "Tümü" || key.sinif === selectedClass
      return matchSearch && matchClass
    })
  }, [searchTerm, selectedClass, answerKeys])


  return (
    <div className="bg-muted min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
         <div className="mb-8 bg-card rounded-2xl p-8 border border-border shadow-sm relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
            <h1 className="text-3xl font-extrabold text-primary mb-2 relative z-10">Cevap Anahtarları</h1>
            <p className="text-muted-foreground relative z-10">Tanımlı paketinize ait tüm denemelerin detaylı çözüm belgelerine buradan ulaşabilirsiniz.</p>
         </div>

         <div className="bg-card rounded-2xl p-6 border border-border mt-8 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
               <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Yayınevi veya seri adı ile ara..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 h-12 rounded-xl bg-muted border-transparent focus:border-primary focus:bg-background transition outline-none text-sm"
                  />
               </div>
               <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 md:pb-0 snap-x">
                  {classes.map((cls, i) => (
                     <button 
                       key={i} 
                       onClick={() => setSelectedClass(cls)}
                       className={`snap-center shrink-0 px-4 py-2 flex items-center rounded-xl text-sm font-semibold transition ${selectedClass === cls ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                     >
                        {cls}
                     </button>
                  ))}
               </div>
            </div>

            <div className="space-y-2">
               {loading ? (
                  <div className="text-center py-12">
                     <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto" />
                  </div>
               ) : filteredKeys.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">Aradığınız kritere uygun cevap anahtarı bulunamadı.</div>
               ) : (
                  filteredKeys.map(key => (
                     <a href={key.pdf_url || '#'} key={key.id} target={key.pdf_url ? '_blank' : undefined} rel={key.pdf_url ? 'noopener noreferrer' : undefined} className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition group">
                        <div className="flex items-center space-x-4">
                           <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                              <FileText className="w-5 h-5" />
                           </div>
                           <div>
                              <h3 className="font-bold text-base group-hover:text-primary transition">{key.sinif} - {key.deneme_adi}</h3>
                              <p className="text-xs text-muted-foreground">{key.seri} • {key.yil} Yılı • PDF Dosyası</p>
                           </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition" />
                     </a>
                  ))
               )}
            </div>
         </div>
      </div>
    </div>
  )
}
