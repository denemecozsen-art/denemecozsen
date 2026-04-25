"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { buildAdminPath } from "@/lib/admin-config"
import {
  Plus, Search, Edit, Trash2, Eye, EyeOff, Power, FileText,
  Clock, Calendar, GraduationCap, Filter, MoreHorizontal, Video,
  CheckCircle2, XCircle, Loader2
} from "lucide-react"

function ExamsListInner() {
  const supabase = createClient()
  const searchParams = useSearchParams()

  const [exams, setExams] = useState<any[]>([])
  const [levels, setLevels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterLevel, setFilterLevel] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [filterPeriod, setFilterPeriod] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    setLoading(true)
    const [examRes, lvlRes] = await Promise.all([
      supabase.from('exams').select('*').eq('is_deleted', false).order('created_at', { ascending: false }),
      supabase.from('levels').select('*').order('sort_order', { ascending: true }),
    ])
    if (examRes.data) setExams(examRes.data)
    if (lvlRes.data) setLevels(lvlRes.data)
    setLoading(false)
  }

  async function toggleActive(id: string, current: boolean) {
    await supabase.from('exams').update({ is_active: !current }).eq('id', id)
    fetchData()
  }

  async function handleDelete(id: string) {
    if (confirm('Bu sınavı silmek istediğinize emin misiniz?')) {
      await supabase.from('exams').update({ is_deleted: true }).eq('id', id)
      fetchData()
    }
  }

  const getLevelName = (id: string) => levels.find(l => l.id === id)?.name || '—'

  const filteredExams = exams.filter(e => {
    if (searchQuery && !e.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (filterLevel !== 'all' && e.level_id !== filterLevel) return false
    if (filterType !== 'all' && e.exam_type !== filterType) return false
    if (filterPeriod !== 'all' && e.period !== filterPeriod) return false
    return true
  })

  const uniqueTypes = [...new Set(exams.map(e => e.exam_type).filter(Boolean))]
  const uniquePeriods = [...new Set(exams.map(e => e.period).filter(Boolean))]

  const formatDate = (d: string) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="space-y-8 pb-10">

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-3 text-foreground">
            <FileText className="w-8 h-8 text-primary" /> Sınav / Deneme Yönetimi
          </h1>
          <p className="text-muted-foreground text-sm font-medium mt-2 max-w-2xl">
            Online sınavları oluşturun, düzenleyin ve yönetin. Öğrenci erişim tarihlerini ve sonuç yayınlanma modlarını tek merkezden kontrol edin.
          </p>
        </div>
        <Link href={buildAdminPath("/sinav-yonetimi/denemeler/yeni")}>
          <Button className="h-12 px-8 font-black bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:scale-105 transition-transform text-base">
            <Plus className="w-5 h-5 mr-2" /> Yeni Deneme Ekle
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Toplam Sınav", value: exams.length, icon: FileText, color: "text-blue-600 bg-blue-500/10" },
          { label: "Aktif Sınav", value: exams.filter(e => e.is_active).length, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-500/10" },
          { label: "Pasif Sınav", value: exams.filter(e => !e.is_active).length, icon: XCircle, color: "text-red-500 bg-red-500/10" },
          { label: "Bu Dönem", value: exams.filter(e => e.period === '2025-2026').length, icon: Calendar, color: "text-violet-600 bg-violet-500/10" },
        ].map((s, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}>
              <s.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black">{s.value}</p>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="bg-card border-2 border-border rounded-3xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative flex-1 min-w-[240px] max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Sınav adı ile ara..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-background border-2 border-border rounded-xl px-12 py-3 text-sm font-bold outline-none focus:border-primary transition-colors"
            />
          </div>

          <select value={filterPeriod} onChange={e => setFilterPeriod(e.target.value)} className="bg-background border-2 border-border rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-primary cursor-pointer">
            <option value="all">Tüm Dönemler</option>
            {uniquePeriods.map(p => <option key={p} value={p}>{p}</option>)}
          </select>

          <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} className="bg-background border-2 border-border rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-primary cursor-pointer">
            <option value="all">Tüm Sınıflar</option>
            {levels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>

          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="bg-background border-2 border-border rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-primary cursor-pointer">
            <option value="all">Tüm Türler</option>
            {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <span className="text-sm font-bold text-muted-foreground ml-auto shrink-0">{filteredExams.length} sınav</span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-xs uppercase tracking-widest text-muted-foreground font-black">
                <th className="p-4 rounded-tl-xl w-14">Durum</th>
                <th className="p-4">Sınav Adı</th>
                <th className="p-4">Sınıf</th>
                <th className="p-4">Tür</th>
                <th className="p-4">Dönem</th>
                <th className="p-4">Süre</th>
                <th className="p-4">Başlangıç</th>
                <th className="p-4">Soru</th>
                <th className="p-4 text-right rounded-tr-xl">Aksiyonlar</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="text-center p-12">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-2" />
                  <p className="font-bold text-muted-foreground">Sınavlar yükleniyor...</p>
                </td></tr>
              ) : filteredExams.length === 0 ? (
                <tr><td colSpan={9} className="text-center p-12 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto opacity-20 mb-3" />
                  <p className="font-bold">Bu filtrelere uygun sınav bulunamadı.</p>
                  <p className="text-sm mt-1">Yeni bir sınav ekleyin veya filtreleri değiştirin.</p>
                </td></tr>
              ) : filteredExams.map(exam => (
                <tr key={exam.id} className="border-b last:border-0 border-border hover:bg-muted/20 transition-colors group">
                  <td className="p-4">
                    <button onClick={() => toggleActive(exam.id, exam.is_active)} className="group/btn" title={exam.is_active ? "Aktif — Pasife Al" : "Pasif — Aktife Al"}>
                      <div className={`w-3.5 h-3.5 rounded-full transition-colors ${exam.is_active ? 'bg-success ring-4 ring-success/20' : 'bg-destructive ring-4 ring-destructive/20'}`} />
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3 min-w-[200px]">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground">{exam.title}</p>
                        {exam.solution_video_url && (
                          <span className="text-[9px] font-black text-violet-500 bg-violet-500/10 px-1.5 py-0.5 rounded uppercase mt-0.5 inline-block">
                            <Video className="w-2.5 h-2.5 inline mr-0.5" />Video
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-semibold text-muted-foreground">{getLevelName(exam.level_id)}</td>
                  <td className="p-4">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-lg border ${
                      exam.exam_type === 'LGS' ? 'bg-blue-500/10 text-blue-600 border-blue-200' :
                      exam.exam_type === 'TYT' ? 'bg-violet-500/10 text-violet-600 border-violet-200' :
                      'bg-muted text-muted-foreground border-border'
                    }`}>
                      {exam.exam_type || 'Deneme'}
                    </span>
                  </td>
                  <td className="p-4 text-xs font-bold text-muted-foreground">{exam.period}</td>
                  <td className="p-4">
                    <span className="flex items-center gap-1 text-xs font-bold text-foreground">
                      <Clock className="w-3 h-3" /> {exam.duration_minutes} dk
                    </span>
                  </td>
                  <td className="p-4 text-[11px] font-semibold text-muted-foreground whitespace-nowrap">{formatDate(exam.start_date)}</td>
                  <td className="p-4 text-sm font-black text-foreground">{exam.total_questions || '—'}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={buildAdminPath(`/sinav-yonetimi/denemeler/yeni?id=${exam.id}`)}>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-primary hover:bg-primary/10">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button onClick={() => handleDelete(exam.id)} size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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

export default function ExamsListPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <ExamsListInner />
    </Suspense>
  )
}
