// Supabase — Parametre tabloları + Seed
const SUPABASE_URL = "https://axmsepsxnjygrwjemuzt.supabase.co"
const SUPABASE_ANON_KEY = "sb_publishable_aw6EuZryAiKLcnhqJX_UuQ_b0XFCBfW"

async function query(path, method = 'GET', body = null) {
  const headers = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  }
  if (method === 'POST') headers['Prefer'] = 'return=representation'
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method, headers,
    ...(body ? { body: JSON.stringify(body) } : {})
  })
  return res.json()
}

async function main() {
  // 1. Check if tables exist
  console.log("⏳ exam_types tablosu kontrol ediliyor...")
  const checkTypes = await fetch(`${SUPABASE_URL}/rest/v1/exam_types?select=id&limit=1`, {
    headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
  })
  const checkPeriods = await fetch(`${SUPABASE_URL}/rest/v1/exam_periods?select=id&limit=1`, {
    headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
  })

  if (checkTypes.status !== 200 || checkPeriods.status !== 200) {
    console.log("❌ Tablolar bulunamadı. Supabase SQL Editor'de aşağıdaki SQL'i çalıştırın:\n")
    console.log(`
-- PARAMETRE TABLOLARI
CREATE TABLE IF NOT EXISTS exam_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exam_periods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE exam_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_periods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "exam_types public read" ON exam_types FOR SELECT USING (true);
CREATE POLICY "exam_types admin write" ON exam_types FOR ALL USING (true);
CREATE POLICY "exam_periods public read" ON exam_periods FOR SELECT USING (true);
CREATE POLICY "exam_periods admin write" ON exam_periods FOR ALL USING (true);
    `)
    console.log("\n⬆️ SQL'i çalıştırıp bu scripti tekrar çalıştırın.")
    return
  }

  console.log("✅ Tablolar mevcut. Seed başlıyor...")

  // 2. Seed Exam Types
  const examTypes = [
    { name: "LGS", description: "Liseye Geçiş Sınavı", sort_order: 1 },
    { name: "TYT", description: "Temel Yeterlilik Testi", sort_order: 2 },
    { name: "AYT", description: "Alan Yeterlilik Testi", sort_order: 3 },
    { name: "YDT", description: "Yabancı Dil Testi", sort_order: 4 },
    { name: "Deneme", description: "Genel Deneme Sınavı", sort_order: 5 },
    { name: "Genel Değerlendirme", description: "Genel müfredat değerlendirmesi", sort_order: 6 },
  ]

  for (const t of examTypes) {
    const existing = await query(`exam_types?name=eq.${encodeURIComponent(t.name)}&select=id`)
    if (existing && existing.length > 0) {
      console.log(`⏩ Tür zaten var: ${t.name}`)
    } else {
      const r = await query('exam_types', 'POST', t)
      console.log(`✅ Tür eklendi: ${t.name}`)
    }
  }

  // 3. Seed Exam Periods
  const periods = [
    { name: "2024-2025", sort_order: 1 },
    { name: "2025-2026", sort_order: 2 },
    { name: "2026-2027", sort_order: 3 },
    { name: "2027-2028", sort_order: 4 },
    { name: "2028-2029", sort_order: 5 },
    { name: "2029-2030", sort_order: 6 },
  ]

  for (const p of periods) {
    const existing = await query(`exam_periods?name=eq.${encodeURIComponent(p.name)}&select=id`)
    if (existing && existing.length > 0) {
      console.log(`⏩ Dönem zaten var: ${p.name}`)
    } else {
      const r = await query('exam_periods', 'POST', p)
      console.log(`✅ Dönem eklendi: ${p.name}`)
    }
  }

  console.log("\n🎉 Parametre seed tamamlandı!")
}

main().catch(console.error)
