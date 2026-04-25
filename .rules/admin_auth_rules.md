# Admin Panel Güvenli Route Yapısı

Admin panel standart `/admin` adresinde çalışmasın.

## Nihai hedef
- Admin panelin public adresi varsayılan olarak sadece `/uraz` olsun.
- Ancak bu değer hardcoded olmasın.
- Route adı `.env` üzerinden yönetilsin.
- Varsayılan env değeri:
  `ADMIN_PANEL_PATH=uraz`

Yani sistem şu mantıkla çalışsın:
- `example.com/admin` -> kesinlikle çalışmasın
- `example.com/administrator` -> kesinlikle çalışmasın
- `example.com/dashboard-admin` -> kesinlikle çalışmasın
- `example.com/uraz` -> yalnızca yetkili admin için çalışsın

## Route kuralları
- `/admin` route’u projede hiç kullanılmasın
- `/admin`, `/administrator`, `/dashboard-admin`, `/panel`, `/control-panel`, `/manage` gibi yaygın admin yolları:
  - 404 dönsün
  - hiçbir şekilde admin panel olduğu anlaşılmasın
- Admin panel path’i runtime/config üzerinden gelsin
- Varsayılan değer `uraz` olsun
- Tüm admin sayfaları bu path altında nested yapı ile çalışsın

Örnek:
- `/uraz`
- `/uraz/login`
- `/uraz/dashboard`
- `/uraz/users`
- `/uraz/orders`
- `/uraz/settings`

## Güvenlik kuralları
- Admin panel route’una erişim için authentication zorunlu olsun
- Sadece `admin` rolüne sahip kullanıcılar erişebilsin
- Giriş yapmamış kullanıcı admin login ekranına yönlendirilsin
- Giriş yapmış ama `admin` olmayan kullanıcıya:
  - tercihen 404 veya
  - gerekiyorsa generic 403 dönsün
- Yetkilendirme route seviyesinde merkezi olarak kontrol edilsin
- Koruma middleware/proxy katmanında yapılsın
- Sadece UI tarafında koruma yapılmasın
- API tarafında da admin yetkisi ayrıca doğrulansın

## Teknik istek
- Admin route değeri `.env` içinden gelsin
- Örnek:
  `ADMIN_PANEL_PATH=uraz`
- Kod içinde doğrudan `/admin` veya `/uraz` hardcoded kullanılmasın
- Her yerde config sabiti kullanılsın
- Tüm admin navigation, link, redirect ve matcher yapıları bu config’i kullansın

## Beklenen davranış
- `example.com/admin` -> 404
- `example.com/administrator` -> 404
- `example.com/panel` -> 404
- `example.com/uraz` -> auth kontrolü
- `example.com/uraz/login` -> admin login sayfası
- `example.com/uraz/dashboard` -> sadece admin

## Middleware / Proxy kuralları
- Admin path eşleşirse önce session kontrolü yapılsın
- Session yoksa `/uraz/login` ekranına yönlendir
- Session var ama rol `admin` değilse erişim verme
- Yetkisiz erişimlerde panel yapısını ele verecek hata mesajı gösterme
- Response body içinde “admin panel”, “dashboard root”, “management area” gibi açık ifadeler gereksiz yere kullanılmasın

## Login güvenliği
- Admin login endpoint’ine rate limit koy
- Başarısız giriş denemelerini logla
- Belirli sayıda başarısız denemede geçici kilit veya throttling uygula
- Mümkünse 2FA/MFA altyapısını hazır kur
- İleride Google Authenticator / email OTP / TOTP eklenebilecek şekilde modüler yapı kur

## SEO / görünmezlik
- Admin sayfaları indexlenmesin
- robots.txt içinde admin path disallow edilsin
- Admin sayfalarında `noindex, nofollow` kullan
- sitemap içine admin route’ları ekleme

## UI / DX beklentisi
- Admin route yapısı temiz ve sürdürülebilir olsun
- Link üretimleri config tabanlı olsun
- Route değişirse tek yerden değişsin
- Public tarafta hiçbir yerde admin adresi görünmesin
- Footer, source map, public config veya console log’larda admin route sızmasın

## API güvenliği
- Admin panelin kullandığı API endpoint’ler sadece UI route korumasına güvenmesin
- Sunucu tarafında ayrıca `admin` rol kontrolü yapılsın
- Admin olmayan kullanıcı admin API’lerine erişemesin
- Yetkisiz erişimlerde generic hata dönsün

## Ek tavsiyeler
- Audit log sistemi kur:
  - kim giriş yaptı
  - kim hangi veriyi güncelledi
  - hangi IP’den geldi
  - başarısız giriş denemeleri neler
- Session cookie güvenli ayarlansın:
  - httpOnly
  - secure
  - sameSite uygun şekilde
- Prod ortamında debug hata detayları gösterilmesin
- Mümkünse admin için ayrı layout ve ayrı auth guard kullan
- Gerekirse ileride ayrı subdomain desteği de eklenebilsin:
  - `panel.example.com`
  - ama varsayılan çözüm `/uraz` olsun

## Kod kalitesi beklentisi
- Temiz dosya yapısı kur
- Admin route config’i tek merkezden yönet
- Middleware/proxy, auth guard, role guard ve admin layout birbirinden ayrılmış olsun
- Gerekli yerlerde test ekle:
  - `/admin` 404 testi
  - `/uraz` guest redirect testi
  - `/uraz` non-admin deny testi
  - `/uraz/dashboard` admin access testi

## Kırmızı çizgi
- `/admin` hiçbir koşulda aktif olmayacak
- Gerçek admin panel public olarak sadece `/uraz` altında çalışacak
- Ama bu değer sistemde config tabanlı kalacak