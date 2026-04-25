import { GlobalBackButton } from "@/components/ui/back-button"
import { CheckCircle2, CalendarDays, Truck, PackageCheck, AlertCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { AddToCartWidget } from "@/components/marketing/add-to-cart-widget"
import { PackageDetailTabs } from "@/components/marketing/package-detail-tabs"

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const supabase = await createClient()
    
    const { data: pkg } = await supabase.from('packages').select('title,seo_title,seo_description,cover_image').eq('slug', slug).single()
    if (!pkg) return { title: 'Paket Bulunamadı' }

    return {
        title: pkg.seo_title || `${pkg.title} | E-Ticaret`,
        description: pkg.seo_description || `${pkg.title} özelliklerini detaylı inceleyin ve satın alın.`,
        openGraph: {
            images: [pkg.cover_image || ""],
        }
    }
}

export default async function PackageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  // 1. Ana Paketi Getir
  let { data: pkg } = await supabase.from('packages').select('*, levels(*)').eq('slug', slug).eq('is_active', true).single()
  
  if (!pkg) {
      const { data: byId } = await supabase.from('packages').select('*, levels(*)').eq('id', slug).eq('is_active', true).single()
      pkg = byId
  }

  if (!pkg) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-background">
           <div className="w-20 h-20 rounded-3xl bg-destructive/10 flex items-center justify-center mb-6">
              <AlertCircle className="w-10 h-10 text-destructive/60" />
           </div>
           <h1 className="text-2xl font-black text-foreground mb-3">Ürün Bulunamadı</h1>
           <p className="text-muted-foreground text-center max-w-sm mb-8 text-sm font-medium">
              Aradığınız paket sistemde kayıtlı değil veya satıştan kaldırılmış olabilir.
           </p>
           <Link href="/paketler">
              <Button variant="outline" className="font-bold border-2 border-border h-11 px-6 rounded-xl gap-2">
                 <ArrowLeft className="w-4 h-4" /> Kataloğa Dön
              </Button>
           </Link>
        </div>
      )
  }

  // 2. Yayıncı İlişkilerini Getir
  const { data: pubData } = await supabase.from('package_publishers').select('id, media_url, series_name, publishers(name)').eq('package_id', pkg.id)
  const publishers = pubData || []

  // 3. Teslimat Takvimini Getir
  const { data: delData } = await supabase.from('package_deliveries').select('*').eq('package_id', pkg.id).order('sort_order', { ascending: true })
  const deliveries = delData || []

  // Fiyat Hesaplama
  const activePrice = pkg.price_monthly || pkg.price || 0;
  const activeOldPrice = pkg.price_monthly_old || pkg.price_old || 0;
  let discountPercent = 0;
  if (activeOldPrice > activePrice && activeOldPrice > 0) {
      discountPercent = Math.round(((activeOldPrice - activePrice) / activeOldPrice) * 100);
  }

  const levelName = pkg.levels ? pkg.levels.name : "Genel";

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col pt-[5rem]">
      
      {/* HEADER BAR */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4">
         <GlobalBackButton />
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-16">
        
        {/* ═══════════════════════════════════════════
            ÜST BÖLGE: HERO — FOTOĞRAF & SATIN ALMA
           ═══════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ── SOL: FOTOĞRAF GALERİSİ (7 KOLON = BÜYÜK) ── */}
          <div className="lg:col-span-7 flex flex-col gap-4 sticky top-24">
            
            {/* Ana Fotoğraf — TEMİZ, BADGE YOK */}
            <div className="product-image-wrapper rounded-3xl border border-border/60 overflow-hidden relative group">
                <div className="aspect-[5/6] sm:aspect-[4/5] bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-6 sm:p-10">
                    {pkg.cover_image ? (
                        <img
                            src={pkg.cover_image}
                            alt={pkg.title}
                            className="w-full h-full object-contain drop-shadow-2xl product-image-zoom transition-transform duration-700 ease-out"
                        />
                    ) : (
                        <div className="text-9xl opacity-15 drop-shadow-sm select-none">{pkg.icon || "📦"}</div>
                    )}
                </div>
            </div>

            {/* Küçük Thumbnail'ler */}
            {pkg.images && Array.isArray(pkg.images) && pkg.images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-2 custom-scrollbar">
                {pkg.images.map((img: any, i: number) => (
                    <div key={i} className="flex-shrink-0 w-[72px] h-[72px] rounded-xl border-2 border-border/50 bg-gradient-to-br from-slate-50 to-white p-1.5 hover:border-primary/50 hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden">
                       <img src={img.url || img} className="w-full h-full object-cover rounded-lg" alt={`${pkg.title} - ${i+1}`} />
                    </div>
                ))}
            </div>
            )}

            {/* Güvenlik Bandı — Fotoğraf Altında */}
            <div className="grid grid-cols-3 gap-3 mt-2">
               <div className="flex flex-col items-center gap-2 text-center bg-card/80 backdrop-blur-sm rounded-2xl border border-border/40 p-4 hover:border-emerald-200 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10 transition-all duration-300 group/trust">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover/trust:scale-110 transition-transform">
                     <PackageCheck className="w-5 h-5 text-emerald-500" />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-tight">Eksiksiz<br/>Hasarsız Kargo</span>
               </div>
               <div className="flex flex-col items-center gap-2 text-center bg-card/80 backdrop-blur-sm rounded-2xl border border-border/40 p-4 hover:border-blue-200 hover:bg-blue-50/30 dark:hover:bg-blue-950/10 transition-all duration-300 group/trust">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover/trust:scale-110 transition-transform">
                     <CalendarDays className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-tight">Düzenli<br/>Takvim</span>
               </div>
               <div className="flex flex-col items-center gap-2 text-center bg-card/80 backdrop-blur-sm rounded-2xl border border-border/40 p-4 hover:border-purple-200 hover:bg-purple-50/30 dark:hover:bg-purple-950/10 transition-all duration-300 group/trust">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover/trust:scale-110 transition-transform">
                     <CheckCircle2 className="w-5 h-5 text-purple-500" />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-tight">Anında<br/>Erişim</span>
               </div>
            </div>
          </div>

          {/* ── SAĞ: ÜRÜN BİLGİSİ & SATIN ALMA (5 KOLON) ── */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Seviye Etiketi */}
            <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 bg-primary/8 text-primary text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-primary/10">
                    {levelName}
                </span>
                {pkg.badge && (
                    <span className="inline-flex items-center bg-accent/10 text-accent text-[11px] font-black uppercase px-3 py-1.5 rounded-lg border border-accent/15">
                        {pkg.badge}
                    </span>
                )}
            </div>

            {/* Başlık */}
            <h1 className="text-2xl sm:text-3xl lg:text-[2rem] font-black text-foreground leading-tight tracking-tight">
                {pkg.title}
            </h1>

            {/* Ücretsiz Teslimat Badge */}
            <div className="flex items-center gap-2 text-sm">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-lg border border-emerald-200/50 dark:border-emerald-800/30">
                    <Truck className="w-4 h-4" /> Ücretsiz Teslimat
                </span>
            </div>

            {/* Kısa Açıklama */}
            {pkg.short_desc && (
            <div className="prose prose-sm text-muted-foreground font-medium leading-relaxed max-w-none border-l-2 border-primary/15 pl-4">
                <div dangerouslySetInnerHTML={{ __html: pkg.short_desc }} />
            </div>
            )}

            {/* Yayınevi Logoları */}
            {publishers.length > 0 && (
            <div className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border/40 p-4">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 mb-3">Dahil Olan Yayınlar</h3>
               <div className="flex flex-wrap gap-2">
                  {publishers.map((pub: any, i: number) => (
                      <div key={i} className="flex items-center gap-2 bg-background/80 border border-border/50 rounded-lg px-2.5 py-1.5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200">
                         {pub.media_url && <img src={pub.media_url} className="h-4 w-auto object-contain" alt="Yayın" />}
                         <span className="text-xs font-bold text-foreground">{pub.series_name || pub.publishers?.name || "Bilinmiyor"}</span>
                      </div>
                  ))}
               </div>
            </div>
            )}

            {/* ── FİYAT & SEPETE EKLE KUTUSU ── */}
            <div className="bg-gradient-to-br from-primary/[0.04] to-accent/[0.04] p-6 rounded-2xl border border-primary/15 shadow-sm">
                
                {/* Fiyat */}
                <div className="flex items-end gap-3 mb-1">
                    <h2 className="text-4xl font-black text-foreground tracking-tight">
                        ₺{activePrice.toLocaleString('tr-TR')}
                    </h2>
                    {activeOldPrice > activePrice && activeOldPrice > 0 && (
                        <span className="text-lg font-bold text-muted-foreground/60 line-through decoration-destructive/40 mb-1">
                            ₺{activeOldPrice.toLocaleString('tr-TR')}
                        </span>
                    )}
                </div>

                {/* İndirim Etiketi — Fiyatın ALTINDA */}
                {discountPercent > 0 && (
                    <div className="mb-4">
                        <span className="inline-flex items-center bg-destructive/10 text-destructive text-xs font-black px-3 py-1 rounded-lg border border-destructive/15">
                            %{discountPercent} İndirim
                        </span>
                    </div>
                )}

                <div className="w-full">
                   <AddToCartWidget slugOrId={pkg.slug || pkg.id} price={activePrice} title={pkg.title} />
                </div>
            </div>

          </div>
        </div>

        {/* ═══════════════════════════════════════════
            ALT BÖLGE: DETAY & TESLİMAT — KOMPAKT TABS
           ═══════════════════════════════════════════ */}
        <div className="mt-16 max-w-4xl mx-auto">
            <PackageDetailTabs
                contentHtml={pkg.content_html || ''}
                deliveries={deliveries}
            />
        </div>

      </main>
    </div>
  )
}
