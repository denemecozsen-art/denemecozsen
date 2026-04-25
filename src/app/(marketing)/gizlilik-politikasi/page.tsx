import { Shield } from "lucide-react"

export const metadata = {
  title: "Gizlilik Politikası | Çözsen Deneme Kulübü",
  description: "Çözsen Deneme Kulübü gizlilik politikası ve kişisel verilerin korunması hakkında bilgi.",
}

export default function GizlilikPolitikasiPage() {
  return (
    <div className="min-h-screen bg-background pt-28 pb-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">Gizlilik Politikası</h1>
          <p className="text-muted-foreground text-sm">Son güncelleme: Nisan 2026</p>
        </div>

        <div className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-sm space-y-8">
          {[
            { title: "1. Genel Bilgi", content: "Çözsen Deneme Kulübü ('Şirket'), kullanıcılarının kişisel verilerinin korunmasına büyük önem vermektedir. Bu gizlilik politikası, web sitemizi ve hizmetlerimizi kullandığınızda toplanan, kullanılan ve korunan kişisel bilgileriniz hakkında sizi bilgilendirmek amacıyla hazırlanmıştır." },
            { title: "2. Toplanan Veriler", content: "Hizmetlerimizi kullanırken ad, soyad, e-posta adresi, telefon numarası, adres bilgileri, öğrenci bilgileri (ad, sınıf düzeyi) ve ödeme bilgileri gibi kişisel veriler toplanabilmektedir. Ayrıca çerezler ve analitik araçlar aracılığıyla tarayıcı bilgileri, IP adresi ve kullanım istatistikleri gibi teknik veriler de otomatik olarak toplanabilir." },
            { title: "3. Verilerin Kullanım Amacı", content: "Toplanan kişisel veriler; sipariş işleme ve teslimat, müşteri hizmetleri desteği, eğitim analitiği ve performans raporlama, yasal yükümlülüklerin yerine getirilmesi ve hizmet kalitesinin artırılması amacıyla kullanılmaktadır." },
            { title: "4. Verilerin Paylaşımı", content: "Kişisel verileriniz, yasal zorunluluklar haricinde üçüncü taraflarla paylaşılmaz. Ödeme işlemleri PayTR güvenli ödeme altyapısı üzerinden gerçekleştirilir ve kart bilgileriniz hiçbir şekilde sunucularımızda saklanmaz." },
            { title: "5. Veri Güvenliği", content: "Tüm veri aktarımları 256-bit SSL şifreleme ile korunmaktadır. Veritabanlarımız endüstri standardı güvenlik protokolleri ile korunmakta ve düzenli olarak güvenlik denetimleri yapılmaktadır." },
            { title: "6. Çerezler (Cookies)", content: "Web sitemiz, kullanıcı deneyimini iyileştirmek ve site trafiğini analiz etmek amacıyla çerezler kullanmaktadır. Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz, ancak bu durumda bazı site özellikleri düzgün çalışmayabilir." },
            { title: "7. Haklarınız", content: "6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında; kişisel verilerinizin işlenip işlenmediğini öğrenme, verilerinizin düzeltilmesini veya silinmesini talep etme, verilerinizin aktarıldığı üçüncü kişileri bilme ve verilerinizin kanuna aykırı olarak işlenmesi halinde zararın giderilmesini talep etme hakkına sahipsiniz." },
            { title: "8. İletişim", content: "Gizlilik politikamız ile ilgili sorularınız için info@cozsendeneme.com adresinden bizimle iletişime geçebilirsiniz." },
          ].map((section, i) => (
            <div key={i} className="space-y-3">
              <h2 className="text-lg font-extrabold text-foreground">{section.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
