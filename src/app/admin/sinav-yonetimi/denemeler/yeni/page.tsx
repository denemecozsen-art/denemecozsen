"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { buildAdminPath } from "@/lib/admin-config"
import {
  ArrowLeft, Save, FileText, Clock, Calendar, GraduationCap,
  Video, Upload, Loader2, Lock, ChevronRight, CheckCircle2, X, PlusCircle, Settings2, Columns3
} from "lucide-react"
import Link from "next/link"

const EXAM_SCHEMAS: Record<string, { name: string, count: number }[]> = {
  'LGS': [
    { name: 'Türkçe', count: 20 },
    { name: 'T.C. İnkılap Tarihi', count: 10 },
    { name: 'Din Kültürü', count: 10 },
    { name: 'İngilizce', count: 10 },
    { name: 'Matematik', count: 20 },
    { name: 'Fen Bilimleri', count: 20 },
  ],
  'TYT': [
    { name: 'Türkçe', count: 40 },
    { name: 'Sosyal Bilimler', count: 20 },
    { name: 'Matematik', count: 40 },
    { name: 'Fen Bilimleri', count: 20 },
  ],
  'AYT (Sayısal)': [
    { name: 'Matematik', count: 40 },
    { name: 'Fizik', count: 14 },
    { name: 'Kimya', count: 13 },
    { name: 'Biyoloji', count: 13 },
  ],
  'AYT (Eşit Ağırlık)': [
    { name: 'Matematik', count: 40 },
    { name: 'Türk Dili ve Edebiyatı', count: 24 },
    { name: 'Tarih-1', count: 10 },
    { name: 'Coğrafya-1', count: 6 },
  ]
}

