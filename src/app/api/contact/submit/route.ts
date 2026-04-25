import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Lütfen tüm zorunlu alanları doldurun' }, { status: 400 })
    }

    const supabase = await createClient()

    // Insert into contact_messages table (or create if not exists)
    const { error } = await supabase
      .from('contact_messages')
      .insert({
        name,
        email,
        subject: subject || 'Genel',
        message,
        status: 'new'
      })

    if (error) {
      // If table doesn't exist, create it
      if (error.code === '42P01') {
        // Table doesn't exist, create it
        const { error: createError } = await supabase.rpc('create_contact_messages_table_if_not_exists')
        if (createError) {
          // Fallback: just log the message
          console.log('Contact form submission:', { name, email, subject, message })
          return NextResponse.json({ message: 'Mesajınız alındı' }, { status: 200 })
        }
        // Retry insert
        const { error: retryError } = await supabase
          .from('contact_messages')
          .insert({
            name,
            email,
            subject: subject || 'Genel',
            message,
            status: 'new'
          })
        if (retryError) throw retryError
      } else {
        throw error
      }
    }

    return NextResponse.json({ message: 'Mesajınız başarıyla gönderildi' }, { status: 200 })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 })
  }
}
