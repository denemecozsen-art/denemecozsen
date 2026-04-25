-- =====================================================================
-- KENDİN SEÇ PAKET MODÜLÜ — SUPABASE SQL ŞEMASI
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.custom_package_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    
    -- Metinler
    hero_title VARCHAR(255) DEFAULT 'Paketini Oluştur',
    step1_desc TEXT DEFAULT 'Sana en uygun kaynakları görmek için eğitim seviyeni belirle.',
    step2_desc TEXT DEFAULT 'Dilediğiniz Ayı ve Yayını Seçin. Seçtiğiniz sınıf için dilediğin ayın kurumsal denemelerini sepete ekle.',
    step3_desc TEXT DEFAULT 'Netlerinizi görebileceğiniz, dijital karnelere ulaşabileceğiniz analiz panelini paketinize ekleyin.',
    
    -- Finans ve Kargo
    shipping_rule_enabled BOOLEAN DEFAULT true,
    shipping_free_threshold INTEGER DEFAULT 3,
    shipping_penalty_fee DECIMAL(10,2) DEFAULT 150.00,
    portal_price DECIMAL(10,2) DEFAULT 100.00,
    portal_rule_enabled BOOLEAN DEFAULT true,
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Tek satır kısıtlaması
    CONSTRAINT single_row CHECK (id = 1)
);

-- Başlangıç verisi ekle
INSERT INTO public.custom_package_settings (id) VALUES (1) ON CONFLICT DO NOTHING;


CREATE TABLE IF NOT EXISTS public.custom_package_options (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    month_name VARCHAR(50) NOT NULL, -- Örn: Ekim, Kasım, Aralık
    publisher_name VARCHAR(100) NOT NULL,
    series_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    logo_url TEXT,
    level_name VARCHAR(100) DEFAULT 'Genel',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.custom_package_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_package_options ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow All on custom_package_settings" ON public.custom_package_settings;
CREATE POLICY "Allow All on custom_package_settings" ON public.custom_package_settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow All on custom_package_options" ON public.custom_package_options;
CREATE POLICY "Allow All on custom_package_options" ON public.custom_package_options FOR ALL USING (true) WITH CHECK (true);

-- Örnek veriler ekleyelim
INSERT INTO public.custom_package_options (month_name, publisher_name, series_name, price, sort_order)
VALUES 
('Ekim', 'Limit Yayınları', 'Kronometre Serisi', 160.00, 1),
('Ekim', 'Bilgi Sarmal', 'Sarmal Seri', 150.00, 2),
('Ekim', 'Nartest', 'Pro Seri', 145.00, 3),
('Kasım', 'Hız Yayınları', 'Kurumsal Seri 1', 140.00, 1),
('Kasım', 'Açı Yayınları', 'Açı Serisi', 155.00, 2),
('Aralık', 'Paraf Yayınları', 'Paraf Pro Serisi', 170.00, 1)
ON CONFLICT DO NOTHING;
