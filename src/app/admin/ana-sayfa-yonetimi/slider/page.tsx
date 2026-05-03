"use client"

import { useState, useEffect, useRef } from "react"
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
import { ArrowLeft, Image as ImageIcon, UploadCloud, Trash2, GripVertical, Plus, Loader2, ExternalLink } from "lucide-react"
import Link from "next/link"
import { buildAdminPath } from "@/lib/admin-config"

interface HeroSlide {
  id: string
  image_url: string
  title: string | null
  subtitle: string | null
  link_url: string | null
  sort_order: number
  is_active: boolean
}

export default function HeroSliderAdminPage() {
  const supabase = createClient()
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    image_url: '',
    title: '',
    subtitle: '',
    link_url: '',
    is_active: true,
  })

  useEffect(() => {
    fetchSlides()
  }, [])

  async function fetchSlides() {
    setLoading(true)
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .order('sort_order', { ascending: true })

    if (!error && data) {
      setSlides(data)
    }
    setLoading(false)
  }

  function openAdd() {
    setEditingSlide(null)
    setForm({ image_url: '', title: '', subtitle: '', link_url: '', is_active: true })
    setDialogOpen(true)
  }

  function openEdit(slide: HeroSlide) {
    setEditingSlide(slide)
    setForm({
      image_url: slide.image_url,
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      link_url: slide.link_url || '',
      is_active: slide.is_active,
    })
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!form.image_url) {
      alert('Görsel URL zorunludur.')
      return
    }

    const payload = {
      image_url: form.image_url,
      title: form.title || null,
      subtitle: form.subtitle || null,
      link_url: form.link_url || null,
      is_active: form.is_active,
      sort_order: editingSlide ? editingSlide.sort_order : slides.length,
    }

    if (editingSlide) {
      const { error } = await supabase.from('hero_slides').update(payload).eq('id', editingSlide.id)
      if (error) alert('Güncelleme hatası: ' + error.message)
    } else {
      const { error } = await supabase.from('hero_slides').insert(payload)
      if (error) alert('Ekleme hatası: ' + error.message)
    }

    setDialogOpen(false)
    await fetchSlides()
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu slaytı silmek istediğinize emin misiniz?')) return
    const { error } = await supabase.from('hero_slides').delete().eq('id', id)
    if (error) alert('Silme hatası: ' + error.message)
    await fetchSlides()
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    setUploading(true)

    const ext = file.name.split('.').pop()
    const fileName = `hero-${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`

    const { error } = await supabase.storage.from('media').upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

    if (!error) {
      const { data: urlData } = supabase.storage.from('media').getPublicUrl(fileName)
      setForm(prev => ({ ...prev, image_url: urlData.publicUrl }))
    } else {
      alert('Dosya yüklenirken hata: ' + error.message)
    }
    setUploading(false)
  }

  async function moveSlide(id: string, direction: 'up' | 'down') {
    const idx = slides.findIndex(s => s.id === id)
    if (idx === -1) return
    if (direction === 'up' && idx === 0) return
    if (direction === 'down' && idx === slides.length - 1) return

    const newSlides = [...slides]
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    const temp = newSlides[idx].sort_order
    newSlides[idx].sort_order = newSlides[swapIdx].sort_order
    newSlides[swapIdx].sort_order = temp

    await supabase.from('hero_slides').update({ sort_order: newSlides[idx].sort_order }).eq('id', newSlides[idx].id)
    await supabase.from('hero_slides').update({ sort_order: newSlides[swapIdx].sort_order }).eq('id', newSlides[swapIdx].id)

    await fetchSlides()
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
              <ImageIcon className="w-6 h-6 text-primary" />
              Hero Slider Yönetimi
            </h1>
            <p className="text-muted-foreground text-sm">Ana sayfadaki dönen görselleri buradan yönetin.</p>
          </div>
        </div>
        <Button onClick={openAdd} className="font-bold">
          <Plus className="w-4 h-4 mr-2" /> Yeni Slayt Ekle
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : slides.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center space-y-4">
            <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto" />
            <div>
              <p className="font-bold text-lg">Henüz slayt eklenmemiş</p>
              <p className="text-muted-foreground text-sm mt-1">Ana sayfada görüntülenecek slaytları eklemek için &quot;Yeni Slayt Ekle&quot; butonuna tıklayın.</p>
            </div>
            <Button onClick={openAdd} variant="outline" className="font-bold">
              <Plus className="w-4 h-4 mr-2" /> İlk Slaytı Ekle
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {slides.map((slide, idx) => (
            <Card key={slide.id} className={`overflow-hidden ${!slide.is_active ? 'opacity-60' : ''}`}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-48 h-28 rounded-xl overflow-hidden bg-muted shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={slide.image_url} alt={slide.title || ''} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-lg">{slide.title || 'Başlıksız'}</p>
                        <p className="text-sm text-muted-foreground">{slide.subtitle || 'Alt başlık yok'}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${slide.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          {slide.is_active ? 'Aktif' : 'Pasif'}
                        </span>
                      </div>
                    </div>
                    {slide.link_url && (
                      <div className="flex items-center gap-1 text-xs text-accent">
                        <ExternalLink className="w-3 h-3" />
                        {slide.link_url}
                      </div>
                    )}
                    <div className="flex items-center gap-2 pt-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(slide)} className="font-bold h-8">
                        Düzenle
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(slide.id)} className="font-bold h-8 text-destructive hover:bg-destructive/10">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                      <div className="flex items-center gap-1 ml-auto">
                        <Button variant="ghost" size="sm" onClick={() => moveSlide(slide.id, 'up')} disabled={idx === 0} className="h-8 px-2">
                          <GripVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black">
              {editingSlide ? 'Slayt Düzenle' : 'Yeni Slayt Ekle'}
            </DialogTitle>
            <DialogDescription>
              Slayt görseli, başlık ve yönlendirme bağlantısını ayarlayın.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="font-semibold">Görsel</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="https://..."
                  value={form.image_url}
                  onChange={(e) => setForm(prev => ({ ...prev, image_url: e.target.value }))}
                  className="rounded-xl"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="shrink-0 rounded-xl"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                </Button>
              </div>
              {form.image_url && (
                <div className="w-full h-32 rounded-xl overflow-hidden bg-muted mt-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Başlık</Label>
              <Input
                placeholder="Slayt başlığı..."
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Alt Başlık</Label>
              <Input
                placeholder="Kısa açıklama..."
                value={form.subtitle}
                onChange={(e) => setForm(prev => ({ ...prev, subtitle: e.target.value }))}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Yönlendirme Linki</Label>
              <Input
                placeholder="/paketler veya https://..."
                value={form.link_url}
                onChange={(e) => setForm(prev => ({ ...prev, link_url: e.target.value }))}
                className="rounded-xl"
              />
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                id="slide-active"
                checked={form.is_active}
                onCheckedChange={(v) => setForm(prev => ({ ...prev, is_active: !!v }))}
              />
              <Label htmlFor="slide-active" className="font-semibold cursor-pointer">Aktif</Label>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="w-full sm:w-auto rounded-xl font-bold h-12">
              İptal
            </Button>
            <Button onClick={handleSave} className="w-full sm:w-auto rounded-xl font-bold h-12">
              {editingSlide ? 'Güncelle' : 'Ekle'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
