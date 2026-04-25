"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Truck, ArrowRight, Loader2, Package } from "lucide-react"

export function LevelsPackagesSection() {
  const supabase = createClient()

  const [levels, setLevels] = useState<any[]>([])
  const [packages, setPackages] = useState<any[]>([])
  const [selectedLevelId, setSelectedLevelId] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [pkgLoading, setPkgLoading] = useState(false)

  useEffect(() => {
    fetchLevels()
  }, [])

  async function fetchLevels() {
    setLoading(true)
    const { data } = await supabase
      .from('levels')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })

    if (data && data.length > 0) {
      // Merge YKS and Mezun levels
      const yksLevel = data.find(l => l.name?.includes('YKS'))
      const mezunLevel = data.find(l => l.name?.includes('Mezun'))
      
      let processedLevels = data
      if (yksLevel && mezunLevel) {
        // Remove Mezun and update YKS label to show both
        processedLevels = data
          .filter(l => !l.name?.includes('Mezun'))
          .map(l => {
            if (l.name?.includes('YKS')) {
              return { ...l, name: 'YKS / Mezun', short_name: 'YKS / Mezun' }
            }
            return l
          })
      }
      
      setLevels(processedLevels)
      setSelectedLevelId(processedLevels[0].id)
      await fetchPackages(processedLevels[0].id)
    }
    setLoading(false)
  }

  async function fetchPackages(levelId: string) {
    setPkgLoading(true)
    // Yıllık paketleri çek (her iki yerde aynı veri kaynağı)
    const { data } = await supabase
      .from('packages')
      .select('*')
      .eq('level_id', levelId)
      .eq('is_active', true)
      .eq('package_type', 'Yıllık')
      .order('created_at', { ascending: false })
      .limit(3)

    setPackages(data || [])
    setPkgLoading(false)
  }

  const handleLevelChange = (levelId: string) => {
    setSelectedLevelId(levelId)
    fetchPackages(levelId)
  }

  if (loading) {
    return (
      <section className="bg-muted py-16 md:py-24 relative border-t border-border">
        <div className="container mx-auto px-4 lg:max-w-7xl flex justify-center items-center min-h-[300px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    )
  }

  if (levels.length === 0) return null

  return (
    <section className="bg-muted py-16 md:py-24 relative border-t border-border">
      <div className="container mx-auto px-4 lg:max-w-7xl space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">Sınıfını Seç, Paketini Belirle</h2>
          <p className="text-muted-foreground">
            Eğitim seviyenize en uygun çalışma grubunu seçerek size özel hazırlanan deneme paketlerine ulaşın.
          </p>
        </div>

        {/* LEVEL TABS — Supabase'den dinamik */}
        <div className="flex overflow-x-auto pb-4 gap-3 snap-x hide-scrollbar justify-start md:justify-center">
          {levels.map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => handleLevelChange(lvl.id)}
              className={`snap-center shrink-0 min-w-[110px] md:min-w-[130px] p-4 rounded-2xl flex flex-col items-center justify-center transition-all shadow-sm cursor-pointer border-2
                ${selectedLevelId === lvl.id
                  ? 'bg-primary border-primary scale-105 shadow-md'
                  : 'bg-background border-border hover:border-primary/50 hover:shadow'}`}
            >
              <span className={`text-xl font-black mb-0.5 transition-colors ${selectedLevelId === lvl.id ? 'text-primary-foreground' : 'text-primary'}`}>
                {lvl.short_name || lvl.name?.split(' ')[0]}
              </span>
              <span className={`text-[9px] md:text-[10px] font-bold tracking-wider transition-colors ${selectedLevelId === lvl.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                {lvl.name?.split(' ').slice(1).join(' ') || 'SINIF'}
              </span>
            </button>
          ))}
        </div>

        {/* PACKAGES GRID */}
        {pkgLoading ? (
          <div className="flex justify-center items-center min-h-[220px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
          </div>
        ) : packages.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[220px] text-center gap-4">
            <Package className="w-14 h-14 text-muted-foreground/30" />
            <p className="font-bold text-muted-foreground">Bu sınıf için henüz yıllık paket eklenmemiş.</p>
            <p className="text-sm text-muted-foreground/70">Admin panelinden yeni paket ekleyebilirsiniz.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
            {packages.map((pkg) => {
              const price = pkg.price || pkg.price_yearly || 0
              const oldPrice = pkg.price_old || pkg.price_yearly_old || 0
              const discountPct = oldPrice > price && oldPrice > 0
                ? Math.round(((oldPrice - price) / oldPrice) * 100)
                : 0

              return (
                <div
                  key={pkg.id}
                  className={`relative flex flex-col bg-card rounded-3xl border-2 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden
                    ${pkg.badge === 'En Popüler' || pkg.badge === 'Çok Satan'
                      ? 'border-accent shadow-accent/10'
                      : 'border-border'}`}
                >
                  {/* Popüler Badge */}
                  {pkg.badge && (
                    <div className="absolute top-0 inset-x-0 z-10 flex justify-center">
                      <span className="bg-accent text-accent-foreground text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-b-xl shadow-sm">
                        {pkg.badge}
                      </span>
                    </div>
                  )}

                  {/* İndirim Badge */}
                  {discountPct > 0 && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="bg-destructive text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-sm">
                        %{discountPct}
                      </span>
                    </div>
                  )}

                  <div className="space-y-4 flex-1 p-6 pt-8">
                    {/* Seviye ikonu */}
                    <div className="text-3xl">{pkg.icon || "📦"}</div>

                    <div>
                      <h3 className="font-black text-xl text-foreground leading-tight">{pkg.title}</h3>
                      {pkg.short_desc && (
                        <div
                          className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: pkg.short_desc }}
                        />
                      )}
                    </div>

                    {/* Fiyat */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-foreground">₺{price.toLocaleString('tr-TR')}</span>
                      {oldPrice > price && (
                        <span className="text-base font-medium text-muted-foreground/60 line-through decoration-destructive/50">
                          ₺{oldPrice.toLocaleString('tr-TR')}
                        </span>
                      )}
                    </div>

                    {/* Kargo */}
                    <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold">
                      <Truck className="w-4 h-4" />
                      <span>Ücretsiz Kargo Dahil</span>
                    </div>
                  </div>

                  {/* Butonlar */}
                  <div className="p-5 pt-0 flex gap-2 mt-auto">
                    <Link
                      href={`/paketler/${pkg.slug || pkg.id}`}
                      className="flex-1 flex items-center justify-center h-11 px-4 rounded-xl border-2 border-border font-bold text-sm text-foreground hover:border-primary hover:text-primary transition-all"
                    >
                      İncele
                    </Link>
                    <Link
                      href={`/paketler/${pkg.slug || pkg.id}`}
                      className="flex-1 flex items-center justify-center gap-1.5 h-11 px-4 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-all shadow-md hover:shadow-primary/25"
                    >
                      Satın Al <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Alt link */}
        <div className="text-center">
          <Link
            href="/paketler"
            className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:gap-3 transition-all underline-offset-4 hover:underline"
          >
            Tüm Paketleri Gör <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
