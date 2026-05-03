"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ArrowLeft, Camera, Trash2, Plus, Loader2, ExternalLink } from "lucide-react"
import Link from "next/link"
import { buildAdminPath } from "@/lib/admin-config"

interface InstagramEmbed {
  id: string
  name: string
  embed_url: string
  sort_order: number
  is_active: boolean
}

export default function InstagramAdminPage() {
  const supabase = createClient()
  const [embeds, setEmbeds] = useState<InstagramEmbed[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<InstagramEmbed | null>(null)

  const [form, setForm] = useState({
    name: '',
    embed_url: '',
    is_active: true,
  })

  useEffect(() => {
    fetchEmbeds()
  }, [])

  async function fetchEmbeds() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('instagram_embeds')
        .select('*')
        .order('sort_order', { ascending: true })

      if (!error && data) setEmbeds(data)
    } catch {
      // Table may not exist
    }
    setLoading(false)
  }

  function openAdd() {
    setEditing(null)
    setForm({ name: '', embed_url: '', is_active: true })
    setDialogOpen(true)
  }

  function openEdit(item: InstagramEmbed) {
    setEditing(item)
    setForm({ name: item.name, embed_url: item.embed_url, is_active: item.is_active })
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!form.name || !form.embed_url) {
      alert('İsim ve Instagram linki zorunludur.')
      return
    }

    const url = form.embed_url.trim()
    if (!url.startsWith('https://www.instagram.com/')) {
      alert('Geçerli bir Instagram linki girin.\n\nÖrnek: https://www.instagram.com/p/DXSk7whCDpI/')
      return
    }

    const payload = {
      name: form.name,
      embed_url: url,
      is_active: form.is_active,
      sort_order: editing ? editing.sort_order : embeds.length,
    }

    if (editing) {
      const { error } = await supabase.from('instagram_embeds').update(payload).eq('id', editing.id)
      if (error) { alert('Güncelleme hatası: ' + error.message); return }
    } else {
      const { error } = await supabase.from('instagram_embeds').insert(payload)
      if (error) { alert('Ekleme hatası: ' + error.message); return }
    }

    setDialogOpen(false)
    await fetchEmbeds()
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu öğeyi silmek istediğinize emin misiniz?')) return
    const { error } = await supabase.from('instagram_embeds').delete().eq('id', id)
    if (error) { alert('Silme hatası: ' + error.message); return }
    await fetchEmbeds()
  }

  async function moveItem(id: string, direction: 'up' | 'down') {
    const idx = embeds.findIndex(e => e.id === id)
    if (idx === -1) return
    if (direction === 'up' && idx === 0) return
    if (direction === 'down' && idx === embeds.length - 1) return

    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    await supabase.from('instagram_embeds').update({ sort_order: embeds[swapIdx].sort_order }).eq('id', embeds[idx].id)
    await supabase.from('instagram_embeds').update({ sort_order: embeds[idx].sort_order }).eq('id', embeds[swapIdx].id)
    await fetchEmbeds()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={buildAdminPath('/ana-sayfa-yonetimi')}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Camera className="w-6 h-6 text-primary" />
              Instagram Yönetimi
            </h1>
            <p className="text-muted-foreground text-sm">Ana sayfadaki Instagram gömme alanını buradan yönetin.</p>
          </div>
        </div>
        <Button onClick={openAdd} className="font-bold">
          <Plus className="w-4 h-4 mr-2" /> Yeni Ekle
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : embeds.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center space-y-4">
            <Camera className="w-12 h-12 text-muted-foreground mx-auto" />
            <div>
              <p className="font-bold text-lg">Henüz Instagram gönderisi eklenmemiş</p>
              <p className="text-muted-foreground text-sm mt-1">Instagram gönderi linkini ekleyin, otomatik gömülecek.</p>
            </div>
            <Button onClick={openAdd} variant="outline" className="font-bold">
              <Plus className="w-4 h-4 mr-2" /> İlkini Ekle
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {embeds.map((item, idx) => (
            <Card key={item.id} className={`${!item.is_active ? 'opacity-60' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold">{item.name}</p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {item.is_active ? 'Aktif' : 'Pasif'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-accent mt-1">
                      <ExternalLink className="w-3 h-3" />
                      <span className="truncate">{item.embed_url}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => openEdit(item)} className="h-8 font-bold">
                      Düzenle
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)} className="h-8 text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                    <div className="flex flex-col gap-1">
                      <Button variant="ghost" size="sm" onClick={() => moveItem(item.id, 'up')} disabled={idx === 0} className="h-5 px-1">▲</Button>
                      <Button variant="ghost" size="sm" onClick={() => moveItem(item.id, 'down')} disabled={idx === embeds.length - 1} className="h-5 px-1">▼</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black">{editing ? 'Düzenle' : 'Yeni Instagram Gönderisi'}</DialogTitle>
            <DialogDescription>Instagram gönderi linkini yapıştırın. Gönderi otomatik olarak gömülecek.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="font-semibold">İsim (Görünen Ad)</Label>
              <Input
                placeholder="Örn: 7.Sınıf Mayıs Paketi"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Instagram Gönderi Linki</Label>
              <Input
                placeholder="https://www.instagram.com/p/DXSk7whCDpI/"
                value={form.embed_url}
                onChange={(e) => setForm(prev => ({ ...prev, embed_url: e.target.value }))}
                className="rounded-xl"
              />
              <p className="text-xs text-muted-foreground">
                Instagram&apos;da gönderiyi aç &gt; Paylaş &gt; Bağlantıyı kopyala &gt; Buraya yapıştır.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="insta-active"
                checked={form.is_active}
                onCheckedChange={(v) => setForm(prev => ({ ...prev, is_active: !!v }))}
              />
              <Label htmlFor="insta-active" className="font-semibold cursor-pointer">Aktif</Label>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="w-full sm:w-auto rounded-xl font-bold h-12">İptal</Button>
            <Button onClick={handleSave} className="w-full sm:w-auto rounded-xl font-bold h-12">{editing ? 'Güncelle' : 'Ekle'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
