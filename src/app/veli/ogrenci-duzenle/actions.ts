'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getStudentForVeli(studentId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Oturum bulunamadı' }

  // Verify relation
  const { data: relation } = await supabase
    .from('parent_students')
    .select('student_id')
    .eq('parent_id', user.id)
    .eq('student_id', studentId)
    .single()

  if (!relation) return { error: 'Yetkisiz erişim' }

  const { data: student } = await supabase
    .from('students')
    .select('*')
    .eq('id', studentId)
    .single()

  return { student }
}

export async function updateStudent(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Yetkisiz' }

  const studentId = formData.get('studentId') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const username = formData.get('username') as string
  const levelId = formData.get('levelId') as string
  const examType = formData.get('examType') as string
  const password = formData.get('password') as string

  // Check parent authorization
  const { data: relation } = await supabase
    .from('parent_students')
    .select('student_id')
    .eq('parent_id', user.id)
    .eq('student_id', studentId)
    .single()

  if (!relation) return { error: 'Bu öğrenciyi düzenleme yetkiniz yok.' }

  const updateData: any = {
    first_name: firstName,
    last_name: lastName,
  }
  
  if (username) updateData.username = username
  if (levelId) updateData.level_id = levelId
  if (examType) updateData.exam_type = examType

  const { error: updateErr } = await supabase
    .from('students')
    .update(updateData)
    .eq('id', studentId)

  if (updateErr) return { error: updateErr.message }

  // If password change is requested via admin auth
  if (password) {
    try {
      const { createAdminClient } = await import('@/lib/supabase/admin')
      const supabaseAdmin = createAdminClient()
      
      const { error: authErr } = await supabaseAdmin.auth.admin.updateUserById(studentId, {
        password: password
      })
      if (authErr) return { error: 'Öğrenci güncellendi ancak şifre değiştirilemedi: ' + authErr.message }
    } catch(err: any) {
      console.warn("Could not change password: ", err)
    }
  }

  revalidatePath('/veli/ogrenciler')
  revalidatePath('/veli')
  return { success: true }
}
