"use client"

import { BookOpen, Lock, Sparkles, Layers, Brain, BarChart3, Search } from "lucide-react"

export default function SoruBankasiPage() {
  const features = [
    { icon: Layers, title: "Konu Bazlı Sınıflandırma", desc: "Sorular MEB kazanımlarına göre otomatik sınıflandırılır. İstediğiniz kazanımdan anında soru havuzu oluşturun." },
    { icon: Brain, title: "Akıllı Soru Editörü", desc: "Görselli, formüllü ve çoklu dil destekli soru oluşturma arayüzü. LaTeX ve görsel ekleme desteği." },
    { icon: Search, title: "Gelişmiş Arama & Filtreleme", desc: "Zorluk, konu, kazanım, sınıf ve soru tipine göre anlık filtreleme. Binlerce sorudan saniyeler içinde erişim." },
    { icon: BarChart3, title: "İstatistik & Analiz", desc: "Her sorunun doğru/yanlış oranları, ortalama çözüm süresi ve zorluk indeksi otomatik hesaplanır." },
  ]

  return (
    <div className="space-y-8 pb-16">

      {/* Header */}
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-black flex items-center gap-3 text-foreground">
          <BookOpen className="w-8 h-8 text-primary" /> Soru Bankası Modülü
        </h1>
        <p className="text-muted-foreground text-sm font-medium mt-2">
          Akıllı soru havuzu yönetimi — konu bazlı, kazanım odaklı, istatistik destekli.
        </p>
      </div>

      {/* Coming Soon Hero */}
      <div className="relative bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 rounded-[2.5rem] p-10 md:p-16 text-white overflow-hidden">
        {/* Dekoratif */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <Sparkles className="absolute right-10 top-10 w-20 h-20 text-white/10" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
            <Lock className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest">Geliştirme Aşamasında</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black leading-tight mb-4">
            Soru Bankası<br />
            <span className="text-white/70">Yakında Geliyor</span>
          </h2>

          <p className="text-white/80 text-lg font-medium leading-relaxed mb-8">
            Binlerce soruyu kazanım bazlı yönetin. Otomatik deneme oluşturucu, zorluk analizi ve
            öğrenci performans takibi ile tamamen entegre çalışan akıllı soru bankası modülü
            üzerinde çalışıyoruz.
          </p>

          <div className="flex items-center gap-4">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-3 text-center">
              <span className="text-3xl font-black">Q3</span>
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/70 mt-0.5">2026</p>
            </div>
            <div>
              <p className="font-bold text-sm">Tahmini Yayın Tarihi</p>
              <p className="text-white/60 text-xs font-medium">Beta erişim için admin panelinden bildirim alacaksınız</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div>
        <h3 className="text-xl font-black text-foreground mb-6">Gelecek Özellikler</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((f, i) => (
            <div key={i} className="bg-card border-2 border-border rounded-2xl p-6 flex gap-4 items-start hover:border-primary/30 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <f.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-sm text-foreground">{f.title}</h4>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-card border-2 border-border rounded-3xl p-8">
        <h3 className="text-lg font-black text-foreground mb-6">Geliştirme Yol Haritası</h3>
        <div className="space-y-4">
          {[
            { phase: "Faz 1", title: "Soru Ekleme & Editör", status: "Tasarım", color: "bg-amber-500" },
            { phase: "Faz 2", title: "Konu & Kazanım Eşleme", status: "Planlama", color: "bg-blue-500" },
            { phase: "Faz 3", title: "Otomatik Deneme Oluşturucu", status: "Planlama", color: "bg-blue-500" },
            { phase: "Faz 4", title: "İstatistik & Raporlama", status: "Gelecek", color: "bg-muted-foreground/30" },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${step.color} shrink-0`} />
              <div className="flex-1 flex items-center justify-between bg-muted/30 rounded-xl px-5 py-3 border border-border/50">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest w-12">{step.phase}</span>
                  <span className="text-sm font-bold text-foreground">{step.title}</span>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                  step.status === 'Tasarım' ? 'bg-amber-500/10 text-amber-600' :
                  step.status === 'Planlama' ? 'bg-blue-500/10 text-blue-600' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {step.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
