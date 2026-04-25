import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function SinavLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { session }, error } = await supabase.auth.getSession()

  if (error || !session) {
    redirect('/giris')
  }

  // Sınav ekranı fullscreen — sidebar YOK
  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      {children}
    </div>
  )
}
