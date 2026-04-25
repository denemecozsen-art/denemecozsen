"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  Award, BarChart3, TrendingUp, BookOpen, Loader2, FileText,
  Calendar, Clock, ChevronRight, Download, Eye, Target, Star,
  Search, RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SonuclarimPage() {
  const supabase = createClient()

  const [results, setResults] = useState<any[]>([])
  const [exams, setExams] = useState<any[]>([])
  const [levels, setLevels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedResult, setSelectedResult] = useState<any>(null)
  const [filterPeriod, setFilterPeriod] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => { init() }, [])

  async function init() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const [resRes, examRes, lvlRes] = await Promise.all([
      supabase.from('exam_results').select('*').eq('student_id', user.id).eq('status', 'completed').order('finished_at', { ascending: false }),
      supabase.from('exams').select('*').order('created_at', { ascending: false }),
      supabase.from('levels').select('*').order('sort_order', { ascending: true }),
    ])

    if (resRes.data) setResults(resRes.data)
    if (examRes.data) setExams(examRes.data)
    if (lvlRes.data) setLevels(lvlRes.data)
    setLoading(false)
  }

  const getExam = (id: string) => exams.find(e => e.id === id) || {}
  const getLevelName = (id: string) => levels.find(l => l.id === id)?.name || '—'

  const filteredResults = results.filter(r => {
    const exam = getExam(r.exam_id)
    if (filterPeriod !== 'all' && exam.period !== filterPeriod) return false
    if (searchQuery && !(exam.title || '').toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  // Genel istatistikler
  const totalExams = filteredResults.length
  const avgNet = totalExams > 0 ? (filteredResults.reduce((s, r) => s + (parseFloat(r.net_score) || 0), 0) / totalExams).toFixed(1) : '0'
  const avgScore = totalExams > 0 ? (filteredResults.reduce((s, r) => s + (parseFloat(r.score) || 0), 0) / totalExams).toFixed(1) : '0'

  // Son 5 sınav trend
  const last5 = filteredResults.slice(0, 5).reverse()

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
        {selectedResult && (
          <span className="text-sm text-muted-foreground font-medium">Rapor yenilensin</span>
        )}
      </div>

      {/* Sonuç Kartları */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
          <p className="font-bold text-muted-foreground">Sonuçlar yükleniyor...</p>
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="bg-card border-2 border-dashed border-border rounded-2xl p-12 text-center">
          <Award className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="text-xl font-black">Henüz sonuç bulunmuyor</h3>
          <p className="text-sm text-muted-foreground mt-2">Bir sınavı tamamladığında sonuçların burada görünecek.</p>
        </div>
      ) : (
        <div className="space-y-8">

          {/* Sınav Sonuç Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredResults.map((result) => {
              const exam = getExam(result.exam_id)
              const isSelected = selectedResult?.id === result.id

              return (
                <div
                  key={result.id}
                  className={`bg-card border-2 rounded-2xl overflow-hidden transition-all hover:shadow-lg cursor-pointer ${
                    isSelected ? 'border-indigo-500 shadow-lg shadow-indigo-500/10' : 'border-border hover:border-indigo-500/30'
                  }`}
                  onClick={() => setSelectedResult(result)}
                >
                  {/* Tarih Header */}
                  <div className="bg-gradient-to-r from-violet-500 to-indigo-600 px-4 py-2 text-white">
                    <div className="text-xs font-bold">
                      {result.finished_at
                        ? new Date(result.finished_at).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })
                        : '—'
                      }
                      {' · '}
                      {exam.exam_type || 'Deneme'}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <h3 className="font-black text-sm text-foreground leading-tight">{exam.title || 'Sınav'}</h3>

                    {/* Karne butonu */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedResult(result) }}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-sm py-2.5 rounded-lg flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-emerald-500/20 transition-all"
                    >
                      <Search className="w-4 h-4" /> KARNE
                    </button>

                    {/* Alt bilgiler */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-muted-foreground">BİRLEŞTİRİLMİŞ KARNE</span>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-indigo-500 font-bold">
                          <BarChart3 className="w-3 h-3" /> {result.net_score || '0'}
                        </span>
                        <span className="flex items-center gap-1 text-emerald-500 font-bold">
                          <TrendingUp className="w-3 h-3" /> {result.score || '0'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Detay Karne */}
          {selectedResult && (
            <ResultReportCard
              result={selectedResult}
              exam={getExam(selectedResult.exam_id)}
              getLevelName={getLevelName}
              onClose={() => setSelectedResult(null)}
            />
          )}
        </div>
      )}
    </div>
  )
}

