PayTR Direkt API – 1. Adım dokümanı, ödeme sürecinin ilk kısmını anlatır. Kısaca amaç: müşteriden ödeme bilgilerini alıp PayTR sistemine güvenli şekilde göndermektir.

Basit ve anlaşılır şekilde özetlersek:

🔹 1. Adımın Mantığı

Bu adımda, ödeme işlemi şu şekilde ilerler:

Müşteri sitende bir sipariş başlatır.
Ödeme sayfasına gelir ve kart bilgilerini girer.
Senin sistemin bu bilgileri alır ve PayTR’a gönderir.
🔹 En önemli kısım: Token üretimi
PayTR’a veri göndermeden önce güvenlik için bir “token” (imza) oluşturman gerekir.
Bu token, gönderdiğin bilgilerin doğruluğunu garanti eder.
Token oluştururken belirli veriler (sipariş bilgisi, tutar, müşteri bilgisi vb.) kullanılır.
🔹 Bu adımda ne yapılmış olur?
Ödeme formu hazırlanır
Kullanıcıdan bilgiler alınır
Bu bilgiler güvenli hale getirilir (token)
PayTR sistemine gönderilmeye hazır hale gelir
🔹 Özet (çok kısa)

1. Adım = Ödeme formundan bilgileri al → güvenli token oluştur → PayTR’a gönder