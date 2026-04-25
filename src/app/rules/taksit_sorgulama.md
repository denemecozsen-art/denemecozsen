PayTR Taksit Sorgulama API ne işe yarar?

Bu API, sitende kredi kartı taksit oranlarını PayTR’dan çekmek için kullanılır. Yani kullanıcı ödeme yapmadan önce hangi banka kartında kaç taksit var ve komisyon oranı ne bunu öğrenirsin.

Önemli nokta:
Taksit oranları sabit değildir, günlük değişebilir. Bu yüzden PayTR, oranları API üzerinden çekip veritabanında güncel tutmanı önerir.

Mantık nasıl çalışır?
Sunucun PayTR’a bir API isteği (POST) gönderir.
İstek içinde mağaza bilgileri ve güvenlik token’ı bulunur.
PayTR sana taksit oranlarını ve taksit sayısını geri döndürür.
Sen de bu bilgileri ödeme ekranında kullanırsın.
API isteğinde gönderilen temel bilgiler

İstek atarken bazı zorunlu bilgiler gönderilir:

merchant_id → PayTR mağaza numarası
request_id → her isteğe özel rastgele ID
paytr_token → güvenlik için oluşturulan token

Opsiyonel olarak şunlar da gönderilebilir:

single_ratio → tek çekim oranını almak için
abroad_ratio → yurtdışı tek çekim oranı için
API'nin döndürdüğü bilgiler

API çağrısı başarılı olursa şu bilgiler gelir:

status → işlem başarılı mı
request_id → gönderdiğin isteğin ID’si
max_inst_non_bus → mağazana tanımlı maksimum taksit
oranlar → banka kartlarına göre taksit oranları

Banka örnekleri:
Axess, World, Maximum, Bonus, CardFinans vb.

Özet (tek paragraf)

PayTR Taksit Sorgulama API, ödeme almadan önce bankalara göre taksit sayısı ve komisyon oranlarını PayTR sisteminden çekmeni sağlar. Çünkü bu oranlar değişebilir. Sunucu PayTR’a bir istek gönderir, PayTR da banka bazlı taksit oranlarını ve maksimum taksit sayısını JSON olarak geri döndürür. Bu verileri ödeme ekranında gösterir veya veritabanında saklayarak güncel tutarsın.