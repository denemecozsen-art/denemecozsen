'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { GlobalBackButton } from '@/components/ui/back-button'
import {
  Lock, CreditCard, User, Phone, MapPin, GraduationCap,
  ChevronRight, Loader2, CheckCircle2, AlertCircle, Package,
  Shield, BadgeCheck, Zap
} from 'lucide-react'
import { CITY_NAMES, TURKEY_CITIES } from '@/lib/turkey-locations'

interface FormData {
  // Kişisel Bilgiler
  buyerFirstName: string
  buyerLastName: string
  buyerEmail: string
  buyerPhone: string
  buyerAddress: string
  buyerCity: string
  buyerDistrict: string
  // Öğrenci Bilgileri
  studentName: string
  studentClass: string
  // Ödeme
  installment: string
}

const CLASSES = [
  '5. Sınıf', '6. Sınıf', '7. Sınıf', '8. Sınıf (LGS)', '9. Sınıf', '10. Sınıf', '11. Sınıf', '12. Sınıf (YKS)', 'Mezun'
]

function CheckoutInner() {
  const searchParams = useSearchParams()
  const packageName = searchParams.get('paket') || 'Seçilen Paket'
  const packageAmount = parseFloat(searchParams.get('tutar') || '0')
  const packageId = searchParams.get('id') || ''
  const packageType = searchParams.get('tip') || 'Aylık'

  const iframeRef = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState<1 | 2>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paytrToken, setPaytrToken] = useState<string | null>(null)
  const [iframeLoading, setIframeLoading] = useState(false)
  const [iframeError, setIframeError] = useState(false)

  const [form, setForm] = useState<FormData>({
    buyerFirstName: '',
    buyerLastName: '',
    buyerEmail: '',
    buyerPhone: '',
    buyerAddress: '',
    buyerCity: '',
    buyerDistrict: '',
    studentName: '',
    studentClass: '12. Sınıf (YKS)',
    installment: '1',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === 'buyerCity') {
      setForm(prev => ({ ...prev, buyerCity: value, buyerDistrict: '' }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  const districts = form.buyerCity ? (TURKEY_CITIES[form.buyerCity] || []) : []

  // PayTR iFrame loading
  useEffect(() => {
    if (!paytrToken || !iframeRef.current) return

    // Önceki içeriği temizle
    iframeRef.current.innerHTML = ''

    // Script zaten yüklü mü kontrol et
    const scriptId = 'paytr-iframe-resizer-script'
    const existingScript = document.getElementById(scriptId)

    const loadIframe = () => {
      const iframe = document.createElement('iframe')
      iframe.src = `https://www.paytr.com/odeme/guvenli/${paytrToken}`
      iframe.id = 'paytriframe'
      iframe.frameBorder = '0'
      iframe.scrolling = 'no'
      iframe.style.width = '100%'
      iframe.style.minHeight = '600px'
      iframe.style.border = 'none'
      iframe.style.borderRadius = '1.5rem'
      iframe.onload = () => {
        setIframeLoading(false)
      }
      iframe.onerror = () => {
        setIframeLoading(false)
        setIframeError(true)
      }
      iframeRef.current!.appendChild(iframe)

      // @ts-ignore
      if (window.iFrameResize) {
        // @ts-ignore
        window.iFrameResize({}, '#paytriframe')
      }
    }

    if (existingScript) {
      // Script zaten yüklü, direkt iframe yükle
      loadIframe()
    } else {
      // Script yükle
      const script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://www.paytr.com/js/iframeResizer.min.js'
      script.onload = () => {
        loadIframe()
      }
      script.onerror = () => {
        setIframeLoading(false)
        setIframeError(true)
      }
      document.head.appendChild(script)
    }

    return () => {
      // İframe'i temizle
      if (iframeRef.current) {
        iframeRef.current.innerHTML = ''
      }
    }
  }, [paytrToken])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/paytr/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId,
          packageName,
          amount: packageAmount || 1490,
          installment: parseInt(form.installment),
          buyerEmail: form.buyerEmail,
          buyerName: `${form.buyerFirstName} ${form.buyerLastName}`,
          buyerPhone: form.buyerPhone,
          buyerAddress: `${form.buyerAddress}, ${form.buyerDistrict}, ${form.buyerCity}`,
          buyerCity: form.buyerCity,
          studentName: form.studentName,
          studentClass: form.studentClass,
        }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        setError(data.error || 'Ödeme başlatılamadı. Lütfen tekrar deneyin.')
        return
      }

      if (data.token) {
        setPaytrToken(data.token)
        setIframeLoading(true)
        setIframeError(false)
        setStep(2)
      } else {
        setError(data.error || 'Ödeme tokenı alınamadı')
      }

      // Scroll to iframe
      setTimeout(() => {
        iframeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 200)
    } catch (err) {
      setError('Bir hata oluştu. Lütfen internet bağlantınızı kontrol edin.')
    } finally {
      setIsLoading(false)
    }
  }

  const displayAmount = packageAmount || 1490

  return (
    <div className="min-h-screen bg-[#F4F6FB] py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <GlobalBackButton className="mb-6 -ml-2" />

        {/* Başlık */}
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">Güvenli Ödeme</h1>
          <p className="text-slate-500 text-sm font-medium">Paketinizi onaylayın ve kaydınızı tamamlayın.</p>
        </div>

        {/* Progress Adımları */}
        <div className="flex items-center justify-center gap-0 mb-10">
          <div className={`flex items-center gap-2 px-5 py-2.5 rounded-l-full font-bold text-sm transition-all ${step === 1 ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25' : 'bg-white text-slate-400 border border-slate-200'}`}>
            <User className="w-4 h-4" />
            <span>1. Bilgileriniz</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 mx-0.5" />
          <div className={`flex items-center gap-2 px-5 py-2.5 rounded-r-full font-bold text-sm transition-all ${step === 2 ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25' : 'bg-white text-slate-400 border border-slate-200'}`}>
            <CreditCard className="w-4 h-4" />
            <span>2. Ödeme</span>
          </div>
        </div>

        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">

              {/* Veli Kişisel Bilgileri */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 space-y-5">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <h2 className="font-black text-slate-800">Veli Bilgileri</h2>
                    <p className="text-xs text-slate-400 font-medium">Sipariş ve fatura bilgileri için gereklidir</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ad *</label>
                    <input
                      name="buyerFirstName"
                      value={form.buyerFirstName}
                      onChange={handleChange}
                      required
                      placeholder="Örn: Ayşe"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 font-medium text-slate-700 transition-all placeholder:text-slate-300"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Soyad *</label>
                    <input
                      name="buyerLastName"
                      value={form.buyerLastName}
                      onChange={handleChange}
                      required
                      placeholder="Örn: Yılmaz"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 font-medium text-slate-700 transition-all placeholder:text-slate-300"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">E-Posta *</label>
                  <input
                    name="buyerEmail"
                    value={form.buyerEmail}
                    onChange={handleChange}
                    required
                    type="email"
                    placeholder="ornek@gmail.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 font-medium text-slate-700 transition-all placeholder:text-slate-300"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Phone className="w-3 h-3" /> Telefon *
                  </label>
                  <input
                    name="buyerPhone"
                    value={form.buyerPhone}
                    onChange={handleChange}
                    required
                    type="tel"
                    placeholder="05xx xxx xx xx"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 font-medium text-slate-700 transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>

              {/* Kargo / Adres Bilgileri */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 space-y-5">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <h2 className="font-black text-slate-800">Kargo Adresi</h2>
                    <p className="text-xs text-slate-400 font-medium">Paket bu adrese gönderilecektir</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Şehir *</label>
                    <select
                      name="buyerCity"
                      value={form.buyerCity}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 font-medium text-slate-700 transition-all"
                    >
                      <option value="">Şehir seçin...</option>
                      {CITY_NAMES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">İlçe *</label>
                    <select
                      name="buyerDistrict"
                      value={form.buyerDistrict}
                      onChange={handleChange}
                      required
                      disabled={!form.buyerCity}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 font-medium text-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">{form.buyerCity ? 'İlçe seçin...' : 'Önce il seçin'}</option>
                      {districts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Açık Adres *</label>
                  <textarea
                    name="buyerAddress"
                    value={form.buyerAddress}
                    onChange={handleChange as any}
                    required
                    rows={3}
                    placeholder="Mahalle, cadde, sokak, bina no, daire no..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 font-medium text-slate-700 transition-all placeholder:text-slate-300 resize-none"
                  />
                </div>
              </div>

              {/* Öğrenci Bilgileri */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 space-y-5">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="font-black text-slate-800">Öğrenci Bilgileri</h2>
                    <p className="text-xs text-slate-400 font-medium">Paket hangi öğrenci için alınıyor?</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Öğrenci Adı Soyadı *</label>
                    <input
                      name="studentName"
                      value={form.studentName}
                      onChange={handleChange}
                      required
                      placeholder="Öğrencinin tam adı"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 font-medium text-slate-700 transition-all placeholder:text-slate-300"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sınıf *</label>
                    <select
                      name="studentClass"
                      value={form.studentClass}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 font-medium text-slate-700 transition-all"
                    >
                      {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                  <p className="font-medium text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-black text-lg rounded-2xl shadow-lg shadow-violet-500/25 flex items-center justify-center gap-3 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Ödeme Hazırlanıyor...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Güvenli Ödemeye Geç
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Sipariş Özeti */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white rounded-3xl p-6 shadow-xl shadow-violet-500/20 space-y-5">
                <div className="flex items-center gap-3 border-b border-white/20 pb-4">
                  <Package className="w-5 h-5 text-violet-200" />
                  <h2 className="font-black">Sipariş Özeti</h2>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-start">
                    <span className="text-violet-200 font-medium">Paket</span>
                    <span className="font-black text-right max-w-[160px]">{packageName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-violet-200 font-medium">Tür</span>
                    <span className="font-bold">{packageType}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-violet-200 font-medium">Kargo</span>
                    <span className="font-bold text-emerald-300">Ücretsiz</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-violet-200 font-medium">Portal Erişimi</span>
                    <span className="font-bold text-emerald-300">Dahil</span>
                  </div>
                </div>

                <div className="border-t border-white/20 pt-4">
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-violet-200">Toplam</span>
                    <span className="text-3xl font-black">
                      ₺{displayAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Güvenlik Rozetleri */}
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3">
                <h3 className="font-black text-slate-700 text-sm">Güvende Alışveriş</h3>
                <div className="space-y-2.5">
                  {[
                    { icon: Shield, text: '256-bit SSL şifreleme', color: 'text-emerald-600 bg-emerald-50' },
                    { icon: BadgeCheck, text: 'PayTR güvencesiyle', color: 'text-blue-600 bg-blue-50' },
                    { icon: Zap, text: '3D Secure koruması', color: 'text-violet-600 bg-violet-50' },
                    { icon: CheckCircle2, text: 'Kart bilgisi saklanmaz', color: 'text-amber-600 bg-amber-50' },
                  ].map(({ icon: Icon, text, color }) => (
                    <div key={text} className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-slate-600">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ADIM 2: PayTR iFrame */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold text-emerald-800 text-sm">Bilgileriniz kaydedildi!</p>
                <p className="text-emerald-600 text-xs font-medium mt-0.5">
                  Güvenli ödeme ekranı yükleniyor. Kart bilgilerinizi PayTR güvencesiyle girin.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
              <div ref={iframeRef} className="w-full">
                {!paytrToken ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="text-center space-y-3">
                      <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                      <p className="text-slate-700 font-bold text-sm">PayTR bağlantısı kurulamadı</p>
                      <p className="text-slate-400 text-xs max-w-sm">Merchant bilgileri henüz yapılandırılmamış olabilir. Lütfen .env dosyasındaki PAYTR_MERCHANT_ID, PAYTR_MERCHANT_KEY ve PAYTR_MERCHANT_SALT değerlerini kontrol edin.</p>
                    </div>
                  </div>
                ) : iframeLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="text-center space-y-3">
                      <Loader2 className="w-8 h-8 animate-spin text-violet-500 mx-auto" />
                      <p className="text-slate-500 font-medium text-sm">PayTR ödeme formu yükleniyor...</p>
                    </div>
                  </div>
                ) : iframeError ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="text-center space-y-3">
                      <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
                      <p className="text-slate-700 font-bold text-sm">Ödeme formu yüklenemedi</p>
                      <p className="text-slate-400 text-xs max-w-sm">Bir bağlantı hatası oluştu. Lütfen sayfayı yenileyip tekrar deneyin.</p>
                      <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors"
                      >
                        Sayfayı Yenile
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <button
              onClick={() => setStep(1)}
              className="text-sm text-slate-400 hover:text-slate-600 font-medium transition-colors flex items-center gap-1"
            >
              ← Bilgilere Geri Dön
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-violet-500" /></div>}>
      <CheckoutInner />
    </Suspense>
  )
}
