'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { login, sendLoginOtp, verifyLoginOtp, loginWithGoogle, resendVerificationEmail } from './actions'
import {
  Mail, Phone, Lock, Eye, EyeOff,
  AlertCircle, ArrowRight, ArrowLeft, CheckCircle2, Loader2, LogIn, RefreshCw
} from 'lucide-react'
import { Suspense } from 'react'

type AuthMode = 'email' | 'phone'
type PhoneStep = 'input' | 'verify'

function LoginForm() {
  const searchParams = useSearchParams()
  const passwordUpdated = searchParams.get('passwordUpdated') === '1'
  const justRegistered = searchParams.get('registered') === '1'

  const [authMode, setAuthMode] = useState<AuthMode>('email')
  const [error, setError] = useState<string | null>(null)
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false)
  const [unconfirmedEmail, setUnconfirmedEmail] = useState('')
  const [resendSent, setResendSent] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isResending, startResend] = useTransition()

  const [phoneStep, setPhoneStep] = useState<PhoneStep>('input')
  const [formattedPhone, setFormattedPhone] = useState('')

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setEmailNotConfirmed(false)
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await login(formData)
      if (result?.error) {
        if (result.emailNotConfirmed) {
          setEmailNotConfirmed(true)
          setUnconfirmedEmail(result.email || '')
        }
        setError(result.error)
      }
    })
  }

  const handleResendVerification = () => {
    startResend(async () => {
      const result = await resendVerificationEmail(unconfirmedEmail)
      if (result.success) {
        setResendSent(true)
        setError(null)
        setEmailNotConfirmed(false)
      } else {
        setError(result.error || 'E-posta gönderilemedi.')
      }
    })
  }

  const handlePhoneSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await sendLoginOtp(formData)
      if (result?.error) {
        setError(result.error)
      } else if (result?.success && result?.phone) {
        setFormattedPhone(result.phone)
        setPhoneStep('verify')
      }
    })
  }

  const handlePhoneVerify = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    formData.set('phone', formattedPhone)
    startTransition(async () => {
      const result = await verifyLoginOtp(formData)
      if (result?.error) setError(result.error)
    })
  }

  const handleGoogleSignIn = () => {
    setError(null)
    startTransition(async () => {
      const result = await loginWithGoogle()
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12 px-4 bg-[linear-gradient(135deg,#0a0a1a_0%,#1a1040_40%,#0d1b2a_100%)]">
      {/* Arka plan dekoratif gradient toplar */}
      <div className="absolute -top-[15%] -left-[10%] w-[550px] h-[550px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.15)_0%,transparent_70%)] animate-pulse" style={{ animationDuration: '5s' }} />
      <div className="absolute -bottom-[10%] -right-[10%] w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.12)_0%,transparent_70%)] animate-pulse" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />

      <div className="w-full max-w-[440px] relative z-10 animate-[fadeIn_0.4s_ease]">
        {/* Şifre güncellendi bildirimi */}
        {passwordUpdated && (
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl mb-4 bg-green-500/10 border border-green-500/25 text-green-300 text-[13px] font-semibold">
            <CheckCircle2 size={16} className="shrink-0" />
            Şifreniz başarıyla güncellendi. Giriş yapabilirsiniz.
          </div>
        )}

        {/* Kayıt başarılı — email doğrulama */}
        {justRegistered && (
          <div className="flex items-start gap-2.5 px-4 py-3.5 rounded-2xl mb-4 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[13px] font-medium">
            <Mail size={16} className="shrink-0 mt-px" />
            <div>
              <p className="m-0 font-bold mb-0.5">Hesabınız oluşturuldu! 🎉</p>
              <p className="m-0 text-indigo-300/80">E-posta adresinize doğrulama linki gönderdik. Lütfen e-postanızı kontrol edip hesabınızı onaylayın, ardından giriş yapın.</p>
            </div>
          </div>
        )}

        {/* Doğrulama e-postası gönderildi */}
        {resendSent && (
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl mb-4 bg-green-500/10 border border-green-500/25 text-green-300 text-[13px] font-semibold">
            <CheckCircle2 size={16} className="shrink-0" />
            Doğrulama e-postası gönderildi! Lütfen gelen kutunuzu kontrol edin.
          </div>
        )}

        {/* LOGO & BAŞLIK */}
        <div className="text-center mb-7">
          <div className="w-16 h-16 rounded-[18px] mx-auto mb-3.5 bg-[linear-gradient(135deg,#6366f1,#3b82f6)] flex items-center justify-center shadow-[0_8px_28px_rgba(99,102,241,0.35)]">
            <LogIn size={30} className="text-white" />
          </div>
          <h1 className="text-white text-2xl font-extrabold mb-1 tracking-[-0.5px]">Tekrar Hoş Geldiniz</h1>
          <p className="text-white/45 text-sm m-0">Hesabınıza güvenli erişim</p>
        </div>

        {/* Glass Card */}
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[28px] shadow-[0_32px_64px_rgba(0,0,0,0.4)] p-8">
          {/* AUTH MODE SEKMELERİ */}
          <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-5">
            <button type="button" onClick={() => { setAuthMode('email'); setError(null); setEmailNotConfirmed(false); setPhoneStep('input') }} className={`flex-1 py-2.5 px-[18px] text-[13px] font-semibold rounded-[10px] cursor-pointer transition-all duration-200 border-none flex items-center justify-center gap-1.5 ${authMode === 'email' ? 'bg-white/10 text-white' : 'bg-transparent text-white/50'}`}>
              <Mail size={14} /> E-posta
            </button>
            <button type="button" onClick={() => { setAuthMode('phone'); setError(null); setEmailNotConfirmed(false); setPhoneStep('input') }} className={`flex-1 py-2.5 px-[18px] text-[13px] font-semibold rounded-[10px] cursor-pointer transition-all duration-200 border-none flex items-center justify-center gap-1.5 ${authMode === 'phone' ? 'bg-white/10 text-white' : 'bg-transparent text-white/50'}`}>
              <Phone size={14} /> Telefon
            </button>
          </div>

          {/* HATA MESAJI */}
          {error && (
            <div className="flex flex-col gap-2 px-4 py-3 rounded-xl mb-[18px] bg-red-500/10 border border-red-500/25 animate-[fadeIn_0.3s_ease]">
              <div className="flex items-center gap-2 text-red-300 text-[13px] font-medium">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </div>
              {/* E-posta doğrulanmamış — tekrar gönder butonu */}
              {emailNotConfirmed && (
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={isResending}
                  className="flex items-center gap-1.5 py-2 px-3.5 bg-indigo-500/20 border border-indigo-500/40 rounded-lg text-indigo-300 text-xs font-bold cursor-pointer w-fit mt-1 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-500/30 transition-colors"
                >
                  {isResending ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
                  Aktivasyon e-postasını tekrar gönder
                </button>
              )}
            </div>
          )}

          {/* E-POSTA FORMU */}
          {authMode === 'email' && (
            <form onSubmit={handleEmailSubmit} className="animate-[fadeIn_0.4s_ease]">
              <div className="mb-3.5">
                <label className="block text-white/60 text-xs font-semibold mb-1.5">E-POSTA VEYA KULLANICI ADI</label>
                <div className="relative">
                  <Mail size={16} className="text-white/35 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input name="emailOrUsername" type="text" required placeholder="ornek@mail.com veya ogrenci_adi" className="w-full py-[13px] pr-3.5 pl-11 bg-white/5 border border-white/10 rounded-2xl text-white text-[15px] font-medium outline-none transition-all duration-200 placeholder:text-white/30 focus:border-indigo-400/70 focus:bg-white/10 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)] box-border" />
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between mb-1.5">
                  <label className="text-white/60 text-xs font-semibold">ŞİFRE</label>
                  <Link href="/sifremi-unuttum" className="text-indigo-400 text-[11px] font-semibold no-underline hover:underline">
                    Şifremi unuttum
                  </Link>
                </div>
                <div className="relative">
                  <Lock size={16} className="text-white/35 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input name="password" type={showPassword ? 'text' : 'password'} required placeholder="••••••••" className="w-full py-[13px] pl-11 pr-11 bg-white/5 border border-white/10 rounded-2xl text-white text-[15px] font-medium outline-none transition-all duration-200 placeholder:text-white/30 focus:border-indigo-400/70 focus:bg-white/10 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)] box-border" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0 text-white/35 hover:text-white/60 transition-colors">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={isPending} className="w-full py-3.5 text-[15px] font-bold rounded-2xl cursor-pointer bg-[linear-gradient(135deg,#6366f1,#3b82f6)] text-white transition-all duration-200 tracking-[0.3px] border-none hover:not-disabled:-translate-y-px hover:not-disabled:shadow-[0_8px_28px_rgba(99,102,241,0.4)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {isPending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Giriş yapılıyor...
                  </>
                ) : (
                  <>
                    Giriş Yap <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TELEFON FORMU */}
          {authMode === 'phone' && phoneStep === 'input' && (
            <form onSubmit={handlePhoneSend} className="animate-[fadeIn_0.4s_ease]">
              <div className="mb-6">
                <label className="block text-white/60 text-xs font-semibold mb-1.5">TELEFON NUMARASI</label>
                <div className="relative">
                  <Phone size={16} className="text-white/35 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input name="phone" type="tel" required placeholder="05XX XXX XX XX" className="w-full py-[13px] pr-3.5 pl-11 bg-white/5 border border-white/10 rounded-2xl text-white text-[15px] font-medium outline-none transition-all duration-200 placeholder:text-white/30 focus:border-indigo-400/70 focus:bg-white/10 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)] box-border" />
                </div>
                <p className="text-[11px] text-white/30 mt-1.5">Telefonunuza bir doğrulama kodu göndereceğiz.</p>
              </div>
              <button type="submit" disabled={isPending} className="w-full py-3.5 text-[15px] font-bold rounded-2xl cursor-pointer bg-[linear-gradient(135deg,#6366f1,#3b82f6)] text-white transition-all duration-200 tracking-[0.3px] border-none hover:not-disabled:-translate-y-px hover:not-disabled:shadow-[0_8px_28px_rgba(99,102,241,0.4)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {isPending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> SMS gönderiliyor...
                  </>
                ) : (
                  <>
                    Doğrulama Kodu Gönder <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TELEFON OTP DOĞRULAMA */}
          {authMode === 'phone' && phoneStep === 'verify' && (
            <form onSubmit={handlePhoneVerify} className="animate-[fadeIn_0.4s_ease]">
              <div className="text-center mb-5">
                <div className="w-14 h-14 rounded-2xl mx-auto mb-3 bg-green-500/10 flex items-center justify-center">
                  <Phone size={24} className="text-green-500" />
                </div>
                <p className="text-white/70 text-sm font-medium">
                  <span className="text-green-500 font-bold">{formattedPhone}</span> numarasına gönderilen kodu girin.
                </p>
              </div>
              <div className="mb-6">
                <input name="token" required maxLength={6} pattern="[0-9]{6}" placeholder="• • • • • •"
                  className="w-full p-[18px] bg-white/5 border border-white/10 rounded-2xl text-white text-[28px] font-extrabold text-center tracking-[12px] outline-none box-border placeholder:text-white/20 focus:border-green-500/50 focus:bg-white/10 transition-all" />
              </div>
              <button type="submit" disabled={isPending} className="w-full py-3.5 text-[15px] font-bold rounded-2xl cursor-pointer bg-[linear-gradient(135deg,#22c55e,#10b981)] text-white transition-all duration-200 tracking-[0.3px] border-none hover:not-disabled:-translate-y-px hover:not-disabled:shadow-[0_8px_28px_rgba(34,197,94,0.4)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {isPending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Doğrulanıyor...
                  </>
                ) : (
                  <>
                    Giriş Yap <CheckCircle2 size={18} />
                  </>
                )}
              </button>
              <button type="button" onClick={() => { setPhoneStep('input'); setError(null) }}
                className="w-full mt-3 py-2.5 bg-transparent border-none text-white/40 cursor-pointer text-[13px] font-medium flex items-center justify-center gap-1.5 hover:text-white/60 transition-colors">
                <ArrowLeft size={14} /> Farklı numara gir
              </button>
            </form>
          )}

          {/* AYIRICI */}
          <div className="flex items-center gap-3 my-[22px]">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/25 text-xs font-medium whitespace-nowrap">veya</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* GOOGLE BUTONU */}
          <button type="button" onClick={handleGoogleSignIn} disabled={isPending} className="w-full py-[13px] text-sm font-semibold rounded-2xl cursor-pointer bg-white/5 border border-white/10 text-white transition-all duration-200 flex items-center justify-center gap-2.5 hover:bg-white/10 hover:border-white/20 disabled:opacity-60 disabled:cursor-not-allowed">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google ile Giriş Yap
          </button>
        </div>

        {/* ALT LİNK */}
        <div className="text-center mt-6">
          <p className="text-white/35 text-sm">
            Hesabınız yok mu?{' '}
            <Link href="/kayit-ol" className="text-indigo-400 font-semibold no-underline hover:underline">Kayıt Ol</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[linear-gradient(135deg,#0a0a1a,#1a1040)]"><Loader2 className="animate-spin text-white" size={32} /></div>}>
      <LoginForm />
    </Suspense>
  )
}