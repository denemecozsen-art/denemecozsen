"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Clock, Save, CheckCircle2, ArrowLeft, AlertTriangle,
  ChevronRight, ChevronLeft, Loader2, Lock, Eye, FileText
} from "lucide-react"

export default function SinavCozPage() {
  const supabase = createClient()
  const router = useRouter()
  const params = useParams()
  const examId = params.examId as string

  const [exam, setExam] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [resultId, setResultId] = useState<string | null>(null)

  // Booklet
  const [booklets, setBooklets] = useState<string[]>([])
  const [activeBooklet, setActiveBooklet] = useState<string>('')
  
  // Subjects
  const [subjects, setSubjects] = useState<{name: string, count: number}[]>([])
  const [activeSubject, setActiveSubject] = useState<string>('')

  // Answers State: { "Türkçe": { 1: "A", 2: "B" }, "Matematik": { ... } }
  const [answers, setAnswers] = useState<Record<string, Record<number, string>>>({})

  const [showFinishModal, setShowFinishModal] = useState(false)

  // Timer
  const [timeLeft, setTimeLeft] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Anti-copy & anti-screenshot CSS
  useEffect(() => {
    const preventContext = (e: MouseEvent) => e.preventDefault()
    const preventKeys = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ['c', 'x', 'a', 'p', 's'].includes(e.key.toLowerCase())) e.preventDefault()
    }
    const preventSelect = (e: Event) => e.preventDefault()
    document.addEventListener('contextmenu', preventContext)
    document.addEventListener('keydown', preventKeys)
    document.addEventListener('selectstart', preventSelect)
    return () => {
      document.removeEventListener('contextmenu', preventContext)
      document.removeEventListener('keydown', preventKeys)
      document.removeEventListener('selectstart', preventSelect)
    }
  }, [])

  useEffect(() => { loadExam() }, [examId])

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) return
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          handleFinish()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [timeLeft > 0])

  async function loadExam() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/giris'); return }
    setUserId(user.id)

    const { data: examData } = await supabase.from('exams').select('*').eq('id', examId).single()
    if (!examData) { router.push('/ogrenci/sinavlarim'); return }
    
    setExam(examData)
    setTimeLeft((examData.duration_minutes || 120) * 60)

    // Decode answer_key structure
    let blets: string[] = ['A']
    let defaultBooklet = 'A'
    if (examData.answer_key && !Array.isArray(examData.answer_key)) {
      blets = Object.keys(examData.answer_key)
      defaultBooklet = blets[0]
      setBooklets(blets)
    }
    setActiveBooklet(defaultBooklet)

    // Extract subjects from booklet
    let subjList: {name: string, count: number}[] = []
    if (examData.answer_key && examData.answer_key[defaultBooklet]) {
       subjList = Object.keys(examData.answer_key[defaultBooklet]).map(name => ({
          name, count: examData.answer_key[defaultBooklet][name].length
       }))
    }
    setSubjects(subjList)
    if (subjList.length > 0) setActiveSubject(subjList[0].name)

    // Check existing result
    const { data: existingResult } = await supabase.from('exam_results')
      .select('*').eq('exam_id', examId).eq('student_id', user.id).single()

    if (existingResult) {
      if (existingResult.status === 'completed') {
        router.push('/ogrenci/sonuclarim')
        return
      }
      setResultId(existingResult.id)
      if (existingResult.answers && typeof existingResult.answers === 'object') {
        setAnswers(existingResult.answers) // expects { Subject: { 0: "A" } }
        if (existingResult.booklet) setActiveBooklet(existingResult.booklet)
      }
    } else {
      // Create new result entry
      const { data: newResult } = await supabase.from('exam_results')
        .insert({ exam_id: examId, student_id: user.id, status: 'started', booklet: defaultBooklet })
        .select('id').single()
      if (newResult) setResultId(newResult.id)
    }

    setLoading(false)
  }

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!resultId) return
    const interval = setInterval(() => { saveProgress() }, 30000)
    return () => clearInterval(interval)
  }, [resultId, answers, activeBooklet])

  async function saveProgress() {
    if (!resultId) return
    await supabase.from('exam_results').update({ answers, booklet: activeBooklet }).eq('id', resultId)
  }

  function setAnswer(subject: string, qIndex: number, option: string) {
    setAnswers(prev => {
      const clone = { ...prev }
      if (!clone[subject]) clone[subject] = {}
      if (clone[subject][qIndex] === option) {
        delete clone[subject][qIndex] // toggle off
      } else {
        clone[subject][qIndex] = option
      }
      return clone
    })
  }

  // Calculate scores
  function calculateScores() {
    const keyData = exam?.answer_key?.[activeBooklet] || {}
    let correct = 0, wrong = 0, empty = 0
    let sectionScores: any[] = []
    
    for (const subj of subjects) {
      const subjKey = keyData[subj.name] || []
      const subjAns = answers[subj.name] || {}
      let secCorrect = 0, secWrong = 0, secEmpty = 0
      
      for (let i = 0; i < subj.count; i++) {
         const myAns = subjAns[i]
         const correctAns = subjKey[i]
         if (!myAns) { secEmpty++; empty++ }
         else if (myAns === correctAns) { secCorrect++; correct++ }
         else { secWrong++; wrong++ }
      }
      
      // Calculate net: 4 yanlış 1 doğru götürür (TYT/AYT), LGS'de 3 yanlış. 
      // Basit hesap (ileride puana göre değişebilir): 4 yanlış = 1 doğru diyelim
      const examType = exam.exam_type || ''
      const wrongRatio = examType.includes('LGS') || examType.includes('Ara Sınıf') ? 3 : 4
      const secNet = secCorrect - (secWrong / wrongRatio)
      
      sectionScores.push({ name: subj.name, correct: secCorrect, wrong: secWrong, empty: secEmpty, net: Math.max(0, secNet).toFixed(2) })
    }

    const wrongRatioTotal = (exam.exam_type?.includes('LGS') || exam.exam_type?.includes('Ara Sınıf')) ? 3 : 4
    const totalNet = correct - (wrong / wrongRatioTotal)
    const totalQ = subjects.reduce((acc,s) => acc + s.count, 0)
    let score = totalQ > 0 ? (totalNet / totalQ)*100 : 0
    if (exam.exam_type?.includes('TYT')) score = 100 + (totalNet * 2.9) // Rough estimate for display
    if (exam.exam_type?.includes('LGS')) score = 100 + (totalNet * 4.5)

    return { correct, wrong, empty, net_score: Math.max(0, totalNet).toFixed(2), score: Math.max(0, score).toFixed(2), section_scores: sectionScores }
  }

  async function handleFinish() {
    if (!resultId || !userId) return
    const scores = calculateScores()
    await supabase.from('exam_results').update({
      answers,
      booklet: activeBooklet,
      status: 'completed',
      finished_at: new Date().toISOString(),
      ...scores,
    }).eq('id', resultId)

    router.push('/ogrenci/sonuclarim')
  }

  async function handleExit() {
    await saveProgress()
    router.push('/ogrenci/sinavlarim')
  }

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600)
    const m = Math.floor((secs % 3600) / 60)
    const s = secs % 60
    return `${h > 0 ? String(h).padStart(2, '0') + ':' : ''}${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  if (loading || !exam) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mx-auto mb-4" />
      </div>
    )
  }

  const isTimeLow = timeLeft < 300 // 5 minutes
  const totalQ = subjects.reduce((acc, s) => acc + s.count, 0)
  const answeredCount = Object.values(answers).reduce((acc, subjObj) => acc + Object.keys(subjObj).length, 0)
  const optionLetters = exam.exam_type?.includes('LGS') || exam.exam_type?.includes('Ara Sınıf') ? ['A','B','C','D'] : ['A','B','C','D','E']
  
  const activeSubjectCount = subjects.find(s => s.name === activeSubject)?.count || 0

  return (
    <div className="h-screen flex flex-col bg-background select-none overflow-hidden" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>

      {/* TOP BAR */}
      <div className="h-16 bg-card border-b-2 border-border flex items-center justify-between px-4 md:px-6 shrink-0 z-50">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-black text-sm ${isTimeLow ? 'bg-destructive text-white animate-pulse' : 'bg-emerald-500 text-white'}`}>
          <Clock className="w-4 h-4" /> {formatTime(timeLeft)}
        </div>

        <div className="hidden md:flex items-center gap-4 text-sm">
          <span className="font-bold text-muted-foreground">{exam.title}</span>
          <span className="text-muted-foreground/40">|</span>
          <span className="font-black text-foreground">Kitapçık:</span>
          <div className="flex gap-1">
             {booklets.map(b => (
                <button key={b} onClick={() => setActiveBooklet(b)} className={`w-6 h-6 rounded-md font-bold text-xs ${activeBooklet === b ? 'bg-indigo-500 text-white' : 'bg-muted text-muted-foreground'}`}>{b}</button>
             ))}
          </div>
          <span className="text-muted-foreground/40">|</span>
          <span className="font-black text-foreground">{answeredCount}/{totalQ} Tamamlandı</span>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => saveProgress()} variant="outline" size="sm" className="font-bold hidden sm:flex"> <Save className="w-4 h-4 mr-1"/> Kaydet </Button>
          <Button onClick={() => setShowFinishModal(true)} className="font-black bg-rose-500 hover:bg-rose-600 text-white" size="sm"> <CheckCircle2 className="w-4 h-4 mr-1" /> Bitir </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* SOL PANEL — Optik Form */}
        <div className="w-[300px] md:w-[360px] bg-card border-r-2 border-border flex flex-col shrink-0">
          
          {/* Subjects horizontal scroll */}
          <div className="flex bg-muted/30 border-b border-border overflow-x-auto shrink-0 custom-scrollbar p-2">
            {subjects.map(s => (
              <button key={s.name} onClick={() => setActiveSubject(s.name)} className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex flex-col items-center gap-1 min-w-[100px] ${activeSubject === s.name ? 'bg-indigo-500 text-white shadow-md' : 'text-muted-foreground hover:bg-muted/50'}`}>
                <span>{s.name}</span>
              </button>
            ))}
          </div>

          <div className="px-5 py-3 border-b border-border/50 bg-background/50 flex justify-between items-center shrink-0">
            <h3 className="font-black text-sm text-foreground">{activeSubject}</h3>
            <p className="text-[10px] text-muted-foreground font-bold">{activeSubjectCount} Soru</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
             {Array.from({ length: activeSubjectCount }).map((_, idx) => {
                const selected = answers[activeSubject]?.[idx]
                return (
                   <div key={idx} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/30 transition-colors group">
                     <span className={`w-8 text-right font-black text-xs ${selected ? 'text-indigo-500' : 'text-muted-foreground'}`}>{idx + 1}.</span>
                     <div className="flex items-center gap-2">
                        {optionLetters.map(letter => (
                          <button key={letter} onClick={() => setAnswer(activeSubject, idx, letter)} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-black transition-all ${selected === letter ? 'bg-indigo-500 border-indigo-500 text-white scale-110 shadow-md shadow-indigo-500/30' : 'border-border text-muted-foreground hover:border-indigo-300 hover:text-indigo-500'}`}>
                             {letter}
                          </button>
                        ))}
                     </div>
                   </div>
                )
             })}
          </div>

        </div>

        {/* SAĞ PANEL — PDF */}
        <div className="flex-1 bg-muted/20 flex flex-col p-6 overflow-hidden relative">
          {exam.pdf_url ? (
            <div className="w-full h-full rounded-2xl overflow-hidden bg-white shadow-lg border border-border relative">
              <iframe src={`${exam.pdf_url}#toolbar=0&navpanes=0`} className="w-full h-full border-0 pointer-events-auto" title="Sınav Kitapçığı" />
              <div className="absolute top-4 right-4 bg-red-500/10 text-red-500 text-[9px] font-black uppercase px-2 py-1 rounded-md flex items-center gap-1 select-none pointer-events-none">
                 <Lock className="w-2.5 h-2.5" /> EKRAN GÖRÜNTÜSÜ ENGELLENDİ
              </div>
            </div>
          ) : (
            <div className="m-auto text-center max-w-sm">
               <FileText className="w-16 h-16 text-indigo-200 mx-auto mb-4" />
               <h2 className="text-xl font-black mb-2">Doküman Yüklenmemiş</h2>
               <p className="text-muted-foreground text-sm font-medium">Bu sınava ait kitapçık PDF'si bulunmuyor. Elinizdeki basılı kitapçıktan soruları çözerek yandaki optik formu doldurunuz.</p>
            </div>
          )}
        </div>

      </div>

      {showFinishModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card rounded-[2rem] border-2 border-border p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center"><AlertTriangle className="w-6 h-6" /></div>
              <div>
                <h3 className="font-black text-lg">Sınavı Bitiriyorsunuz</h3>
                <p className="text-sm text-muted-foreground font-medium">Sınavınızı tamamlayıp sonuçları hesapla.</p>
              </div>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 mb-6 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground font-medium">Cevaplanan:</span><span className="font-black">{answeredCount} / {totalQ}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground font-medium">Boş:</span><span className="font-black text-amber-500">{totalQ - answeredCount}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground font-medium">Kalan Süre:</span><span className="font-black">{formatTime(timeLeft)}</span></div>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setShowFinishModal(false)} variant="outline" className="flex-1 font-bold border-2 h-12 rounded-xl">İptal</Button>
              <Button onClick={handleFinish} className="flex-1 font-black bg-rose-500 hover:bg-rose-600 text-white h-12 rounded-xl shadow-lg"><CheckCircle2 className="w-4 h-4 mr-2" /> Sınavı Bitir</Button>
            </div>
            <button onClick={handleExit} className="w-full mt-4 text-xs font-bold text-muted-foreground hover:text-foreground">Sınavdan çık, sürem dursun sonra devam edeceğim</button>
          </div>
        </div>
      )}

    </div>
  )
}
