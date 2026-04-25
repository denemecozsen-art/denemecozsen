'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getStudentForVeli, updateStudent } from './actions'
import {
  UserPlus, Mail, Lock, Eye, EyeOff, User, GraduationCap,
  CheckCircle2, Loader2, ArrowLeft, AlertCircle, Info, BookOpen, Save
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function OgrenciDuzenlePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const studentId = searchParams.get('id')

  const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const [student, setStudent] = useState<any>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [levels, setLevels] = useState<any[]>([])
  const [examTypes, setExamTypes] = useState<any[]>([])

  useEffect(() => {
    if (!studentId) {
      router.push('/veli/ogrenciler')
      return
    }

    async function loadData() {
      try {
        const [studentRes, lvl, exam] = await Promise.all([
          getStudentForVeli(studentId!),
          fetch('/api/lookups?table=levels').then(r => r.json()),
          fetch('/api/lookups?table=exam_types').then(r => r.json()),
        ])

        if (studentRes?.error) {
          setError(studentRes.error)
        } else {
          setStudent(studentRes.student)
        }
        
        setLevels(Array.isArray(lvl) ? lvl : [])
        setExamTypes(Array.isArray(exam) ? exam : [])
        setLoading(false)
      } catch (err) {
        setError('Veriler yüklenirken bir sorun oluştu.')
        setLoading(false)
      }
    }
    loadData()
  }, [studentId, router])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    formData.append('studentId', studentId!)
    
    startTransition(async () => {
      const result = await updateStudent(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setTimeout(() => router.push('/veli/ogrenciler'), 2000)
      }
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
      </div>
    )
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 bg-card rounded-[2.5rem] border border-border p-8 text-center animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-black text-foreground">Öğrenci Başarıyla Güncellendi!</h2>
        <p className="text-muted-foreground font-medium">Öğrencilerim sayfasına yönlendiriliyorsunuz...</p>
        <Loader2 className="w-6 h-6 text-emerald-500 animate-spin mt-4" />
      </div>
    )
  }

  if (!student && error) {
    return (
      <div className="max-w-3xl mx-auto pb-12">
        <div className="flex items-center gap-3 p-6 rounded-[2.5rem] bg-destructive/10 border border-destructive/20 text-destructive font-bold text-center justify-center">
          <AlertCircle className="w-6 h-6" /> {error}
        </div>
        <div className="text-center mt-6">
           <Link href="/veli/ogrenciler">
              <Button>Öğrencilerime Dön</Button>
           </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* BAŞLIK */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/veli/ogrenciler">
          <Button variant="outline" size="icon" className="rounded-2xl w-12 h-12 border-2 hover:bg-muted/50 transition-colors">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-black text-foreground mb-1">Öğrenciyi Düzenle</h2>
          <p className="text-sm font-bold text-muted-foreground">{student?.first_name} {student?.last_name} adlı öğrencinin profil bilgilerini güncelliyorsunuz.</p>
        </div>
      </div>

      {/* HATA MESAJI */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl mb-8 bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* KİŞİSEL BİLGİLER KARTI */}
        <div className="bg-card border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] rounded-[2.5rem] p-8 md:p-10">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border/50">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
              <User className="w-5 h-5 text-pink-600" />
            </div>
            <h3 className="text-xl font-black text-foreground">Kişisel Bilgiler</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-muted-foreground uppercase tracking-wider">Ad 
                <span className="text-destructive inline-block ml-1">*</span>
              </label>
              <input 
                name="firstName" 
                defaultValue={student?.first_name}
                required 
                className="w-full px-4 py-3.5 bg-muted/30 border-2 border-border/60 rounded-2xl text-sm font-bold text-foreground focus:outline-none focus:border-pink-500/50 focus:ring-4 focus:ring-pink-500/10 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-muted-foreground uppercase tracking-wider">Soyad 
                <span className="text-destructive inline-block ml-1">*</span>
              </label>
              <input 
                name="lastName" 
                defaultValue={student?.last_name}
                required 
                className="w-full px-4 py-3.5 bg-muted/30 border-2 border-border/60 rounded-2xl text-sm font-bold text-foreground focus:outline-none focus:border-pink-500/50 focus:ring-4 focus:ring-pink-500/10 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <label className="text-xs font-black text-muted-foreground uppercase tracking-wider">Kullanıcı Adı 
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Mail className="w-5 h-5" />
              </div>
              <input 
                name="username" 
                defaultValue={student?.username || ''}
                className="w-full pl-12 pr-4 py-3.5 bg-muted/30 border-2 border-border/60 rounded-2xl text-sm font-bold text-foreground focus:outline-none focus:border-pink-500/50 focus:ring-4 focus:ring-pink-500/10 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-muted-foreground uppercase tracking-wider">Şifreyi Değiştir (İsteğe Bağlı)
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Lock className="w-5 h-5" />
              </div>
              <input 
                name="password" 
                type={showPassword ? "text" : "password"}
                minLength={6}
                placeholder="Yeni şifre belirlemek için doldurun, aksi halde boş bırakın" 
                className="w-full pl-12 pr-12 py-3.5 bg-muted/30 border-2 border-border/60 rounded-2xl text-sm font-bold text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-pink-500/50 focus:ring-4 focus:ring-pink-500/10 transition-all"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ÖĞRENCİ BİLGİLERİ KARTI */}
        <div className="bg-card border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] rounded-[2.5rem] p-8 md:p-10">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border/50">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-violet-600" />
            </div>
            <h3 className="text-xl font-black text-foreground">Sınıf & Sınav Bilgileri</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-muted-foreground uppercase tracking-wider">Öğrencinin Sınıfı</label>
              <select name="levelId" defaultValue={student?.level_id || ''} className="w-full px-4 py-3.5 bg-muted/30 border-2 border-border/60 rounded-2xl text-sm font-bold text-foreground focus:outline-none focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10 transition-all appearance-none cursor-pointer">
                <option value="">Sınıf seçin...</option>
                {levels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-muted-foreground uppercase tracking-wider">Hedef Sınav Türü</label>
              <select name="examType" defaultValue={student?.exam_type || ''} className="w-full px-4 py-3.5 bg-muted/30 border-2 border-border/60 rounded-2xl text-sm font-bold text-foreground focus:outline-none focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10 transition-all appearance-none cursor-pointer">
                <option value="">Sınav türü seçin...</option>
                {examTypes.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* KAYDET BUTONU */}
        <Button 
          type="submit" 
          disabled={isPending}
          className="w-full h-16 rounded-[1.5rem] bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 text-white font-black text-lg shadow-[0_8px_30px_rgb(236,72,153,0.25)] hover:shadow-[0_8px_30px_rgb(236,72,153,0.4)] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending ? (
             <><Loader2 className="w-6 h-6 animate-spin" /> Güncelleniyor...</>
          ) : (
             <><Save className="w-6 h-6" /> Değişiklikleri Kaydet</>
          )}
        </Button>

      </form>
    </div>
  )
}
