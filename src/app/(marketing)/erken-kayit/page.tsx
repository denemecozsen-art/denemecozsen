"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Star, ArrowRight, GraduationCap, Package, Loader2 } from "lucide-react"
import Link from "next/link"

interface Level {
  id: string
  name: string
  sort_order: number
}

interface EarlyPackage {
  id: string
  title: string
  description: string
  price: number
  original_price: number
  features: string[]
  cover_image: string | null
  is_featured: boolean
  is_active: boolean
}

export default function EarlyRegistrationPage() {
  const [levels, setLevels] = useState<Level[]>([])
  const [packages, setPackages] = useState<EarlyPackage[]>([])
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchLevels()
  }, [])

  useEffect(() => {
    if (selectedLevel) {
      fetchPackages(selectedLevel)
    }
  }, [selectedLevel])

  async function fetchLevels() {
    try {
      const { data, error } = await supabase
        .from('levels')
        .select('*')
        .order('sort_order', { ascending: true })
      
      if (error) throw error
      setLevels(data || [])
    } catch (err) {
      setError('Sınıf bilgileri yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  async function fetchPackages(levelId: string) {
    setLoading(true)
    try {
      // Erken kayıt paketlerini çek (2026-2027 sezonu)
      const { data, error } = await supabase
        .from('early_registration_packages')
        .select('*')
        .eq('level_id', levelId)
        .eq('season', '2026-2027')
        .eq('is_active', true)
        .order('price', { ascending: true })
      
      if (error) throw error
      setPackages(data || [])
    } catch (err) {
      setError('Paketler yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  if (loading && levels.length === 0) {
    return (
      <div className="bg-muted min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Yükleniyor...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-muted min-h-screen">
      {/* HERO */}
      <section className="container mx-auto px-4 lg:max-w-7xl pt-16 pb-12">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <span className="bg-accent/10 text-accent text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest inline-flex items-center gap-2">
            <Star className="w-4 h-4" />
            2026-2027 SEZONU ERKEN KAYIT
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary leading-tight">
            Sınıfını Seç, Paketini Belirle
          </h1>
          <p className="text-lg text-muted-foreground">
            Gelecek sezon için şimdi kaydol, %30'a varan indirimlerden yararlan. 
            Her sınıfa özel hazırlanmış paketler seni bekliyor.
          </p>
        </div>
      </section>

      {/* SINIF SEÇİMİ */}
      {!selectedLevel && (
        <section className="container mx-auto px-4 lg:max-w-7xl pb-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Hangi Sınıftasın?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {levels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setSelectedLevel(level.id)}
                  className="bg-card hover:bg-primary hover:text-primary-foreground p-6 rounded-2xl border-2 border-border hover:border-primary transition-all group text-center"
                >
                  <GraduationCap className="w-10 h-10 mx-auto mb-3 text-primary group-hover:text-primary-foreground" />
                  <span className="font-bold text-lg">{level.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PAKET SEÇİMİ */}
      {selectedLevel && (
        <section className="container mx-auto px-4 lg:max-w-7xl pb-24">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">
                  {levels.find(l => l.id === selectedLevel)?.name} Paketleri
                </h2>
                <p className="text-muted-foreground mt-1">Sana en uygun paketi seç ve erken kayıt fırsatını yakala</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => {setSelectedLevel(null); setPackages([])}}
              >
                ← Başka Sınıf Seç
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : packages.length === 0 ? (
              <Card className="p-12 text-center">
                <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-bold mb-2">Henüz Paket Tanımlanmamış</h3>
                <p className="text-muted-foreground">
                  Bu sınıf için henüz erken kayıt paketi tanımlanmamış. 
                  Lütfen daha sonra tekrar kontrol edin.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                  <Card 
                    key={pkg.id} 
                    className={`relative overflow-hidden ${pkg.is_featured ? 'border-2 border-primary ring-4 ring-primary/10' : ''}`}
                  >
                    {pkg.is_featured && (
                      <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-bl-xl z-10">
                        ⭐ EN POPÜLER
                      </div>
                    )}
                    {pkg.cover_image && (
                      <div className="w-full h-40 overflow-hidden">
                        <img 
                          src={pkg.cover_image} 
                          alt={pkg.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className={`${pkg.cover_image ? 'pt-4' : 'p-6'}`}>
                      <h3 className="text-xl font-bold mb-2">{pkg.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 min-h-[40px]">
                        {pkg.description}
                      </p>
                      
                      <div className="mb-6">
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-black text-primary">
                            ₺{pkg.price.toLocaleString('tr-TR')}
                          </span>
                          {pkg.original_price > pkg.price && (
                            <span className="text-lg text-muted-foreground line-through">
                              ₺{pkg.original_price.toLocaleString('tr-TR')}
                            </span>
                          )}
                        </div>
                        {pkg.original_price > pkg.price && (
                          <span className="text-sm font-bold text-accent">
                            %{Math.round((1 - pkg.price/pkg.original_price) * 100)} indirim
                          </span>
                        )}
                      </div>

                      <ul className="space-y-2 mb-6">
                        {pkg.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Link href={`/odeme?paket=${pkg.id}&tip=erken-kayit`} className="block">
                        <Button className="w-full font-bold" size="lg">
                          Hemen Kaydol
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ADVANTAGES */}
      <section className="bg-background py-24">
         <div className="container mx-auto px-4 lg:max-w-7xl">
            <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
               <h2 className="text-3xl md:text-4xl font-extrabold text-primary">Erken Kaydın Avantajları</h2>
               <p className="text-muted-foreground">Neden şimdi kayıt olmalısın? İşte 2026-2027 sezonunda seni bekleyen ayrıcalıklar.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                  { icon: "💰", title: "En Uygun Fiyat", desc: "Yeni sezon fiyat artışlarından etkilenmeden, geçen yılın baz fiyatları üzerinden en düşük maliyetle kaydol.", color: "bg-accent/10 text-accent" },
                  { icon: "🛡️", title: "Kontenjan Garantisi", desc: "Sınırlı kontenjanlar hızla doluyor. Erken kayıtla yerini şimdiden ayırt, son dakika stresinden kurtul.", color: "bg-primary/10 text-primary" },
                  { icon: "🚚", title: "Öncelikli Gönderim", desc: "Yeni sezon materyalleri basıldığı anda sıra beklemeden, ücretsiz ve öncelikli kargo avantajıyla kapında.", color: "bg-success/10 text-success" },
               ].map((item, i) => (
                  <div key={i} className="bg-card border border-border p-8 rounded-3xl shadow-sm">
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 ${item.color}`}>
                        {item.icon}
                     </div>
                     <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                     <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* TRUST BANNER */}
      <section className="py-24 bg-muted relative overflow-hidden">
         <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
               <span className="text-primary text-2xl">🛡️</span>
            </div>
            <h2 className="text-3xl font-extrabold text-primary mb-6">Güvenilir Kayıt Sistemi</h2>
            <p className="text-lg md:text-xl text-muted-foreground italic leading-relaxed">
               &quot;Çözsen Deneme Kulübü olarak, 10 yılı aşkın tecrübemizle binlerce öğrencinin hayallerine dokunduk. 
               Erken kayıt avantajlarıyla yeni sezona hazır ol, sınav maratonuna bir adım önde başla.&quot;
            </p>
         </div>
      </section>
    </div>
  )
}
