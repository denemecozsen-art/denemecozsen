import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const PAYTR_MERCHANT_KEY = process.env.PAYTR_MERCHANT_KEY || ''
const PAYTR_MERCHANT_SALT = process.env.PAYTR_MERCHANT_SALT || ''

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const params = new URLSearchParams(body)

    const merchantOid = params.get('merchant_oid') || ''
    const status = params.get('status') || ''
    const totalAmount = params.get('total_amount') || ''
    const hash = params.get('hash') || ''
    const failedReasonCode = params.get('failed_reason_code') || ''
    const failedReasonMsg = params.get('failed_reason_msg') || ''
    const paymentType = params.get('payment_type') || ''
    const installmentCount = parseInt(params.get('installment_count') || '1')

    // Hash doğrulaması — kritik güvenlik adımı
    const hashStr = `${merchantOid}${PAYTR_MERCHANT_SALT}${status}${totalAmount}`
    const expectedHash = crypto
      .createHmac('sha256', PAYTR_MERCHANT_KEY + PAYTR_MERCHANT_SALT)
      .update(hashStr)
      .digest('base64')

    if (hash !== expectedHash) {
      console.error('[PayTR Notify] Hash mismatch!')
      return new NextResponse('HASH_ERROR', { status: 400 })
    }

    // Supabase'e bildir
    const supabase = await createClient()

    // Bildirimi logla
    await supabase.from('paytr_notifications').insert({
      merchant_oid: merchantOid,
      status,
      total_amount: parseInt(totalAmount),
      payment_type: paymentType,
      installment_count: installmentCount,
      failed_reason_code: failedReasonCode,
      failed_reason_msg: failedReasonMsg,
      raw_payload: Object.fromEntries(params),
    })

    // Siparişi bul ve güncelle
    const { data: order } = await supabase
      .from('orders')
      .select('id, payment_status')
      .eq('merchant_oid', merchantOid)
      .single()

    if (order) {
      // Tekrar işlenmeyi önle
      if (order.payment_status === 'success' || order.payment_status === 'failed') {
        return new NextResponse('OK')
      }

      const updateData: Record<string, any> = {
        payment_status: status === 'success' ? 'success' : 'failed',
        payment_type: paymentType,
        installment_count: installmentCount,
        updated_at: new Date().toISOString(),
      }

      if (status === 'success') {
        updateData.payment_date = new Date().toISOString()
        updateData.order_status = 'confirmed'
      } else {
        updateData.failed_reason_code = failedReasonCode
        updateData.failed_reason_msg = failedReasonMsg
        updateData.order_status = 'cancelled'
      }

      await supabase
        .from('orders')
        .update(updateData)
        .eq('merchant_oid', merchantOid)
    }

    // PayTR "OK" bekleniyor — HTML, JSON, boşluk OLMAMALI
    return new NextResponse('OK', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    })
  } catch (error) {
    console.error('[PayTR Notify]', error)
    return new NextResponse('ERROR', { status: 500 })
  }
}
