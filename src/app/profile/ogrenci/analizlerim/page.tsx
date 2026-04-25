"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  BarChart3, TrendingUp, Target, BookOpen, Loader2,
  ChevronRight, Award, Zap
} from "lucide-react"

export default function AnalizlerimPage() {
  const supabase = createClient()
  const [results, setResults] = useState<any[]>([])
  const [exams, setExams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { init() }, [])

  async function init() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const [resRes, examRes] = await Promise.all([
      supabase.from('exam_results').select('*').eq('student_id', user.id).eq('status', 'completed').order('finished_at', { ascending: false }),
      supabase.from('exams').select('id, title, exam_type, total_questions'),
    ])
    if (resRes.data) setResults(resRes.data)
    if (examRes.data) setExams(examRes.data)
    setLoading(false)
  }

  const getExam = (id: string) => exams.find(e => e.id === id) || {}

  // Ders bazlı analiz
  const subjectStats: Record<string, { correct: number; wrong: number; empty: number; total: number; count: number }> = {}
  results.forEach(r => {
    const scores: any[] = r.section_scores || []
    scores.forEach((sec: any) => {
      if (!subjectStats[sec.name]) {
        subjectStats[sec.name] = { correct: 0, wrong: 0, empty: 0, total: 0, count: 0 }
      }
      subjectStats[sec.name].correct += sec.correct || 0
      subjectStats[sec.name].wrong += sec.wrong || 0
      subjectStats[sec.name].empty += sec.empty || 0
      subjectStats[sec.name].total += (sec.correct || 0) + (sec.wrong || 0) + (sec.empty || 0)
      subjectStats[sec.name].count++
    })
  })

  const subjects = Object.entries(subjectStats).map(([name, stats]) => ({
    name,
    ...stats,
    avgSuccess: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
    avgNet: stats.count > 0 ? ((stats.correct - (stats.wrong / 3)) / stats.count).toFixed(1) : '0',
  })).sort((a, b) => b.avgSuccess - a.avgSuccess)

  // Trend verisi (son 10 sınav)
  const last10 = results.slice(0, 10).reverse()

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
        <p className="font-bold text-muted-foreground">Analizler yükleniyor...</p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-black">Analizlerim</h1>
        <div className="bg-card border-2 border-dashed border-border rounded-2xl p-12 text-center">
          <BarChart3 className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="text-xl font-black">Henüz analiz verisi yok</h3>
          <p className="text-sm text-muted-foreground mt-2">En az bir sınavı tamamladığında analizlerin burada görünecek.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      <div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">Analizlerim 📊</h1>
        <p className="text-muted-foreground font-bold text-sm mt-1">Ders bazlı performansın ve gelişim trendlerin.</p>
      </div>

      {/* Genel Özet Kartları */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Toplam Sınav", value: results.length, icon: Target, color: "text-indigo-600 bg-indigo-500/10" },
          { label: "En Güçlü Ders", value: subjects[0]?.name || '—', icon: Zap, color: "text-emerald-600 bg-emerald-500/10" },
          { label: "Gelişim Gerekli", value: subjects[subjects.length - 1]?.name || '—', icon: TrendingUp, color: "text-amber-600 bg-amber-500/10" },
          { label: "Genel Başarı", value: `%${results.length > 0 ? Math.round(results.reduce((s, r) => s + (parseFloat(r.score) || 0), 0) / results.length) : 0}`, icon: Award, color: "text-violet-600 bg-violet-500/10" },
        ].map((s, i) => (
          <div key={i} className="bg-card border border-border/60 rounded-2xl p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color} shrink-0`}>
              <s.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-black text-foreground truncate max-w-[120px]">{s.value}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Ders Bazlı Performans */}
      <div className="bg-card border-2 border-border rounded-2xl p-6">
        <h3 className="font-black text-base mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" /> Ders Bazlı Performans
        </h3>
        <div className="space-y-3">
          {subjects.map((sub, i) => (
            <div key={i} className="flex items-center gap-4 bg-muted/20 rounded-xl p-4 border border-border/50">
              <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-black shrink-0">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-foreground truncate">{sub.name}</span>
                  <span className="text-xs font-black text-foreground">%{sub.avgSuccess}</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      sub.avgSuccess >= 70 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' :
                      sub.avgSuccess >= 40 ? 'bg-gradient-to-r from-amber-400 to-amber-500' :
                      'bg-gradient-to-r from-red-400 to-red-500'
                    }`}
                    style={{ width: `${sub.avgSuccess}%` }}
                  />
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-black text-indigo-500">Net: {sub.avgNet}</span>
                <p className="text-[9px] text-muted-foreground font-medium">{sub.count} sınav</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Net Trend */}
      {last10.length > 1 && (
        <div className="bg-card border-2 border-border rounded-2xl p-6">
          <h3 className="font-black text-base mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" /> Son {last10.length} Sınav Net Trendi
          </h3>
          <div className="flex items-end justify-between gap-2 h-40 px-2">
            {last10.map((r, i) => {
              const net = parseFloat(r.net_score) || 0
              const maxNet = Math.max(...last10.map(x => parseFloat(x.net_score) || 0), 1)
              const heightPct = Math.max(5, (net / maxNet) * 100)
              const exam = getExam(r.exam_id)

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group cursor-default">
                  <span className="text-[9px] font-black text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">{net}</span>
                  <div
                    className="w-full max-w-10 bg-gradient-to-t from-indigo-500 to-violet-500 rounded-t-md transition-all group-hover:from-indigo-400 group-hover:to-violet-400"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[8px] font-bold text-muted-foreground truncate max-w-full">{i + 1}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
