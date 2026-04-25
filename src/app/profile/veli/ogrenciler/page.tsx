import { createClient } from '@/lib/supabase/server'
import { Users, Plus, ArrowRight, AtSign } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function VeliOgrencilerPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const parentId = user?.id

  // Veliye bağlı öğrencileri çek
  const { data: parentStudents } = await supabase
    .from('parent_students')
    .select(`
      student_id,
      students (
        id,
        first_name,
        last_name,
        username,
        email,
        membership_status
      )
    `)
    .eq('parent_id', parentId)

  const students = parentStudents?.map((ps: any) => ps.students) || []

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-8 rounded-[2.5rem] shadow-sm">
        <div>
           <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
              <div className="w-12 h-12 bg-pink-500/10 text-pink-600 rounded-xl flex items-center justify-center">
                 <Users className="w-6 h-6" />
              </div>
              Öğrencilerim
           </h1>
           <p className="text-muted-foreground font-semibold mt-2">Sisteme kayıtlı alt hesaplarınızı buradan yönetebilirsiniz.</p>
        </div>
        <Link href="/profile/veli/ogrenci-ekle">
          <Button size="lg" className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-bold rounded-2xl h-12 px-6 shadow-lg shadow-violet-500/20">
             <Plus className="w-5 h-5 mr-2" /> Yeni Öğrenci Ekle
          </Button>
        </Link>
      </div>

      {students.length === 0 ? (
        <div className="bg-card rounded-[2.5rem] p-8 border border-border/50 text-center flex flex-col items-center justify-center min-h-[400px]">
           <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mb-6">
              <Users className="w-10 h-10 text-muted-foreground/40" />
           </div>
           <h2 className="text-xl font-black mb-2">Henüz Bir Öğrenci Ekli Değil</h2>
           <p className="text-muted-foreground max-w-md font-medium mb-8">
              Öğrenci ekleyerek deneme analizlerine, online sınavlara ve paket işlemlerine hemen ulaşabilirsiniz.
           </p>
           <Link href="/profile/veli/ogrenci-ekle">
              <Button className="h-12 border-2 border-border font-bold px-8 rounded-xl items-center gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white">
                 Öğrenci Ekle <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
           </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {students.map((student: any) => (
            <div key={student.id} className="bg-card border-2 border-border/50 rounded-3xl p-6 shadow-sm hover:border-violet-500/30 transition-all flex flex-col min-h-[240px]">
               <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-violet-500/20 shrink-0">
                     {student.first_name?.charAt(0)}{student.last_name?.charAt(0)}
                  </div>
                  <div>
                     <h4 className="font-black text-foreground text-xl leading-tight mb-1">{student.first_name} {student.last_name}</h4>
                     <p className="text-sm font-bold text-muted-foreground flex items-center gap-1">
                        <AtSign className="w-3.5 h-3.5" /> {student.username || student.email || 'Giriş bilgisi yok'}
                     </p>
                  </div>
               </div>
               
               <div className="bg-muted/30 rounded-2xl p-4 flex justify-between items-center mb-6">
                  <span className="text-sm font-bold text-muted-foreground">Sistem Durumu:</span>
                  <span className="text-sm font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-lg">{student.membership_status || 'Aktif Üye'}</span>
               </div>

               <div className="mt-auto grid grid-cols-2 gap-3">
                  <Link href={`/profile/ogrenci/sonuclarim?studentId=${student.id}`} className="col-span-1">
                     <Button variant="outline" className="w-full font-bold border-2 hover:bg-muted rounded-xl h-11 text-xs">
                        Raporlar
                     </Button>
                  </Link>
                  <Link href={`/profile/veli/ogrenci-duzenle?id=${student.id}`} className="col-span-1">
                     <Button variant="outline" className="w-full font-bold border-2 hover:bg-muted rounded-xl h-11 text-xs">
                        Düzenle
                     </Button>
                  </Link>
                  <Link href={`/profile/ogrenci?studentId=${student.id}`} className="col-span-2 mt-1">
                     <Button className="w-full font-black bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-md shadow-violet-600/20 rounded-xl h-12">
                        Öğrenci Paneline Git <ArrowRight className="w-4 h-4 ml-2" />
                     </Button>
                  </Link>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
