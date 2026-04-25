// Supabase Seed Script — 5 Örnek Yıllık Paket
// Run: node seed-packages.mjs

const SUPABASE_URL = "https://axmsepsxnjygrwjemuzt.supabase.co"
const SUPABASE_ANON_KEY = "sb_publishable_aw6EuZryAiKLcnhqJX_UuQ_b0XFCBfW"

async function query(path, method = 'GET', body = null) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': method === 'POST' ? 'return=representation' : '',
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  })
  return res.json()
}

async function main() {
  console.log("⏳ Mevcut levels çekiliyor...")

  // 1. Levelleri çek
  const levels = await query('levels?select=id,name&order=sort_order.asc')
  console.log("✅ Levels:", levels.map(l => `${l.name} (${l.id})`).join(', '))

  if (!levels || levels.length === 0) {
    console.log("⚠️ Levels tablosu boş — önce level eklenecek...")

    // Temel levelları ekle
    const newLevels = await query('levels', 'POST', [
      { name: '5. Sınıf', short_name: '5.', sort_order: 1 },
      { name: '6. Sınıf', short_name: '6.', sort_order: 2 },
      { name: '7. Sınıf', short_name: '7.', sort_order: 3 },
      { name: '8. Sınıf | LGS', short_name: '8.', sort_order: 4 },
      { name: 'TYT Hazırlık', short_name: 'TYT', sort_order: 5 },
      { name: 'YKS Hazırlık', short_name: 'YKS', sort_order: 6 },
    ])
    console.log("✅ Levels eklendi:", newLevels)
    
    // Tekrar çek
    const refreshedLevels = await query('levels?select=id,name&order=sort_order.asc')
    await insertPackages(refreshedLevels)
  } else {
    await insertPackages(levels)
  }
}

