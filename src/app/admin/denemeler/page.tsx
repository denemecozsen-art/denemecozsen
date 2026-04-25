"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Upload, BookOpen, CalendarRange, Calendar, Pencil, Trash2 } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────
type PaketTipi = "tekli" | "aylik" | "donemlik"

// ─── Mock Data ───────────────────────────────────────────────────────────────
const mockDenemeler = [
  { id: 1, tip: "tekli", sinif: "8. Sınıf", name: "Limit LGS Deneme #12", price: 45, publisher: "Limit Yayınları" },
  { id: 2, tip: "aylik", sinif: "TYT", name: "Ekim Ayı TYT Paketi", trialCount: "4 Deneme", price: 220, publisher: "Çeşitli" },
  { id: 3, tip: "donemlik", sinif: "8. Sınıf", name: "1. Dönem LGS Seti", trialCount: "12 Deneme", price: 480, publisher: "Çoklu Yayın" },
]

const siniflar = ["5. Sınıf", "6. Sınıf", "7. Sınıf", "8. Sınıf", "TYT", "YKS", "Mezun"]
const yayinevleri = ["Limit Yayınları", "Bilgi Sarmal", "Hız Yayınları", "Nartest", "Açı Yayınları", "Paraf Yayınları", "Apotemi"]

// ─── Form Components ──────────────────────────────────────────────────────────
function TekliForm() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Sınıf / Seviye *</label>
          <Select>
            <SelectTrigger><SelectValue placeholder="Sınıf Seç" /></SelectTrigger>
            <SelectContent>
              {siniflar.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Yayınevi *</label>
          <Select>
            <SelectTrigger><SelectValue placeholder="Yayınevi Seç" /></SelectTrigger>
            <SelectContent>
              {yayinevleri.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Kapak Görseli / Logo</label>
        <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center gap-3 text-muted-foreground bg-muted/30 cursor-pointer hover:bg-muted/60 transition">
          <Upload className="w-8 h-8 opacity-40" />
          <p className="text-sm font-medium">Sürükle & Bırak veya Tıkla</p>
          <p className="text-xs">PNG, JPG, WEBP – Maks 2MB</p>
          <Input type="file" className="hidden" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Deneme Adı *</label>
        <Input placeholder="Örn: Limit LGS Deneme – Aralık #15" />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Kısa Açıklama</label>
        <Textarea placeholder="Ürün listesinde görünen kısa tanım…" rows={2} />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Detaylı İçerik Açıklaması</label>
        <Textarea placeholder="Soru sayısı, konu dağılımı, çözüm anahtarı bilgisi vb…" rows={4} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Fiyat (₺) *</label>
          <Input type="number" placeholder="45" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Eski Fiyat (₺)</label>
          <Input type="number" placeholder="60" />
        </div>
      </div>
    </div>
  )
}

