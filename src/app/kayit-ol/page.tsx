'use client'

import { useState, useEffect, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signup } from './actions'
import {
  GraduationCap, Users, Mail, Lock, Eye, EyeOff,
  AlertCircle, ArrowRight, ArrowLeft, CheckCircle2, Loader2, ShieldCheck,
  BookOpen, User, UserPlus, Phone, Plus, Trash2
} from 'lucide-react'

type UserRole = 'student' | 'parent'
type Step = 1 | 2 | 3

type StudentEntry = {
  firstName: string; lastName: string; usernameOrEmail: string; password: string;
  levelId: string; examType: string;
}

export default function RegisterPage() {
  const router = useRouter()
  const [role, setRole] = useState<UserRole>('student')
  const [step, setStep] = useState<Step>(1)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Adım 1 — Kişisel Bilgiler
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Adım 2 — Öğrenci Detayları (role=student)
  const [levelId, setLevelId] = useState('')
  const [levelName, setLevelName] = useState('')
  const [examType, setExamType] = useState('')
  const [parentName, setParentName] = useState('')
  const [parentPhone, setParentPhone] = useState('')
  const [levels, setLevels] = useState<any[]>([])
  const [examTypes, setExamTypes] = useState<any[]>([])

  // Adım 2 — Veli: Öğrenci ekleme
  const [studentCount, setStudentCount] = useState(1)
  const [addStudentsNow, setAddStudentsNow] = useState(false)
  const [students, setStudents] = useState<StudentEntry[]>([])
  const [registrationDone, setRegistrationDone] = useState(false)

  const PARENT_OPTIONAL_LEVELS = ['12', 'Mezun', 'TYT', 'AYT', 'YKS']

  useEffect(() => {
    async function load() {
      try {
        const [lvl, exam] = await Promise.all([
          fetch('/api/lookups?table=levels').then(r => r.json()),
          fetch('/api/lookups?table=exam_types').then(r => r.json()),
        ])
        setLevels(Array.isArray(lvl) ? lvl : [])
        setExamTypes(Array.isArray(exam) ? exam : [])
      } catch { /* hata durumunda boş bırak */ }
    }
    load()
  }, [])

  const isParentOptionalLevel = PARENT_OPTIONAL_LEVELS.some(l => levelName?.includes(l))
  const parentRequired = !isParentOptionalLevel && role === 'student'

  const validateStep1 = () => {
    if (!firstName.trim() || !lastName.trim()) return 'Ad ve soyad zorunludur.'
    if (!email.trim()) return 'E-posta zorunludur.'
    if (!password || password.length < 6) return 'Şifre en az 6 karakter olmalıdır.'
    if (password !== confirmPassword) return 'Şifreler eşleşmiyor.'
    return null
  }

  const handleNextStep = () => {
    setError(null)
    const err = validateStep1()
    if (err) { setError(err); return }
    // Veli için öğrenci ekleme listesini hazırla
    if (role === 'parent') {
      const initial: StudentEntry[] = Array.from({ length: studentCount }, () => ({
        firstName: '', lastName: '', usernameOrEmail: '', password: '',
        levelId: '', examType: '',
      }))
      setStudents(initial)
    }
    setStep(2)
  }

  // Öğrenci entry güncelle
  function updateStudent(idx: number, field: keyof StudentEntry, val: string) {
    setStudents(prev => prev.map((s, i) => i === idx ? { ...s, [field]: val } : s))
  }
  function addStudentEntry() {
    setStudents(prev => [...prev, { firstName: '', lastName: '', usernameOrEmail: '', password: '', levelId: '', examType: '' }])
    setStudentCount(prev => prev + 1)
  }
  function removeStudentEntry(idx: number) {
    if (students.length <= 1) return
    setStudents(prev => prev.filter((_, i) => i !== idx))
    setStudentCount(prev => prev - 1)
  }

  const handleSubmit = () => {
    setError(null)
    if (role === 'student' && !levelId) {
      setError('Lütfen sınıfınızı seçin.')
      return
    }
    if (role === 'student' && parentRequired && !parentName.trim()) {
      setError('Veli adı soyadı zorunludur.')
      return
    }

    // Veli + öğrenci ekleme validasyonu
    if (role === 'parent' && addStudentsNow) {
      for (let i = 0; i < students.length; i++) {
        const s = students[i]
        if (!s.firstName.trim() || !s.lastName.trim()) {
          setError(`${i + 1}. öğrencinin adı ve soyadı zorunludur.`)
          return
        }
        if (!s.usernameOrEmail.trim()) {
          setError(`${i + 1}. öğrencinin kullanıcı adı/e-postası zorunludur.`)
          return
        }
        if (!s.password || s.password.length < 6) {
          setError(`${i + 1}. öğrencinin şifresi en az 6 karakter olmalıdır.`)
          return
        }
      }
    }

    const formData = new FormData()
    formData.set('firstName', firstName)
    formData.set('lastName', lastName)
    formData.set('email', email)
    formData.set('password', password)
    formData.set('role', role)
    if (role === 'student') {
      formData.set('levelId', levelId)
      formData.set('examType', examType)
      formData.set('parentName', parentName)
      formData.set('parentPhone', parentPhone)
    }
    if (role === 'parent' && addStudentsNow) {
      formData.set('students', JSON.stringify(students))
    }

    startTransition(async () => {
      const result = await signup(formData)
      if (result?.error) setError(result.error)
      // signup action redirects on success
    })
  }

  const commonStyles = `
    @keyframes pulse{0%,100%{transform:scale(1);opacity:.7}50%{transform:scale(1.08);opacity:1}}
    @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    @keyframes spin{to{transform:rotate(360deg)}}
    .fade-in{animation:fadeIn .35s ease}
    .glass-card{background:rgba(255,255,255,0.04);backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,0.08);border-radius:28px;box-shadow:0 32px 64px rgba(0,0,0,0.4)}
    .inp{width:100%;padding:12px 14px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:12px;color:#fff;font-size:14px;outline:none;transition:all .2s;box-sizing:border-box;font-weight:500}
    .inp::placeholder{color:rgba(255,255,255,0.3)}
    .inp:focus{border-color:rgba(99,102,241,0.7);background:rgba(255,255,255,0.09);box-shadow:0 0 0 3px rgba(99,102,241,0.12)}
    .inp-icon{width:100%;padding:12px 14px 12px 40px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:12px;color:#fff;font-size:14px;outline:none;transition:all .2s;box-sizing:border-box;font-weight:500}
    .inp-icon::placeholder{color:rgba(255,255,255,0.3)}
    .inp-icon:focus{border-color:rgba(99,102,241,0.7);background:rgba(255,255,255,0.09);box-shadow:0 0 0 3px rgba(99,102,241,0.12)}
    .sel{width:100%;padding:12px 14px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:12px;color:#fff;font-size:14px;outline:none;transition:all .2s;box-sizing:border-box;font-weight:500;cursor:pointer;appearance:none;-webkit-appearance:none}
    .sel:focus{border-color:rgba(99,102,241,0.7);box-shadow:0 0 0 3px rgba(99,102,241,0.12)}
    .sel option{background:#1a1040;color:#fff}
    .btn-p{width:100%;padding:14px;font-size:15px;font-weight:700;border:none;border-radius:14px;cursor:pointer;color:#fff;transition:all .2s;letter-spacing:.3px}
    .btn-p:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 8px 28px rgba(99,102,241,0.4)}
    .btn-p:disabled{opacity:.6;cursor:not-allowed}
    .role-card{flex:1;padding:20px 16px;border-radius:18px;cursor:pointer;transition:all .3s;text-align:center;border:2px solid transparent;position:relative}
    .role-card.a-s{background:rgba(99,102,241,0.12);border-color:rgba(99,102,241,0.5);box-shadow:0 4px 20px rgba(99,102,241,0.2)}
    .role-card.a-p{background:rgba(236,72,153,0.12);border-color:rgba(236,72,153,0.5);box-shadow:0 4px 20px rgba(236,72,153,0.2)}
    .role-card:not(.a-s):not(.a-p){background:rgba(255,255,255,0.03);border-color:rgba(255,255,255,0.08)}
    .lbl{display:block;color:rgba(255,255,255,0.6);font-size:11px;font-weight:700;margin-bottom:6px;text-transform:uppercase;letter-spacing:.8px}
  `

  const grad = role === 'parent' ? 'linear-gradient(135deg,#ec4899,#a855f7)' : 'linear-gradient(135deg,#6366f1,#3b82f6)'

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12 px-4" style={{ background:'linear-gradient(135deg,#0a0a1a 0%,#1a1040 40%,#0d1b2a 100%)' }}>
      <style>{commonStyles}</style>
      <div style={{ position:'absolute',top:'-15%',right:'-10%',width:'600px',height:'600px',borderRadius:'50%',background:role==='parent'?'radial-gradient(circle,rgba(236,72,153,0.15) 0%,transparent 70%)':'radial-gradient(circle,rgba(99,102,241,0.15) 0%,transparent 70%)',animation:'pulse 5s ease-in-out infinite',transition:'background .5s' }} />
      <div style={{ position:'absolute',bottom:'-10%',left:'-10%',width:'500px',height:'500px',borderRadius:'50%',background:role==='parent'?'radial-gradient(circle,rgba(168,85,247,0.12) 0%,transparent 70%)':'radial-gradient(circle,rgba(59,130,246,0.12) 0%,transparent 70%)',animation:'pulse 6s ease-in-out infinite reverse',transition:'background .5s' }} />

      <div className="fade-in" style={{ width:'100%',maxWidth:'520px',position:'relative',zIndex:10 }}>

        {/* LOGO */}
        <div style={{ textAlign:'center',marginBottom:'24px' }}>
          <div style={{ width:'64px',height:'64px',borderRadius:'18px',margin:'0 auto 14px',background:grad,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:role==='parent'?'0 8px 28px rgba(236,72,153,0.35)':'0 8px 28px rgba(99,102,241,0.35)',transition:'all .4s' }}>
            {role==='parent'?<Users size={30} color="#fff"/>:<GraduationCap size={30} color="#fff"/>}
          </div>
          <h1 style={{ color:'#fff',fontSize:'24px',fontWeight:800,margin:'0 0 4px',letterSpacing:'-0.5px' }}>Çözsen&apos;e Katıl</h1>
          <p style={{ color:'rgba(255,255,255,0.45)',fontSize:'14px',margin:0 }}>{role==='parent'?'Çocuğunuzun eğitimini yakından takip edin':'Hedeflerine ulaşmak için ilk adımı at'}</p>
        </div>

        {/* ADIM GÖSTERGESİ */}
        <div style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',marginBottom:'20px' }}>
          {[1,2].map(s=>(
            <div key={s} style={{ display:'flex',alignItems:'center',gap:'8px' }}>
              <div style={{ display:'flex',alignItems:'center',justifyContent:'center',width:'36px',height:'36px',borderRadius:'50%',fontSize:'13px',fontWeight:800,transition:'all .3s',background:step>=s?grad:'rgba(255,255,255,0.08)',color:step>=s?'#fff':'rgba(255,255,255,0.3)',boxShadow:step===s?'0 4px 16px rgba(99,102,241,0.4)':'none' }}>
                {step>s?<CheckCircle2 size={16}/>:s}
              </div>
              <span style={{ fontSize:'11px',fontWeight:600,color:step>=s?'rgba(255,255,255,0.7)':'rgba(255,255,255,0.25)' }}>
                {s===1?'Kişisel Bilgiler':(role==='student'?'Öğrenci Bilgileri':'Öğrenci Kayıtları')}
              </span>
              {s<2&&<div style={{ width:'32px',height:'2px',background:step>s?grad:'rgba(255,255,255,0.1)',borderRadius:'2px',transition:'background .3s' }}/>}
            </div>
          ))}
        </div>

        <div className="glass-card" style={{ padding:'32px 28px' }}>

          {/* ROL SEÇİMİ (sadece step 1) */}
          {step===1&&(
            <div style={{ display:'flex',gap:'12px',marginBottom:'24px' }}>
              <div onClick={()=>setRole('student')} className={`role-card ${role==='student'?'a-s':''}`}>
                <GraduationCap size={28} style={{ margin:'0 auto 8px',color:role==='student'?'#818cf8':'rgba(255,255,255,0.3)',transition:'color .3s' }}/>
                <div style={{ fontSize:'14px',fontWeight:700,color:role==='student'?'#fff':'rgba(255,255,255,0.5)',transition:'color .3s' }}>Öğrenci</div>
                <div style={{ fontSize:'11px',color:'rgba(255,255,255,0.3)',marginTop:'4px' }}>Deneme çöz, sonuç takip et</div>
                {role==='student'&&<div style={{ position:'absolute',top:'8px',right:'8px' }}><CheckCircle2 size={16} color="#818cf8"/></div>}
              </div>
              <div onClick={()=>setRole('parent')} className={`role-card ${role==='parent'?'a-p':''}`}>
                <Users size={28} style={{ margin:'0 auto 8px',color:role==='parent'?'#f472b6':'rgba(255,255,255,0.3)',transition:'color .3s' }}/>
                <div style={{ fontSize:'14px',fontWeight:700,color:role==='parent'?'#fff':'rgba(255,255,255,0.5)',transition:'color .3s' }}>Veli</div>
                <div style={{ fontSize:'11px',color:'rgba(255,255,255,0.3)',marginTop:'4px' }}>Gelişimi izleyin</div>
                {role==='parent'&&<div style={{ position:'absolute',top:'8px',right:'8px' }}><CheckCircle2 size={16} color="#f472b6"/></div>}
              </div>
            </div>
          )}

          {/* HATA */}
          {error&&(
            <div style={{ display:'flex',alignItems:'center',gap:'10px',padding:'12px 16px',borderRadius:'12px',marginBottom:'18px',background:'rgba(239,68,68,0.12)',border:'1px solid rgba(239,68,68,0.25)',color:'#fca5a5',fontSize:'13px',fontWeight:500,animation:'fadeIn .3s ease' }}>
              <AlertCircle size={16} style={{ flexShrink:0 }}/>{error}
            </div>
          )}

          {/* ===== ADIM 1: KİŞİSEL BİLGİLER ===== */}
          {step===1&&(
            <div className="fade-in">
              <div style={{ display:'flex',gap:'10px',marginBottom:'14px' }}>
                <div style={{ flex:1 }}>
                  <label className="lbl">Ad *</label>
                  <input value={firstName} onChange={e=>setFirstName(e.target.value)} placeholder="Adınız" className="inp"/>
                </div>
                <div style={{ flex:1 }}>
                  <label className="lbl">Soyad *</label>
                  <input value={lastName} onChange={e=>setLastName(e.target.value)} placeholder="Soyadınız" className="inp"/>
                </div>
              </div>
              <div style={{ marginBottom:'14px' }}>
                <label className="lbl">E-posta *</label>
                <div style={{ position:'relative' }}>
                  <Mail size={16} color="rgba(255,255,255,0.35)" style={{ position:'absolute',left:'13px',top:'50%',transform:'translateY(-50%)' }}/>
                  <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="ornek@mail.com" className="inp-icon"/>
                </div>
              </div>
              <div style={{ marginBottom:'14px' }}>
                <label className="lbl">Şifre *</label>
                <div style={{ position:'relative' }}>
                  <Lock size={16} color="rgba(255,255,255,0.35)" style={{ position:'absolute',left:'13px',top:'50%',transform:'translateY(-50%)' }}/>
                  <input value={password} onChange={e=>setPassword(e.target.value)} type={showPassword?'text':'password'} minLength={6} placeholder="En az 6 karakter" className="inp-icon" style={{ paddingRight:'44px' }}/>
                  <button type="button" onClick={()=>setShowPassword(!showPassword)} style={{ position:'absolute',right:'14px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.35)' }}>
                    {showPassword?<EyeOff size={16}/>:<Eye size={16}/>}
                  </button>
                </div>
              </div>
              <div style={{ marginBottom:'24px' }}>
                <label className="lbl">Şifre (Tekrar) *</label>
                <div style={{ position:'relative' }}>
                  <ShieldCheck size={16} color="rgba(255,255,255,0.35)" style={{ position:'absolute',left:'13px',top:'50%',transform:'translateY(-50%)' }}/>
                  <input value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} type={showPassword?'text':'password'} placeholder="Şifrenizi tekrar girin" className="inp-icon"/>
                </div>
              </div>
              <button type="button" onClick={handleNextStep} className="btn-p" style={{ background:grad }}>
                <span style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:'8px' }}>Devam Et <ArrowRight size={18}/></span>
              </button>
            </div>
          )}

          {/* ===== ADIM 2: ÖĞRENCİ BİLGİLERİ (student) ===== */}
          {step===2&&role==='student'&&(
            <div className="fade-in">
              <div style={{ marginBottom:'8px',display:'flex',alignItems:'center',gap:'8px',color:'rgba(255,255,255,0.5)',fontSize:'12px' }}>
                <BookOpen size={14}/> Öğrenci bilgilerini tamamlayın
              </div>
              <div style={{ marginBottom:'14px' }}>
                <label className="lbl">Sınıf / Şube *</label>
                <select value={levelId} onChange={e=>{setLevelId(e.target.value);setLevelName(e.target.options[e.target.selectedIndex].text)}} className="sel">
                  <option value="">Sınıf seçin...</option>
                  {levels.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
              <div style={{ marginBottom:'14px' }}>
                <label className="lbl">Sınav Türü (Puan hesabı için)</label>
                <select value={examType} onChange={e=>setExamType(e.target.value)} className="sel">
                  <option value="">Sınav türü seçin...</option>
                  {examTypes.map(t=><option key={t.id} value={t.name}>{t.name}</option>)}
                </select>
              </div>
              <div style={{ marginBottom:'14px' }}>
                <label className="lbl">Veli Adı Soyadı {parentRequired?'*':'(Opsiyonel)'}</label>
                <div style={{ position:'relative' }}>
                  <User size={16} color="rgba(255,255,255,0.35)" style={{ position:'absolute',left:'13px',top:'50%',transform:'translateY(-50%)' }}/>
                  <input value={parentName} onChange={e=>setParentName(e.target.value)} placeholder="Annenizin / Babanızın adı soyadı" className="inp-icon"/>
                </div>
              </div>
              <div style={{ marginBottom:'24px' }}>
                <label className="lbl">Veli Telefonu (Opsiyonel)</label>
                <div style={{ position:'relative' }}>
                  <Phone size={16} color="rgba(255,255,255,0.35)" style={{ position:'absolute',left:'13px',top:'50%',transform:'translateY(-50%)' }}/>
                  <input value={parentPhone} onChange={e=>setParentPhone(e.target.value)} type="tel" placeholder="05XX XXX XX XX" className="inp-icon"/>
                </div>
              </div>
              <div style={{ display:'flex',gap:'10px' }}>
                <button type="button" onClick={()=>{setStep(1);setError(null)}} style={{ padding:'14px 20px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'14px',color:'rgba(255,255,255,0.6)',fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:'6px',fontSize:'14px' }}>
                  <ArrowLeft size={16}/> Geri
                </button>
                <button type="button" onClick={handleSubmit} disabled={isPending} className="btn-p" style={{ background:grad,flex:1 }}>
                  {isPending?<span style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:'8px' }}><Loader2 size={18} style={{ animation:'spin .8s linear infinite' }}/> Kayıt yapılıyor...</span>
                  :<span style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:'8px' }}>Hesap Oluştur <CheckCircle2 size={18}/></span>}
                </button>
              </div>
            </div>
          )}

          {/* ===== ADIM 2: VELİ — ÖĞRENCİ EKLEME ===== */}
          {step===2&&role==='parent'&&(
            <div className="fade-in">

              {/* Seçim: Şimdi mi panelde mi? */}
              {!addStudentsNow ? (
                <>
                  <div style={{ marginBottom:'20px',padding:'16px',background:'rgba(236,72,153,0.08)',border:'1px solid rgba(236,72,153,0.2)',borderRadius:'14px' }}>
                    <p style={{ color:'#f472b6',fontSize:'13px',fontWeight:700,margin:'0 0 6px' }}>Hesabınız neredeyse hazır! 🎉</p>
                    <p style={{ color:'rgba(255,255,255,0.5)',fontSize:'12px',margin:0,lineHeight:1.6 }}>
                      İsterseniz şimdi öğrenci(lerinizi) ekleyin, dilerseniz panelde sonra ekleyin.
                    </p>
                  </div>

                  <div style={{ marginBottom:'20px' }}>
                    <label className="lbl">Kaç Öğrenciniz Var?</label>
                    <div style={{ display:'flex',gap:'8px' }}>
                      {[1,2,3,4,5].map(n=>(
                        <button key={n} type="button" onClick={()=>{ setStudentCount(n); setStudents(Array.from({length:n},()=>({firstName:'',lastName:'',usernameOrEmail:'',password:'',levelId:'',examType:''}))) }}
                          style={{ flex:1,padding:'12px 0',border:`2px solid ${studentCount===n?'rgba(236,72,153,0.6)':'rgba(255,255,255,0.1)'}`,borderRadius:'12px',background:studentCount===n?'rgba(236,72,153,0.15)':'rgba(255,255,255,0.04)',color:studentCount===n?'#f472b6':'rgba(255,255,255,0.4)',fontWeight:800,fontSize:'15px',cursor:'pointer',transition:'all .2s' }}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display:'flex',gap:'10px',marginBottom:'12px' }}>
                    <button type="button" onClick={()=>{setStep(1);setError(null)}} style={{ padding:'14px 20px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'14px',color:'rgba(255,255,255,0.6)',fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:'6px',fontSize:'14px' }}>
                      <ArrowLeft size={16}/> Geri
                    </button>
                    <button type="button" onClick={()=>setAddStudentsNow(true)} className="btn-p" style={{ background:grad,flex:1 }}>
                      <span style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:'8px' }}>
                        <UserPlus size={18}/> Şimdi Öğrenci Ekle
                      </span>
                    </button>
                  </div>

                  <button type="button" onClick={handleSubmit} disabled={isPending} style={{ width:'100%',padding:'12px',background:'none',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'12px',color:'rgba(255,255,255,0.5)',fontWeight:600,cursor:'pointer',fontSize:'13px',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px',transition:'all .2s' }}>
                    {isPending?<><Loader2 size={14} style={{ animation:'spin .8s linear infinite' }}/> Kayıt yapılıyor...</>:<>Atla — Panelde Sonra Eklerim <ArrowRight size={14}/></>}
                  </button>
                </>
              ) : (
                <>
                  {/* ÖĞRENCİ FORMLARI */}
                  <p style={{ color:'rgba(255,255,255,0.6)',fontSize:'12px',fontWeight:600,marginBottom:'16px' }}>
                    {students.length} öğrenci bilgilerini doldurun. Kayıt sonrası bu öğrenciler sisteme eklenecektir.
                  </p>

                  <div style={{ maxHeight:'400px',overflowY:'auto',paddingRight:'4px',marginBottom:'16px' }}>
                    {students.map((s,idx)=>(
                      <div key={idx} style={{ background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'16px',padding:'16px',marginBottom:'12px' }}>
                        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px' }}>
                          <span style={{ color:'#f472b6',fontSize:'12px',fontWeight:800,textTransform:'uppercase' }}>
                            {idx+1}. Öğrenci
                          </span>
                          {students.length>1&&(
                            <button type="button" onClick={()=>removeStudentEntry(idx)} style={{ background:'none',border:'none',cursor:'pointer',color:'rgba(239,68,68,0.7)',padding:'4px' }}>
                              <Trash2 size={14}/>
                            </button>
                          )}
                        </div>

                        <div style={{ display:'flex',gap:'8px',marginBottom:'10px' }}>
                          <input value={s.firstName} onChange={e=>updateStudent(idx,'firstName',e.target.value)} placeholder="Ad *" className="inp" style={{ flex:1 }}/>
                          <input value={s.lastName} onChange={e=>updateStudent(idx,'lastName',e.target.value)} placeholder="Soyad *" className="inp" style={{ flex:1 }}/>
                        </div>
                        <div style={{ marginBottom:'10px' }}>
                          <input value={s.usernameOrEmail} onChange={e=>updateStudent(idx,'usernameOrEmail',e.target.value)} placeholder="Kullanıcı adı veya e-posta *" className="inp"/>
                        </div>
                        <div style={{ marginBottom:'10px' }}>
                          <input value={s.password} onChange={e=>updateStudent(idx,'password',e.target.value)} type="password" placeholder="Şifre (min 6 karakter) *" className="inp"/>
                        </div>
                        <div style={{ display:'flex',gap:'8px' }}>
                          <select value={s.levelId} onChange={e=>updateStudent(idx,'levelId',e.target.value)} className="sel" style={{ flex:1 }}>
                            <option value="">Sınıf...</option>
                            {levels.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}
                          </select>
                          <select value={s.examType} onChange={e=>updateStudent(idx,'examType',e.target.value)} className="sel" style={{ flex:1 }}>
                            <option value="">Sınav türü...</option>
                            {examTypes.map(t=><option key={t.id} value={t.name}>{t.name}</option>)}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Öğrenci Ekle butonu */}
                  <button type="button" onClick={addStudentEntry} style={{ width:'100%',padding:'10px',background:'rgba(255,255,255,0.04)',border:'1px dashed rgba(255,255,255,0.15)',borderRadius:'12px',color:'rgba(255,255,255,0.5)',fontWeight:600,cursor:'pointer',fontSize:'13px',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px',marginBottom:'16px',transition:'all .2s' }}>
                    <Plus size={14}/> Bir Öğrenci Daha Ekle
                  </button>

                  {/* Bilgi notu */}
                  <div style={{ padding:'12px 14px',background:'rgba(236,72,153,0.07)',border:'1px solid rgba(236,72,153,0.15)',borderRadius:'10px',marginBottom:'16px' }}>
                    <p style={{ color:'rgba(255,255,255,0.55)',fontSize:'11px',margin:0,lineHeight:1.6 }}>
                      💡 <strong style={{ color:'rgba(255,255,255,0.7)' }}>Kullanıcı adı:</strong> Öğrenci sisteme bu kullanıcı adı ya da e-posta ve şifreyle giriş yapabilir. Daha sonra profilden bilgi güncellenebilir.
                    </p>
                  </div>

                  <div style={{ display:'flex',gap:'10px' }}>
                    <button type="button" onClick={()=>setAddStudentsNow(false)} style={{ padding:'14px 20px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'14px',color:'rgba(255,255,255,0.6)',fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:'6px',fontSize:'14px' }}>
                      <ArrowLeft size={16}/> Geri
                    </button>
                    <button type="button" onClick={handleSubmit} disabled={isPending} className="btn-p" style={{ background:grad,flex:1 }}>
                      {isPending?<span style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:'8px' }}><Loader2 size={18} style={{ animation:'spin .8s linear infinite' }}/> Kayıt yapılıyor...</span>
                      :<span style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:'8px' }}>Kaydet ve Bitir <CheckCircle2 size={18}/></span>}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div style={{ textAlign:'center',marginTop:'24px' }}>
          <p style={{ color:'rgba(255,255,255,0.35)',fontSize:'14px' }}>
            Zaten hesabınız var mı?{' '}
            <Link href="/login" style={{ color:'#818cf8',fontWeight:600,textDecoration:'none' }}>Giriş Yap</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