// ─── Premium Karne Bileşeni ──────────────────────────────────
function ResultReportCard({ result, exam, getLevelName, onClose }: { result: any; exam: any; getLevelName: (id: string) => string; onClose: () => void }) {
  const sectionScores: any[] = result.section_scores || []

  return (
    <div className="bg-card border-2 border-border rounded-2xl overflow-hidden shadow-xl animate-in slide-in-from-bottom-4 duration-300">

      {/* Karne Üst Başlık — Öğrenci Bilgileri */}
      <div className="bg-gradient-to-r from-fuchsia-600 via-purple-600 to-violet-600 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="relative z-10 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black">{exam.title || 'Sınav Karnesi'}</h2>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-white/80 text-xs font-bold">
                <span>{getLevelName(exam.level_id)}</span>
                <span>•</span>
                <span>{exam.exam_type}</span>
                <span>•</span>
                <span>
                  {result.finished_at
                    ? new Date(result.finished_at).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })
                    : '—'}
                </span>
              </div>
            </div>
            <button onClick={onClose} className="text-white/60 hover:text-white transition-colors self-start md:self-center">✕</button>
          </div>
        </div>
      </div>

      {/* Ders Analizi Tablosu */}
      <div className="p-6">
        <h3 className="font-black text-sm uppercase tracking-widest text-fuchsia-600 mb-4 text-center">
          DERS ANALİZİ
        </h3>

        {sectionScores.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border-2 border-fuchsia-200">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-fuchsia-600 text-white text-xs font-black uppercase tracking-wider">
                  <th className="p-3 text-left">DERS</th>
                  <th className="p-3 text-center">SORU</th>
                  <th className="p-3 text-center">DOĞRU</th>
                  <th className="p-3 text-center">YANLIŞ</th>
                  <th className="p-3 text-center">BOŞ</th>
                  <th className="p-3 text-center">NET</th>
                  <th className="p-3 text-center">ORT</th>
                </tr>
              </thead>
              <tbody>
                {sectionScores.map((sec: any, i: number) => {
                  const total = (sec.correct || 0) + (sec.wrong || 0) + (sec.empty || 0)
                  const successRate = total > 0 ? Math.round(((sec.correct || 0) / total) * 100) : 0

                  return (
                    <tr key={i} className={`border-b border-fuchsia-100 ${i % 2 === 0 ? 'bg-fuchsia-50/30' : 'bg-white'}`}>
                      <td className="p-3 font-bold text-foreground">{sec.name}</td>
                      <td className="p-3 text-center font-bold">{total}</td>
                      <td className="p-3 text-center font-bold text-emerald-600">{sec.correct || 0}</td>
                      <td className="p-3 text-center font-bold text-red-500">{sec.wrong || 0}</td>
                      <td className="p-3 text-center font-medium text-muted-foreground">{sec.empty || 0}</td>
                      <td className="p-3 text-center font-black text-fuchsia-600">{sec.net}</td>
                      <td className="p-3 text-center font-bold">{sec.net}</td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="bg-fuchsia-600 text-white font-black">
                  <td className="p-3">TOPLAM</td>
                  <td className="p-3 text-center">{(result.correct || 0) + (result.wrong || 0) + (result.empty || 0)}</td>
                  <td className="p-3 text-center">{result.correct || 0}</td>
                  <td className="p-3 text-center">{result.wrong || 0}</td>
                  <td className="p-3 text-center">{result.empty || 0}</td>
                  <td className="p-3 text-center">{result.net_score}</td>
                  <td className="p-3 text-center">{result.net_score}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <div className="bg-muted/30 rounded-xl p-6 text-center border border-border/50">
            <p className="text-sm text-muted-foreground font-medium">Ders bazlı analiz verisi bu sınav için yüklenmemiş.</p>
          </div>
        )}
      </div>

      {/* Puan ve Sıralamalar */}
      <div className="px-6 pb-6">
        <h3 className="font-black text-sm uppercase tracking-widest text-fuchsia-600 mb-4 text-center">
          PUAN VE SIRALAMALAR
        </h3>
        <div className="overflow-x-auto rounded-lg border-2 border-fuchsia-200">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-fuchsia-600 text-white text-xs font-black uppercase tracking-wider">
                <th className="p-3 text-left">PUAN TÜRÜ</th>
                <th className="p-3 text-center">PUAN</th>
                <th className="p-3 text-center">GENEL</th>
                <th className="p-3 text-center">SINIF</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-fuchsia-100 bg-white">
                <td className="p-3 font-bold">{exam.exam_type || 'Deneme'}</td>
                <td className="p-3 text-center font-black text-fuchsia-600">{result.score || '0'}</td>
                <td className="p-3 text-center font-bold text-indigo-500">—</td>
                <td className="p-3 text-center font-bold text-indigo-500">—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Son Sınavların Trend Grafiği */}
      {result.score && (
        <div className="px-6 pb-6">
          <h3 className="font-black text-sm uppercase tracking-widest text-fuchsia-600 mb-4 text-center">
            SON 1 SINAVIN SONUÇLARI
          </h3>
          <div className="bg-gradient-to-r from-fuchsia-50 to-violet-50 border-2 border-fuchsia-200 rounded-xl p-6 flex items-end justify-center gap-1 h-32">
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-black text-fuchsia-600">{result.score}</span>
              <div className="w-12 bg-gradient-to-t from-fuchsia-500 to-violet-500 rounded-t-md" style={{ height: `${Math.min(100, Math.max(10, parseFloat(result.score)))}%` }} />
              <span className="text-[9px] font-bold text-muted-foreground">1</span>
            </div>
          </div>
        </div>
      )}

      {/* Çözüm Videosu */}
      {exam.solution_video_url && (
        <div className="px-6 pb-6">
          <a
            href={exam.solution_video_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-violet-500/10 border-2 border-violet-500/20 rounded-xl px-5 py-4 hover:bg-violet-500/15 transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-500 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">▶</div>
            <div>
              <p className="font-black text-sm text-foreground">Çözüm Videosunu İzle</p>
              <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Sınavın detaylı çözüm anlatımı</p>
            </div>
            <ChevronRight className="w-5 h-5 text-violet-500 ml-auto" />
          </a>
        </div>
      )}
    </div>
  )
}
