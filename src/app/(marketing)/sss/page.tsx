import { MessageCircleQuestion, ChevronDown } from "lucide-react"

export const metadata = {
  title: "Sıkça Sorulan Sorular | Çözsen Deneme Kulübü",
  description: "Çözsen Deneme Kulübü hakkında merak ettiğiniz tüm soruların cevapları burada.",
}

const faqs = [
  { q: "Denemeler nasıl gönderiliyor?", a: "Türkiye geneli denemeler, adrese teslim paketler şeklinde kargo ile düzenli olarak evlerinize gönderilir. Her ay belirlenen takvime uygun şekilde yeni deneme kitapçıkları kargoya verilir." },
  { q: "Portal destekli paket ile portalsız paket arasındaki fark nedir?", a: "Portal destekli paketlerde Türkiye geneli sıralamanızı, detaylı sonuç analizlerinizi ve eksik konu kazanım karnenizi görebildiğiniz özel bir öğrenci paneli erişimi bulunmaktadır. Portalsız paketlerde sadece basılı denemeler gönderilir." },
  { q: "Cevap anahtarlarına nasıl ulaşılır?", a: "Öğrenci paneli üzerinden veya sitemizdeki cevap anahtarları sayfasından ilgili sınavın PDF çözüm anahtarına kolayca erişebilirsiniz." },
  { q: "Sonuçlar ne zaman açıklanır?", a: "Optiğinizi sisteme girdikten kısa bir süre sonra Türkiye geneli sonuçlarınız anlık olarak panelinize yansımaktadır." },
  { q: "Hangi sınıflar için paketler mevcut?", a: "5, 6, 7. sınıflar, LGS hazırlık (8. sınıf) ile YKS ve TYT hazırlık grupları için güncel deneme paketlerimiz bulunmaktadır." },
  { q: "Erken kayıt fırsatı nedir?", a: "Yeni eğitim yılı için kontenjanlar dolmadan avantajlı fiyatlar ile katılabildiğiniz özel ve öncelikli bir kayıt sistemidir." },
  { q: "Kargo ücreti var mı?", a: "Belirli sayıda ve üzeri yayın seçimlerinde kargo tamamen ücretsizdir. Minimum eşiğin altında kalan seçimlerde küçük bir kargo bedeli uygulanmaktadır." },
  { q: "İade ve iptal koşulları nelerdir?", a: "Henüz kargoya verilmemiş paketler için tam iade yapılabilir. Detaylı bilgi için iletişim sayfamızdan bize ulaşabilirsiniz." },
  { q: "Ödeme güvenli mi?", a: "Tüm ödemeler PayTR altyapısı üzerinden 256-bit SSL şifreleme ve 3D Secure koruması ile gerçekleştirilir. Kart bilgileriniz hiçbir zaman sistemimizde saklanmaz." },
  { q: "Veli olarak çocuğumun sonuçlarını görebilir miyim?", a: "Evet! Veli hesabı ile giriş yaparak öğrencinizin tüm sınav sonuçlarını, analizlerini ve gelişim grafiklerini detaylı şekilde takip edebilirsiniz." },
]

export default function SSSPage() {
  return (
    <div className="min-h-screen bg-background pt-28 pb-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
            <MessageCircleQuestion className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">Sıkça Sorulan Sorular</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">Merak ettiğiniz her şeyin cevabını burada bulabilirsiniz. Bulamazsanız bize ulaşın!</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <summary className="flex items-center justify-between cursor-pointer p-5 md:p-6 font-bold text-foreground hover:bg-muted/30 transition-colors list-none">
                <span className="pr-4">{faq.q}</span>
                <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-5 md:px-6 pb-5 md:pb-6 text-muted-foreground leading-relaxed border-t border-border pt-4">
                {faq.a}
              </div>
            </details>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">Sorunuz hâlâ cevaplanmadı mı?</p>
          <a href="/iletisim" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
            Bize Ulaşın
          </a>
        </div>
      </div>
    </div>
  )
}
