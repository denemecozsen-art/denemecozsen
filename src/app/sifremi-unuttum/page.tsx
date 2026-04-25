'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { sendPasswordReset } from '../login/actions'
import { Mail, ArrowLeft, CheckCircle2, Loader2, KeyRound, AlertCircle } from 'lucide-react'

export default function SifremiUnuttumPage() {
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await sendPasswordReset(formData)
      if (result.error) {
        setError(result.error)
      } else {
        setSent(true)
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12 px-4"
      style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1040 40%, #0d1b2a 100%)' }}>

      <style>{`
        @keyframes pulse { 0%,100%{transform:scale(1);opacity:.7} 50%{transform:scale(1.08);opacity:1} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .fade-in{animation:fadeIn 0.4s ease}
        .glass-card{background:rgba(255,255,255,0.04);backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,0.08);border-radius:28px;box-shadow:0 32px 64px rgba(0,0,0,0.4)}
        .input-modern{width:100%;padding:13px 14px 13px 44px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:14px;color:#fff;font-size:15px;outline:none;transition:all .2s;box-sizing:border-box;font-weight:500}
        .input-modern::placeholder{color:rgba(255,255,255,0.3)}
        .input-modern:focus{border-color:rgba(99,102,241,0.7);background:rgba(255,255,255,0.09);box-shadow:0 0 0 3px rgba(99,102,241,0.12)}
      `}</style>

      <div style={{ position: 'absolute', top: '-15%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', animation: 'pulse 5s ease-in-out infinite' }} />

      <div className="fade-in" style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 10 }}>

        {/* Geri Linki */}
        <Link href="/login" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.4)', fontSize: '13px', fontWeight: 600, textDecoration: 'none', marginBottom: '24px', width: 'fit-content' }}>
          <ArrowLeft size={15} /> Giriş sayfasına dön
        </Link>

        {/* LOGO */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '18px', margin: '0 auto 14px', background: 'linear-gradient(135deg, #6366f1, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 28px rgba(99,102,241,0.35)' }}>
            <KeyRound size={30} color="#fff" />
          </div>
          <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.5px' }}>Şifremi Unuttum</h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', margin: 0 }}>
            {sent ? 'E-posta gönderildi!' : 'E-posta adresinize sıfırlama linki göndereceğiz'}
          </p>
        </div>

        <div className="glass-card" style={{ padding: '32px 28px' }}>

          {sent ? (
            /* BAŞARILI DURUM */
            <div className="fade-in text-center space-y-4">
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto 20px', background: 'rgba(34,197,94,0.12)', border: '2px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={36} color="#22c55e" />
              </div>
              <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: 800, marginBottom: '12px' }}>
                E-posta Gönderildi!
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
                <strong style={{ color: 'rgba(255,255,255,0.8)' }}>{email}</strong> adresine şifre sıfırlama bağlantısı gönderildi. Lütfen gelen kutunuzu ve spam/istenmeyen klasörünü kontrol edin.
              </p>

              {/* Büyük buton tasarımı */}
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
                <Mail size={32} color="#818cf8" style={{ margin: '0 auto 12px', display: 'block' }} />
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: 600, margin: 0 }}>
                  📬 E-postanızda bir buton gelecek:<br />
                  <strong style={{ color: '#a5b4fc' }}>"Şifremi Sıfırla"</strong> — tıklayın ve yeni şifrenizi belirleyin.
                </p>
              </div>

              <Link href="/login" style={{ display: 'block', width: '100%', padding: '14px', background: 'linear-gradient(135deg, #6366f1, #3b82f6)', borderRadius: '14px', color: '#fff', fontWeight: 700, textDecoration: 'none', fontSize: '15px', textAlign: 'center' }}>
                Giriş Sayfasına Dön
              </Link>

              <button
                type="button"
                onClick={() => setSent(false)}
                style={{ width: '100%', marginTop: '12px', padding: '10px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
              >
                Farklı e-posta ile dene
              </button>
            </div>
          ) : (
            /* FORM */
            <form onSubmit={handleSubmit} className="fade-in">

              {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderRadius: '12px', marginBottom: '18px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5', fontSize: '13px', fontWeight: 500 }}>
                  <AlertCircle size={16} style={{ flexShrink: 0 }} /> {error}
                </div>
              )}

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>KAYITLI E-POSTA ADRESİNİZ</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="rgba(255,255,255,0.35)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    name="email" type="email" required
                    placeholder="ornek@mail.com"
                    className="input-modern"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '8px' }}>
                  Kayıt olurken kullandığınız e-posta adresini giriniz.
                </p>
              </div>

              <button type="submit" disabled={isPending} style={{ width: '100%', padding: '14px', fontSize: '15px', fontWeight: 700, border: 'none', borderRadius: '14px', cursor: 'pointer', background: 'linear-gradient(135deg, #6366f1, #3b82f6)', color: '#fff', transition: 'all .2s', letterSpacing: '.3px', opacity: isPending ? 0.6 : 1 }}>
                {isPending ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Loader2 size={18} style={{ animation: 'spin 0.8s linear infinite' }} /> Gönderiliyor...
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    Sıfırlama Linki Gönder <Mail size={18} />
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
