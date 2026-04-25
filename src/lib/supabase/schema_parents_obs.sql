-- =====================================================================
-- VELİ (PARENT) ÖBS SİSTEMİ — SUPABASE SQL ŞEMASI
-- =====================================================================
-- Bu dosyayı Supabase Dashboard → SQL Editor'de çalıştırın.
-- Sırasıyla:
--   1. parents tablosu
--   2. parent_students junction tablosu
--   3. Auth → Parents/Students otomatik senkronizasyon trigger'ı (güncel)
-- =====================================================================

-- =====================================================================
-- 1. VELİLER (PARENTS) TABLOSU
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.parents (
    id UUID PRIMARY KEY,  -- auth.users.id ile aynı
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS aktifleştir
ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow All on parents" ON public.parents;
CREATE POLICY "Allow All on parents" ON public.parents FOR ALL USING (true) WITH CHECK (true);

-- =====================================================================
-- 2. VELİ-ÖĞRENCİ İLİŞKİ TABLOSU (Çoktan Çoğa)
-- Bir velinin birden fazla öğrencisi olabilir.
-- Bir öğrencinin birden fazla velisi olabilir (anne-baba).
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.parent_students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    parent_id UUID NOT NULL REFERENCES public.parents(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    relationship VARCHAR(50) DEFAULT 'Veli',  -- 'Veli', 'Anne', 'Baba', 'Diğer'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(parent_id, student_id)
);

-- RLS aktifleştir
ALTER TABLE public.parent_students ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow All on parent_students" ON public.parent_students;
CREATE POLICY "Allow All on parent_students" ON public.parent_students FOR ALL USING (true) WITH CHECK (true);

-- =====================================================================
-- 3. GÜNCELLENMİŞ AUTH → STUDENTS/PARENTS SENKRONİZASYON TRİGGER'I
-- =====================================================================
-- Kayıt olurken kullanıcının seçtiği role göre (metadata olarak gönderilir):
--   role = 'parent' → parents tablosuna eklenir
--   role = 'student' (veya boş) → students tablosuna eklenir
-- =====================================================================

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
BEGIN
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'student');

  IF user_role = 'parent' THEN
    -- Veli olarak kayıt yapıldı → parents tablosuna ekle
    INSERT INTO public.parents (
      id,
      first_name,
      last_name,
      email,
      phone,
      is_active
    )
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'first_name', 'Yeni'),
      COALESCE(NEW.raw_user_meta_data->>'last_name', 'Veli'),
      NEW.email,
      NEW.phone,
      true
    );
  ELSE
    -- Öğrenci olarak kayıt yapıldı → students tablosuna ekle
    INSERT INTO public.students (
      id,
      first_name,
      last_name,
      email,
      phone,
      membership_status,
      is_active,
      has_parent_app
    )
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'first_name', 'Yeni'),
      COALESCE(NEW.raw_user_meta_data->>'last_name', 'Web Öğrencisi'),
      NEW.email,
      NEW.phone,
      'Deneme Kulübü (Web)',
      true,
      false
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eski trigger'ı kaldır ve yenisini oluştur
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_auth_user();

-- =====================================================================
-- 4. LEVELS TABLOSUNA SORT_ORDER EKLEMESİ (Advanced OBS)
-- =====================================================================
ALTER TABLE public.levels
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- =====================================================================
-- 5. PACKAGES TABLOSUNA TIPTAP VE FİYAT ALANLARI (Advanced Package)
-- =====================================================================
ALTER TABLE public.packages
ADD COLUMN IF NOT EXISTS content_json JSONB,
ADD COLUMN IF NOT EXISTS content_html TEXT,
ADD COLUMN IF NOT EXISTS payment_cycle VARCHAR(50) DEFAULT 'Aylık',
ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS price_old DECIMAL(10,2) DEFAULT 0;

ALTER TABLE public.package_publishers
ADD COLUMN IF NOT EXISTS series_name VARCHAR(255);

-- =====================================================================
-- 6. GELİŞMİŞ PAKET BUILDER (SEO, SÜRE, İNSANCIL MEDYA VS) Güncellemeleri
-- =====================================================================

-- Packages tablosuna SEO, Çoklu Medya, Tip/Süre, Portal Seçenekleri Ekleme
ALTER TABLE public.packages
ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255),
ADD COLUMN IF NOT EXISTS seo_description TEXT,
ADD COLUMN IF NOT EXISTS seo_slug VARCHAR(255),
ADD COLUMN IF NOT EXISTS images JSONB, -- Çoklu resim array'i için
ADD COLUMN IF NOT EXISTS package_type VARCHAR(50) DEFAULT 'Aylık', -- Aylık, Yıllık, vs.
ADD COLUMN IF NOT EXISTS duration_days INTEGER DEFAULT 0, -- Satın alınca kaç gün aktif kalacak? (Örn: 35)
ADD COLUMN IF NOT EXISTS has_portal_support BOOLEAN DEFAULT false;

-- Package_publishers tablosunu Medya Kütüphanesinden okuyacak şekilde güncelleme.
-- publisher_id primary key olduğu için DROP NOT NULL yapamıyoruz. 
-- Önce primary key'i kaldırıp tabloya id adında surrogate key eklenecek, sonra DROP NOT NULL yapılacak.
ALTER TABLE public.package_publishers DROP CONSTRAINT IF EXISTS package_publishers_pkey CASCADE;

ALTER TABLE public.package_publishers
ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() PRIMARY KEY;

ALTER TABLE public.package_publishers
ALTER COLUMN publisher_id DROP NOT NULL,
ADD COLUMN IF NOT EXISTS media_url VARCHAR(500);

-- Package_deliveries (Teslimat Takvimi) tablosuna tarih aralıkları ve satır içi logolar ekleme
ALTER TABLE public.package_deliveries
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS end_date DATE,
ADD COLUMN IF NOT EXISTS inline_publishers JSONB; -- [{ media_url: '...', name: '...' }]

-- =====================================================================
-- 7. STUDENTS TABLOSUNA USERNAME DESTEĞİ
-- =====================================================================
ALTER TABLE public.students
ADD COLUMN IF NOT EXISTS username VARCHAR(100) UNIQUE;
