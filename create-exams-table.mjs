// Supabase — exams tablosu + exam_results tablosu
// Run: node create-exams-table.mjs

const SUPABASE_URL = "https://axmsepsxnjygrwjemuzt.supabase.co"
const SUPABASE_ANON_KEY = "sb_publishable_aw6EuZryAiKLcnhqJX_UuQ_b0XFCBfW"

async function rpc(sql) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql })
  })
  return res
}

async function query(path, method = 'GET', body = null) {
  const headers = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  }
  if (method === 'POST') headers['Prefer'] = 'return=representation'
  
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {})
  })
  return res.json()
}

async function main() {
  console.log("⏳ exams tablosu kontrol ediliyor...")

  // Tabloyu kontrol et — varsa skip
  const check = await fetch(`${SUPABASE_URL}/rest/v1/exams?select=id&limit=1`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    }
  })

  if (check.status === 200) {
    console.log("✅ exams tablosu zaten mevcut, seed işlemine geçiliyor...")
  } else {
    console.log("❌ exams tablosu bulunamadı. Supabase SQL Editor'de aşağıdaki SQL'i çalıştırın:")
    console.log(`
-- ═══════════════════════════════════════════
-- SINAV YÖNETİMİ TABLOLARI
-- ═══════════════════════════════════════════

-- 1. EXAMS (Sınavlar / Denemeler)
CREATE TABLE IF NOT EXISTS exams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  level_id UUID REFERENCES levels(id),
  exam_type TEXT DEFAULT 'Deneme',  -- Deneme, TYT, AYT, LGS, vs.
  period TEXT DEFAULT '2025-2026',
  duration_minutes INTEGER DEFAULT 120,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  result_publish_mode TEXT DEFAULT 'instant', -- 'instant' veya 'scheduled'
  result_publish_date TIMESTAMPTZ,
  pdf_url TEXT,
  solution_video_url TEXT,
  cover_image TEXT,
  is_active BOOLEAN DEFAULT true,
  is_deleted BOOLEAN DEFAULT false,
  answer_key JSONB DEFAULT '[]',   -- [{q:1, answer:"A"}, {q:2, answer:"B"}, ...]
  sections JSONB DEFAULT '[]',     -- [{name:"LGS-Türkçe", question_count:10, options:4}, ...]
  total_questions INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. EXAM_RESULTS (Öğrenci Sınav Sonuçları)
CREATE TABLE IF NOT EXISTS exam_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  answers JSONB DEFAULT '{}',        -- {1:"A", 2:"B", 3:"C", ...}
  score DECIMAL(6,2),
  correct_count INTEGER DEFAULT 0,
  wrong_count INTEGER DEFAULT 0,
  empty_count INTEGER DEFAULT 0,
  net_score DECIMAL(6,2),
  section_scores JSONB DEFAULT '[]', -- Bölüm bazlı sonuçlar
  started_at TIMESTAMPTZ DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  status TEXT DEFAULT 'started',     -- started, completed, abandoned
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;

-- Herkes sınavları görebilir (aktif olanlar)
CREATE POLICY "Exams viewable by all" ON exams FOR SELECT USING (true);
-- Admin CRUD
CREATE POLICY "Exams managed by admin" ON exams FOR ALL USING (true);

-- Öğrenci kendi sonuçlarını görebilir
CREATE POLICY "Results viewable by student" ON exam_results FOR SELECT USING (true);
-- Sonuç ekleyebilir
CREATE POLICY "Results insertable" ON exam_results FOR INSERT WITH CHECK (true);
-- Sonuç güncelleyebilir
CREATE POLICY "Results updatable" ON exam_results FOR UPDATE USING (true);

-- Indexler
CREATE INDEX IF NOT EXISTS idx_exams_level ON exams(level_id);
CREATE INDEX IF NOT EXISTS idx_exams_active ON exams(is_active, is_deleted);
CREATE INDEX IF NOT EXISTS idx_exam_results_student ON exam_results(student_id);
CREATE INDEX IF NOT EXISTS idx_exam_results_exam ON exam_results(exam_id);
    `)
    console.log("\n⬆️ Yukarıdaki SQL'i Supabase Dashboard > SQL Editor'de çalıştırın, sonra bu script'i tekrar çalıştırın.")
    return
  }

  // Seed examları ekle
  console.log("\n⏳ Örnek sınavlar ekleniyor...")

  const levels = await query('levels?select=id,name&order=sort_order.asc')
  const getLevel = (s) => levels.find(l => l.name.toLowerCase().includes(s.toLowerCase()))?.id

  const exams = [
    {
      title: "NARTEST TG LGS-1",
      description: "Nartest Yayınları Türkiye Geneli LGS Deneme Sınavı 1. Oturum. Tüm dersleri kapsar.",
      level_id: getLevel('8'),
      exam_type: "LGS",
      period: "2025-2026",
      duration_minutes: 150,
      start_date: "2026-04-15T10:00:00+03:00",
      end_date: "2026-06-01T12:30:00+03:00",
      result_publish_mode: "instant",
      is_active: true,
      total_questions: 90,
      sections: JSON.stringify([
        { name: "LGS-Türkçe", question_count: 10, options: 4 },
        { name: "LGS-İnkılap Tarihi", question_count: 10, options: 4 },
        { name: "LGS-Din Kültürü", question_count: 10, options: 4 },
        { name: "LGS-İngilizce", question_count: 10, options: 4 },
        { name: "LGS-Matematik", question_count: 20, options: 4 },
        { name: "LGS-Fen Bilimleri", question_count: 20, options: 4 },
      ]),
      answer_key: JSON.stringify([]),
    },
    {
      title: "Newton TG LGS-2",
      description: "Newton Yayınları Türkiye Geneli LGS Deneme Sınavı 2. Oturum.",
      level_id: getLevel('8'),
      exam_type: "LGS",
      period: "2025-2026",
      duration_minutes: 150,
      start_date: "2026-04-15T10:00:00+03:00",
      end_date: "2026-06-01T12:30:00+03:00",
      result_publish_mode: "instant",
      is_active: true,
      total_questions: 90,
      sections: JSON.stringify([
        { name: "LGS-Türkçe", question_count: 10, options: 4 },
        { name: "LGS-İnkılap Tarihi", question_count: 10, options: 4 },
        { name: "LGS-Din Kültürü", question_count: 10, options: 4 },
        { name: "LGS-İngilizce", question_count: 10, options: 4 },
        { name: "LGS-Matematik", question_count: 20, options: 4 },
        { name: "LGS-Fen Bilimleri", question_count: 20, options: 4 },
      ]),
      answer_key: JSON.stringify([]),
    },
    {
      title: "Fenomen TG TYT-1",
      description: "Fenomen Yayınları Türkiye Geneli TYT Deneme Sınavı. 120 Soru, 135 Dakika.",
      level_id: getLevel('TYT'),
      exam_type: "TYT",
      period: "2025-2026",
      duration_minutes: 135,
      start_date: "2026-04-20T09:00:00+03:00",
      end_date: "2026-06-01T12:30:00+03:00",
      result_publish_mode: "scheduled",
      result_publish_date: "2026-04-25T18:00:00+03:00",
      is_active: true,
      total_questions: 120,
      sections: JSON.stringify([
        { name: "TYT-Türkçe", question_count: 40, options: 5 },
        { name: "TYT-Matematik", question_count: 40, options: 5 },
        { name: "TYT-Sosyal Bilimler", question_count: 20, options: 5 },
        { name: "TYT-Fen Bilimleri", question_count: 20, options: 5 },
      ]),
      answer_key: JSON.stringify([]),
    },
    {
      title: "7. Sınıf Genel Değerlendirme-1",
      description: "7. sınıf müfredatının tüm derslerini kapsayan genel değerlendirme denemesi.",
      level_id: getLevel('7'),
      exam_type: "Deneme",
      period: "2025-2026",
      duration_minutes: 120,
      start_date: "2026-04-18T10:00:00+03:00",
      end_date: "2026-06-01T12:30:00+03:00",
      result_publish_mode: "instant",
      is_active: true,
      total_questions: 60,
      sections: JSON.stringify([
        { name: "Türkçe", question_count: 10, options: 4 },
        { name: "Matematik", question_count: 10, options: 4 },
        { name: "Fen Bilimleri", question_count: 10, options: 4 },
        { name: "Sosyal Bilimler", question_count: 10, options: 4 },
        { name: "İngilizce", question_count: 10, options: 4 },
        { name: "Din Kültürü", question_count: 10, options: 4 },
      ]),
      answer_key: JSON.stringify([]),
    },
  ]

  for (const exam of exams) {
    const result = await query('exams', 'POST', exam)
    if (result && result[0]?.id) {
      console.log(`✅ ${exam.title} → ID: ${result[0].id}`)
    } else {
      console.log(`❌ ${exam.title}:`, JSON.stringify(result))
    }
  }

  console.log("\n🎉 Seed tamamlandı!")
}

main().catch(console.error)
