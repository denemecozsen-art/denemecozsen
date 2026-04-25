'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateKendinSecSettings(formData: FormData) {
  const supabase = await createClient()

  const data = {
    hero_title: formData.get('hero_title') as string,
    step1_desc: formData.get('step1_desc') as string,
    step2_desc: formData.get('step2_desc') as string,
    step3_desc: formData.get('step3_desc') as string,
    shipping_rule_enabled: formData.get('shipping_rule_enabled') === 'on',
    shipping_free_threshold: parseInt(formData.get('shipping_free_threshold') as string) || 3,
    shipping_penalty_fee: parseFloat(formData.get('shipping_penalty_fee') as string) || 150,
    portal_price: parseFloat(formData.get('portal_price') as string) || 100,
    portal_rule_enabled: formData.get('portal_rule_enabled') === 'on',
    updated_at: new Date().toISOString()
  }

  const { error } = await supabase
    .from('custom_package_settings')
    .update(data)
    .eq('id', 1)

  if (error) {
    console.error('Settings update error:', error)
    throw new Error('Ayarlar güncellenemedi.')
  }

  revalidatePath('/admin/sayfalar/kendin-sec')
  revalidatePath('/paketini-kendin-sec')
}

export async function addKendinSecOption(formData: FormData) {
  const supabase = await createClient()
  
  const data = {
    month_name: formData.get('month_name') as string,
    publisher_name: formData.get('publisher_name') as string,
    series_name: formData.get('series_name') as string,
    price: parseFloat(formData.get('price') as string) || 0,
    logo_url: formData.get('logo_url') as string,
    level_name: formData.get('level_name') as string || 'Genel',
    sort_order: parseInt(formData.get('sort_order') as string) || 0,
  }

  const { error } = await supabase.from('custom_package_options').insert(data)

  if (error) {
    console.error('Insert Option Error:', error)
    throw new Error(`Seçenek eklenemedi: ${error.message}`)
  }

  revalidatePath('/admin/sayfalar/kendin-sec')
  revalidatePath('/paketini-kendin-sec')
}

export async function deleteKendinSecOption(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase.from('custom_package_options').delete().eq('id', id)
  
  if (error) throw new Error('Seçenek silinemedi.')
  
  revalidatePath('/admin/sayfalar/kendin-sec')
  revalidatePath('/paketini-kendin-sec')
}