function ExamFormInner() {
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('id')

  const [step, setStep] = useState(1)

  // Basic fields
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [levelId, setLevelId] = useState("")
  const [examType, setExamType] = useState("")
  const [period, setPeriod] = useState("")
  const [durationMinutes, setDurationMinutes] = useState(120)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [resultPublishMode, setResultPublishMode] = useState("instant")
  const [resultPublishDate, setResultPublishDate] = useState("")
  const [pdfUrl, setPdfUrl] = useState("")
  const [solutionVideoUrl, setSolutionVideoUrl] = useState("")
  const [isActive, setIsActive] = useState(true)

  // Answer Key State
  const [booklets, setBooklets] = useState<string[]>(['A']) // e.g. 'A', 'B'
  const [activeBooklet, setActiveBooklet] = useState('A')
  // Structured Answer Key: { A: { 'Türkçe': ['A','B',...], 'Matematik': [...] }, B: { ... } }
  const [structuredKey, setStructuredKey] = useState<Record<string, Record<string, string[]>>>({ A: {} })
  const [activeSubject, setActiveSubject] = useState<string>('')

  // Lookups
  const [levels, setLevels] = useState<any[]>([])
  const [examTypes, setExamTypes] = useState<any[]>([])
  const [examPeriods, setExamPeriods] = useState<any[]>([])
  
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(!!editId)
  const [uploadingPdf, setUploadingPdf] = useState(false)
  const pdfInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadLookups()
    if (editId) loadExam(editId)
  }, [editId])

  async function loadLookups() {
    const [lvlRes, typeRes, periodRes] = await Promise.all([
      supabase.from('levels').select('*').order('sort_order', { ascending: true }),
      supabase.from('exam_types').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
      supabase.from('exam_periods').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
    ])
    if (lvlRes.data) setLevels(lvlRes.data)
    if (typeRes.data) setExamTypes(typeRes.data)
    if (periodRes.data) setExamPeriods(periodRes.data)
  }

  async function loadExam(id: string) {
    setLoading(true)
    const { data } = await supabase.from('exams').select('*').eq('id', id).single()
    if (data) {
      setTitle(data.title || "")
      setDescription(data.description || "")
      setLevelId(data.level_id || "")
      setExamType(data.exam_type || "")
      setPeriod(data.period || "")
      setDurationMinutes(data.duration_minutes || 120)
      setStartDate(data.start_date ? new Date(data.start_date).toISOString().slice(0, 16) : "")
      setEndDate(data.end_date ? new Date(data.end_date).toISOString().slice(0, 16) : "")
      setResultPublishMode(data.result_publish_mode || "instant")
      setResultPublishDate(data.result_publish_date ? new Date(data.result_publish_date).toISOString().slice(0, 16) : "")
      setPdfUrl(data.pdf_url || "")
      setSolutionVideoUrl(data.solution_video_url || "")
      setIsActive(data.is_active ?? true)
      
      if (data.answer_key && !Array.isArray(data.answer_key)) {
        setStructuredKey(data.answer_key)
        setBooklets(Object.keys(data.answer_key))
      }
    }
    setLoading(false)
  }

  // --- Answer Key Logic ---
  const currentSchema = EXAM_SCHEMAS[examType] || [ { name: 'Genel Yetenek', count: 40 } ]
  
  useEffect(() => {
    if (!structuredKey[activeBooklet]) {
       const newBooklet = { ...structuredKey }
       newBooklet[activeBooklet] = {}
       setStructuredKey(newBooklet)
    }
    if (!activeSubject) {
       setActiveSubject(currentSchema[0].name)
    }
  }, [examType, activeBooklet, currentSchema])

  function handleSetAnswer(booklet: string, subject: string, index: number, val: string) {
    setStructuredKey(prev => {
       const clone = JSON.parse(JSON.stringify(prev))
       if (!clone[booklet]) clone[booklet] = {}
       if (!clone[booklet][subject]) clone[booklet][subject] = Array(currentSchema.find(s => s.name === subject)?.count || 0).fill("")
       
       // Toggle if same
       if (clone[booklet][subject][index] === val) {
          clone[booklet][subject][index] = ""
       } else {
          clone[booklet][subject][index] = val
       }
       return clone
    })
  }

  function handleAddBooklet() {
    const nextBooklet = String.fromCharCode(booklets[booklets.length-1].charCodeAt(0) + 1)
    if (nextBooklet > 'D') return alert("En fazla A,B,C,D kitapçıkları eklenebilir.")
    setBooklets([...booklets, nextBooklet])
    setActiveBooklet(nextBooklet)
  }

  async function handlePdfUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingPdf(true)
    const fileName = `exams/${Date.now()}_${file.name.replace(/\s+/g, '_')}`
    const { data, error } = await supabase.storage.from('media').upload(fileName, file, { contentType: 'application/pdf', upsert: true })
    if (!error) {
      const { data: urlData } = supabase.storage.from('media').getPublicUrl(fileName)
      if (urlData?.publicUrl) setPdfUrl(urlData.publicUrl)
    }
    setUploadingPdf(false)
  }

  async function handleSave() {
    if (!title.trim()) return alert("Sınav adı zorunludur!")
    setSaving(true)

    // Calculate total questions dynamically from current schema
    const totalQ = currentSchema.reduce((acc, curr) => acc + curr.count, 0)

    const payload: any = {
      title,
      description,
      level_id: levelId || null,
      exam_type: examType || null,
      period: period || null,
      duration_minutes: durationMinutes,
      start_date: startDate ? new Date(startDate).toISOString() : null,
      end_date: endDate ? new Date(endDate).toISOString() : null,
      result_publish_mode: resultPublishMode,
      pdf_url: pdfUrl || null,
      solution_video_url: solutionVideoUrl || null,
      is_active: isActive,
      total_questions: totalQ,
      answer_key: structuredKey, // Save as object: { A: { Turkce: ["A"],... }, B: {...} }
      updated_at: new Date().toISOString(),
    }

    if (resultPublishMode === 'scheduled' && resultPublishDate) {
      payload.result_publish_date = new Date(resultPublishDate).toISOString()
    }

    let error
    if (editId) {
      error = (await supabase.from('exams').update(payload).eq('id', editId)).error
    } else {
      error = (await supabase.from('exams').insert(payload)).error
    }

    setSaving(false)
    if (error) {
      alert("Hata: " + error.message)
    } else {
      router.push(buildAdminPath("/sinav-yonetimi/denemeler"))
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <Link href={buildAdminPath("/sinav-yonetimi/denemeler")}>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl"><ArrowLeft className="w-5 h-5" /></Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-foreground">{editId ? 'Sınavı Düzenle' : 'Yeni Sınav Oluştur'}</h1>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-3">
        <button onClick={() => setStep(1)} className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all ${step === 1 ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-card border-2 border-border text-muted-foreground'}`}>
          <FileText className="w-4 h-4" /> Temel Ayarlar
        </button>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
        <button onClick={() => setStep(2)} className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all ${step === 2 ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-card border-2 border-border text-muted-foreground'}`}>
          <Columns3 className="w-4 h-4" /> Kitapçık & Cevap Anahtarı
        </button>
      </div>

      {/* STEP 1: Ayarlar */}
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border-2 border-border rounded-3xl p-6 md:p-8 space-y-5">
               <h3 className="font-black text-lg flex items-center gap-2"><Settings2 className="text-primary w-5 h-5" /> Sınav Meta Bilgileri</h3>
               
               <div className="space-y-2">
                 <label className="text-xs font-black text-muted-foreground uppercase">Sınav Adı *</label>
                 <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Örn: 2026 LGS Türkiye Geneli - 1" className="w-full bg-background border-2 border-border rounded-xl px-4 py-3.5 font-bold outline-none focus:border-primary" />
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <label className="text-xs font-black text-muted-foreground uppercase">Sınav Türü *</label>
                   <select value={examType} onChange={e => { setExamType(e.target.value); setStructuredKey({A:{}}) }} className="w-full bg-background border-2 border-border rounded-xl px-4 py-3.5 font-bold outline-none focus:border-primary">
                     <option value="">Seçiniz</option>
                     {examTypes.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                     <option value="AYT (Sayısal)">AYT (Sayısal)</option>
                     <option value="AYT (Eşit Ağırlık)">AYT (Eşit Ağırlık)</option>
                   </select>
                 </div>
                 <div className="space-y-2">
                   <label className="text-xs font-black text-muted-foreground uppercase">Dönem</label>
                   <select value={period} onChange={e => setPeriod(e.target.value)} className="w-full bg-background border-2 border-border rounded-xl px-4 py-3.5 font-bold outline-none focus:border-primary">
                     <option value="">Seçiniz</option>
                     {examPeriods.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                   </select>
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <label className="text-xs font-black text-muted-foreground uppercase">Sınav Başlangıç</label>
                   <input type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-background border-2 border-border rounded-xl px-4 py-3.5 font-bold outline-none focus:border-primary" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-xs font-black text-muted-foreground uppercase">Sınav Bitiş</label>
                   <input type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full bg-background border-2 border-border rounded-xl px-4 py-3.5 font-bold outline-none focus:border-primary" />
                 </div>
               </div>
            </div>
            
            <Button onClick={() => setStep(2)} className="w-full h-14 font-black text-base shadow-xl shadow-primary/20">
               İleri: Cevap Anahtarına Geç <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <div className="space-y-6">
             <div className="bg-card border-2 border-border rounded-3xl p-6 space-y-4">
               <h3 className="font-black text-sm uppercase text-muted-foreground flex items-center gap-2"><Upload className="w-4 h-4" /> PDF & Medya</h3>
               <input value={pdfUrl} onChange={e => setPdfUrl(e.target.value)} placeholder="PDF URL" className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-primary" />
               <button onClick={() => pdfInputRef.current?.click()} className="w-full border-2 border-dashed border-border rounded-xl p-4 font-bold text-sm text-muted-foreground hover:bg-muted transition-colors">
                  {uploadingPdf ? "Yükleniyor..." : "Cihazdan Yükle"}
               </button>
               <input ref={pdfInputRef} type="file" accept=".pdf" onChange={handlePdfUpload} className="hidden" />
               
               <hr className="border-border" />
               <label className="text-xs font-black text-muted-foreground uppercase">Süre Kısıtı (DK)</label>
               <input type="number" value={durationMinutes} onChange={e => setDurationMinutes(Number(e.target.value))} className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 font-bold outline-none focus:border-primary" />
             </div>
          </div>
        </div>
      )}

      {/* STEP 2: CEVAP ANAHTARI OLUŞTURUCU (Yatay Kaydırmalı, Kitapçıklı) */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
           
           {!examType ? (
             <div className="bg-destructive/10 text-destructive font-bold p-6 rounded-2xl border border-destructive/30 text-center">
                Lütfen önce 1. Adıma dönüp "Sınav Türü" seçiniz. Seçilen sınav türüne göre ders alanları otomatik oluşturulacaktır.
             </div>
           ) : (
             <div className="bg-card border-none shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-[2.5rem] overflow-hidden flex flex-col">
                
                {/* Top Bar: Booklets */}
                <div className="bg-muted/40 border-b border-border p-4 px-6 md:px-8 flex items-center gap-3">
                   <h3 className="font-black text-sm uppercase tracking-wider text-muted-foreground mr-4">Kitapçık:</h3>
                   {booklets.map(b => (
                     <button key={b} onClick={() => setActiveBooklet(b)} className={`w-10 h-10 rounded-xl font-black text-sm transition-all ${activeBooklet === b ? 'bg-primary text-primary-foreground shadow-md scale-110' : 'bg-background border border-border text-muted-foreground hover:bg-muted'}`}>
                        {b}
                     </button>
                   ))}
                   {booklets.length < 4 && (
                     <button onClick={handleAddBooklet} className="w-10 h-10 rounded-xl font-black text-sm border-2 border-dashed border-border text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors flex items-center justify-center">
                        <PlusCircle className="w-4 h-4" />
                     </button>
                   )}
                </div>

                {/* Sub Bar: Subjects (Horizontal Scroll) */}
                <div className="border-b border-border bg-background w-full overflow-x-auto custom-scrollbar">
                   <div className="flex p-4 px-6 md:px-8 gap-3 min-w-max">
                      {currentSchema.map(subject => (
                         <button 
                            key={subject.name} 
                            onClick={() => setActiveSubject(subject.name)}
                            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeSubject === subject.name ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/20' : 'bg-muted/50 border border-border/60 text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                         >
                            {subject.name} <span className="opacity-60 text-xs ml-1">({subject.count})</span>
                         </button>
                      ))}
                   </div>
                </div>

                {/* Content: Bubble Inputs */}
                <div className="p-6 md:p-8 bg-card min-h-[400px]">
                   <h4 className="font-black text-xl mb-6 text-foreground flex items-center gap-2">
                       <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-600 flex items-center justify-center"><CheckCircle2 className="w-4 h-4" /></div>
                       Kitapçık {activeBooklet} / {activeSubject}
                   </h4>

                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-4">
                      {Array.from({ length: currentSchema.find(s => s.name === activeSubject)?.count || 0 }).map((_, index) => {
                         const currentVal = structuredKey[activeBooklet]?.[activeSubject]?.[index] || ""
                         return (
                           <div key={index} className="flex items-center justify-between p-2.5 bg-muted/20 border border-border/80 rounded-2xl hover:border-violet-500/30 transition-colors group">
                             <div className="w-8 text-center font-black text-sm text-muted-foreground group-hover:text-violet-600">
                               {index + 1}.
                             </div>
                             <div className="flex items-center gap-1.5">
                               {['A','B','C','D','E'].map(opt => (
                                  <button
                                     key={opt}
                                     onClick={() => handleSetAnswer(activeBooklet, activeSubject, index, opt)}
                                     className={`w-8 h-8 rounded-full font-black text-xs transition-all ${
                                        currentVal === opt 
                                           ? 'bg-violet-600 text-white shadow-md scale-110' 
                                           : 'bg-background border border-border text-muted-foreground hover:bg-violet-100 hover:text-violet-600 dark:hover:bg-violet-500/20'
                                     }`}
                                  >
                                     {opt}
                                  </button>
                               ))}
                             </div>
                           </div>
                         )
                      })}
                   </div>
                </div>
                
             </div>
           )}

           <div className="flex gap-4 pt-4">
              <Button onClick={() => setStep(1)} variant="outline" className="h-14 px-8 font-bold text-base border-2">Geri</Button>
              <Button onClick={handleSave} disabled={saving || !examType} className="flex-1 h-14 font-black text-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-xl shadow-emerald-500/20">
                 {saving ? "Kaydediliyor..." : "Sınavı Yayınla ve Kaydet"}
              </Button>
           </div>
        </div>
      )}

    </div>
  )
}

export default function ExamFormPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
      <ExamFormInner />
    </Suspense>
  )
}
