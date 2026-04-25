"use client"

import { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, Layers, Search, Eye, Star } from "lucide-react"
import { buildAdminPath } from "@/lib/admin-config"

function PackagesListInner() {
  const searchParams = useSearchParams()
  const filterType = searchParams.get('type') // 'yillik' veya null
  const isYearlyView = filterType === 'yillik'

  const [packages, setPackages] = useState<any[]>([])
  const [levels, setLevels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    const [pkgRes, lvlRes] = await Promise.all([
      supabase.from('packages').select('*').order('created_at', { ascending: false }),
      supabase.from('levels').select('*')
    ])

    if (pkgRes.data) setPackages(pkgRes.data)
    if (lvlRes.data) setLevels(lvlRes.data)
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (confirm('Bu paketi silmek istediğinize emin misiniz? Geri alınamaz!')) {
      await supabase.from('packages').delete().eq('id', id)
      fetchData()
    }
  }

  const getLevelName = (id: string) => {
    return levels.find(l => l.id === id)?.name || 'Kategorisiz'
  }

  // Filtrele: yıllık view ise sadece Yıllık package_type göster
  const filteredPackages = packages.filter(pkg => {
    const matchType = isYearlyView ? pkg.package_type === 'Yıllık' : true
    const matchSearch = searchQuery
      ? pkg.title?.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    return matchType && matchSearch
  })

  const newPackageHref = isYearlyView
    ? buildAdminPath("/paketler/yeni?defaultType=Y%C4%B1ll%C4%B1k")
    : buildAdminPath("/paketler/yeni")

  return (
    <div className="space-y-8 pb-10">

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-border pb-6">
        <div>
          {isYearlyView && (
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg mb-3 border border-accent/20">
              <Star className="w-3.5 h-3.5" />
              Sınıfını Seç, Paketini Belirle — Yıllık Görünümü
            </div>
          )}
          <h1 className="text-3xl font-black flex items-center gap-3 text-foreground mt-2">
            <Layers className="w-8 h-8 text-primary" />
            {isYearlyView ? 'Yıllık Paketler (Ana Sayfa)' : 'Kurumsal Paket Yönetimi'}
          </h1>
          <p className="text-muted-foreground text-sm font-medium mt-2 max-w-2xl">
            {isYearlyView
              ? 'Bu bölümdeki paketler doğrudan ana sayfanın "Sınıfını Seç, Paketini Belirle" bölümünde görünür. Yıllık olarak işaretlediğiniz her paket buraya ve /paketler sayfasının Yıllık sekmesine otomatik eklenir.'
              : 'Sistemdeki tüm deneme ve eğitim setlerini buradan yönetebilir, yeni ürün ekleyebilir veya mevcut fiyatlamaları güncelleyebilirsiniz.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 w-full lg:w-auto shrink-0">
          {isYearlyView && (
            <Link href={buildAdminPath("/paketler")}>
              <Button variant="outline" className="h-12 px-6 font-bold border-2">
                Tüm Paketleri Gör
              </Button>
            </Link>
          )}
          <Link href={newPackageHref}>
            <Button className="h-12 px-8 font-black bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:scale-105 transition-transform text-base">
              <Plus className="w-5 h-5 mr-2" />
              {isYearlyView ? 'Yeni Yıllık Paket Ekle' : 'Yeni Paket Ekle'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Info Banner — yıllık görünümde */}
      {isYearlyView && (
        <div className="bg-accent/5 border-2 border-accent/20 rounded-2xl p-5 flex gap-4">
          <div className="shrink-0 w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
            <Star className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="font-black text-sm text-foreground">Nasıl çalışır?</p>
            <p className="text-sm text-muted-foreground mt-1">
              Yeni Yıllık Paket Ekle butonuyla oluşturduğunuz paket otomatik olarak <strong>Paket Türü = Yıllık</strong> seçili gelir.
              Bu paketler hem burada hem <code className="bg-muted px-1 rounded">/paketler</code> sayfasının Yıllık sekmesinde hem de
              ana sayfada "Sınıfını Seç" bölümünde (sınıfa göre) görünür.
            </p>
          </div>
        </div>
      )}

      <div className="bg-card border-2 border-border rounded-3xl p-6 shadow-sm">

        {/* Search */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Paket adı ile ara..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-background border-2 border-border rounded-xl px-12 py-3 text-sm font-bold outline-none focus:border-primary"
            />
          </div>
          <span className="text-sm font-bold text-muted-foreground shrink-0">
            {filteredPackages.length} paket
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-xs uppercase tracking-widest text-muted-foreground font-black">
                <th className="p-4 rounded-tl-xl w-16">Satış</th>
                <th className="p-4">Paket Adı</th>
                <th className="p-4">Kategori / Sınıf</th>
                <th className="p-4">Paket Türü</th>
                <th className="p-4">Fiyat</th>
                <th className="p-4 text-right rounded-tr-xl">Aksiyonlar</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center p-8 text-muted-foreground font-bold">Yükleniyor...</td></tr>
              ) : filteredPackages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-muted-foreground font-bold">
                    {isYearlyView
                      ? 'Henüz yıllık paket eklenmemiş. "Yeni Yıllık Paket Ekle" butonuna tıklayın.'
                      : 'Henüz hiç paket eklenmemiş. "Yeni Paket Ekle" butonuna tıklayarak başlayın.'}
                  </td>
                </tr>
              ) : filteredPackages.map(pkg => (
                <tr key={pkg.id} className="border-b last:border-0 border-border hover:bg-muted/20 transition-colors group">
                  <td className="p-4">
                    <div className={`w-3 h-3 rounded-full ${pkg.is_active ? 'bg-success' : 'bg-destructive'} mx-auto`} title={pkg.is_active ? "Aktif" : "Pasif"} />
                  </td>
                  <td className="p-4 font-bold text-foreground">
                    <div className="flex items-center gap-2">
                      {pkg.cover_image && (
                        <img src={pkg.cover_image} className="w-8 h-10 object-cover rounded border border-border shrink-0" alt="" />
                      )}
                      <div>
                        {pkg.title}
                        {pkg.badge && <span className="ml-2 bg-accent/20 text-accent font-black text-[10px] px-2 py-0.5 rounded uppercase">{pkg.badge}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-semibold text-muted-foreground">
                    {getLevelName(pkg.level_id)}
                  </td>
                  <td className="p-4">
                    <span className={`text-[11px] font-black px-2.5 py-1 rounded-lg border ${
                      pkg.package_type === 'Yıllık'
                        ? 'bg-primary/10 text-primary border-primary/20'
                        : 'bg-muted text-muted-foreground border-border'
                    }`}>
                      {pkg.package_type || 'Aylık'}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-black text-foreground">
                    {pkg.price ? `₺${pkg.price.toLocaleString('tr-TR')}` : '—'}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Link href={`/paketler/${pkg.slug || pkg.id}`} target="_blank">
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href={buildAdminPath(`/paketler/yeni?id=${pkg.id}`)}>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-primary hover:bg-primary/10">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button onClick={() => handleDelete(pkg.id)} size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
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

export default function PackagesListPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[400px] text-muted-foreground font-bold">Yükleniyor...</div>}>
      <PackagesListInner />
    </Suspense>
  )
}
