import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MessageSquare, Clock } from 'lucide-react'

export const metadata = {
  title: 'Mesajlar | Çözsen',
}

export default async function OgrenciMesajlarPage() {
  const supabase = await createClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error || !session) redirect('/giris')

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-black text-slate-800">Mesajlar</h1>
        <p className="text-slate-500 text-sm font-medium mt-1">Rehberlik ve destek mesajlarınız burada görünecek.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 flex flex-col items-center justify-center text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-sky-50 flex items-center justify-center">
          <MessageSquare className="w-8 h-8 text-sky-400" />
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-700">Henüz mesajınız yok</h2>
          <p className="text-slate-400 text-sm mt-1 max-w-xs">
            Rehberlik görüşmeleri ve destek mesajları burada görüntülenecektir.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg mt-2">
          <Clock className="w-3.5 h-3.5" />
          Yakında aktif olacak
        </div>
      </div>
    </div>
  )
}
