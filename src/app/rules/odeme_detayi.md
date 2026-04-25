Kısaca söyleyeyim. Bu servis, PayTR’de belirli bir günde yapılan satışların transfer detaylarını çekmek için kullanılır. Yani “o gün hangi ödeme yapılmış, hangi siparişten gelmiş, hangi IBAN’a aktarılmış” gibi bilgileri API üzerinden alırsın.

1. Servisin amacı

Ödeme Detay Servisi, gönderdiğin tarih için yapılan satış işlemlerinin transfer dökümünü getirir.
Başka bir deyişle: günlük ödeme hareketlerini API üzerinden çekmeni sağlar.

Servis iki şekilde kullanılabilir:

Mağaza ödeme detay
Pazaryeri ödeme detay
2. API’ye gönderilen bilgiler

Servisi kullanmak için PayTR’ye POST isteği gönderirsin.

Gönderilen temel parametreler:

merchant_id → mağaza numarası
date → ödeme detayını istediğin tarih (YYYY-MM-DD)
paytr_token → güvenlik için oluşturulan hash token

İstek şu endpoint’e gönderilir:

https://www.paytr.com/rapor/odeme-detayi
3. API’nin döndürdüğü cevap

Servis sana JSON formatında cevap verir.

Duruma göre üç farklı sonuç gelir:

success → o tarihte işlem var, detaylar döner
failed → o tarihte işlem yok
error → istekte hata var (err_msg ile hata mesajı gelir)
4. Success durumunda dönen bilgiler

Eğer işlem varsa şu bilgiler gelir:

merchant_oid → sipariş numarası
merchant_iban → mağaza IBAN
merchant_name → mağaza adı
payment → işlem tutarı
currency → para birimi (TL vb.)

Pazaryeri kullanımında ayrıca:

amount → alt satıcıya aktarılan tutar
transfer → alt satıcının transfer bilgileri
5. Basit mantık

Bu API’nin yaptığı şey şu:

Bir tarih gönderiyorsun
PayTR o gün yapılan satışları kontrol ediyor
Varsa ödeme transfer detaylarını JSON olarak döndürüyor

Kısacası:
Ödeme Özeti = toplam rakamlar
Ödeme Detayı = tek tek işlem dökümü

Yani rapor çekmek veya muhasebe sistemine veri aktarmak için kullanılıyor.