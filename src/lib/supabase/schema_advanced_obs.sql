-- ADVANCED ÖBS & SİSTEM REVİZYONLARI SQL ŞEMASI
-- Bu dosya; Akıllı Sıralama, Otomatik Öğrenci Senkronizasyonu ve Tiptap Editör JSONB desteğini kurar.

-- 1. Sınıflar İçin Akıllı Sıralama (Sort Order)
ALTER TABLE public.levels 
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- 2. Auth -> Students (Öğrenci) Otomatik Senkronizasyon Tetikleyicisi
-- Web sitesinden (Supabase Auth üzerinden) yeni bir üye kayıt olduğunda, bu üyenin bilgileri otomatik olarak
-- admin paneli Öğrenci Bilgi Sistemi (ÖBS) yani "students" tablosuna aktarılacak.
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.students (
    id, 
    first_name, 
    last_name, 
    email, 
    membership_status, 
    is_active, 
    has_parent_app
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'Yeni'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'Web Öğrencisi'),
    NEW.email,
    'Deneme Kulübü (Web)',
    true,
    false
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_auth_user();


-- 3. Paketler (Kurumsal Satış) Tablosunun Tiptap ve Gelişmiş Ödeme İçin Güncellenmesi
ALTER TABLE public.packages
ADD COLUMN IF NOT EXISTS content_json JSONB,
ADD COLUMN IF NOT EXISTS content_html TEXT,
ADD COLUMN IF NOT EXISTS payment_cycle VARCHAR(50) DEFAULT 'Aylık', -- 'Aylık', 'Dönemlik', 'Yıllık'
ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS price_old DECIMAL(10,2) DEFAULT 0;

-- 4. Yayınevi Setleri ve Medya İçin Ekstra Bilgi
ALTER TABLE public.package_publishers
ADD COLUMN IF NOT EXISTS series_name VARCHAR(255); -- Örn: "Limit LGS Kamp Seti"
