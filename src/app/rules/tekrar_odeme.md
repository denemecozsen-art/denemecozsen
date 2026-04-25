Kayıtlı Kart ile Tekrarlayan Ödeme (Recurring Payment) Nedir?

Bu servis sayesinde kullanıcının PayTR’de daha önce kaydedilmiş kartından, kullanıcı tekrar kart bilgisi girmeden istediğiniz zaman ödeme çekebilirsiniz.
Genelde şu işler için kullanılır:

abonelik sistemi
aylık ödeme
otomatik yenileme
düzenli üyelik ücretleri

Kart zaten PayTR tarafında kayıtlıdır. Siz sadece o karta ödeme isteği gönderirsiniz.

Sistem Nasıl Çalışır? (Basit Akış)
Kullanıcının PayTR’da kayıtlı kartı olması gerekir.
Kullanıcıya ait utoken alınır.
CAPI LIST servisi ile kullanıcının kartlarına ait ctoken bilgisi alınır.
Bu tokenlar ile PayTR’a POST isteği gönderilir.
PayTR o kayıtlı karttan ödeme çekmeye çalışır.

Özetle:

kullanıcı -> kayıtlı kart
kayıtlı kart -> ctoken
kullanıcı -> utoken
utoken + ctoken -> PayTR ödeme isteği
Önemli Özellikler
1. Kullanıcı işlem yapmaz

Bu ödeme Non-3D (Non Secure) yapılır.
Yani kullanıcıya:

SMS doğrulama
kart bilgisi girme
onay ekranı

gösterilmez. Sistem arka planda çalışır.

Ama bunun için PayTR hesabınızda Non3D yetkisi açık olmalıdır.

2. Form gerekmez

Normal ödeme gibi kullanıcıya ödeme formu göstermezsiniz.

Siz backend’den doğrudan PayTR’a istek gönderirsiniz.

3. PayTR’a gönderilen temel bilgiler

Ödeme isteğinde bazı alanlar zorunludur. Önemlileri:

merchant_id → PayTR mağaza numarası
paytr_token → güvenlik için oluşturulan hash
user_ip → kullanıcının IP adresi
merchant_oid → sipariş numarası
email → müşteri email
payment_amount → ödeme tutarı
installment_count → taksit sayısı
non_3d = 1 → tekrarlayan ödeme için zorunlu
merchant_ok_url → başarılı yönlendirme
merchant_fail_url → hata yönlendirme
user_name, user_address → müşteri bilgileri

Bu bilgilerle:

POST https://www.paytr.com/odeme

adresine istek atılır.

Tek Cümlede Özet

Bu servis, PayTR’da saklanan kullanıcı kartından otomatik ödeme çekmek için backend’den gönderilen bir ödeme isteğidir. Kullanıcı tekrar kart bilgisi girmez ve işlem Non-3D olarak gerçekleşir.