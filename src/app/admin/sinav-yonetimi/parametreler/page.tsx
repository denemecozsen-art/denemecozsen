"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Plus, Trash2, Edit, Save, X, Loader2, Settings2,
  ListOrdered, Calendar, CheckCircle2, XCircle
} from "lucide-react"

type Param = { id: string; name: string; description?: string; sort_order: number; is_active: boolean }

export default function ParametrelerPage() {
  const supabase = createClient()

  const [activeTab, setActiveTab] = useState<"types" | "periods">("types")
  const [types, setTypes] = useState<Param[]>([])
  const [periods, setPeriods] = useState<Param[]>([])
  const [loading, setLoading] = useState(true)

  // Add form
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState("")
  const [newDesc, setNewDesc] = useState("")
  const [saving, setSaving] = useState(false)

  // Edit
  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editDesc, setEditDesc] = useState("")

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    setLoading(true)
    const [tRes, pRes] = await Promise.all([
      supabase.from('exam_types').select('*').order('sort_order', { ascending: true }),
      supabase.from('exam_periods').select('*').order('sort_order', { ascending: true }),
    ])
    if (tRes.data) setTypes(tRes.data)
    if (pRes.data) setPeriods(pRes.data)
    setLoading(false)
  }

  const table = activeTab === "types" ? "exam_types" : "exam_periods"
  const items = activeTab === "types" ? types : periods

  async function handleAdd() {
    if (!newName.trim()) return
    setSaving(true)
    const payload: any = { name: newName.trim(), sort_order: items.length + 1 }
    if (activeTab === "types") payload.description = newDesc.trim()
    await supabase.from(table).insert(payload)
    setNewName(""); setNewDesc(""); setShowAdd(false); setSaving(false)
    fetchData()
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu parametreyi silmek istediğinize emin misiniz?")) return
    await supabase.from(table).delete().eq('id', id)
    fetchData()
  }

  async function handleToggle(id: string, current: boolean) {
    await supabase.from(table).update({ is_active: !current }).eq('id', id)
    fetchData()
  }

  async function handleSaveEdit() {
    if (!editId || !editName.trim()) return
    const payload: any = { name: editName.trim() }
    if (activeTab === "types") payload.description = editDesc.trim()
    await supabase.from(table).update(payload).eq('id', editId)
    setEditId(null); setEditName(""); setEditDesc("")
    fetchData()
  }

  function startEdit(item: Param) {
    setEditId(item.id); setEditName(item.name); setEditDesc((item as any).description || "")
  }

  return (
    <div className="space-y-8 pb-10">

      {/* Header */}
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-black flex items-center gap-3 text-foreground">
          <Settings2 className="w-8 h-8 text-primary" /> Sınav Parametreleri
        </h1>
        <p className="text-muted-foreground text-sm font-medium mt-2">
          Sınav türü ve dönem parametrelerini yönetin. Bu veriler sınav oluşturma formlarında otomatik olarak kullanılır.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { key: "types" as const, label: "Sınav Türleri", icon: ListOrdered, count: types.length },
          { key: "periods" as const, label: "Dönemler", icon: Calendar, count: periods.length },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setShowAdd(false); setEditId(null) }}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === tab.key
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                : 'bg-card border-2 border-border text-muted-foreground hover:border-primary/30'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
              activeTab === tab.key ? 'bg-white/20' : 'bg-muted'
            }`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-card border-2 border-border rounded-3xl p-6">

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-black text-base">
            {activeTab === "types" ? "Sınav Türü Listesi" : "Dönem Listesi"}
          </h3>
          <Button onClick={() => { setShowAdd(true); setEditId(null) }} className="font-bold" size="sm">
            <Plus className="w-4 h-4 mr-1" /> Yeni Ekle
          </Button>
        </div>

        {/* Add Form */}
        {showAdd && (
          <div className="bg-muted/30 border border-border rounded-xl p-4 mb-4 flex flex-wrap items-end gap-3 animate-in slide-in-from-top-2 duration-200">
            <div className="flex-1 min-w-[200px] space-y-1">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                {activeTab === "types" ? "Tür Adı" : "Dönem Adı"} *
              </label>
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder={activeTab === "types" ? "Örn: LGS" : "Örn: 2025-2026"} className="w-full bg-background border-2 border-border rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-primary" />
            </div>
            {activeTab === "types" && (
              <div className="flex-1 min-w-[200px] space-y-1">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Açıklama</label>
                <input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Kısa açıklama..." className="w-full bg-background border-2 border-border rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-primary" />
              </div>
            )}
            <Button onClick={handleAdd} disabled={saving} size="sm" className="font-bold h-10">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-1" />} Kaydet
            </Button>
            <Button onClick={() => setShowAdd(false)} variant="ghost" size="sm" className="font-bold h-10">
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-2" />
            <p className="font-bold text-muted-foreground">Yükleniyor...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
            <p className="font-bold text-muted-foreground">Henüz parametre eklenmemiş.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item, idx) => (
              <div key={item.id} className="flex items-center gap-3 bg-background border border-border rounded-xl px-4 py-3 hover:bg-muted/20 transition-colors group">
                <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-black shrink-0">{idx + 1}</span>

                {editId === item.id ? (
                  <>
                    <input value={editName} onChange={e => setEditName(e.target.value)} className="flex-1 bg-background border-2 border-primary rounded-lg px-3 py-1.5 text-sm font-bold outline-none" />
                    {activeTab === "types" && (
                      <input value={editDesc} onChange={e => setEditDesc(e.target.value)} placeholder="Açıklama" className="flex-1 bg-background border-2 border-border rounded-lg px-3 py-1.5 text-sm font-bold outline-none focus:border-primary" />
                    )}
                    <Button onClick={handleSaveEdit} size="icon" variant="ghost" className="h-8 w-8 text-primary"><Save className="w-4 h-4" /></Button>
                    <Button onClick={() => setEditId(null)} size="icon" variant="ghost" className="h-8 w-8"><X className="w-4 h-4" /></Button>
                  </>
                ) : (
                  <>
                    <div className="flex-1">
                      <span className="font-bold text-sm text-foreground">{item.name}</span>
                      {(item as any).description && (
                        <span className="text-xs text-muted-foreground ml-2">— {(item as any).description}</span>
                      )}
                    </div>
                    <button onClick={() => handleToggle(item.id, item.is_active)} title={item.is_active ? "Aktif" : "Pasif"}>
                      {item.is_active ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                    </button>
                    <Button onClick={() => startEdit(item)} size="icon" variant="ghost" className="h-8 w-8 text-primary/70 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => handleDelete(item.id)} size="icon" variant="ghost" className="h-8 w-8 text-destructive/70 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
