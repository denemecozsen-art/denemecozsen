Amaç

Bu API’nin amacı kullanıcının kredi kartını PayTR sistemine kaydetmek.
Böylece kullanıcı bir sonraki ödemelerde kart bilgilerini tekrar girmek zorunda kalmaz. Kart bilgileri senin sisteminde değil, PayTR tarafında saklanır.

Sistem Nasıl Çalışır (Basit Akış)
Kullanıcı ödeme sayfasına gelir.
Kart bilgilerini girer.
"Kartımı kaydet" gibi bir checkbox olur.
Kullanıcı bunu seçerse ödeme isteğiyle birlikte PayTR’a kart kaydetme bilgisi gönderilir.
PayTR kartı kaydeder ve kullanıcı için bir utoken oluşturur.

Bu utoken, kullanıcının PayTR’daki kimliği gibidir.

utoken Nedir?

utoken = kullanıcı kartlarının bağlı olduğu kimlik.

Mantık şöyle:

Kullanıcı ilk kez kart ekliyorsa → store_card gönderilir
Kullanıcının zaten kartı varsa → utoken + store_card gönderilir

Eğer mevcut kullanıcı için utoken göndermezsen, PayTR yeni bir kullanıcı gibi davranır ve yeni utoken oluşturur. Bu durumda kartlar aynı kullanıcı altında toplanmaz.

API’ye Gönderilen Temel Bilgiler

Ödeme + kart kaydetme için POST isteğinde şu tip bilgiler gönderilir:

İşlem bilgileri
merchant_id → mağaza ID
paytr_token → güvenlik doğrulama hash
merchant_oid → sipariş ID
payment_amount → ödeme tutarı
payment_type → card
Kart bilgileri
cc_owner → kart sahibi
card_number → kart numarası
expiry_month
expiry_year
cvv
Kullanıcı bilgileri
user_name
user_address
user_phone
email
user_ip
Sistem parametreleri
installment_count → taksit
currency
test_mode
non_3d
Kart saklama parametreleri
store_card
utoken

Bu bilgiler POST ile PayTR’a gönderilir.

Ödeme Sonrası Ne Olur

Ödeme tamamlandıktan sonra PayTR:

ödeme sonucunu
utoken bilgisini

senin callback / notification URL adresine gönderir.

Sen de bunu veritabanına kaydedersin.
Sonraki ödemelerde kullanıcıya ait kartları bu token üzerinden yönetebilirsin.

Tek Cümleyle Özet

Bu API:

Ödeme sırasında kullanıcının kartını PayTR sistemine kaydedip, kartları utoken ile kullanıcıya bağlamanı sağlar.

cloude : 

PayTR – Kayıtlı Karttan Ödeme Nedir?

Bu servis, kullanıcının daha önce PayTR’de kaydettiği bir kartla tekrar kart bilgisi girmeden ödeme yapmasını sağlar. Yani kullanıcı her seferinde kart numarası yazmaz, sistemde kayıtlı kartı seçer ve ödeme yapılır.

Ödeme Akışı (Basit Mantık)

Sistem şu şekilde çalışır:

Önce kullanıcının kayıtlı kartları alınır.
Bu kartlar kullanıcıya listelenir.
Kullanıcı ödeme yapacağı kartı seçer.
Seçilen kartın bazı token bilgileri ödeme isteğinde gönderilir.

Ödeme sırasında kullanılan temel bilgiler:

utoken → Kullanıcıya ait token
ctoken → Seçilen karta ait token
require_cvv → Kart için CVV gerekip gerekmediği

Eğer require_cvv = 1 ise kullanıcıdan CVV girmesi istenir.

Ödeme İsteğinde Gönderilen Temel Parametreler

Ödeme yaparken PayTR’ye bazı bilgiler gönderilir. En önemlileri:

merchant_id → PayTR mağaza numaran
user_ip → Kullanıcının IP adresi
merchant_oid → Senin oluşturduğun sipariş numarası
email → Kullanıcının e-postası
payment_amount → Ödeme tutarı
payment_type → "card"
installment_count → Taksit sayısı
currency → Para birimi
non_3d → 3D olmadan ödeme yapılacak mı

Ayrıca güvenlik için:

merchant_key
merchant_salt

ile token (hash) üretilir ve PayTR’ye gönderilir.

Kritik Nokta

Ödeme isteğinde mutlaka şu üç bilgi gönderilir:

utoken → kullanıcıyı temsil eder
ctoken → kartı temsil eder
require_cvv → gerekiyorsa CVV alınır

Bu sayede PayTR hangi kullanıcı ve hangi kartla ödeme yapılacağını anlar.

Kısaca Özet

Bu API’nin yaptığı şey:

Kullanıcının kayıtlı kartlarını getir.
Kullanıcı kart seçsin.
Kartın token bilgilerini al.
Gerekirse CVV iste.
PayTR’ye ödeme isteği gönder.

Yani basitçe:
“Kart bilgisi tekrar girmeden ödeme alma sistemi.”