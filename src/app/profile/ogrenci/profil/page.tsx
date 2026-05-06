import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '@/app/auth/logout/actions'
import {
  UserCircle,
  Mail,
  Phone,
  GraduationCap,
  Shield,
  LogOut,
  Lock,
} from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Hesabım | Çözsen',
}

export default async function OgrenciProfilPage() {
  const supabase = await createClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error || !session) redirect('/giris')

  const user = session.user
  const role = user.user_metadata?.role
  const firstName = user.user_metadata?.first_name || ''
  const lastName = user.user_metadata?.last_name || ''
  const displayName = (firstName + ' ' + lastName).trim() || user.email?.split('@')[0] || 'Kullanıcı'
  const initials = (firstName?.charAt(0) || user.email?.charAt(0) || 'Ö').toUpperCase()

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-4">

      {/* Başlık */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">Hesabım</h1>
        <p className="text-slate-500 text-sm font-medium mt-1">Hesap bilgilerinizi buradan görüntüleyin.</p>
      </div>

      {/* Avatar + Ad Kartı */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-20 bg-gradient-to-br from-indigo-500 to-violet-600 relative">
          <div className="absolute -bottom-10 left-6">
            <div className="w-20 h-20 rounded-2xl bg-white ring-4 ring-white flex items-center justify-center shadow-lg">
              <span className="text-3xl font-black text-indigo-600">{initials}</span>
            </div>
          </div>
        </div>
        <div className="pt-14 px-6 pb-6">
          <h2 className="text-xl font-black text-slate-800">{displayName}</h2>
          <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-bold">
            <GraduationCap className="w-3.5 h-3.5" />
            {role === 'parent' ? 'Veli Hesabı' : 'Öğrenci Hesabı'}
          </span>
        </div>
      </div>

      {/* Hesap Bilgileri */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
        <h3 className="font-black text-slate-700 text-xs uppercase tracking-wider mb-3">Hesap Bilgileri</h3>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
            <Mail className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">E-posta</p>
            <p className="text-sm font-semibold text-slate-700 truncate">{user.email}</p>
          </div>
          <span className="ml-auto shrink-0 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Doğrulandı</span>
        </div>

        {user.phone && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
            <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4 text-violet-500" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Telefon</p>
              <p className="text-sm font-semibold text-slate-700">{user.phone}</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hesap Güvenliği</p>
            <p className="text-sm font-semibold text-slate-700">Aktif · Güvenli</p>
          </div>
        </div>
      </div>

      {/* İşlemler */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-1">
        <h3 className="font-black text-slate-700 text-xs uppercase tracking-wider mb-3">İşlemler</h3>

        <Link
          href="/sifremi-unuttum"
          className="flex items-center gap-3 w-full p-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors font-semibold text-sm"
        >
          <Lock className="w-4 h-4 text-slate-400" />
          Şifremi Değiştir
        </Link>

        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-3 w-full p-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors font-semibold text-sm"
          >
            <LogOut className="w-4 h-4" />
            Oturumu Kapat
          </button>
        </form>
      </div>

      {/* Uygulama versiyonu */}
      <p className="text-center text-[10px] text-slate-300 font-semibold uppercase tracking-widest pb-2">
        Çözsen ÖBS · v1.0
      </p>
    </div>
  )
}
