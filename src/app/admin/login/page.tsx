"use client"

import { useState, useTransition } from 'react'
import { adminLogin } from './actions'
import { Shield, Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react'

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await adminLogin(formData)
      if (result?.error) {
        if (result.error.includes('Invalid login credentials')) {
          setError('E-posta veya şifre hatalı. Lütfen tekrar deneyin.')
        } else {
          setError('Giriş başarısız. Lütfen tekrar deneyin.')
        }
      }
    })
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      }}
    >
      {/* Animated background orbs */}
      <div
        style={{
          position: 'absolute', top: '-10%', left: '-10%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)',
          animation: 'pulse 4s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute', bottom: '-10%', right: '-10%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)',
          animation: 'pulse 5s ease-in-out infinite reverse',
        }}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .card-animate { animation: fadeInUp 0.5s ease forwards; font-family: 'Inter', sans-serif; }
        .shake { animation: shake 0.4s ease; }
        .input-field {
          width: 100%; padding: 12px 14px 12px 44px;
          background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px; color: #fff; font-size: 15px; outline: none;
          transition: all 0.2s; box-sizing: border-box;
        }
        .input-field::placeholder { color: rgba(255,255,255,0.35); }
        .input-field:focus { border-color: rgba(99,102,241,0.8); background: rgba(255,255,255,0.1); box-shadow: 0 0 0 3px rgba(99,102,241,0.15); }
        .btn-login {
          width: 100%; padding: 13px; font-size: 15px; font-weight: 700;
          border: none; border-radius: 12px; cursor: pointer;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: #fff; transition: all 0.2s; letter-spacing: 0.3px;
        }
        .btn-login:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 25px rgba(99,102,241,0.45); }
        .btn-login:active:not(:disabled) { transform: translateY(0); }
        .btn-login:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>

      <div className="card-animate" style={{ width: '100%', maxWidth: '420px', padding: '0 20px', position: 'relative', zIndex: 10 }}>
        {/* Logo / Brand */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '72px', height: '72px', borderRadius: '20px', margin: '0 auto 16px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
            }}
          >
            <Shield size={36} color="#fff" />
          </div>
          <h1 style={{ color: '#fff', fontSize: '26px', fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.5px' }}>
            Çözsen Admin
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: 0 }}>
            Yönetim paneline güvenli erişim
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '24px',
            padding: '36px 32px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
          }}
        >
          {/* Error */}
          {error && (
            <div
              className={error ? 'shake' : ''}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 16px', borderRadius: '12px', marginBottom: '20px',
                background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                color: '#fca5a5', fontSize: '14px',
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email field */}
            <div style={{ marginBottom: '16px', position: 'relative' }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: 500, marginBottom: '8px', letterSpacing: '0.3px' }}>
                YÖNETİCİ E-POSTA
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  color="rgba(255,255,255,0.4)"
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  placeholder="admin@cozsen.com"
                  required
                  className="input-field"
                />
              </div>
            </div>

            {/* Password field */}
            <div style={{ marginBottom: '28px', position: 'relative' }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: 500, marginBottom: '8px', letterSpacing: '0.3px' }}>
                GÜVENLİK ŞİFRESİ
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  color="rgba(255,255,255,0.4)"
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  required
                  className="input-field"
                  style={{ paddingRight: '44px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'rgba(255,255,255,0.4)',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isPending} className="btn-login">
              {isPending ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 0.8s linear infinite' }}>
                    <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" opacity="0.3" />
                    <path d="M21 12a9 9 0 0 0-9-9" />
                  </svg>
                  Doğrulanıyor...
                </span>
              ) : (
                'Yönetim Paneline Giriş Yap'
              )}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '13px', marginTop: '24px' }}>
          Bu alan yalnızca yetkili yöneticiler içindir.
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
