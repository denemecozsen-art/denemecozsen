ayTR Direkt API – 2. Adım (Özet)

Bu adımın amacı: ödemenin sonucunu PayTR’dan almak.
Yani müşteri ödeme yaptıktan sonra PayTR sana “ödeme başarılı mı değil mi” bilgisini gönderir.

1. Bildirim URL (Notification URL) oluşturursun

Sunucunda bir endpoint açarsın. Örneğin:

https://siteadi.com/paytr-bildirim

Bu adresi PayTR paneline girersin.
PayTR ödeme tamamlanınca arka planda bu adrese POST isteği atar.

Önemli nokta:
Bu sayfa kullanıcının gittiği bir sayfa değildir, tamamen server-to-server iletişimdir.

2. PayTR sana bazı veriler gönderir

POST ile gelen başlıca veriler:

merchant_oid → sipariş numaran
status → ödeme sonucu (success veya failed)
total_amount → ödenen tutar
payment_type → ödeme yöntemi (card / eft)
hash → güvenlik doğrulaması
failed_reason_code → başarısızsa hata kodu
failed_reason_msg → hata mesajı
installment_count → taksit sayısı

Bu verileri kullanarak siparişi onaylar veya iptal edersin.

3. Hash doğrulaması yapılır

PayTR’dan gelen isteğin gerçekten PayTR’dan geldiğini doğrulamak için:

kendi hash’ini hesaplıyorsun
PayTR’ın gönderdiği hash ile karşılaştırıyorsun

Eğer eşleşmezse isteği reddediyorsun.
Bu güvenlik için kritik.

4. Ödeme sonucuna göre işlem yaparsın
Eğer status = success
siparişi onayla
kullanıcıya ürün / hizmet ver
gerekirse mail veya SMS gönder
Eğer status = failed
siparişi iptal et
hata kodunu kaydet

Bu işlemler tamamen senin backend’inde yapılır.

5. PayTR’a “OK” cevabı dönmen gerekir

İşlemi yaptıktan sonra PayTR’a sadece şu cevabı gönderirsin:

OK

Başka hiçbir şey olmamalı.
HTML, JSON, boşluk bile eklememelisin.

Eğer PayTR bu cevabı alamazsa:

işlem tamamlanmış sayılmaz
panelde “Devam Ediyor” görünür.
6. Aynı bildirim birden fazla gelebilir

Ağ sorunları yüzünden PayTR aynı ödeme için birkaç kez bildirim gönderebilir.

Bu yüzden:

merchant_oid ile siparişi kontrol et
zaten işlenmişse tekrar işlem yapma
sadece OK döndür.
Tek cümlelik gerçek özet
adım ödeme başlatma,
adım ise PayTR’dan ödeme sonucunu alıp siparişi güncelleme sürecidir.

Yani backend tarafında yaptığın şey şu:

PayTR → Bildirim URL → Sipariş kontrol → Onay / İptal → OK

Basit ama kritik bir adım. Çünkü para aktarımı bu doğrulamaya bağlı.


cloude : 

Bu dokümanda PayTR Direkt API entegrasyonunun “2. Adımı” anlatılıyor. 1. Adımda müşteri ödeme formunu doldurup ödeme yaptığı anda, PayTR sistemi 2. Adımda tanımladığınız “Bildirim URL” adresinize otomatik olarak ödeme sonucunu gönderir. Bu sayede yazılımınız, işlemin başarılı mı yoksa başarısız mı olduğunu anlayarak kendi sisteminde gerekli işlemleri (sipariş onayı, e‑posta gönderebilme vs.) yapabilir.

Bildirim URL ne işe yarar?
Bildirim URL, PayTR’in ödeme sonucunu sizin sistemine otomatik olarak ilettiği bir adres gibi düşünülebilir. Müşteri ödeme yapar yapmaz PayTR oraya bir POST isteği (bildirim) gönderir ve siz bu bildirimi aldıysanız cevaben “OK” yazısını döndürmelisiniz. Bu şekilde PayTR, işlemin sizin sistem tarafından da alındığını ve tamamlandığını kabul eder.

Hangi bilgiler geliyor?
PayTR, Bildirim URL’nize gönderdiği bildirimde sipariş numarası (merchant_oid), ödeme durumu (başarılı/başarısız), tutar (100 ile çarpılmış hali), para birimi, ödeme yöntemi (kart/eft), taksit sayısı ve güvenlik için bir token gibi bilgileri iletir. Bu bilgileri kullanarak, hangi siparişin durumunu güncellemeniz gerektiğini, hangi ödemeyle ilgili işlem yapmanız gerektiğini anlayabilirsiniz.

Yazılımda dikkat edilmesi gerekenler
Bildirim URL si bir normal web sayfası gibi davranmaz; müşterinin girdiği bir adres değildir, PayTR’in arka planda otomatik olarak aradığı bir adrestir. Bu nedenle bu sayfada oturum (session) bilgisi kullanmamanız ve HTML, JavaScript gibi fazla içerik basmamanız gerekir. Sadece “OK” yanıtını döndürmeniz, işlemlerinizi ise sipariş numarasına (merchant_oid) göre yapmanız önerilir.

SSL ve protokol uyarısı
PayTR Mağaza Panelinde “Bildirim URL Ayarları” kısmında, sitenizde SSL sertifikası varsa bildirim adresinizin protokolünü HTTPS olarak seçmelisiniz. SSL’iniz yoksa HTTPS kullanmamanız, varsa da daha sonra SSL kurduysanız protokolü güncellemeniz gerekir. Aksi halde bildirim düzgün alınamaz ve işlem tamamlanmaz kalabilir.

