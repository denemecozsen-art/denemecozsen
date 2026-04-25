import { createClient } from '@/lib/supabase/server'
import { Settings, UserCog, Mail, KeyRound, Save } from "lucide-react"

export default async function VeliAyarlarPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const firstName = user?.user_metadata?.first_name || 'Veli'
  const lastName = user?.user_metadata?.last_name || ''
  const email = user?.email || ''

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-8 rounded-[2.5rem] shadow-sm">
        <div>
           <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
              <div className="w-12 h-12 bg-zinc-500/10 text-zinc-600 rounded-xl flex items-center justify-center">
                 <Settings className="w-6 h-6" />
              </div>
              Hesap Ayarları
           </h1>
           <p className="text-muted-foreground font-semibold mt-2">Veli profili tercihlerinizi yönetin ve kişisel bilgilerinizi güncel tutun.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <div className="bg-card rounded-[2.5rem] border border-border/50 p-8 shadow-sm">
               <h2 className="text-xl font-black flex items-center mb-6 border-b border-border/50 pb-4">
                  <UserCog className="w-5 h-5 mr-3 text-indigo-500" /> Profil Bilgileri
               </h2>
               
               <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-muted-foreground ml-1">Adınız</label>
                        <input type="text" defaultValue={firstName} className="w-full bg-muted/40 border-2 border-border/50 rounded-2xl h-14 px-4 font-bold outline-none focus:border-indigo-500 transition-colors" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-muted-foreground ml-1">Soyadınız</label>
                        <input type="text" defaultValue={lastName} className="w-full bg-muted/40 border-2 border-border/50 rounded-2xl h-14 px-4 font-bold outline-none focus:border-indigo-500 transition-colors" />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase text-muted-foreground ml-1">E-Posta Adresiniz</label>
                     <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                        <input type="email" defaultValue={email} disabled className="w-full bg-background border-2 border-border/50 rounded-2xl h-14 pl-12 pr-4 font-bold text-muted-foreground opacity-70 cursor-not-allowed" />
                     </div>
                     <p className="text-[10px] text-muted-foreground font-bold ml-1">E-posta adresinizi değiştirmek için destek ekibiyle görüşmelisiniz.</p>
                  </div>

                  <button type="button" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 px-8 rounded-xl flex items-center transition-colors">
                     <Save className="w-4 h-4 mr-2" /> Değişiklikleri Kaydet
                  </button>
               </form>
            </div>

            <div className="bg-card rounded-[2.5rem] border border-border/50 p-8 shadow-sm">
               <h2 className="text-xl font-black flex items-center mb-6 border-b border-border/50 pb-4">
                  <KeyRound className="w-5 h-5 mr-3 text-fuchsia-500" /> Şifre İşlemleri
               </h2>
               <div className="space-y-4">
                  <p className="text-muted-foreground font-medium text-sm">Hesabınızın güvenliği sağlamak için düzenli periyotlarda şifrenizi yenileyin.</p>
                  <button type="button" className="bg-muted hover:bg-muted/80 text-foreground border border-border font-bold h-12 px-6 rounded-xl transition-colors">
                     Şifremi Sıfırla (Bağlantı Gönder)
                  </button>
               </div>
            </div>
         </div>

         {/* Sağ Taraf - Veli Kartı Veya Ekstra Bilgi */}
         <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border-2 border-indigo-500/20 rounded-[2.5rem] p-8 text-center flex flex-col items-center">
               <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white flex items-center justify-center font-black text-3xl shadow-lg mb-4">
                  {firstName.charAt(0)}{lastName ? lastName.charAt(0) : ''}
               </div>
               <h3 className="text-xl font-black text-foreground">{firstName} {lastName}</h3>
               <span className="bg-indigo-500/10 text-indigo-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mt-2">VIP Veli Hesabı</span>
            </div>
         </div>
      </div>
    </div>
  )
}
