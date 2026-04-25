'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, CheckCircle2, Loader2, Lock, AlertCircle, KeyRound } from 'lucide-react'

export default function YeniSifrePage() {
  const router = useRouter()
  const supabase = createClient()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [sessionReady, setSessionReady] = useState(false)

  // Supabase hash'ten session oluştur (password reset token)
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setSessionReady(true)
      }
    })
    // Hash varsa session zaten hazır olabilir
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setSessionReady(true)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.')
      return
    }
    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor.')
      return
    }

    startTransition(async () => {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        setTimeout(() => router.push('/login?passwordUpdated=1'), 2500)
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12 px-4"
      style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1040 40%, #0d1b2a 100%)' }}>

      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .fade-in{animation:fadeIn 0.4s ease}
        .glass-card{background:rgba(255,255,255,0.04);backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,0.08);border-radius:28px;box-shadow:0 32px 64px rgba(0,0,0,0.4)}
        .input-modern{width:100%;padding:13px 14px 13px 44px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:14px;color:#fff;font-size:15px;outline:none;transition:all .2s;box-sizing:border-box;font-weight:500}
        .input-modern::placeholder{color:rgba(255,255,255,0.3)}
        .input-modern:focus{border-color:rgba(99,102,241,0.7);background:rgba(255,255,255,0.09);box-shadow:0 0 0 3px rgba(99,102,241,0.12)}
      `}</style>

      <div className="fade-in" style={{ width:'100%', maxWidth:'420px', position:'relative', zIndex:10 }}>

        {/* LOGO */}
        <div style={{ textAlign:'center', marginBottom:'28px' }}>
          <div style={{ width:'64px', height:'64px', borderRadius:'18px', margin:'0 auto 14px', background:'linear-gradient(135deg, #6366f1, #3b82f6)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 28px rgba(99,102,241,0.35)' }}>
            <KeyRound size={30} color="#fff" />
          </div>
          <h1 style={{ color:'#fff', fontSize:'24px', fontWeight:800, margin:'0 0 4px' }}>Yeni Şifre Belirle</h1>
          <p style={{ color:'rgba(255,255,255,0.45)', fontSize:'14px', margin:0 }}>Hesabınız için güçlü bir şifre seçin</p>
        </div>

        <div className="glass-card" style={{ padding:'32px 28px' }}>

          {success ? (
            <div className="fade-in" style={{ textAlign:'center' }}>
              <div style={{ width:'72px', height:'72px', borderRadius:'50%', margin:'0 auto 20px', background:'rgba(34,197,94,0.12)', border:'2px solid rgba(34,197,94,0.3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <CheckCircle2 size={36} color="#22c55e" />
              </div>
              <h2 style={{ color:'#fff', fontSize:'18px', fontWeight:800, marginBottom:'8px' }}>Şifre Güncellendi!</h2>
              <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'14px' }}>Giriş sayfasına yönlendiriliyorsunuz...</p>
              <Loader2 size={20} color="#818cf8" style={{ animation:'spin 0.8s linear infinite', margin:'16px auto', display:'block' }} />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="fade-in">

              {error && (
                <div style={{ display:'flex', alignItems:'center', gap:'8px', padding:'12px 16px', borderRadius:'12px', marginBottom:'18px', background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.25)', color:'#fca5a5', fontSize:'13px', fontWeight:500 }}>
                  <AlertCircle size={16} style={{ flexShrink:0 }} /> {error}
                </div>
              )}

              {!sessionReady && (
                <div style={{ display:'flex', alignItems:'center', gap:'8px', padding:'12px 16px', borderRadius:'12px', marginBottom:'18px', background:'rgba(251,191,36,0.1)', border:'1px solid rgba(251,191,36,0.2)', color:'#fcd34d', fontSize:'13px', fontWeight:500 }}>
                  <AlertCircle size={16} style={{ flexShrink:0 }} />
                  Doğrulama bağlantınız bekleniyor. E-postanızdaki link üzerinden geldiğinizden emin olun.
                </div>
              )}

              <div style={{ marginBottom:'14px' }}>
                <label style={{ display:'block', color:'rgba(255,255,255,0.6)', fontSize:'12px', fontWeight:600, marginBottom:'6px' }}>YENİ ŞİFRE</label>
                <div style={{ position:'relative' }}>
                  <Lock size={16} color="rgba(255,255,255,0.35)" style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)' }} />
                  <input name="password" type={showPassword ? 'text' : 'password'} required minLength={6} placeholder="En az 6 karakter" className="input-modern" style={{ paddingRight:'44px' }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.35)' }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div style={{ marginBottom:'24px' }}>
                <label style={{ display:'block', color:'rgba(255,255,255,0.6)', fontSize:'12px', fontWeight:600, marginBottom:'6px' }}>ŞİFRE (TEKRAR)</label>
                <div style={{ position:'relative' }}>
                  <Lock size={16} color="rgba(255,255,255,0.35)" style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)' }} />
                  <input name="confirmPassword" type={showConfirm ? 'text' : 'password'} required placeholder="Şifrenizi tekrar girin" className="input-modern" style={{ paddingRight:'44px' }} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.35)' }}>
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={isPending || !sessionReady} style={{ width:'100%', padding:'14px', fontSize:'15px', fontWeight:700, border:'none', borderRadius:'14px', cursor: (isPending || !sessionReady) ? 'not-allowed' : 'pointer', background:'linear-gradient(135deg,#6366f1,#3b82f6)', color:'#fff', transition:'all .2s', opacity:(isPending || !sessionReady) ? 0.6 : 1 }}>
                {isPending ? (
                  <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
                    <Loader2 size={18} style={{ animation:'spin 0.8s linear infinite' }} /> Güncelleniyor...
                  </span>
                ) : (
                  <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
                    Şifremi Güncelle <CheckCircle2 size={18} />
                  </span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
