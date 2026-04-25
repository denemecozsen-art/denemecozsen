"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react"

const levels = [
  { id: "5.", level: "5.", text: "SINIF" }, 
  { id: "6.", level: "6.", text: "SINIF" },
  { id: "7.", level: "7.", text: "SINIF" }, 
  { id: "8.", level: "8.", text: "SINIF | LGS" },
  { id: "TYT", level: "TYT", text: "HAZIRLIK" }, 
  { id: "YKS", level: "YKS", text: "HAZIRLIK" }
]

const months = [
  { name: "Ekim", publishers: ["Özdebir", "Töder", "Nartest"] },
  { name: "Kasım", publishers: ["Sinan Kuzucu", "Açı", "Hız Yayınevi"] },
  { name: "Aralık", publishers: ["Bilgi Sarmal", "Paraf", "Limit"] },
  { name: "Ocak", publishers: ["Kafa Dengi", "3D", "Apotemi"] },
]

export function MobilePackageWizard() {
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
  const [selectedPublishers, setSelectedPublishers] = useState<Record<string, string>>({})

  const scrollToStep = (stepIndex: number) => {
    if (scrollRef.current) {
      const el = scrollRef.current.children[stepIndex] as HTMLElement
      if (el) {
         el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
      }
    }
  }

  const handleLevelSelect = (id: string) => {
    setSelectedLevel(id)
    setTimeout(() => scrollToStep(1), 300)
  }

  const handlePublisherSelect = (month: string, pub: string) => {
    setSelectedPublishers(prev => ({ ...prev, [month]: pub }))
    // Opsiyonel: tüm aylar seçilince portal adımına geç / veya Next butonuyla geç.
  }

  const handleFinishStep2 = () => {
    scrollToStep(2)
  }

  const handleCreate = () => {
    router.push("/odeme")
  }

  return (
    <div className="w-full relative overflow-hidden bg-muted py-8 px-2 border-t border-border">
      <div className="text-center space-y-2 mb-8 px-4">
        <h2 className="text-2xl font-bold text-primary">Paketini Oluştur</h2>
        <p className="text-xs text-muted-foreground">3 Adımda sana özel deneme takvimini tamamla.</p>
      </div>

      <div 
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar w-full"
      >
        {/* STEP 1: SINIF SEÇİMİ */}
        <div className="min-w-full w-full snap-start shrink-0 px-4 flex flex-col items-center">
           <div className="bg-background border border-border rounded-3xl p-6 shadow-sm w-full max-w-sm space-y-6">
              <div className="flex justify-between items-center border-b border-border pb-4">
                 <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">1. Adım</span>
                 <span className="text-sm font-semibold text-primary">Sınıfını Seç</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                 {levels.map((item, i) => (
                    <button 
                      key={item.id}
                      onClick={() => handleLevelSelect(item.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${selectedLevel === item.id ? 'border-primary bg-primary/5 shadow-md scale-105' : 'border-border bg-muted hover:border-primary/50'}`}
                    >
                       <span className={`text-xl font-bold ${selectedLevel === item.id ? 'text-primary' : 'text-foreground'}`}>{item.level}</span>
                       <span className="text-[9px] font-bold text-muted-foreground mt-1">{item.text}</span>
                    </button>
                 ))}
              </div>
              <div className="pt-2 flex justify-end">
                 <Button variant="ghost" className="text-xs" onClick={() => scrollToStep(1)} disabled={!selectedLevel}>
                    Devam Et <ChevronRight className="w-4 h-4 ml-1"/>
                 </Button>
              </div>
           </div>
        </div>

        {/* STEP 2: AYLIK YAYIN SEÇİMİ */}
        <div className="min-w-full w-full snap-start shrink-0 px-4 flex flex-col items-center">
           <div className="bg-background border border-border rounded-3xl p-6 shadow-sm w-full max-w-sm flex flex-col max-h-[65vh]">
              <div className="flex justify-between items-center border-b border-border pb-4 mb-4 shrink-0">
                 <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">2. Adım</span>
                 <div className="flex items-center space-x-2">
                   <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => scrollToStep(0)}><ChevronLeft className="w-4 h-4" /></Button>
                   <span className="text-sm font-semibold text-primary">Yayınları Seç</span>
                 </div>
              </div>
              
              <div className="flex-1 overflow-y-auto hide-scrollbar space-y-6 pr-1">
                 {months.map((m) => (
                    <div key={m.name} className="space-y-3">
                       <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border/50 pb-1">{m.name}</h4>
                       <div className="flex overflow-x-auto gap-3 pb-2 snap-x hide-scrollbar">
                         {m.publishers.map((pub) => (
                           <button 
                              key={pub}
                              onClick={() => handlePublisherSelect(m.name, pub)}
                              className={`snap-center shrink-0 w-[100px] h-[70px] rounded-xl flex items-center justify-center border-2 text-xs font-bold transition-all px-2 text-center
                                ${selectedPublishers[m.name] === pub ? 'border-primary bg-primary/10 text-primary shadow-sm' : 'border-border bg-muted/50 text-muted-foreground'}`}
                           >
                              {pub}
                           </button>
                         ))}
                       </div>
                    </div>
                 ))}
              </div>

              <div className="pt-4 border-t border-border mt-auto shrink-0 flex justify-end">
                 <Button onClick={handleFinishStep2} className="w-full h-12 font-bold bg-primary text-primary-foreground">
                    Son Aşama <ArrowRight className="w-4 h-4 ml-2"/>
                 </Button>
              </div>
           </div>
        </div>

        {/* STEP 3: PORTAL / OLUŞTUR */}
        <div className="min-w-full w-full snap-start shrink-0 px-4 flex flex-col items-center">
           <div className="bg-background border border-border rounded-3xl p-6 shadow-sm w-full max-w-sm space-y-6">
              <div className="flex justify-between items-center border-b border-border pb-4">
                 <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">3. Adım</span>
                 <div className="flex items-center space-x-2">
                   <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => scrollToStep(1)}><ChevronLeft className="w-4 h-4" /></Button>
                   <span className="text-sm font-semibold text-primary">Onay & Kayıt</span>
                 </div>
              </div>
              
              <div className="bg-muted p-4 rounded-2xl border border-border/50 space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-muted-foreground">Seçilen Sınıf:</span>
                    <span className="font-extrabold text-primary">{selectedLevel ? levels.find(l => l.id === selectedLevel)?.level + " " + levels.find(l => l.id === selectedLevel)?.text : "-"}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-muted-foreground">Toplam Yayın:</span>
                    <span className="font-extrabold text-primary">{Object.keys(selectedPublishers).length} Adet</span>
                 </div>
                 <div className="border-t border-border pt-4 mt-2">
                    <ul className="space-y-2">
                      <li className="flex items-start text-xs font-medium text-foreground"><CheckCircle2 className="w-4 h-4 text-success mr-2 shrink-0"/> Ücretsiz Kargo</li>
                      <li className="flex items-start text-xs font-medium text-foreground"><CheckCircle2 className="w-4 h-4 text-success mr-2 shrink-0"/> Özel Sonuç Portalı</li>
                      <li className="flex items-start text-xs font-medium text-foreground"><CheckCircle2 className="w-4 h-4 text-success mr-2 shrink-0"/> Öğrenci Paneli</li>
                    </ul>
                 </div>
              </div>

              <Button onClick={handleCreate} className="w-full h-14 text-lg font-bold bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/20">
                 Paketi Oluştur & Öde
              </Button>
           </div>
        </div>

      </div>

      <div className="flex justify-center gap-2 mt-6">
        <div className="w-2 h-2 rounded-full bg-primary/20"></div>
        <div className="w-2 h-2 rounded-full bg-primary/20"></div>
        <div className="w-2 h-2 rounded-full bg-primary/20"></div>
      </div>
    </div>
  )
}
