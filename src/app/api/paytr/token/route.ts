import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// PayTR Sandbox / Canlı bilgileri — .env'den alınır
const PAYTR_MERCHANT_ID = process.env.PAYTR_MERCHANT_ID || ''
const PAYTR_MERCHANT_KEY = process.env.PAYTR_MERCHANT_KEY || ''
const PAYTR_MERCHANT_SALT = process.env.PAYTR_MERCHANT_SALT || ''
const PAYTR_API_URL = 'https://www.paytr.com/odeme/api/get-token'

// Placeholder / eksik kimlik bilgisi kontrolü — ödeme sistemi kapatıldıysa erken dön
function isPaytrConfigured(): boolean {
  const placeholders = ['magaza_numaraniz', 'magaza_gizli_anahtar', 'magaza_gizli_tuz', '']
  return (
    !placeholders.includes(PAYTR_MERCHANT_ID) &&
    !placeholders.includes(PAYTR_MERCHANT_KEY) &&
    !placeholders.includes(PAYTR_MERCHANT_SALT)
  )
}

export async function POST(request: NextRequest) {
  try {
    if (!isPaytrConfigured()) {
      return NextResponse.json(
        { error: 'Ödeme sistemi şu an aktif değil. Lütfen daha sonra tekrar deneyin.' },
        { status: 503 }
      )
    }
    const body = await request.json()
    const {
      packageId,
      packageName,
      amount,         // TL cinsinden (örn: 1490.00)
      installment,    // Taksit sayısı (1 = peşin)
      buyerEmail,
      buyerName,
      buyerPhone,
      buyerAddress,
      buyerCity,
      studentId,
      studentName,
      studentClass,
    } = body

    if (!buyerEmail || !buyerName || !amount) {
      return NextResponse.json({ error: 'Eksik bilgi' }, { status: 400 })
    }

    // Merchant sipariş ID üret (benzersiz)
    const merchantOid = `CZSEN-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`

    // Sepet oluştur (PayTR formatı)
    const userBasket = Buffer.from(
      JSON.stringify([[packageName, (amount * 100).toFixed(0), 1]])
    ).toString('base64')

    // IP adresi
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1'

    // Tutar — PayTR kuruş cinsinden (TL × 100)
    const paymentAmount = Math.round(amount * 100)

    // Hash oluştur
    // Sıra: merchant_id + ip + merchant_oid + email + payment_amount + user_basket + no_installment + max_installment + currency + test_mode
    const hashStr = [
      PAYTR_MERCHANT_ID,
      ip,
      merchantOid,
      buyerEmail,
      paymentAmount,
      userBasket,
      0,             // no_installment (0 = taksit açık)
      0,             // max_installment (0 = tüm taksitler açık)
      'TL',
      '0',           // test_mode (canlıda '0')
    ].join('')

    const paytrToken = crypto
      .createHmac('sha256', PAYTR_MERCHANT_KEY + PAYTR_MERCHANT_SALT)
      .update(hashStr)
      .digest('base64')

    // PayTR'a istek gönder
    const params = new URLSearchParams({
      merchant_id: PAYTR_MERCHANT_ID,
      user_ip: ip,
      merchant_oid: merchantOid,
      email: buyerEmail,
      payment_amount: paymentAmount.toString(),
      paytr_token: paytrToken,
      user_basket: userBasket,
      debug_on: process.env.NODE_ENV === 'development' ? '1' : '0',
      no_installment: '0',
      max_installment: '0',
      user_name: buyerName,
      user_address: buyerAddress || '',
      user_phone: buyerPhone || '',
      merchant_ok_url: `${process.env.NEXT_PUBLIC_SITE_URL}/odeme/basarili`,
      merchant_fail_url: `${process.env.NEXT_PUBLIC_SITE_URL}/odeme/basarisiz`,
      timeout_limit: '30',
      currency: 'TL',
      test_mode: process.env.NODE_ENV === 'development' ? '1' : '0',
      lang: 'tr',
    })

    const paytrResponse = await fetch(PAYTR_API_URL, {
      method: 'POST',
      body: params,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })

    const paytrData = await paytrResponse.json()

    if (paytrData.status === 'error') {
      console.error('[PayTR] Token error:', paytrData)
      return NextResponse.json({ error: paytrData.reason || 'PayTR token alınamadı' }, { status: 500 })
    }

    // Siparişi Supabase'e kaydet
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { error: dbError } = await supabase.from('orders').insert({
      parent_id: user?.id || null,
      parent_email: buyerEmail,
      parent_phone: buyerPhone,
      student_id: studentId || null,
      student_name: studentName || '',
      student_class: studentClass || '',
      package_id: packageId || null,
      package_name: packageName,
      amount: amount,
      merchant_oid: merchantOid,
      payment_status: 'pending',
      buyer_first_name: buyerName.split(' ')[0] || '',
      buyer_last_name: buyerName.split(' ').slice(1).join(' ') || '',
      buyer_email: buyerEmail,
      buyer_phone: buyerPhone,
      buyer_address: buyerAddress || '',
      buyer_city: buyerCity || '',
      order_status: 'new',
    })

    if (dbError) {
      console.error('[DB] Order insert error:', dbError)
      // Token aldık ama DB'ye kaydedemedik — loglayıp devam edebiliriz
    }

    return NextResponse.json({
      token: paytrData.token,
      merchantOid,
    })
  } catch (error) {
    console.error('[PayTR Token]', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
