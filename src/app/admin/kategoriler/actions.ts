"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { buildAdminPath } from "@/lib/admin-config"

// Senior Level Server Actions for Category Management
// These wrap Supabase interactions with proper error handling and caching strategies

export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

  if (!name) return { error: "Kategori adı zorunludur." }

  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('categories')
    .insert([{ name, slug, description }])
    .select()
    .single()

  if (error) {
    console.error("Supabase Kategori Ekleme Hatası:", error)
    return { error: error.message }
  }

  revalidatePath(buildAdminPath('/kategoriler'))
  return { success: true, data }
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('categories')
    .delete()
    .match({ id })

  if (error) {
    return { error: error.message }
  }

  revalidatePath(buildAdminPath('/kategoriler'))
  return { success: true }
}
