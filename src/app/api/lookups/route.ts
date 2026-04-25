import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_TABLES = ['levels', 'exam_types', 'exam_periods']

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const table = searchParams.get('table')

  if (!table || !ALLOWED_TABLES.includes(table)) {
    return NextResponse.json({ error: 'Invalid table' }, { status: 400 })
  }

  // Public anon key kullanarak doğrudan erişim — auth session gerekmez
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  let query = supabase.from(table).select('id, name')

  // exam_types ve exam_periods için sadece aktif olanları getir
  if (table === 'exam_types' || table === 'exam_periods') {
    query = query.eq('is_active', true)
  }

  const { data, error } = await query.order('sort_order', { ascending: true })

  if (error) {
    console.error(`Lookups API error for ${table}:`, error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data || [])
}
