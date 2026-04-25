"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { PlusCircle, Save, Trash2, Edit, Package, GraduationCap, Loader2, Upload, X, ImageIcon } from "lucide-react"

interface Level {
  id: string
  name: string
}

interface EarlyPackage {
  id: string
  title: string
  description: string
  price: number
  original_price: number
  features: string[]
  level_id: string
  season: string
  cover_image: string | null
  is_featured: boolean
  is_active: boolean
}

export default function AdminErkenKayit() {
  const [levels, setLevels] = useState<Level[]>([])
  const [packages, setPackages] = useState<EarlyPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedSeason, setSelectedSeason] = useState("2026-2027")
  const [editingPackage, setEditingPackage] = useState<EarlyPackage | null>(null)
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: 0,
    original_price: 0,
    features: [''],
    level_id: '',
    season: '2026-2027',
    cover_image: '',
    is_featured: false,
    is_active: true
  })
  
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [selectedSeason])

  async function fetchData() {
    setLoading(true)
    const [levelsRes, packagesRes] = await Promise.all([
      supabase.from('levels').select('*').order('sort_order'),
      supabase.from('early_registration_packages')
        .select('*')
        .eq('season', selectedSeason)
        .order('created_at', { ascending: false })
    ])
    
    if (levelsRes.data) setLevels(levelsRes.data)
    if (packagesRes.data) setPackages(packagesRes.data || [])
    setLoading(false)
  }

  function addFeature() {
    setForm({ ...form, features: [...form.features, ''] })
  }

  function updateFeature(index: number, value: string) {
    const newFeatures = [...form.features]
    newFeatures[index] = value
    setForm({ ...form, features: newFeatures })
  }

  function removeFeature(index: number) {
    setForm({ ...form, features: form.features.filter((_, i) => i !== index) })
  }

  async function handleSave() {
    if (!form.title || !form.level_id || form.price <= 0) {
      alert('Lütfen zorunlu alanları doldurun')
      return
    }

    setSaving(true)
    
    const data = {
      ...form,
      features: form.features.filter(f => f.trim() !== '')
    }

    if (editingPackage) {
      // Güncelle
      const { error } = await supabase
        .from('early_registration_packages')
        .update(data)
        .eq('id', editingPackage.id)
      
      if (error) {
        alert('Güncelleme hatası: ' + error.message)
      } else {
        setEditingPackage(null)
        resetForm()
        fetchData()
      }
    } else {
      // Yeni ekle
      const { error } = await supabase
        .from('early_registration_packages')
        .insert(data)
      
      if (error) {
        alert('Ekleme hatası: ' + error.message)
      } else {
        resetForm()
        fetchData()
      }
    }
    
    setSaving(false)
  }

  function resetForm() {
    setForm({
      title: '',
      description: '',
      price: 0,
      original_price: 0,
      features: [''],
      level_id: '',
      season: selectedSeason,
      cover_image: '',
      is_featured: false,
      is_active: true
    })
  }

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    // Dosya boyutu kontrolü (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Dosya boyutu 2MB\'ı geçemez')
      return
    }

    // Sadece resim dosyaları
    if (!file.type.startsWith('image/')) {
      alert('Sadece resim dosyaları yüklenebilir')
      return
    }

    setUploadingImage(true)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `early-packages/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Public URL al
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName)

      setForm({ ...form, cover_image: publicUrl })
    } catch (error: any) {
      alert('Görsel yükleme hatası: ' + error.message)
    } finally {
      setUploadingImage(false)
    }
  }

  function removeImage() {
    setForm({ ...form, cover_image: '' })
  }

  function editPackage(pkg: EarlyPackage) {
    setEditingPackage(pkg)
    setForm({
      title: pkg.title,
      description: pkg.description,
      price: pkg.price,
      original_price: pkg.original_price,
      features: pkg.features.length > 0 ? pkg.features : [''],
      level_id: pkg.level_id,
      season: pkg.season,
      cover_image: pkg.cover_image || '',
      is_featured: pkg.is_featured,
      is_active: pkg.is_active
    })
  }

  async function deletePackage(id: string) {
    if (!confirm('Bu paketi silmek istediğinize emin misiniz?')) return
    
    const { error } = await supabase
      .from('early_registration_packages')
      .delete()
      .eq('id', id)
    
    if (error) {
      alert('Silme hatası: ' + error.message)
    } else {
      fetchData()
    }
  }

  const getLevelName = (id: string) => {
    return levels.find(l => l.id === id)?.name || 'Bilinmiyor'
  }

  return (
    <div className="space-y-8 pb-10">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package className="w-6 h-6 text-primary" />
            Erken Kayıt Paket Yönetimi
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Sezon bazlı erken kayıt paketlerini tanımlayın. Her sınıf için birden fazla paket oluşturabilirsiniz.
          </p>
        </div>
        <div className="flex gap-2">
          <select 
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="bg-background border border-border rounded-lg px-4 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="2025-2026">2025-2026 Sezonu</option>
            <option value="2026-2027">2026-2027 Sezonu</option>
            <option value="2027-2028">2027-2028 Sezonu</option>
          </select>
        </div>
      </div>

      {/* PAKET LİSTESİ */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            {selectedSeason} Sezonu Paketleri
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          </div>
        ) : packages.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="font-bold">Henüz paket tanımlanmamış</p>
            <p className="text-sm mt-1">Aşağıdaki formdan yeni paket ekleyin</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {packages.map((pkg) => (
              <div key={pkg.id} className="p-4 flex items-center justify-between hover:bg-muted/50">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${pkg.is_active ? 'bg-success' : 'bg-destructive'}`} />
                  {pkg.cover_image && (
                    <img src={pkg.cover_image} alt="" className="w-12 h-12 object-cover rounded-lg border border-border" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{pkg.title}</span>
                      {pkg.is_featured && <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded font-bold">POPÜLER</span>}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {getLevelName(pkg.level_id)} • ₺{pkg.price.toLocaleString('tr-TR')} 
                      {pkg.original_price > 0 && <span className="line-through ml-1 text-muted-foreground/70">₺{pkg.original_price.toLocaleString('tr-TR')}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => editPackage(pkg)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deletePackage(pkg.id)} className="text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* YENİ PAKET FORMU */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-6 space-y-5">
        <h2 className="text-lg font-bold border-b border-border pb-3 flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-primary" />
          {editingPackage ? 'Paketi Düzenle' : 'Yeni Paket Ekle'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* SINIF SEÇİMİ */}
          <div className="space-y-2">
            <label className="text-sm font-bold">Sınıf *</label>
            <select 
              value={form.level_id}
              onChange={(e) => setForm({...form, level_id: e.target.value})}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Sınıf Seçin</option>
              {levels.map((level) => (
                <option key={level.id} value={level.id}>{level.name}</option>
              ))}
            </select>
          </div>

          {/* PAKET ADI */}
          <div className="space-y-2">
            <label className="text-sm font-bold">Paket Adı *</label>
            <input 
              type="text"
              value={form.title}
              onChange={(e) => setForm({...form, title: e.target.value})}
              placeholder="Örn: Premium Paket"
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 font-bold"
            />
          </div>

          {/* FİYATLAR */}
          <div className="space-y-2">
            <label className="text-sm font-bold">İndirimli Fiyat (₺) *</label>
            <input 
              type="number"
              value={form.price}
              onChange={(e) => setForm({...form, price: Number(e.target.value)})}
              placeholder="2999"
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 font-bold"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">Normal Fiyat (₺) <span className="text-muted-foreground font-normal">(İndirim göstermek için)</span></label>
            <input 
              type="number"
              value={form.original_price}
              onChange={(e) => setForm({...form, original_price: Number(e.target.value)})}
              placeholder="3999"
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 font-bold"
            />
          </div>
        </div>

        {/* AÇIKLAMA */}
        <div className="space-y-2">
          <label className="text-sm font-bold">Kısa Açıklama</label>
          <input 
            type="text"
            value={form.description}
            onChange={(e) => setForm({...form, description: e.target.value})}
            placeholder="Paketin özeti..."
            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* GÖRSEL YÜKLEME */}
        <div className="space-y-3">
          <label className="text-sm font-bold">Paket Görseli</label>
          
          {form.cover_image ? (
            <div className="relative w-fit">
              <img 
                src={form.cover_image} 
                alt="Paket görseli" 
                className="w-40 h-40 object-cover rounded-xl border-2 border-border"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-white rounded-full flex items-center justify-center hover:bg-destructive/90"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-40 h-40 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
            >
              {uploadingImage ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="text-xs text-muted-foreground">Yükleniyor...</span>
                </>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground text-center px-2">
                    Görsel Yükle<br/>(Max 2MB)
                  </span>
                </>
              )}
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* ÖZELLİKLER */}
        <div className="space-y-3">
          <label className="text-sm font-bold">Paket Özellikleri</label>
          {form.features.map((feature, idx) => (
            <div key={idx} className="flex gap-2">
              <input 
                type="text"
                value={feature}
                onChange={(e) => updateFeature(idx, e.target.value)}
                placeholder={`Özellik ${idx + 1}`}
                className="flex-1 bg-background border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Button variant="outline" size="sm" onClick={() => removeFeature(idx)} disabled={form.features.length === 1}>
                Sil
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addFeature} className="w-full">
            + Özellik Ekle
          </Button>
        </div>

        {/* AYARLAR */}
        <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => setForm({...form, is_featured: e.target.checked})}
              className="w-4 h-4"
            />
            <span className="text-sm font-bold">En Popüler olarak işaretle</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({...form, is_active: e.target.checked})}
              className="w-4 h-4"
            />
            <span className="text-sm font-bold">Aktif</span>
          </label>
        </div>

        {/* BUTONLAR */}
        <div className="flex gap-3 pt-4">
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="font-bold bg-primary text-primary-foreground"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Kaydediliyor...' : (editingPackage ? 'Güncelle' : 'Kaydet')}
          </Button>
          {editingPackage && (
            <Button variant="outline" onClick={() => {setEditingPackage(null); resetForm()}} className="font-bold">
              İptal
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
