import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Geçerli bir e-posta adresi girin' }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', email)
      .eq('status', 'active')
      .single()

    if (existing) {
      return NextResponse.json({ message: 'Bu e-posta zaten bülten listesinde kayıtlı' }, { status: 200 })
    }

    // Insert new subscriber
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email, status: 'active' })

    if (error) {
      // If it's a unique constraint violation, they're already subscribed
      if (error.code === '23505') {
        return NextResponse.json({ message: 'Bu e-posta zaten bülten listesinde kayıtlı' }, { status: 200 })
      }
      throw error
    }

    return NextResponse.json({ message: 'Bülten kaydınız başarıyla alındı' }, { status: 200 })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 })
  }
}