function AylikForm() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Sınıf / Seviye *</label>
          <Select>
            <SelectTrigger><SelectValue placeholder="Sınıf Seç" /></SelectTrigger>
            <SelectContent>
              {siniflar.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Ay *</label>
          <Select>
            <SelectTrigger><SelectValue placeholder="Ay Seç" /></SelectTrigger>
            <SelectContent>
              {["Ekim", "Kasım", "Aralık", "Ocak", "Şubat", "Mart", "Nisan", "Mayıs"].map(m => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Paket Adı *</label>
        <Input placeholder="Örn: Ekim Ayı LGS Deneme Paketi" />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">İçerik Açıklaması (Deneme Sayısı, Yayınlar)</label>
        <Textarea placeholder="4 deneme – Limit, Bilgi Sarmal, Nartest, Hız Yayınları" rows={3} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Deneme Sayısı *</label>
          <Input type="number" placeholder="4" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Fiyat (₺) *</label>
          <Input type="number" placeholder="220" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">İndirim Etiketi</label>
        <Input placeholder="Örn: %15 İndirim" />
      </div>
    </div>
  )
}

function DonemlikForm() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Sınıf / Seviye *</label>
          <Select>
            <SelectTrigger><SelectValue placeholder="Sınıf Seç" /></SelectTrigger>
            <SelectContent>
              {siniflar.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Dönem *</label>
          <Select>
            <SelectTrigger><SelectValue placeholder="Dönem Seç" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1. Dönem (Ekim–Ocak)</SelectItem>
              <SelectItem value="2">2. Dönem (Şubat–Mayıs)</SelectItem>
              <SelectItem value="tam">Tam Yıl</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Paket Adı *</label>
        <Input placeholder="Örn: 1. Dönem LGS Tam Seti" />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">İçerik Detayı</label>
        <Textarea placeholder="Toplam kaç deneme, hangi yayınevleri, kapsanan konular vb…" rows={4} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Deneme Sayısı</label>
          <Input type="number" placeholder="12" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Fiyat (₺) *</label>
          <Input type="number" placeholder="480" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Eski Fiyat (₺)</label>
          <Input type="number" placeholder="600" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Öne Çıkan Yayınevleri</label>
        <Input placeholder="Limit, Bilgi Sarmal, Hız Yayınları…" />
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DenemellerAdminPage() {
  const [tip, setTip] = useState<PaketTipi>("tekli")

  const tipConfig: Record<PaketTipi, { label: string; icon: React.ElementType; color: string; description: string }> = {
    tekli: { label: "Tekli Deneme", icon: BookOpen, color: "bg-blue-500/10 text-blue-600 border-blue-200", description: "Sınıf bazlı, görsel yüklenebilir bireysel deneme ekle." },
    aylik: { label: "Aylık Paket", icon: Calendar, color: "bg-accent/10 text-accent border-accent/20", description: "Her ay için çoklu yayınevi içeren aylık paket oluştur." },
    donemlik: { label: "Dönemlik Set", icon: CalendarRange, color: "bg-primary/10 text-primary border-primary/20", description: "1. Dönem, 2. Dönem veya Tam Yıl dönemlik seti tanımla." },
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Deneme Yönetimi</h2>
          <p className="text-muted-foreground">Tekli, aylık ve dönemlik deneme/paket ürünlerini yönetin.</p>
        </div>
      </div>

      {/* TYPE SELECTOR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {(Object.entries(tipConfig) as [PaketTipi, typeof tipConfig[PaketTipi]][]).map(([key, cfg]) => {
          const Icon = cfg.icon
          return (
            <button
              key={key}
              onClick={() => setTip(key)}
              className={`p-5 rounded-2xl border-2 text-left transition-all flex gap-4 items-start ${
                tip === key ? `${cfg.color} border-current shadow-sm scale-[1.02]` : "border-border bg-card hover:border-primary/30"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tip === key ? cfg.color : "bg-muted"}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm">{cfg.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{cfg.description}</p>
              </div>
            </button>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* FORM */}
        <Card className="lg:col-span-2 border-border shadow-sm h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Yeni {tipConfig[tip].label} Ekle
            </CardTitle>
            <CardDescription>Formu doldurun ve kaydedin.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tip === "tekli" && <TekliForm />}
            {tip === "aylik" && <AylikForm />}
            {tip === "donemlik" && <DonemlikForm />}
            <Button className="w-full mt-2">
              <Plus className="w-4 h-4 mr-2" /> Kaydet
            </Button>
          </CardContent>
        </Card>

        {/* LIST */}
        <Card className="lg:col-span-3 border-border shadow-sm">
          <CardHeader>
            <CardTitle>Mevcut Ürünler</CardTitle>
            <CardDescription>
              Sisteme kayıtlı{" "}
              <Badge variant="secondary">{tipConfig[tip].label}</Badge> ürünleri aşağıda listelenmektedir.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockDenemeler.filter(d => d.tip === tip).length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-border rounded-xl text-muted-foreground">
                  <p className="font-semibold">Henüz kayıt yok.</p>
                  <p className="text-sm mt-1">Formu kullanarak ilk ürününüzü ekleyin.</p>
                </div>
              ) : (
                mockDenemeler
                  .filter(d => d.tip === tip)
                  .map((d) => (
                    <div key={d.id} className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center shrink-0 text-lg">
                          {tip === "tekli" ? "📄" : tip === "aylik" ? "📅" : "📦"}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{d.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="outline" className="text-[10px] py-0">{d.sinif}</Badge>
                            {"trialCount" in d && (
                              <span className="text-xs text-muted-foreground">{d.trialCount}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 ml-2">
                        <span className="font-bold text-primary text-sm">₺{d.price}</span>
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-primary/70 hover:text-primary">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive/70 hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
