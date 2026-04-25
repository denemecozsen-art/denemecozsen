-- Erken Kayıt Paketleri Tablosu
-- Her sezon ve her sınıf için birden fazla paket tanımlanabilir

CREATE TABLE IF NOT EXISTS public.early_registration_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    season TEXT NOT NULL DEFAULT '2026-2027',
    level_id UUID NOT NULL REFERENCES public.levels(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL DEFAULT 0,
    original_price NUMERIC(10,2) DEFAULT 0,
    features TEXT[] DEFAULT '{}',
    cover_image TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- cover_image kolonunu ekle (eğer tablo önceden oluşturulduysa ve bu kolon eksikse)
ALTER TABLE public.early_registration_packages 
ADD COLUMN IF NOT EXISTS cover_image TEXT;

-- Indexler
CREATE INDEX IF NOT EXISTS idx_early_packages_season ON public.early_registration_packages(season);
CREATE INDEX IF NOT EXISTS idx_early_packages_level ON public.early_registration_packages(level_id);
CREATE INDEX IF NOT EXISTS idx_early_packages_active ON public.early_registration_packages(is_active);

-- RLS Politikaları
ALTER TABLE public.early_registration_packages ENABLE ROW LEVEL SECURITY;

-- Önce varsa sil (idempotent olması için)
DROP POLICY IF EXISTS "Herkes aktif paketleri görebilir" ON public.early_registration_packages;
DROP POLICY IF EXISTS "Sadece admin'ler paket yönetebilir" ON public.early_registration_packages;

-- Herkes aktif paketleri görebilir
CREATE POLICY "Herkes aktif paketleri görebilir" 
ON public.early_registration_packages
FOR SELECT
USING (is_active = true);

-- Sadece admin'ler yazma işlemi yapabilir (auth.users raw_user_meta_data'da role kontrolü)
CREATE POLICY "Sadece admin'ler paket yönetebilir"
ON public.early_registration_packages
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() 
        AND (
            raw_user_meta_data->>'role' = 'admin' 
            OR raw_user_meta_data->>'role' = 'super_admin'
        )
    )
);

-- Trigger: updated_at otomatik güncelleme
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Önce varsa trigger'ı sil
DROP TRIGGER IF EXISTS trigger_early_packages_updated_at ON public.early_registration_packages;

CREATE TRIGGER trigger_early_packages_updated_at
    BEFORE UPDATE ON public.early_registration_packages
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Storage Bucket: images (public)
-- Storage bucket ve politikaları oluştur

-- Bucket oluştur (storage.buckets tablosuna insert)
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES ('images', 'images', true, false, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Storage politikaları önce varsa sil
DROP POLICY IF EXISTS "Public Read" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Users Upload" ON storage.objects;

-- 1. SELECT politikası - Herkes görebilir (Public bucket)
CREATE POLICY "Public Read" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

-- 2. INSERT politikası - Admin'ler ve authenticated kullanıcılar yükleyebilir (daha esnek)
CREATE POLICY "Authenticated Users Upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'images' AND
  auth.role() = 'authenticated'
);

-- 3. DELETE politikası - Admin'ler silebilir
CREATE POLICY "Admin Delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'images' AND
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND (raw_user_meta_data->>'role' = 'admin' OR raw_user_meta_data->>'role' = 'super_admin')
  )
);

-- Örnek veri (isteğe bağlı, test için)
-- INSERT INTO public.early_registration_packages (season, level_id, title, description, price, original_price, features, cover_image, is_featured, is_active)
-- SELECT 
--     '2026-2027',
--     id as level_id,
--     '2026-2027 Tam Yıllık Paket',
--     'Tüm yayınlar, online denemeler ve analiz raporları dahil',
--     2999.00,
--     3999.00,
--     ARRAY['Tüm yayın setleri', 'Online deneme sistemi', 'Detaylı analiz raporları', '7/24 destek'],
--     NULL,
--     true,
--     true
-- FROM public.levels 
-- WHERE name IN ('12. Sınıf', 'Mezun', '8. Sınıf');
