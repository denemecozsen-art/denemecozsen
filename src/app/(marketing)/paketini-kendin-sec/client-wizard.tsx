'use client'

import { useState, useRef } from "react"
import { Check, ShoppingCart, Info, X, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { GlobalBackButton } from "../../../components/ui/back-button"
import { Button } from "../../../components/ui/button"

// Hardcoded classes removed

function PublisherLogo({ name }: { name: string }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
  return (
    <div className="w-full h-full flex-shrink-0 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 flex items-center justify-center font-black text-primary text-sm shadow-sm">
      {initials}
    </div>
  )
}

export function ClientWizard({ 
  settings, 
  options,
  classes 
}: { 
  settings: any, 
  options: any[],
  classes: { id: string, label: string, sub: string }[]
}) {
  const router = useRouter()
  const [step, setStep] = useState(0) // 0=Sınıf, 1=Yayın, 2=Portal
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [selectedPubs, setSelectedPubs] = useState<string[]>([])
  const [selectedPortal, setSelectedPortal] = useState<"portal" | "portalsiz">("portal")
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  // Sınıfa göre filtrele ve aylara göre grupla
  // YKS ve Mezun aynı yayınları gösterir (YKS level_name)
  const filterLevel = (selectedClass === 'YKS' || selectedClass === 'Mezun') ? 'YKS' : selectedClass
  const filteredOptions = filterLevel ? options.filter(o => o.level_name === filterLevel) : options
  const publishersByMonth = filteredOptions.reduce((acc: any, curr: any) => {
    if (!acc[curr.month_name]) acc[curr.month_name] = []
    acc[curr.month_name].push(curr)
    return acc
  }, {})
  
  const months = Object.keys(publishersByMonth)
  const maxStep = settings.portal_rule_enabled ? 2 : 1

  const togglePub = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setSelectedPubs(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])
  }

  const selectedPubDetails = selectedPubs
    .map(id => options.find((p: any) => p.id === id))
    .filter(Boolean)

  const pubsTotal = selectedPubDetails.reduce((acc, p) => acc + parseFloat(p.price || '0'), 0)
  
  // Shipping Rule dynamically from settings
  let shippingFee = 0
  if (settings.shipping_rule_enabled) {
    if (selectedPubs.length > 0 && selectedPubs.length < settings.shipping_free_threshold) {
      shippingFee = settings.shipping_penalty_fee
    }
  }
  
  const portalPrice = selectedPortal === "portal" ? settings.portal_price : 0
  const finalPrice = pubsTotal + shippingFee + (step === 2 ? portalPrice : 0)

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current
    const threshold = 60
    if (diff > threshold && step < maxStep) {
      // Sola kaydır → ileri
      if (step === 0 && selectedClass) setStep(1)
      else if (step === 1 && settings.portal_rule_enabled) setStep(2)
    } else if (diff < -threshold && step > 0) {
      // Sağa kaydır → geri
      setStep(step - 1)
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-28 md:py-16 pt-8">
      <div className="mx-auto max-w-6xl transition-all duration-500">
        
        <div className="md:bg-background md:shadow-xl md:rounded-[2.5rem] md:border md:border-border overflow-hidden md:min-h-[750px] flex flex-col relative">
          <div className="bg-background px-4 md:px-8 py-4 md:py-6 border-b border-border z-30 shrink-0">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <GlobalBackButton />
              <h1 className="text-lg md:text-3xl font-extrabold text-foreground leading-tight">{settings.hero_title}</h1>
            </div>
            <div className="flex gap-2">
              {["Sınıf", "Yayınlar", ...(settings.portal_rule_enabled ? ["Ekstra Seçim"] : [])].map((label, i) => (
                <button
                  key={i}
                  onClick={() => { if (i <= step) setStep(i) }}
                  className={`flex-1 py-2 md:py-3 md:rounded-full rounded-xl text-xs md:text-sm font-bold transition-all ${
                    step === i
                      ? "bg-primary text-primary-foreground shadow-md"
                      : step > i
                      ? "bg-primary/20 text-primary hover:bg-primary/30"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i < step ? "✓ " : `${i + 1}. `}{label}
                </button>
              ))}
            </div>
          </div>

          <div
            className={`p-3 md:p-8 flex-1 flex ${step === 1 ? 'flex-col md:flex-row gap-4 md:gap-8' : 'flex-col bg-muted/10'}`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >

            {/* ── STEP 0: SINIF ─────────────────────────────────────────────── */}
            {step === 0 && (
              <div className="space-y-6 md:space-y-8 animate-in slide-in-from-right-4 duration-300 w-full mb-auto mt-4">
                <div>
                  <h2 className="text-lg md:text-3xl font-extrabold text-foreground tracking-tight">Eğitim Kademeni Seç</h2>
                  <p className="text-xs md:text-base text-muted-foreground mt-1 md:mt-2">{settings.step1_desc}</p>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-3 gap-1.5 md:gap-4">
                  {classes.map((cls) => (
                    <button
                      key={cls.id}
                      onClick={() => { setSelectedClass(cls.id); setTimeout(() => setStep(1), 200) }}
                      className={`flex flex-col items-center justify-center rounded-xl md:rounded-3xl border-2 p-2 md:p-6 transition-all hover:-translate-y-1 ${
                        selectedClass === cls.id
                          ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                          : "border-border bg-background hover:border-primary/40 hover:shadow-md"
                      }`}
                    >
                      <span className={`text-xs md:text-3xl font-black ${selectedClass === cls.id ? "text-primary" : "text-foreground"}`}>
                        {cls.label}
                      </span>
                      <span className="text-[8px] md:text-xs font-bold text-muted-foreground mt-0.5 md:mt-3 uppercase tracking-widest leading-none">{cls.sub}</span>
                    </button>
                  ))}
                </div>
                {/* Swipe hint for mobile */}
                <p className="text-center text-[10px] text-muted-foreground md:hidden animate-pulse">← Sınıf seçtikten sonra yana kaydırarak ilerleyebilirsiniz →</p>
              </div>
            )}

            {/* ── STEP 1: YAYINLAR ──────────────────────────────────────────── */}
            {step === 1 && (
              <>
                <div className="flex-1 flex flex-col animate-in slide-in-from-right-4 duration-300">
                  <div className="mb-3 md:mb-4">
                    <h2 className="text-base md:text-2xl font-extrabold text-foreground mb-1 md:mb-2 flex items-center justify-between">
                       <span>{settings.step2_desc}</span>
                    </h2>
                    
                    {settings.shipping_rule_enabled && (
                      <div className="bg-accent/10 border border-accent/20 rounded-xl p-3 md:p-4 flex items-start gap-2 md:gap-3 mt-2 md:mt-4 animate-in fade-in">
                         <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-accent shrink-0 mt-0.5" />
                         <div className="text-xs md:text-sm">
                            <p className="font-bold text-accent">Önemli Kargo Kuralı</p>
                            <p className="text-accent/80 font-medium mt-0.5 md:mt-1">En az <strong className="font-extrabold">{settings.shipping_free_threshold} adet yayın</strong> seçin, kargo ücretsiz olsun. Aksi halde <strong className="font-extrabold">{settings.shipping_penalty_fee} ₺</strong> kargo ücreti eklenir.</p>
                         </div>
                      </div>
                    )}
                  </div>

                  {/* Tam Kontrollü Aylar */}
                  <div className="flex-1 overflow-y-auto pr-1 md:pr-2 custom-scrollbar space-y-3 md:space-y-4 pb-10 max-h-[500px]">
                     {months.map((month) => (
                       <div key={month} className="border border-border rounded-xl md:rounded-2xl bg-background overflow-hidden shadow-sm flex flex-col">
                         
                         <div className="bg-muted px-3 md:px-4 py-2 md:py-3 border-b border-border flex items-center justify-between sticky top-0 z-10 shadow-sm">
                           <span className="text-xs md:text-base font-extrabold text-foreground uppercase tracking-widest">{month} AYI KUTUSU</span>
                           <span className="text-[10px] md:text-xs font-bold text-muted-foreground bg-background px-2 py-0.5 md:py-1 rounded-md border border-border">{publishersByMonth[month].length} Yayın</span>
                         </div>
                         
                         <div className="p-1.5 md:p-4 grid grid-cols-3 gap-1 md:gap-3">
                           {publishersByMonth[month].map((pub: any) => {
                             const selected = selectedPubs.includes(pub.id)
                             return (
                               <button
                                 key={pub.id}
                                 onClick={() => togglePub(pub.id)}
                                 className={`relative flex flex-col items-center justify-center p-1.5 md:p-4 rounded-lg md:rounded-2xl border transition-all group ${
                                   selected ? "border-primary bg-primary/5 shadow-md shadow-primary/10" : "border-border/60 bg-background hover:border-primary/40 hover:bg-muted/20"
                                 }`}
                               >
                                 <div className={`absolute top-0.5 right-0.5 md:top-2 md:right-2 w-3.5 h-3.5 md:w-5 md:h-5 rounded border flex items-center justify-center transition-all ${
                                   selected ? "border-primary bg-primary" : "border-muted-foreground/30 bg-background group-hover:border-primary/50"
                                 }`}>
                                   {selected && <Check className="w-2 h-2 md:w-3.5 md:h-3.5 text-primary-foreground duration-200 animate-in zoom-in" />}
                                 </div>
                                 <div className="w-14 h-14 md:w-16 md:h-16 mb-1 md:mb-3 rounded-lg md:rounded-xl border border-border/30 bg-muted/10 flex items-center justify-center overflow-hidden shrink-0">
                                    {pub.logo_url ? (
                                      <img src={pub.logo_url} alt={pub.publisher_name} className="w-full h-full object-cover rounded-lg md:rounded-xl" />
                                    ) : (
                                      <PublisherLogo name={pub.publisher_name} />
                                    )}
                                 </div>
                                 <div className="text-center w-full min-w-0">
                                   <p className={`font-bold text-[9px] md:text-sm leading-tight truncate transition-colors ${selected ? 'text-primary' : 'text-foreground'}`}>{pub.publisher_name}</p>
                                   <p className="text-[7px] md:text-[10px] text-muted-foreground truncate uppercase mt-0.5 md:mt-1">{pub.series_name}</p>
                                 </div>
                                 <div className="mt-1 md:mt-3 w-full border-t border-border/40 pt-0.5 md:pt-2 text-center">
                                   <span className="font-extrabold text-[10px] md:text-base text-foreground">₺{pub.price}</span>
                                 </div>
                               </button>
                             )
                           })}
                         </div>
                       </div>
                     ))}
                  </div>
                </div>

                {/* Sticky Sidebar Cart for Desktop */}
                <div className="w-full md:w-[350px] shrink-0 flex flex-col animate-in slide-in-from-right-8 duration-500">
                   <div className="bg-card border-2 border-primary/20 rounded-3xl p-4 md:p-6 shadow-xl sticky top-0 flex flex-col h-full max-h-[600px]">
                      <h3 className="text-base md:text-lg font-extrabold border-b border-border pb-3 md:pb-4 mb-3 md:mb-4 flex items-center text-primary uppercase tracking-widest">
                         <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 mr-2" /> Sepetim
                      </h3>
                      
                      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 mb-3 md:mb-4 space-y-2 md:space-y-3">
                         {selectedPubDetails.length === 0 ? (
                           <div className="text-center text-muted-foreground py-8 md:py-12 flex flex-col items-center">
                              <Info className="w-8 h-8 md:w-10 md:h-10 mb-3 opacity-30" />
                              <p className="text-xs md:text-sm font-semibold">Sepetiniz Boş.</p>
                              <p className="text-[10px] md:text-xs mt-1 px-4">Yukarıdaki listeden yayınları ekleyebilirsiniz.</p>
                           </div>
                         ) : (
                           selectedPubDetails.map(pub => (
                              <div key={pub.id} className="flex justify-between items-center text-sm border border-border p-2 md:p-3 rounded-xl md:rounded-2xl bg-background shadow-sm animate-in slide-in-from-right-2 group">
                                 <div className="overflow-hidden flex-1 pr-2">
                                    <p className="font-bold truncate text-foreground text-xs md:text-sm">{pub.publisher_name}</p>
                                    <p className="text-[9px] md:text-[10px] uppercase font-bold text-muted-foreground mt-0.5 tracking-wider bg-muted w-fit px-2 rounded">{pub.month_name} AYI</p>
                                 </div>
                                 <div className="flex items-center gap-2 md:gap-3 shrink-0">
                                    <span className="font-black text-primary text-xs md:text-sm">₺{pub.price}</span>
                                    <button 
                                      onClick={(e) => togglePub(pub.id, e)}
                                      className="w-6 h-6 md:w-7 md:h-7 bg-muted/50 hover:bg-destructive hover:text-destructive-foreground text-muted-foreground rounded-full flex items-center justify-center transition-colors shadow-sm"
                                      title="Kaldır"
                                    >
                                       <X className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                    </button>
                                 </div>
                              </div>
                           ))
                         )}
                      </div>

                      <div className="pt-3 md:pt-4 border-t border-border mt-auto">
                         <div className="flex justify-between items-center mb-2 text-xs md:text-sm font-bold text-muted-foreground">
                            <span>Toplanan Yayınlar ({selectedPubs.length})</span>
                            <span className="text-foreground">₺{pubsTotal}</span>
                         </div>
                         
                         {settings.shipping_rule_enabled && selectedPubs.length > 0 && selectedPubs.length < settings.shipping_free_threshold && (
                            <div className="flex justify-between items-center mb-3 md:mb-4 text-xs md:text-sm font-bold text-accent animate-in fade-in">
                               <span>Hizmet & Kargo Payı</span>
                               <span>+₺{settings.shipping_penalty_fee}</span>
                            </div>
                         )}

                         <div className="flex justify-between items-end mb-4 md:mb-6 mt-3 md:mt-4">
                            <span className="text-sm md:text-lg font-extrabold uppercase tracking-widest text-muted-foreground">Ara Toplam</span>
                            <span className="text-3xl md:text-4xl font-black text-primary">₺{pubsTotal + shippingFee}</span>
                         </div>
                         
                         <Button
                            disabled={selectedPubs.length === 0}
                            onClick={() => {
                               if (settings.portal_rule_enabled) {
                                  setStep(2)
                               } else {
                                  router.push(`/odeme?paket=Özel Oluşturulmuş Paket&tip=Kendin Seç&tutar=${finalPrice}`)
                               }
                            }}
                            className="w-full h-12 md:h-16 text-base md:text-lg font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform rounded-xl md:rounded-2xl"
                         >
                            {settings.portal_rule_enabled ? "Portal Seçimine Geç" : "Ödemeye Geç"}
                         </Button>
                         
                         {settings.shipping_rule_enabled && selectedPubs.length > 0 && selectedPubs.length < settings.shipping_free_threshold && (
                            <p className="text-[10px] text-center text-accent font-bold mt-3 md:mt-4 px-2 uppercase tracking-wide">
                               {settings.shipping_free_threshold - selectedPubs.length} Yayın daha ekleyerek kargoyu sıfırlayabilirsiniz.
                            </p>
                         )}
                      </div>
                   </div>
                </div>
              </>
            )}

            {/* ── STEP 2: PORTAL SEÇİMİ ─────────────────────────────────────── */}
            {step === 2 && (
              <div className="space-y-6 md:space-y-8 animate-in slide-in-from-right-4 duration-300 flex-1 flex flex-col w-full max-w-4xl mx-auto mt-6">
                <div className="text-center">
                  <h2 className="text-2xl md:text-4xl font-extrabold text-foreground tracking-tight">Portal Desteği</h2>
                  <p className="text-sm md:text-base text-muted-foreground mt-2 max-w-lg mx-auto">{settings.step3_desc}</p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      id: "portal" as const,
                      title: "Tam Kapsamlı Dijital Portal İstiyorum",
                      desc: "Türkiye geneli anlık sıralama, konu/kazanım analizi ve hataya özel dijital optik okuyucu karne özelliği.",
                      extra: `+₺${settings.portal_price} Sabit Ücret`,
                      highlight: true,
                    },
                    {
                      id: "portalsiz" as const,
                      title: "İstemiyorum (Sadece Basılı Paket)",
                      desc: "Analiz paneline ve optik okumaya erişim olmadan, sadece basılı deneme paketleri eve teslim edilir.",
                      extra: "Ücretsiz",
                      highlight: false,
                    },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedPortal(opt.id)}
                      className={`w-full flex items-start gap-5 p-6 md:p-8 rounded-[2rem] border-2 text-left transition-all hover:-translate-y-1 hover:shadow-xl ${
                        selectedPortal === opt.id
                          ? opt.highlight ? "border-accent bg-accent/5 shadow-md shadow-accent/10" : "border-primary bg-primary/5 shadow-md"
                          : "border-border bg-background"
                      }`}
                    >
                      <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition-all ${
                        selectedPortal === opt.id
                          ? opt.highlight ? "border-accent bg-accent" : "border-primary bg-primary"
                          : "border-border"
                      }`}>
                        {selectedPortal === opt.id && <div className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-full bg-white animate-in zoom-in" />}
                      </div>
                      <div className="flex-1">
                        <p className={`font-extrabold text-lg md:text-xl tracking-tight mb-2 ${opt.highlight ? "text-accent" : "text-foreground"}`}>{opt.title}</p>
                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed md:pr-4 font-medium">{opt.desc}</p>
                        <p className={`font-black text-sm md:text-base mt-4 inline-flex px-4 py-1.5 rounded-lg items-center ${opt.highlight ? "text-accent bg-accent/10" : "text-primary bg-primary/10"}`}>{opt.extra}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Final Summary Card */}
                <div className="mt-8 pt-6">
                   <div className="bg-card rounded-[2rem] border-2 border-primary/20 p-6 md:p-8 space-y-4 relative overflow-hidden shadow-2xl">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                     
                     <div className="flex justify-between text-sm md:text-base items-center font-bold">
                       <span className="text-muted-foreground">Eğitim Seviyesi</span>
                       <span className="bg-muted text-foreground px-3 py-1 rounded-lg border border-border">{selectedClass}</span>
                     </div>
                     <div className="flex justify-between text-sm md:text-base items-center font-bold border-t border-border/50 pt-4">
                       <span className="text-muted-foreground">Yayın Tipi</span>
                       <span>Kendin Seç Modeli ({selectedPubs.length} Yayın)</span>
                     </div>
                     <div className="flex justify-between text-sm md:text-base items-center font-bold border-t border-border/50 pt-4">
                       <span className="text-muted-foreground">Kargo / Nakliye</span>
                       {shippingFee === 0 ? <span className="text-success bg-success/10 px-3 py-1 rounded-lg">Ücretsiz</span> : <span className="text-accent">+₺{shippingFee}</span>}
                     </div>
                     {settings.portal_rule_enabled && (
                       <div className="flex justify-between text-sm md:text-base items-center font-bold border-t border-border/50 pt-4 pb-2">
                         <span className="text-muted-foreground">Dijital Portal Desteği</span>
                         <span>{selectedPortal === "portal" ? `+₺${settings.portal_price}` : "İstenmiyor"}</span>
                       </div>
                     )}
                     
                     <div className="flex justify-between items-end font-extrabold text-foreground border-t-2 border-border pt-6 mt-4">
                       <div>
                         <span className="text-sm md:text-base font-bold text-muted-foreground uppercase tracking-widest block mb-2">Ödenecek Toplam Tutar</span>
                       </div>
                       <span className="text-4xl md:text-5xl font-black text-primary">₺{finalPrice}</span>
                     </div>
                   </div>

                   <div className="flex flex-col sm:flex-row gap-4 mt-8">
                     <Button
                        onClick={() => setStep(1)}
                        variant="outline"
                        className="w-full sm:w-1/3 h-16 text-lg font-bold rounded-2xl border-2"
                     >
                        ← Sepete Dön
                     </Button>
                     <Button
                       onClick={() => router.push(`/odeme?paket=Özel Oluşturulmuş Paket&tip=Kendin Seç&tutar=${finalPrice}`)}
                       className="w-full sm:w-2/3 h-16 text-lg font-bold bg-primary text-primary-foreground shadow-xl shadow-primary/20 transition hover:scale-[1.02] rounded-[2rem]"
                     >
                       Ödemeye Geç
                       <Check className="w-5 h-5 ml-2" />
                     </Button>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
