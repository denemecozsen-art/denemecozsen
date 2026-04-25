PayTR Ödeme Özeti Servisi Nedir?

Bu servis, belirlediğin tarih aralığında PayTR üzerinden mağaza hesabına aktarılan veya aktarılacak ödemelerin özetini almak için kullanılır. Yani satışların toplamını, iadeleri ve net kazancı tek bir rapor halinde çekebilirsin.

Servis iki şekilde kullanılabilir:

Mağaza Ödeme Özeti
Pazaryeri Ödeme Özeti

Mantık ikisinde de aynı, sadece kullanım senaryosu farklıdır.

API Nasıl Çalışır?

API’ye POST isteği gönderilir.

Gönderilen temel parametreler:

merchant_id → Mağaza numarası
start_date → Başlangıç tarihi (YYYY-MM-DD)
end_date → Bitiş tarihi
paytr_token → Güvenlik için oluşturulan hash token

Bu bilgiler gönderildiğinde PayTR, belirtilen tarih aralığına göre ödeme özetini döndürür.

API’den Dönen Sonuç

Sonuç JSON formatında gelir.

status alanı işlemin sonucunu gösterir:

success → Veri bulundu
failed → O tarihler arasında işlem yok
error → İstek hatalı (hata mesajı err_msg içinde)
Success Durumunda Dönen Temel Bilgiler

API başarılı olursa şu bilgiler gelir:

date_paid → Ödeme tarihi
currency → Para birimi
sales → Toplam satış tutarı
return → Toplam iade tutarı
net → Hesaba geçen net tutar
merchant_iban → Ödemenin gönderildiği IBAN
Gelecek Ödemeler

API ayrıca future_payments adlı bir bölüm de döndürebilir.

Burada henüz hesabına geçmemiş ama gelecekte aktarılacak ödemelerin özet bilgileri bulunur.

Örneğin:

net_amounts → net tutar
sale_amounts → satış tutarı
return_amounts → iade tutarı
Özet (Gerçekten Özet)

Bu API’nin yaptığı şey şu:

Tarih aralığı gönderirsin
PayTR sana o tarihler için
toplam satış
toplam iade
net kazanç
ödeme tarihi
IBAN bilgisi
gibi verileri JSON olarak döndürür.

Yani kısaca: PayTR’den ödeme raporunun kısa özetini almak için kullanılan servis.