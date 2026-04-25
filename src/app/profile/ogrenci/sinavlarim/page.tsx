"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import {
  Clock, Calendar, ArrowRight, Search, Loader2, FileText,
  Lock, CheckCircle2, AlertCircle, RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SinavlarimPage() {
  const supabase = createClient()

  const [exams, setExams] = useState<any[]>([])
  const [levels, setLevels] = useState<any[]>([])
  const [myResults, setMyResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPeriod, setFilterPeriod] = useState("2025-2026")
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => { init() }, [])

  async function init() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) setUserId(user.id)

    const [examRes, lvlRes, resultRes] = await Promise.all([
      supabase.from('exams').select('*').eq('is_active', true).eq('is_deleted', false).order('start_date', { ascending: false }),
      supabase.from('levels').select('*').order('sort_order', { ascending: true }),
      user ? supabase.from('exam_results').select('exam_id, status, score, net_score, finished_at').eq('student_id', user.id) : Promise.resolve({ data: [] }),
    ])

    if (examRes.data) setExams(examRes.data)
    if (lvlRes.data) setLevels(lvlRes.data)
    if (resultRes.data) setMyResults(resultRes.data || [])
    setLoading(false)
  }

  const getLevelName = (id: string) => levels.find(l => l.id === id)?.name || '—'

  const getExamStatus = (exam: any) => {
    const result = myResults.find(r => r.exam_id === exam.id)
    if (result) {
      if (result.status === 'completed') return 'completed'
      return 'started'
    }
    const now = new Date()
    const start = exam.start_date ? new Date(exam.start_date) : null
    const end = exam.end_date ? new Date(exam.end_date) : null
    if (start && now < start) return 'upcoming'
    if (end && now > end) return 'expired'
    return 'available'
  }

  const filteredExams = exams.filter(e => {
    if (searchQuery && !e.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (filterPeriod !== 'all' && e.period !== filterPeriod) return false
    return true
  })

  const formatDateShort = (d: string) => {
    if (!d) return '—'
    const date = new Date(d)
    return `${date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })} ${date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} ${date.toLocaleDateString('tr-TR', { weekday: 'long' })}`
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Başlık */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
          Dashboard
        </h1>
        <Button onClick={() => init()} variant="outline" size="sm" className="font-bold border-2 gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" /> Sayfayı Yenile
        </Button>
      </div>

      {/* Filtreler */}
      <div className="flex flex-wrap items-center gap-3">
        <select value={filterPeriod} onChange={e => setFilterPeriod(e.target.value)} className="bg-card border-2 border-border rounded-lg px-3 py-2 text-sm font-bold outline-none focus:border-indigo-500 cursor-pointer">
          <option value="all">Dönem▼</option>
          <option value="2024-2025">2024-2025</option>
          <option value="2025-2026">2025-2026</option>
          <option value="2026-2027">2026-2027</option>
        </select>
        <div className="relative">
          <input
            type="text"
            placeholder="Ara..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-card border-2 border-border rounded-lg pl-3 pr-8 py-2 text-sm font-bold outline-none focus:border-indigo-500 w-40"
          />
        </div>
      </div>

      {/* Sınav Kartları */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
          <p className="font-bold text-muted-foreground">Sınavlar yükleniyor...</p>
        </div>
      ) : filteredExams.length === 0 ? (
        <div className="bg-card border-2 border-dashed border-border rounded-2xl p-12 text-center">
          <FileText className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="text-xl font-black">Henüz aktif sınav bulunmuyor</h3>
          <p className="text-sm text-muted-foreground mt-2">Yeni sınavlar eklendiğinde burada görünecektir.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredExams.map(exam => {
            const status = getExamStatus(exam)
            const result = myResults.find(r => r.exam_id === exam.id)

            // Renk teması
            const isBlue = status === 'available'
            const isPink = status === 'upcoming' || status === 'expired'
            const isGreen = status === 'completed'

            return (
              <div
                key={exam.id}
                className="bg-card border-2 border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all"
              >
                {/* Tarih banner */}
                <div className={`px-4 py-3 text-white text-xs font-bold ${
                  isGreen ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
                  isPink ? 'bg-gradient-to-r from-rose-400 to-pink-500' :
                  'bg-gradient-to-r from-blue-500 to-indigo-600'
                }`}>
                  <div className="space-y-0.5">
                    <div>Baş:{formatDateShort(exam.start_date)}</div>
                    {exam.end_date && <div>Bit: {formatDateShort(exam.end_date)}</div>}
                  </div>
                </div>

                {/* İçerik */}
                <div className="p-5 space-y-3">
                  <h3 className="font-black text-sm text-foreground leading-tight min-h-[40px]">
                    {exam.title}
                  </h3>

                  <p className="text-xs text-muted-foreground font-medium line-clamp-2">
                    Sınava Başla butonuna tıklayarak sınava giriş yapabilirsiniz. Butona tıklayınca süreniz başlayacaktır.
                  </p>

                  {/* Buton */}
                  {status === 'available' || status === 'started' ? (
                    <Link href={`/ogrenci/sinav/${exam.id}`} className="block">
                      <button className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-black text-sm text-white transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] ${
                        status === 'started' ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-amber-500/20' :
                        'bg-gradient-to-r from-red-500 to-rose-500 shadow-red-500/20'
                      }`}>
                        <Lock className="w-4 h-4" />
                        {status === 'started' ? 'SINAVA DEVAM ET' : 'SINAVA BAŞLA'}
                      </button>
                    </Link>
                  ) : status === 'completed' ? (
                    <button disabled className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm bg-emerald-100 text-emerald-700 cursor-default">
                      <CheckCircle2 className="w-4 h-4" /> TAMAMLANDI
                    </button>
                  ) : (
                    <button disabled className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm bg-muted text-muted-foreground cursor-default">
                      <Lock className="w-4 h-4" /> {status === 'upcoming' ? 'HENÜZ AÇILMADI' : 'SÜRE DOLDU'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
