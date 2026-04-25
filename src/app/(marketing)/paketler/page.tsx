"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Truck, Loader2, PackageOpen, ArrowRight, ShoppingCart } from "lucide-react"
import Link from "next/link"

export default function PackagesPage() {
  const supabase = createClient()

  // Data States
  const [packages, setPackages] = useState<any[]>([])
  const [levels, setLevels] = useState<any[]>([])
  const [publishers, setPublishers] = useState<any[]>([])
  const [pkgPubs, setPkgPubs] = useState<any[]>([])

  // Filter & UI States
  const [loading, setLoading] = useState(true)
  const [billingCycle, setBillingCycle] = useState<"aylik" | "yillik">("yillik")
  const [selectedLevelId, setSelectedLevelId] = useState<string>("all")
  const [selectedPublisherId, setSelectedPublisherId] = useState<string>("all")

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)

    const [pkgRes, lvlRes, pubRes, pkgPubRes] = await Promise.all([
      supabase.from('packages').select('*').eq('is_active', true).order('created_at', { ascending: false }),
      supabase.from('levels').select('*').order('sort_order', { ascending: true }),
      supabase.from('publishers').select('*').order('name', { ascending: true }),
      supabase.from('package_publishers').select('*'),
    ])

    if (pkgRes.data) setPackages(pkgRes.data)
    if (lvlRes.data) setLevels(lvlRes.data)
    if (pubRes.data) setPublishers(pubRes.data)
    if (pkgPubRes.data) setPkgPubs(pkgPubRes.data)

    setLoading(false)
  }

  // Filtering Logic — package_type ile billing cycle eşleşiyor
  const filteredPackages = packages.filter(pkg => {
    // package_type senkronizasyonu: "Yıllık" → yillik tab, "Aylık" → aylik tab
    const typeMatch =
      billingCycle === "yillik"
        ? pkg.package_type === 'Yıllık'
        : pkg.package_type === 'Aylık' || (!pkg.package_type || pkg.package_type === '')

    if (!typeMatch) return false

    if (selectedLevelId !== "all" && pkg.level_id !== selectedLevelId) return false

    if (selectedPublisherId !== "all") {
      const hasPub = pkgPubs.some(pp => pp.package_id === pkg.id && pp.publisher_id === selectedPublisherId)
      if (!hasPub) return false
    }

    return true
  })

  const getLevelName = (id: string) => levels.find(l => l.id === id)?.name || "Genel"
  const getPackagePublishers = (pkgId: string) => {
    const pubIds = pkgPubs.filter(pp => pp.package_id === pkgId).map(pp => pp.publisher_id)
    return publishers.filter(p => pubIds.includes(p.id))
  }

  return (
    <div className="bg-muted min-h-screen py-12">
      <div className="container mx-auto px-4 lg:max-w-7xl">

        {/* HEADER */}
        <div className="mb-12 bg-card rounded-[2rem] p-8 md:p-14 relative overflow-hidden shadow-sm flex flex-col items-center text-center gap-6 border-2 border-border">
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
          <div className="space-y-4 max-w-3xl relative z-10">
            <span className="bg-primary/10 text-primary uppercase text-xs font-black tracking-widest px-4 py-1.5 rounded-full">Tüm Sınav Setleri</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tight">
              Kurumsal <span className="text-primary">Başarı</span> Paketleri
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl font-medium mt-4">
              Seviyenize özel hazırlanmış, MEB ve ÖSYM müfredatına %100 uyumlu, çözüm videolu deneme setlerimizle hedefinizi şansa bırakmayın.
            </p>
          </div>
        </div>

        {/* BILLING TOGGLE — Sadece Aylık / Yıllık */}
        <div className="flex justify-center mb-12 relative z-20">
          <div className="bg-card p-2 rounded-2xl border-2 border-border shadow-sm flex items-center gap-2">
            <button
              onClick={() => setBillingCycle("aylik")}
              className={`px-8 py-3 rounded-xl font-black text-sm transition-all whitespace-nowrap ${billingCycle === "aylik" ? "bg-primary text-primary-foreground shadow-md scale-105" : "text-muted-foreground hover:bg-muted"}`}
            >
              Aylık Gönderim
            </button>
            <div className="relative">
              <span className="absolute -top-4 -right-2 bg-success text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm rotate-12 z-10 w-max">%30 İndirim</span>
              <button
                onClick={() => setBillingCycle("yillik")}
                className={`px-8 py-3 rounded-xl font-black text-sm transition-all whitespace-nowrap ${billingCycle === "yillik" ? "bg-primary text-primary-foreground shadow-md scale-105" : "text-muted-foreground hover:bg-muted"}`}
              >
                Yıllık Paket (10 Ay)
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* MOBILE PILL FILTERS */}
          <div className="lg:hidden space-y-3">
            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
              <button onClick={() => setSelectedLevelId("all")} className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all ${selectedLevelId === "all" ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border text-muted-foreground'}`}>Tümü</button>
              {levels.map(lvl => (
                <button key={lvl.id} onClick={() => setSelectedLevelId(lvl.id)} className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all whitespace-nowrap ${selectedLevelId === lvl.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border text-muted-foreground'}`}>{lvl.name}</button>
              ))}
            </div>
            <Select value={selectedPublisherId} onValueChange={(val) => setSelectedPublisherId(val || 'all')}>
              <SelectTrigger className="w-full bg-card border-2 font-bold h-10 rounded-xl text-sm"><SelectValue placeholder="Tüm Yayın Evleri" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="font-bold cursor-pointer">Tüm Yayınevleri (Karma)</SelectItem>
                {publishers.map(pub => (<SelectItem key={pub.id} value={pub.id} className="font-bold cursor-pointer">{pub.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          {/* DESKTOP SIDEBAR */}
          <div className="hidden lg:block w-72 shrink-0 space-y-6">
            <div className="bg-card rounded-2xl p-6 border-2 border-border shadow-sm sticky top-24">
              <h4 className="font-black text-sm text-foreground uppercase tracking-widest border-b border-border pb-3 mb-4">Sınıf / Seviye</h4>
              <div className="flex flex-col gap-2">
                <button onClick={() => setSelectedLevelId("all")} className={`text-left px-5 py-3 rounded-xl text-sm font-bold transition-all border-2 ${selectedLevelId === "all" ? 'bg-primary/10 text-primary border-primary/20' : 'bg-transparent border-transparent hover:bg-muted text-muted-foreground hover:text-foreground'}`}>Tüm Sınıflar</button>
                {levels.map((lvl) => (
                  <button key={lvl.id} onClick={() => setSelectedLevelId(lvl.id)} className={`text-left px-5 py-3 rounded-xl text-sm font-bold transition-all border-2 ${selectedLevelId === lvl.id ? 'bg-primary/10 text-primary border-primary/20' : 'bg-transparent border-transparent hover:bg-muted text-muted-foreground hover:text-foreground'}`}>{lvl.name}</button>
                ))}
              </div>
              <h4 className="font-black text-sm text-foreground uppercase tracking-widest border-b border-border pb-3 mb-4 mt-8">Yayın Evi Filtresi</h4>
              <Select value={selectedPublisherId} onValueChange={(val) => setSelectedPublisherId(val ?? 'all')}>
                <SelectTrigger className="w-full bg-background border-2 font-bold h-12 rounded-xl"><SelectValue placeholder="Tüm Yayın Evleri" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="font-bold cursor-pointer">Tüm Yayınevleri (Karma)</SelectItem>
                  {publishers.map(pub => (<SelectItem key={pub.id} value={pub.id} className="font-bold cursor-pointer">{pub.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* PACKAGE GRID */}
          <div className="flex-1 w-full min-w-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-20 text-muted-foreground">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
                <p className="font-bold">Paketler Yükleniyor...</p>
              </div>
            ) : filteredPackages.length === 0 ? (
              <div className="bg-card rounded-3xl border-2 border-dashed border-border p-12 flex flex-col items-center text-center">
                <PackageOpen className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-2xl font-black">Bu filtreye uygun paket bulunamadı.</h3>
                <p className="text-muted-foreground mt-2">Seçtiğiniz sınıf veya yayınevi kriterlerine uygun satıştaki bir paketimiz şu an yok. Lütfen farklı filtreler deneyin.</p>
                <Button onClick={() => { setSelectedLevelId('all'); setSelectedPublisherId('all') }} className="mt-6 font-bold" variant="outline">Filtreleri Temizle</Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
                {filteredPackages.map((pkg) => {
                  const price = pkg.price || 0
                  const oldPrice = pkg.price_old || 0
                  const discountPct = oldPrice > price && oldPrice > 0
                    ? Math.round(((oldPrice - price) / oldPrice) * 100)
                    : 0
                  const packPublishers = getPackagePublishers(pkg.id)

                  return (
                    <Link
                      href={`/paketler/${pkg.slug || pkg.id}`}
                      key={pkg.id}
                      className="group bg-card rounded-2xl border border-border hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden"
                    >
                      {/* ── GÖRSEL ALANI — Kartın %65'i ── */}
                      <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
                        {pkg.cover_image ? (
                          <img
                            src={pkg.cover_image}
                            alt={pkg.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-20 select-none">
                            {pkg.icon || "📦"}
                          </div>
                        )}

                        {/* Badge'ler — sağ üst köşe, görseli kapatmaz */}
                        <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1.5 pointer-events-none">
                          {discountPct > 0 && (
                            <span className="bg-destructive/90 backdrop-blur-sm text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg">
                              %{discountPct}
                            </span>
                          )}
                          {pkg.badge && (
                            <span className="bg-accent/90 backdrop-blur-sm text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg whitespace-nowrap">
                              {pkg.badge}
                            </span>
                          )}
                        </div>

                        {/* Sınıf Etiketi — sol alt */}
                        <div className="absolute bottom-2.5 left-2.5 pointer-events-none">
                          <span className="bg-background/85 backdrop-blur-sm text-foreground border border-border/50 text-[9px] font-black px-2 py-1 rounded-md shadow-sm">
                            {getLevelName(pkg.level_id)}
                          </span>
                        </div>

                        {/* Kargo bilgisi — sağ alt */}
                        <div className="absolute bottom-2.5 right-2.5 pointer-events-none">
                          <span className="bg-emerald-500/90 backdrop-blur-sm text-white text-[9px] font-black px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                            <Truck className="w-2.5 h-2.5" /> Kargo Dahil
                          </span>
                        </div>
                      </div>

                      {/* ── DETAY ALANI ── */}
                      <div className="p-4 flex flex-col flex-1 gap-2.5">

                        {/* Yayıncı Logoları */}
                        {packPublishers.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1">
                            {packPublishers.slice(0, 4).map(pub => (
                              <div key={pub.id} className="bg-white border border-border/50 rounded p-0.5 shadow-sm" title={pub.name}>
                                {pub.logo_url
                                  ? <img src={pub.logo_url} className="h-3 w-auto object-contain" alt={pub.name} />
                                  : <span className="text-[8px] font-bold px-1">{pub.name.substring(0, 6)}</span>
                                }
                              </div>
                            ))}
                            {packPublishers.length > 4 && (
                              <span className="text-[9px] font-bold text-muted-foreground">+{packPublishers.length - 4}</span>
                            )}
                          </div>
                        )}

                        {/* Başlık */}
                        <h2 className="text-sm font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                          {pkg.title}
                        </h2>

                        {/* Fiyat */}
                        <div className="mt-auto pt-2 flex items-end gap-2">
                          {oldPrice > price && (
                            <span className="text-xs font-medium text-muted-foreground line-through decoration-destructive/50">
                              ₺{oldPrice.toLocaleString('tr-TR')}
                            </span>
                          )}
                          <span className="text-lg font-black text-primary leading-none">
                            ₺{price.toLocaleString('tr-TR')}
                          </span>
                        </div>

                        {/* CTA Butonları */}
                        <div className="flex gap-1.5 mt-1">
                          <button className="flex-1 bg-primary text-primary-foreground text-[10px] md:text-xs font-bold h-8 md:h-9 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-1 shadow-sm">
                            Hemen Al <ArrowRight className="w-3 h-3" />
                          </button>
                          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = `/odeme?paket=${encodeURIComponent(pkg.title)}&tutar=${price}&paket_id=${pkg.id}` }} className="h-8 md:h-9 px-2 border border-border rounded-lg text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors flex items-center justify-center" title="Sepete Ekle">
                            <ShoppingCart className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