async function insertPackages(levels) {
  // Level ID'lerini bul (fallback: ilk level)
  const getLevel = (search) => {
    const found = levels.find(l => l.name.toLowerCase().includes(search.toLowerCase()))
    return found?.id || levels[0]?.id
  }

  const level8 = getLevel('8') || getLevel('LGS')
  const level7 = getLevel('7')
  const level6 = getLevel('6')
  const level5 = getLevel('5')
  const levelTYT = getLevel('TYT')

  const slugify = (text) => text.toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

  const packages = [
    {
      title: "8. Sınıf LGS Yıllık Şampiyon Paketi",
      slug: "8-sinif-lgs-yillik-sampiyon-paketi",
      short_desc: "<p>8. sınıf LGS öğrencileri için profesyonellerce hazırlanmış, 10 aylık tam kapsamlı deneme paketi. Tüm yayınevlerinden seçme 40+ deneme seti.</p>",
      content_html: "<h2>Paket İçeriği</h2><p>Bu paket, 8. sınıf LGS sürecinde öğrencinin tüm yıl boyunca düzenli deneme yapmasını sağlar.</p><ul><li>Ankara Yayınları — 4 Deneme</li><li>3D Yayınları — 4 Deneme</li><li>Fenomen Yayınları — 4 Deneme</li><li>Newton Yayınları — 4 Deneme</li></ul><h2>Kargo Bilgisi</h2><p>Her ay düzenli olarak kapınıza teslim edilir. Kargo ücretsizdir.</p>",
      icon: "🏆",
      badge: "En Popüler",
      level_id: level8,
      package_type: "Yıllık",
      payment_cycle: "Yıllık",
      price: 2990,
      price_old: 4500,
      trial_count: "40",
      is_active: true,
      duration_days: 365,
      has_portal_support: true,
      cover_image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
      seo_title: "8. Sınıf LGS Yıllık Şampiyon Paketi | Çözsen Deneme",
      seo_description: "LGS sürecinde 40+ denemeyle sınavsevizi geçin. Yıllık paket kapsamında tüm yayınevleri bir arada.",
    },
    {
      title: "7. Sınıf Yıllık Deneme Paketi 2025-2026",
      slug: "7-sinif-yillik-deneme-paketi-2025-2026",
      short_desc: "<p>7. sınıf öğrencileri için akademik gelişimini adım adım takip eden, yıl boyunca düzenli gönderim yapılan deneme paketi.</p>",
      content_html: "<h2>Paket İçeriği</h2><p>7. sınıf müfredatına %100 uyumlu, 5 farklı yayınevinden derlenen karma deneme seti.</p><ul><li>Aylık 4 Deneme Seti</li><li>Optik Sonuç Formu Dahil</li><li>Konu Analiz Raporu</li></ul>",
      icon: "📚",
      badge: "Yeni Sezon",
      level_id: level7,
      package_type: "Yıllık",
      payment_cycle: "Yıllık",
      price: 2490,
      price_old: 3600,
      trial_count: "36",
      is_active: true,
      duration_days: 365,
      has_portal_support: true,
      cover_image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80",
      seo_title: "7. Sınıf Yıllık Deneme Paketi | Çözsen",
      seo_description: "7. sınıf için yıl boyunca düzenli deneme paketi. Karma yayınevi seti.",
    },
    {
      title: "6. Sınıf Yıllık Başarı Seti",
      slug: "6-sinif-yillik-basari-seti",
      short_desc: "<p>6. sınıf öğrencileri için uzmanlar tarafından hazırlanmış, temel ve orta düzey konuları pekiştiren yıllık deneme seti.</p>",
      content_html: "<h2>Paket İçeriği</h2><p>6. sınıf için temel kavram pekiştirme odaklı karma deneme seti.</p><ul><li>4 Farklı Yayınevi Denemesi</li><li>Kazanım Bazlı Analiz</li><li>Kargo Dahil</li></ul>",
      icon: "⭐",
      badge: null,
      level_id: level6,
      package_type: "Yıllık",
      payment_cycle: "Yıllık",
      price: 1990,
      price_old: 2800,
      trial_count: "30",
      is_active: true,
      duration_days: 365,
      has_portal_support: false,
      cover_image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80",
      seo_title: "6. Sınıf Yıllık Başarı Seti | Çözsen",
      seo_description: "6. sınıf için yıllık deneme paketi. Karma yayın evi seti, kargo dahil.",
    },
    {
      title: "5. Sınıf Yıllık Keşif Paketi",
      slug: "5-sinif-yillik-kesif-paketi",
      short_desc: "<p>5. sınıfa geçiş yapan öğrenciler için temel alışkanlık kazandıran, eğlenceli ve motive edici yıllık deneme paketi.</p>",
      content_html: "<h2>Paket İçeriği</h2><p>5. sınıf öğrencileri için sınav alışkanlığı kazandıran karma set.</p><ul><li>Her Ay 3 Deneme Seti</li><li>Renkli Tasarımlı Kitapçıklar</li><li>Ücretsiz Kargo</li></ul>",
      icon: "🎯",
      badge: null,
      level_id: level5,
      package_type: "Yıllık",
      payment_cycle: "Yıllık",
      price: 1590,
      price_old: 2200,
      trial_count: "24",
      is_active: true,
      duration_days: 365,
      has_portal_support: false,
      cover_image: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&q=80",
      seo_title: "5. Sınıf Yıllık Keşif Paketi | Çözsen",
      seo_description: "5. sınıf için yıllık deneme paketi. Temel alışkanlık ve sınav hazırlığı.",
    },
    {
      title: "TYT Yıllık Sıralama Paketi",
      slug: "tyt-yillik-siralama-paketi",
      short_desc: "<p>TYT sınavına hazırlanan öğrenciler için Türkiye geneli sıralama sistemiyle entegre, 10 aylık kapsamlı deneme paketi.</p>",
      content_html: "<h2>Paket İçeriği</h2><p>TYT hazırlığında en etkili yayınevlerinden derlenen yıllık paket.</p><ul><li>Bilgi Sarmal, Okyanus, AV, Yanıt Yayınları</li><li>Türkiye Geneli Sıralama Dahil</li><li>Optik Okuma Sistemi</li><li>Portal Erişimi</li></ul>",
      icon: "🚀",
      badge: "Çok Satan",
      level_id: levelTYT,
      package_type: "Yıllık",
      payment_cycle: "Yıllık",
      price: 3490,
      price_old: 5000,
      trial_count: "48",
      is_active: true,
      duration_days: 365,
      has_portal_support: true,
      cover_image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
      seo_title: "TYT Yıllık Sıralama Paketi | Çözsen",
      seo_description: "TYT hazırlığında Türkiye geneli sıralama sistemiyle entegre yıllık deneme paketi.",
    }
  ]

  console.log("\n⏳ 5 örnek paket ekleniyor...")

  // Mevcut seed paketleri sil (tekrar çalıştırma için)
  const existing = await query(`packages?slug=in.(${packages.map(p => `"${p.slug}"`).join(',')})&select=id`)
  if (existing && existing.length > 0) {
    for (const pkg of existing) {
      await query(`packages?id=eq.${pkg.id}`, 'DELETE')
    }
    console.log(`🗑️ ${existing.length} eski seed paketi temizlendi`)
  }

  // Yeni paketleri ekle
  for (const pkg of packages) {
    const result = await query('packages', 'POST', pkg)
    if (result && result[0]?.id) {
      console.log(`✅ Eklendi: ${pkg.title} (ID: ${result[0].id})`)
    } else {
      console.log(`❌ Hata — ${pkg.title}:`, JSON.stringify(result))
    }
  }

  console.log("\n🎉 Seed tamamlandı! http://localhost:3000 ve http://localhost:3000/paketler sayfalarını kontrol edin.")
}

main().catch(console.error)
