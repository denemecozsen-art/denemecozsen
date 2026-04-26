"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import {
  Users, Plus, Search, Edit, Eye, Trash2, Phone, Mail,
  UserPlus, UserCheck, UserX, ChevronDown, ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"

type Parent = {
  id: string
  first_name: string
  last_name: string
  phone: string | null
  email: string | null
  is_active: boolean
  created_at: string
  students?: { id: string; first_name: string; last_name: string; is_active: boolean }[]
}

export default function ParentsListPage() {
  const supabase = createClient()
  const [parents, setParents] = useState<Parent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedParent, setExpandedParent] = useState<string | null>(null)

  // Öğrenci Ekleme Modal
  const [showAddStudent, setShowAddStudent] = useState<string | null>(null) // parent_id
  const [newStudentFirstName, setNewStudentFirstName] = useState("")
  const [newStudentLastName, setNewStudentLastName] = useState("")
  const [newStudentEmail, setNewStudentEmail] = useState("")
  const [newStudentPhone, setNewStudentPhone] = useState("")
  const [addingStudent, setAddingStudent] = useState(false)

  useEffect(() => {
    fetchParents()
  }, [])

  async function fetchParents() {
    setLoading(true)

    // Velileri çek
    const { data: parentsData } = await supabase
      .from('parents')
      .select('*')
      .order('created_at', { ascending: false })

    if (parentsData) {
      // Her veli için bağlı öğrencileri çek
      const enrichedParents = await Promise.all(
        (parentsData as Parent[]).map(async (parent: Parent) => {
          const { data: relations } = await supabase
            .from('parent_students')
            .select('student_id')
            .eq('parent_id', parent.id)

          if (relations && relations.length > 0) {
            const studentIds = (relations as any[]).map(r => r.student_id)
            const { data: students } = await supabase
              .from('students')
              .select('id, first_name, last_name, is_active')
              .in('id', studentIds)

            return { ...parent, students: students || [] }
          }

          return { ...parent, students: [] }
        })
      )
      setParents(enrichedParents)
    }

    setLoading(false)
  }

  async function handleDeleteParent(id: string, name: string) {
    if (confirm(`"${name}" isimli veliyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz!`)) {
      await supabase.from('parent_students').delete().eq('parent_id', id)
      await supabase.from('parents').delete().eq('id', id)
      fetchParents()
    }
  }

  async function handleAddStudent(parentId: string) {
    if (!newStudentFirstName.trim() || !newStudentLastName.trim()) {
      alert("Öğrenci adı ve soyadı zorunludur.")
      return
    }

    setAddingStudent(true)

    // 1. Öğrenciyi students tablosuna ekle
    const { data: newStudent, error: studentError } = await supabase
      .from('students')
      .insert([{
        first_name: newStudentFirstName,
        last_name: newStudentLastName,
        email: newStudentEmail || null,
        phone: newStudentPhone || null,
        membership_status: 'Veli Kayıt',
        is_active: true,
        has_parent_app: true,
      }])
      .select()
      .single()

    if (studentError) {
      alert("Öğrenci eklenirken hata: " + studentError.message)
      setAddingStudent(false)
      return
    }

    // 2. Veli-öğrenci ilişkisini kur
    const { error: relationError } = await supabase
      .from('parent_students')
      .insert([{
        parent_id: parentId,
        student_id: newStudent.id,
        relationship: 'Veli',
      }])

    if (relationError) {
      alert("İlişki kurulurken hata: " + relationError.message)
    }

    // Temizle ve yenile
    setNewStudentFirstName("")
    setNewStudentLastName("")
    setNewStudentEmail("")
    setNewStudentPhone("")
    setShowAddStudent(null)
    setAddingStudent(false)
    fetchParents()
  }

  async function handleUnlinkStudent(parentId: string, studentId: string) {
    if (confirm("Bu öğrenciyi veliden ayırmak istediğinize emin misiniz?")) {
      await supabase
        .from('parent_students')
        .delete()
        .eq('parent_id', parentId)
        .eq('student_id', studentId)
      fetchParents()
    }
  }

  const filteredParents = parents.filter(p =>
    `${p.first_name} ${p.last_name} ${p.phone} ${p.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8 pb-10">

      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-3xl border border-border mt-2 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-500 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground">Veli Yönetimi</h1>
            <p className="text-sm font-semibold text-muted-foreground tracking-wide mt-1">
              Kayıtlı veliler, bağlı öğrencileri ve iletişim bilgileri.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card border-2 border-border rounded-3xl p-6 shadow-sm">

        {/* Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 border-b border-border pb-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="İsim, telefon veya e-posta ile ara..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-background border-2 border-border rounded-xl px-12 py-3 text-sm font-bold outline-none focus:border-primary"
            />
          </div>
          <div className="text-sm font-bold text-muted-foreground">
            Toplam <span className="text-foreground">{filteredParents.length}</span> Veli
          </div>
        </div>

        {/* VELİ LİSTESİ */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center p-12 text-muted-foreground font-bold">
              Veli verileri yükleniyor...
            </div>
          ) : filteredParents.length === 0 ? (
            <div className="text-center p-12">
              <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="font-bold text-foreground text-lg">Kayıtlı veli bulunamadı</p>
              <p className="text-sm text-muted-foreground">Veliler web sitesinden &quot;Veli&quot; olarak kayıt olduğunda burada görünecek.</p>
            </div>
          ) : filteredParents.map(parent => (
            <div key={parent.id} className="bg-background border-2 border-border rounded-2xl overflow-hidden hover:border-pink-500/30 transition-colors">

              {/* Veli Bilgileri */}
              <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-500 font-black flex items-center justify-center text-lg shrink-0">
                    {parent.first_name[0]}{parent.last_name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-black text-lg text-foreground">
                        {parent.first_name} {parent.last_name}
                      </h3>
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${parent.is_active ? 'bg-emerald-500/15 text-emerald-500' : 'bg-destructive/10 text-destructive'}`}>
                        {parent.is_active ? 'Aktif' : 'Pasif'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      {parent.email && (
                        <span className="flex items-center gap-1.5 font-medium"><Mail className="w-3.5 h-3.5" /> {parent.email}</span>
                      )}
                      {parent.phone && (
                        <span className="flex items-center gap-1.5 font-medium"><Phone className="w-3.5 h-3.5" /> {parent.phone}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline" size="sm"
                    onClick={() => setExpandedParent(expandedParent === parent.id ? null : parent.id)}
                    className="font-bold border-2 text-xs gap-2"
                  >
                    {expandedParent === parent.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    Öğrenciler ({parent.students?.length || 0})
                  </Button>
                  <Button
                    variant="outline" size="sm"
                    onClick={() => { setShowAddStudent(parent.id); setExpandedParent(parent.id) }}
                    className="font-bold border-2 text-xs gap-2 text-pink-500 border-pink-500/30 hover:bg-pink-500/10"
                  >
                    <UserPlus className="w-4 h-4" /> Öğrenci Ekle
                  </Button>
                  <Button
                    onClick={() => handleDeleteParent(parent.id, `${parent.first_name} ${parent.last_name}`)}
                    size="icon" variant="ghost"
                    className="text-destructive hover:bg-destructive/10 h-8 w-8"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Bağlı Öğrenciler (genişletme) */}
              {expandedParent === parent.id && (
                <div className="border-t border-border bg-muted/20 p-5 animate-in slide-in-from-top-2 duration-200">
                  <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4">
                    Bağlı Öğrenciler
                  </h4>

                  {parent.students && parent.students.length > 0 ? (
                    <div className="space-y-3">
                      {parent.students.map(student => (
                        <div key={student.id} className="flex items-center justify-between bg-background rounded-xl p-3 border border-border">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                              {student.first_name[0]}{student.last_name[0]}
                            </div>
                            <div>
                              <span className="font-bold text-sm text-foreground">{student.first_name} {student.last_name}</span>
                              <div className="flex items-center gap-2 mt-0.5">
                                {student.is_active ? (
                                  <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                                    <UserCheck className="w-3 h-3" /> Aktif
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold text-destructive flex items-center gap-1">
                                    <UserX className="w-3 h-3" /> Pasif
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Link href={`/uraz/kayitlar/ogrenciler/yeni?id=${student.id}`}>
                              <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10 text-xs font-bold">
                                <Edit className="w-3.5 h-3.5 mr-1.5" /> Düzenle
                              </Button>
                            </Link>
                            <Button
                              size="sm" variant="ghost"
                              onClick={() => handleUnlinkStudent(parent.id, student.id)}
                              className="text-destructive hover:bg-destructive/10 text-xs font-bold"
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Ayır
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Bu veliye henüz öğrenci bağlanmamış.
                    </p>
                  )}

                  {/* Öğrenci Ekleme Formu */}
                  {showAddStudent === parent.id && (
                    <div className="mt-4 bg-pink-500/5 border-2 border-pink-500/20 rounded-2xl p-5 animate-in fade-in slide-in-from-top-2">
                      <h5 className="text-sm font-black text-pink-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <UserPlus className="w-4 h-4" /> Yeni Öğrenci Ekle
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="text-[10px] font-black text-muted-foreground uppercase">Öğrenci Adı (*)</label>
                          <input
                            type="text" value={newStudentFirstName}
                            onChange={e => setNewStudentFirstName(e.target.value)}
                            placeholder="Adı" autoFocus
                            className="w-full bg-background border-2 border-border rounded-lg px-3 py-2 text-sm font-bold outline-none focus:border-pink-500 mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-muted-foreground uppercase">Öğrenci Soyadı (*)</label>
                          <input
                            type="text" value={newStudentLastName}
                            onChange={e => setNewStudentLastName(e.target.value)}
                            placeholder="Soyadı"
                            className="w-full bg-background border-2 border-border rounded-lg px-3 py-2 text-sm font-bold outline-none focus:border-pink-500 mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-muted-foreground uppercase">E-posta (Opsiyonel)</label>
                          <input
                            type="email" value={newStudentEmail}
                            onChange={e => setNewStudentEmail(e.target.value)}
                            placeholder="ogrenci@mail.com"
                            className="w-full bg-background border-2 border-border rounded-lg px-3 py-2 text-sm font-bold outline-none focus:border-pink-500 mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-muted-foreground uppercase">Telefon (Opsiyonel)</label>
                          <input
                            type="tel" value={newStudentPhone}
                            onChange={e => setNewStudentPhone(e.target.value)}
                            placeholder="05XX XXX XX XX"
                            className="w-full bg-background border-2 border-border rounded-lg px-3 py-2 text-sm font-bold outline-none focus:border-pink-500 mt-1"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-3 justify-end">
                        <Button
                          variant="outline" size="sm"
                          onClick={() => setShowAddStudent(null)}
                          className="font-bold"
                        >
                          İptal
                        </Button>
                        <Button
                          size="sm" disabled={addingStudent}
                          onClick={() => handleAddStudent(parent.id)}
                          className="font-black bg-pink-500 hover:bg-pink-600 text-white"
                        >
                          {addingStudent ? "Ekleniyor..." : "Öğrenci Ekle & Bağla"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
