"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { 
  Users, Plus, Search, Settings, Edit, Eye, Trash2, Camera, MapPin, Phone, 
  MoreVertical, CheckCircle2, XCircle, UserX, UserCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function StudentsListPage() {
  const supabase = createClient()
  const [students, setStudents] = useState<any[]>([])
  const [levels, setLevels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Selection and Actions
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchStudents()
  }, [])

  async function fetchStudents() {
    setLoading(true)
    const [stuRes, lvlRes] = await Promise.all([
      supabase.from('students').select('*').order('created_at', { ascending: false }),
      supabase.from('levels').select('*')
    ])
    if (stuRes.data) setStudents(stuRes.data)
    if (lvlRes.data) setLevels(lvlRes.data)
    setLoading(false)
  }

  async function handleDelete(id: string, name: string) {
    if (confirm(`"${name}" isimli öğrenciyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz!`)) {
      await supabase.from('students').delete().eq('id', id)
      fetchStudents()
      setOpenDropdown(null)
    }
  }

  const getClassName = (id: string) => levels.find(l => l.id === id)?.name || "-"

  const filteredStudents = students.filter(s => 
    `${s.first_name} ${s.last_name} ${s.phone} ${s.citizen_id}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8 pb-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-3xl border border-border mt-2 shadow-sm">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
               <Users className="w-6 h-6" />
            </div>
            <div>
               <h1 className="text-2xl font-black text-foreground">Öğrenci Yönetimi</h1>
               <p className="text-sm font-semibold text-muted-foreground tracking-wide mt-1">Sistemdeki tüm kayıtlı öğrencilerin listesi ve detayları.</p>
            </div>
         </div>
         <div className="flex items-center gap-3 shrink-0">
             <Link href="/uraz/kayitlar/ogrenciler/yeni">
                 <Button className="font-bold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 h-11 px-6">
                    <Plus className="w-4 h-4 mr-2" /> Yeni Öğrenci Ekle
                 </Button>
             </Link>
         </div>
      </div>

      <div className="bg-card border-2 border-border rounded-3xl p-6 shadow-sm">
        
        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 border-b border-border pb-6">
           <div className="relative w-full max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input 
                 type="text" 
                 placeholder="İsim, telefon veya TC ile ara..." 
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
                 className="w-full bg-background border-2 border-border rounded-xl px-12 py-3 text-sm font-bold outline-none focus:border-primary" 
              />
           </div>
           <div className="text-sm font-bold text-muted-foreground">
             Toplam <span className="text-foreground">{filteredStudents.length}</span> Öğrenci
           </div>
        </div>

        {/* DATA TABLE (HORIZONTAL SCROLL FOR LARGE COLUMNS) */}
        <div className="overflow-x-auto rounded-xl border border-border relative min-h-[400px]">
          <table className="w-full text-left border-collapse whitespace-nowrap text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-xs uppercase tracking-widest text-muted-foreground font-black">
                 <th className="p-4 rounded-tl-xl w-32 border-r border-border/50 sticky left-0 bg-muted/95 z-10 backdrop-blur-sm">İşlemler</th>
                 <th className="p-4">Durum</th>
                 <th className="p-4">Veli App</th>
                 <th className="p-4">Şube / Sınıf</th>
                 <th className="p-4">Öğrenci Adı</th>
                 <th className="p-4">Soyadı</th>
                 <th className="p-4">Kullanıcı Adı</th>
                 <th className="p-4">Telefon</th>
                 <th className="p-4">Kayıt Türü</th>
                 <th className="p-4 rounded-tr-xl">Kayıt Tarihi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={10} className="text-center p-12 text-muted-foreground font-bold">Öğrenci verileri yükleniyor...</td></tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                   <td colSpan={10} className="text-center p-12">
                      <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="font-bold text-foreground text-lg">Kayıt bulunamadı</p>
                      <p className="text-sm text-muted-foreground">Arama kriterlerine uygun öğrenci yok veya henüz eklenmemiş.</p>
                   </td>
                </tr>
              ) : filteredStudents.map(student => (
                <tr key={student.id} className="border-b last:border-0 border-border hover:bg-muted/20 transition-colors group">
                   
                   {/* ACTION DROPDOWN (STICKY) */}
                   <td className="p-4 border-r border-border/50 sticky left-0 bg-card group-hover:bg-muted/20 z-10">
                      <div className="relative">
                        <Button 
                          onClick={() => setOpenDropdown(openDropdown === student.id ? null : student.id)} 
                          variant="default" 
                          size="sm" 
                          className="bg-primary text-primary-foreground font-bold shadow-sm rounded-lg"
                        >
                           <Settings className="w-4 h-4 mr-2" /> İşlemler
                        </Button>
                        
                        {/* Dropdown Menu */}
                        {openDropdown === student.id && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)}></div>
                            <div className="absolute top-full left-0 mt-2 w-48 bg-card border-2 border-border rounded-xl shadow-xl z-50 overflow-hidden flex flex-col py-1 animate-in fade-in slide-in-from-top-2">
                               <Link href={`/uraz/kayitlar/ogrenciler/yeni?id=${student.id}`} className="px-4 py-3 flex items-center gap-3 hover:bg-muted text-sm font-bold text-foreground transition-colors group/item">
                                 <Edit className="w-4 h-4 text-primary group-hover/item:scale-110 transition-transform" /> Düzenle
                               </Link>
                               <button disabled className="px-4 py-3 flex items-center gap-3 hover:bg-muted text-sm font-bold text-muted-foreground transition-colors group/item opacity-50 cursor-not-allowed">
                                 <Eye className="w-4 h-4 text-emerald-500 group-hover/item:scale-110 transition-transform" /> Görüntüle
                               </button>
                               <button className="px-4 py-3 flex items-center gap-3 hover:bg-muted text-sm font-bold text-foreground transition-colors group/item">
                                 <Camera className="w-4 h-4 text-indigo-500 group-hover/item:scale-110 transition-transform" /> Resim Yükle
                               </button>
                               <div className="h-px bg-border my-1 w-full" />
                               <button onClick={() => handleDelete(student.id, `${student.first_name} ${student.last_name}`)} className="px-4 py-3 flex items-center gap-3 hover:bg-destructive/10 hover:text-destructive text-sm font-bold text-destructive transition-colors group/item">
                                 <Trash2 className="w-4 h-4 group-hover/item:scale-110 transition-transform" /> Sil
                               </button>
                            </div>
                          </>
                        )}
                      </div>
                   </td>
                   
                   <td className="p-4 text-center">
                     {student.is_active ? <UserCheck className="w-5 h-5 text-success mx-auto" /> : <UserX className="w-5 h-5 text-destructive mx-auto" />}
                   </td>
                   <td className="p-4 text-center">
                     {student.has_parent_app ? <CheckCircle2 className="w-5 h-5 text-success mx-auto" /> : <XCircle className="w-5 h-5 text-muted-foreground opacity-30 mx-auto" />}
                   </td>
                   <td className="p-4 font-black text-foreground">
                      {getClassName(student.level_id)}
                   </td>
                   <td className="p-4 font-semibold text-foreground">
                      {student.first_name}
                   </td>
                   <td className="p-4 font-semibold text-foreground">
                      {student.last_name}
                   </td>
                   <td className="p-4 text-muted-foreground font-medium">
                      {student.username || '-'}
                   </td>
                   <td className="p-4 font-bold text-foreground">
                      {student.phone || '-'}
                   </td>
                   <td className="p-4">
                      {student.membership_status ? (
                         <span className="bg-accent/15 text-accent font-black text-[10px] px-3 py-1.5 rounded-md uppercase tracking-widest border border-accent/20">
                            {student.membership_status}
                         </span>
                      ) : '-'}
                   </td>
                   <td className="p-4 text-muted-foreground font-medium">
                      {new Date(student.created_at).toLocaleDateString('tr-TR')}
                   </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
