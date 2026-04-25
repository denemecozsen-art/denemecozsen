-- =====================================================================
-- SİPARİŞLER (ORDERS) TABLOSU — PayTR Entegrasyonu için
-- =====================================================================
-- Bu dosyayı Supabase Dashboard → SQL Editor'de çalıştırın.
-- =====================================================================

-- 1. ORDERS (Siparişler) TABLOSU
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Sipariş sahibi (Veli)
    parent_id UUID REFERENCES public.parents(id) ON DELETE SET NULL,
    parent_email VARCHAR(255),
    parent_phone VARCHAR(20),
    
    -- Öğrenci bilgisi
    student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
    student_name VARCHAR(255),
    student_class VARCHAR(100),
    
    -- Sipariş edilen paket
    package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL,
    package_name VARCHAR(255) NOT NULL,
    package_type VARCHAR(50), -- Aylık, Sömestr, Yıllık
    
    -- Fiyatlandırma
    amount DECIMAL(10,2) NOT NULL,         -- Ödenecek tutar (TL)
    installment_count INTEGER DEFAULT 1,   -- Taksit sayısı
    
    -- Kargo/Teslimat bilgileri
    shipping_address TEXT,
    shipping_city VARCHAR(100),
    shipping_district VARCHAR(100),
    shipping_zip VARCHAR(10),
    
    -- Veli kişisel bilgileri (satın alma anındaki snapshot)
    buyer_first_name VARCHAR(100),
    buyer_last_name VARCHAR(100),
    buyer_email VARCHAR(255),
    buyer_phone VARCHAR(20),
    buyer_address TEXT,
    buyer_city VARCHAR(100),
    buyer_district VARCHAR(100),
    
    -- PayTR Ödeme bilgileri
    merchant_oid VARCHAR(100) UNIQUE,      -- PayTR sipariş numarası
    payment_status VARCHAR(50) DEFAULT 'pending', -- pending | success | failed | refunded
    payment_type VARCHAR(50),             -- card | eft
    payment_date TIMESTAMP WITH TIME ZONE,
    paytr_token TEXT,                     -- PayTR token (log amaçlı)
    failed_reason_code VARCHAR(50),
    failed_reason_msg TEXT,
    
    -- Taksit detayları
    installments JSONB,                   -- [{ month: 1, amount: 500, status: 'paid', date: '...' }]
    
    -- Sipariş durumu
    order_status VARCHAR(50) DEFAULT 'new', -- new | confirmed | shipped | delivered | cancelled
    notes TEXT,                           -- Admin notları
    
    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. ORDER_ITEMS (Sipariş Kalemleri) — Birden fazla ürün için
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL,
    package_name VARCHAR(255) NOT NULL,
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. PAYTR_NOTIFICATIONS (PayTR bildirim log'u — hata ayıklama için)
CREATE TABLE IF NOT EXISTS public.paytr_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    merchant_oid VARCHAR(100),
    status VARCHAR(20),
    total_amount INTEGER,
    payment_type VARCHAR(50),
    installment_count INTEGER,
    failed_reason_code VARCHAR(50),
    failed_reason_msg TEXT,
    raw_payload JSONB,
    received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Aktifleştir
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paytr_notifications ENABLE ROW LEVEL SECURITY;

-- Geliştirme için açık policy (prod'da kısıtlanmalı)
DROP POLICY IF EXISTS "Allow All on orders" ON public.orders;
CREATE POLICY "Allow All on orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow All on order_items" ON public.order_items;
CREATE POLICY "Allow All on order_items" ON public.order_items FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow All on paytr_notifications" ON public.paytr_notifications;
CREATE POLICY "Allow All on paytr_notifications" ON public.paytr_notifications FOR ALL USING (true) WITH CHECK (true);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Index'ler
CREATE INDEX IF NOT EXISTS idx_orders_parent_id ON public.orders(parent_id);
CREATE INDEX IF NOT EXISTS idx_orders_merchant_oid ON public.orders(merchant_oid);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
