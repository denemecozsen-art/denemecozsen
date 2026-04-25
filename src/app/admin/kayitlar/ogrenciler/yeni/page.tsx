"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Save, UserPlus, FileSignature, CheckCircle2, ChevronDown, ArrowLeft, AlertCircle } from "lucide-react"

function StudentBuilderInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('id')
  const supabase = createClient()

  const [isSaving, setIsSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [levels, setLevels] = useState<any[]>([])

  // Form States
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [levelId, setLevelId] = useState("")
  const [username, setUsername] = useState("")
  const [citizenId, setCitizenId] = useState("")
  const [schoolNum, setSchoolNum] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [gender, setGender] = useState("")
  const [membershipStatus, setMembershipStatus] = useState("Aylık Üye")
  const [isActive, setIsActive] = useState(true)
  const [hasParentApp, setHasParentApp] = useState(false)

  useEffect(() => {
    loadLookups()
    if (editId) {
       loadStudent(editId)
    }
  }, [editId])

  async function loadLookups() {
    const { data } = await supabase.from('levels').select('*').order('created_at', { ascending: true })
    if (data) setLevels(data)
  }

  async function loadStudent(id: string) {
    const { data: std, error } = await supabase.from('students').select('*').eq('id', id).single()
    if (std) {
      setFirstName(std.first_name || "")
      setLastName(std.last_name || "")
      setLevelId(std.level_id || "")
      setUsername(std.username || "")
      setCitizenId(std.citizen_id || "")
      setSchoolNum(std.school_number || "")
      setPhone(std.phone || "")
      setEmail(std.email || "")
      setGender(std.gender || "")
      setMembershipStatus(std.membership_status || "")
      setIsActive(std.is_active ?? true)
      setHasParentApp(std.has_parent_app ?? false)
    }
  }

  async function handleSave() {
    setErrorMsg("")
    setIsSaving(true)
    
    if (!firstName || !lastName || !levelId) {
      setErrorMsg("Ad, Soyad ve Sınıf/Şube alanları zorunludur.")
      setIsSaving(false)
      return
    }

    const payload = {
      first_name: firstName,
      last_name: lastName,
      level_id: levelId || null,
      username: username || null, // null makes UNIQUE constraint work when empty
      citizen_id: citizenId,
      school_number: schoolNum,
      phone,
      email,
      gender: gender || null,
      membership_status: membershipStatus,
      is_active: isActive,
      has_parent_app: hasParentApp
    }

    if (editId) {
      const { error } = await supabase.from('students').update(payload).eq('id', editId)
      if (error) { setErrorMsg(error.message); setIsSaving(false); return }
    } else {
      const { error } = await supabase.from('students').insert([payload])
      if (error) { setErrorMsg(error.message); setIsSaving(false); return }
    }

    setIsSaving(false)
    router.push('/uraz/kayitlar/ogrenciler')
  }

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-border pb-6">
        <div>
          <button onClick={() => router.push('/uraz/kayitlar/ogrenciler')} className="text-muted-foreground hover:text-foreground flex items-center text-sm font-bold mb-4">
             <ArrowLeft className="w-4 h-4 mr-2" /> Öğrenci Listesine Dön
          </button>
          <div className="flex items-center gap-2 mb-2">
             <span className="bg-primary/15 text-primary text-xs font-black uppercase tracking-widest px-3 py-1 rounded-md">ÖĞRENCİ KAYIT FORMU</span>
             {isActive ? <span className="bg-success/15 text-success text-xs font-black uppercase tracking-widest px-3 py-1 rounded-md">Aktif Dosya</span> : <span className="bg-destructive/15 text-destructive text-xs font-black uppercase px-3 py-1 rounded-md">Pasif İstifa</span>}
          </div>
          <h1 className="text-3xl font-black flex items-center gap-3 text-foreground mt-2">
            {firstName || lastName ? `${firstName} ${lastName}` : "Yeni Öğrenci Dosyası Oluştur"}
          </h1>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full lg:w-auto shrink-0">
           <Button onClick={handleSave} disabled={isSaving} className="h-12 px-8 font-black bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:scale-105 transition-transform text-base rounded-2xl">
              {isSaving ? "Kaydediliyor..." : editId ? "Öğrenciyi Güncelle" : "Sisteme Kaydet Ekle"} <Save className="w-5 h-5 ml-2" />
           </Button>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-destructive/10 border-2 border-destructive/20 text-destructive p-4 rounded-2xl flex items-center font-bold">
           <AlertCircle className="w-5 h-5 mr-3" /> {errorMsg}
        </div>
      )}

      <div className="flex flex-col xl:flex-row gap-8">
         <div className="flex-1 min-w-0 space-y-8">
            
            {/* KIMLIK BILGILERI */}
            <div className="bg-card border-2 border-border rounded-[2rem] p-8 sm:p-10 shadow-sm space-y-8">
               <h2 className="text-xl font-black border-b border-border pb-4 flex items-center text-primary">
                  <FileSignature className="w-6 h-6 mr-3" /> Kimlik / Temel Bilgiler
               </h2>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                     <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Öğrenci Adı (*)</label>
                     <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Ahmet" className="w-full bg-background border-2 border-border focus:border-primary rounded-xl px-4 py-3 font-bold outline-none transition-all" />
                  </div>
                  <div className="space-y-3">
                     <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Öğrenci Soyadı (*)</label>
                     <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Yılmaz" className="w-full bg-background border-2 border-border focus:border-primary rounded-xl px-4 py-3 font-bold outline-none transition-all" />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-3">
                     <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">TC Kimlik Nu.</label>
                     <input type="text" maxLength={11} value={citizenId} onChange={e => setCitizenId(e.target.value)} placeholder="11 Haneli" className="w-full bg-background border-2 border-border focus:border-primary rounded-xl px-4 py-3 font-bold outline-none transition-all" />
                  </div>
                  <div className="space-y-3">
                     <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Bağlı Olduğu Sınıf/Şube (*)</label>
                     <div className="relative">
                        <select value={levelId} onChange={e => setLevelId(e.target.value)} className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-primary appearance-none cursor-pointer">
                           <option value="">Seçiniz...</option>
                           {levels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                     </div>
                  </div>
                  <div className="space-y-3">
                     <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Kullanıcı Adı (Portal Girişi)</label>
                     <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="ahmetyilmaz9" className="w-full bg-background border-2 border-border focus:border-primary rounded-xl px-4 py-3 font-bold outline-none transition-all text-sm" />
                  </div>
               </div>
            </div>

            {/* ILETISIM */}
            <div className="bg-card border-2 border-border rounded-[2rem] p-8 sm:p-10 shadow-sm space-y-8">
               <h2 className="text-xl font-black border-b border-border pb-4 flex items-center text-primary">
                  <UserPlus className="w-6 h-6 mr-3" /> İletişim ve Profil
               </h2>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                     <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Cep Telefonu</label>
                     <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="05XX XXX XX XX" className="w-full bg-background border-2 border-border focus:border-primary rounded-xl px-4 py-3 font-bold outline-none transition-all" />
                  </div>
                  <div className="space-y-3">
                     <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Okul/Bölüm Nu.</label>
                     <input type="text" value={schoolNum} onChange={e => setSchoolNum(e.target.value)} placeholder="000" className="w-full bg-background border-2 border-border focus:border-primary rounded-xl px-4 py-3 font-bold outline-none transition-all" />
                  </div>
                  <div className="space-y-3">
                     <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">E-Posta Adresi</label>
                     <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="mail@ornek.com" className="w-full bg-background border-2 border-border focus:border-primary rounded-xl px-4 py-3 font-bold outline-none transition-all text-sm" />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                     <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Cinsiyet (Grafik İçin)</label>
                     <div className="flex gap-4">
                        <label className={`flex-1 flex items-center justify-center p-3 rounded-xl border-2 font-bold cursor-pointer transition-colors ${gender === 'Erkek' ? 'bg-primary/10 border-primary text-primary' : 'bg-background border-border hover:border-primary/50'}`}>
                           <input type="radio" name="gender" value="Erkek" checked={gender === 'Erkek'} onChange={(e) => setGender(e.target.value)} className="hidden" /> Erkek
                        </label>
                        <label className={`flex-1 flex items-center justify-center p-3 rounded-xl border-2 font-bold cursor-pointer transition-colors ${gender === 'Kız' ? 'bg-primary/10 border-primary text-primary' : 'bg-background border-border hover:border-primary/50'}`}>
                           <input type="radio" name="gender" value="Kız" checked={gender === 'Kız'} onChange={(e) => setGender(e.target.value)} className="hidden" /> Kız
                        </label>
                     </div>
                  </div>
                  <div className="space-y-3">
                     <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Üyelik Modeli (Durumu)</label>
                     <div className="relative">
                        <select value={membershipStatus} onChange={e => setMembershipStatus(e.target.value)} className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-primary appearance-none cursor-pointer">
                           <option value="Deneme Kulübü">Deneme Kulübü</option>
                           <option value="Aylık Üye">Aylık Üye</option>
                           <option value="Dönemlik Üye (5 Ay)">Dönemlik Üye</option>
                           <option value="Yıllık Üye (10 Ay)">Yıllık Üye</option>
                           <option value="VIP Koçluk">VIP Koçluk</option>
                           <option value="Ücretsiz/Burslu">Ücretsiz (Burslu) Kurum</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                     </div>
                  </div>
               </div>
            </div>

         </div>

         <div className="w-full xl:w-80 shrink-0 space-y-6">
            <div className="bg-card border-2 border-border rounded-[2rem] p-6 shadow-sm flex items-center justify-between cursor-pointer group" onClick={() => setIsActive(!isActive)}>
               <div className="flex flex-col">
                  <span className="font-black text-sm uppercase text-foreground">Öğrenci Aktif Mi?</span>
                  <span className="text-[10px] text-muted-foreground">İptaller için pasif yapın.</span>
               </div>
               <div className={`w-12 h-6 rounded-full border-2 transition-colors relative ${isActive ? 'bg-success/20 border-success' : 'bg-destructive/20 border-destructive'}`}>
                  <div className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full transition-all ${isActive ? 'bg-success right-1.5' : 'bg-destructive left-1.5'}`}></div>
               </div>
            </div>

            <div className="bg-card border-2 border-border rounded-[2rem] p-6 shadow-sm flex items-center justify-between cursor-pointer group" onClick={() => setHasParentApp(!hasParentApp)}>
               <div className="flex flex-col">
                  <span className="font-black text-sm uppercase text-foreground">Mobil Veli Bağlı Mı?</span>
                  <span className="text-[10px] text-muted-foreground">Velisi takip ediyorsa seçin.</span>
               </div>
               <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${hasParentApp ? 'bg-primary border-primary text-white' : 'border-border'}`}>
                  {hasParentApp && <CheckCircle2 className="w-4 h-4" />}
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}

export default function StudentBuilderPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[400px] text-muted-foreground font-bold">Öğrenci formu yükleniyor...</div>}>
      <StudentBuilderInner />
    </Suspense>
  )
}
