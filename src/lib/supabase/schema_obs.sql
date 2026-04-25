-- ÖĞRENCİ BİLGİ SİSTEMİ (ÖBS) TABLOLARI

-- 1. Öğretmenler (Örnek Dashboard ve İleriye Yönelik Veri)
CREATE TABLE IF NOT EXISTS public.teachers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    branch VARCHAR(150),
    phone VARCHAR(20),
    email VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Öğrenciler (Tüm kayıtların ve detayların olduğu ana tablo)
CREATE TABLE IF NOT EXISTS public.students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    username VARCHAR(100) UNIQUE, -- Öğrenci Tarafı Girişleri İçin Opsiyonel
    citizen_id VARCHAR(11), -- TC Kimlik No
    school_number VARCHAR(50), -- Okul/Dershane Numarası
    
    gender VARCHAR(10) CHECK (gender IN ('Erkek', 'Kız')),
    
    phone VARCHAR(20),
    email VARCHAR(255),
    
    -- İlişkiler
    level_id UUID REFERENCES public.levels(id) ON DELETE SET NULL, -- Şube / Sınıf
    teacher_id UUID REFERENCES public.teachers(id) ON DELETE SET NULL, -- Danışman Öğretmeni
    
    -- Durum ve Ekstralar
    has_parent_app BOOLEAN DEFAULT false, -- Mobil Veli Kullanımı (Görseldeki "Mobil Veli")
    membership_status VARCHAR(100), -- "Deneme Kulübü", "VIP Kayıt", "Yıllık Üye" vb.
    is_active BOOLEAN DEFAULT true,
    
    profile_picture TEXT, -- Profil Fotoğrafı URL (İşlemler > Resim Yükle için)
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- GÜVENLİK (RLS) POLİTİKALARI (Şimdilik admin erişimi için herkese açık olarak başlatılıyor)
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow All on teachers" ON public.teachers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All on students" ON public.students FOR ALL USING (true) WITH CHECK (true);
