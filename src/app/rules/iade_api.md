PayTR İade API dokümanı, sitenizde yapılan bir ödemenin geri ödenmesini (refund) programatik olarak başlatmanızı sağlar. Yani admin paneline girmeden, kod üzerinden iade işlemi yapabilirsiniz.

Bunu basitçe şöyle düşünebilirsin:

👉 Müşteri ödeme yaptı → sen API çağrısı yaparak o ödemeyi geri gönderiyorsun.

🔹 Temel Mantık

İade API’nin amacı:

Daha önce alınmış bir ödemenin tamamını veya bir kısmını iade etmek
Bu işlemi otomatik ve güvenli şekilde yapmak
E-ticaret sistemi ile PayTR arasında doğrudan bağlantı kurmak
🔹 Nasıl Çalışır?
Sen kendi sunucundan PayTR’ın iade endpoint’ine POST isteği gönderirsin
Bu istekte bazı bilgiler bulunur:
Mağaza bilgileri (merchant_id vb.)
İade yapılacak sipariş numarası
İade tutarı
PayTR bu isteği kontrol eder
Sonucu sana JSON formatında döner (başarılı / hata)
🔹 Önemli Noktalar
İade işlemi ödeme yapılmış bir sipariş için yapılabilir
İstersen:
Tam iade (tüm tutar)
Kısmi iade (belirli tutar) yapabilirsin
Güvenlik için API çağrısında token (hash) oluşturman gerekir
İşlem sonucu:
success → iade başarılı
error/failed → hata oluştu
🔹 Ne İşe Yarar?
Panelden manuel işlem yapmaya gerek kalmaz
İade sürecini otomatikleştirirsin (örneğin: sipariş iptal edildiğinde otomatik iade)
Muhasebe ve operasyon süreçleri hızlanır
🔹 Kısaca Özet

PayTR İade API:

➡️ Kod üzerinden ödeme iadesi yapmanı sağlar
➡️ Güvenli bir şekilde PayTR’a istek gönderirsin
➡️ Sonucu anında alırsın
➡️ Tam veya kısmi iade destekler