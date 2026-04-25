import { createClient } from "../../../../lib/supabase/server"
import { Button } from "../../../../components/ui/button"
import { Layers, Save, Settings2, LayoutTemplate, Plus, Trash2, ListTree, Image as ImageIcon } from "lucide-react"
import { updateKendinSecSettings, addKendinSecOption, deleteKendinSecOption } from "./actions"
import { LogoInput } from "./logo-input"

export const dynamic = "force-dynamic"

export default async function AdminKendinSec() {
  const supabase = await createClient()

  // Tabloların varlığını kontrol et ve veri çek
  const { data: settingsData, error: settingsError } = await supabase
    .from('custom_package_settings')
    .select('*')
    .eq('id', 1)
    .single()

  const { data: optionsData, error: optionsError } = await supabase
    .from('custom_package_options')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('month_name', { ascending: true })

  const hasTables = settingsError?.code !== '42P01' && optionsError?.code !== '42P01'

  const settings = settingsData || {
    hero_title: 'Paketini Oluştur',
    step1_desc: 'Sana en uygun kaynakları görmek için eğitim seviyeni belirle.',
    step2_desc: 'Dilediğiniz Ayı ve Yayını Seçin. Seçtiğiniz sınıf için dilediğin ayın kurumsal denemelerini sepete ekle.',
    step3_desc: 'Netlerinizi görebileceğiniz, dijital karnelere ulaşabileceğiniz analiz panelini paketinize ekleyin.',
    shipping_rule_enabled: true,
    shipping_free_threshold: 3,
    shipping_penalty_fee: 150,
    portal_price: 100,
    portal_rule_enabled: true
  }

  const options = optionsData || []

  const { data: levelsData } = await supabase.from('levels').select('id, name').order('sort_order', { ascending: true })
  const classes = levelsData || []

  if (!hasTables) {
    return (
      <div className="p-8 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 text-center font-medium">
        Uyarı: 'custom_package_settings' ve 'custom_package_options' tabloları bulunamadı. Lütfen Supabase SQL editöründe gerekli tabloları oluşturun.
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-3 text-primary">
            <Layers className="w-8 h-8" />
            "Kendin Seç" Sihirbaz Ünitesi
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">Öğrencilerin paket oluşturduğu bu kritik sayfanın zengin metinlerini, yayınları ve kargo kurallarını yönetin.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12 gap-8">
         <div className="space-y-8">
            {/* AYARLAR FORMU */}
            <form action={updateKendinSecSettings}>
              <div className="bg-card border-2 border-border rounded-3xl shadow-sm p-8 sm:p-10 space-y-8">
                <div className="flex justify-between items-center border-b border-border pb-4">
                  <h2 className="text-xl font-black flex items-center">
                    <LayoutTemplate className="w-6 h-6 mr-3 text-primary" /> Genel Ayarlar & Metinler
                  </h2>
                  <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                    <Save className="w-4 h-4 mr-2" /> Kaydet
                  </Button>
                </div>
                
                <div className="space-y-4">
                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider block">Sayfa Ana Başlığı (H1)</label>
                    <input name="hero_title" defaultValue={settings.hero_title} className="w-full bg-background border-2 border-border rounded-2xl px-6 py-5 text-xl font-black focus:ring-4 focus:ring-primary/20 outline-none transition-all focus:border-primary" />
                </div>

                <div className="space-y-4 border-t border-border pt-8">
                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider block">Adım 1: Sınıf Seçimi Açıklaması</label>
                    <textarea name="step1_desc" rows={3} defaultValue={settings.step1_desc} className="w-full bg-background border-2 border-border rounded-2xl px-6 py-5 text-base focus:ring-4 focus:ring-primary/20 outline-none resize-none font-medium transition-all focus:border-primary"></textarea>
                </div>

                <div className="space-y-4 border-t border-border pt-8">
                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider block">Adım 2: Yayın Seçimi Açıklaması</label>
                    <textarea name="step2_desc" rows={3} defaultValue={settings.step2_desc} className="w-full bg-background border-2 border-border rounded-2xl px-6 py-5 text-base focus:ring-4 focus:ring-primary/20 outline-none resize-none font-medium transition-all focus:border-primary"></textarea>
                </div>

                <div className="space-y-4 border-t border-border pt-8">
                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider block">Adım 3: Dijital Portal Modülü</label>
                    <textarea name="step3_desc" rows={3} defaultValue={settings.step3_desc} className="w-full bg-background border-2 border-border rounded-2xl px-6 py-5 text-base focus:ring-4 focus:ring-primary/20 outline-none resize-none font-medium transition-all focus:border-primary"></textarea>
                </div>
                
                {/* Finans Kuralları */}
                <h2 className="text-xl font-black border-b border-border pb-4 pt-8 flex items-center text-primary mt-8">
                    <Settings2 className="w-6 h-6 mr-3" /> Finans & Ücretlendirme Motoru
                </h2>
                
                <div className="bg-muted/50 p-6 rounded-2xl border-2 border-border flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-base flex items-center text-foreground block mb-1">Kargo Kuralı Aktif Mi?</span>
                      <p className="text-xs text-muted-foreground font-medium">Kapatılırsa yayın limiti aranmaz, ücretsiz kargo olur.</p>
                    </div>
                    <input name="shipping_rule_enabled" type="checkbox" defaultChecked={settings.shipping_rule_enabled} className="w-6 h-6 rounded-md accent-primary" />
                </div>

                <div className="flex gap-4">
                  <div className="w-1/2 space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">Ücretsiz Kargo Eşiği</label>
                    <div className="flex items-center">
                      <input name="shipping_free_threshold" type="number" defaultValue={settings.shipping_free_threshold} className="w-full border-2 border-border rounded-xl px-4 py-3 font-bold outline-none focus:border-primary" />
                    </div>
                  </div>
                  <div className="w-1/2 space-y-2">
                    <label className="text-xs font-bold text-destructive uppercase tracking-widest block">Limit Altı Kargo Ücreti</label>
                    <div className="flex items-center">
                      <input name="shipping_penalty_fee" type="number" defaultValue={settings.shipping_penalty_fee} className="w-full border-2 border-border rounded-xl px-4 py-3 font-bold outline-none focus:border-destructive text-destructive" />
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 p-6 rounded-2xl border-2 border-border mt-4">
                    <div className="flex items-center justify-between mb-4 border-b border-border pb-4">
                      <div>
                        <span className="font-extrabold text-base flex items-center text-foreground block mb-1">Dijital Portal Eklenebilir Mi?</span>
                        <p className="text-xs text-muted-foreground font-medium">Kapatılırsa 3. adımda portal seçimi gösterilmez.</p>
                      </div>
                      <input name="portal_rule_enabled" type="checkbox" defaultChecked={settings.portal_rule_enabled} className="w-6 h-6 rounded-md accent-primary" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">Portal Sabit Ücreti (₺)</label>
                      <input name="portal_price" type="number" defaultValue={settings.portal_price} className="w-full border-2 border-background bg-background rounded-xl px-4 py-3 font-black text-xl outline-none focus:border-primary" />
                    </div>
                </div>
              </div>
            </form>
         </div>

         <div className="space-y-8">
            <div className="bg-card border-2 border-primary/20 rounded-3xl shadow-xl shadow-primary/5 p-8 sm:p-10 space-y-8">
               <h2 className="text-2xl font-black border-b border-border pb-4 flex items-center text-primary">
                  <ListTree className="w-7 h-7 mr-4" /> Yayın Seçenekleri Yönetimi
               </h2>
               
               <p className="text-sm text-muted-foreground font-medium">Öğrencilerin seçebileceği ayları ve o aylardaki deneme yayınlarını buradan ekleyip çıkarabilirsiniz.</p>

               {/* YENİ YAYIN EKLEME FORMU */}
               <form action={addKendinSecOption} className="bg-muted/30 p-6 rounded-2xl border border-border space-y-4">
                  <h3 className="font-bold text-sm uppercase tracking-wider mb-2">Yeni Yayın Ekle</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground">Hangi Sınıf İçin?</label>
                      <select name="level_name" required className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:border-primary outline-none bg-background">
                         <option value="Genel">Genel (Tüm Sınıflar)</option>
                         {classes.map((cls: any) => (
                           <option key={cls.id} value={cls.name}>{cls.name}</option>
                         ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground">Ay İsmi</label>
                      <select name="month_name" required className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:border-primary outline-none bg-background">
                        {['Eylül', 'Ekim', 'Kasım', 'Aralık', 'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'].map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground">Yayın Evi</label>
                      <input name="publisher_name" placeholder="Örn: Limit Yayınları" required className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:border-primary outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground">Seri Adı</label>
                      <input name="series_name" placeholder="Örn: Kronometre Serisi" required className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:border-primary outline-none" />
                    </div>
                    <LogoInput />
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground">Fiyat (₺)</label>
                      <input name="price" type="number" step="0.01" min="0" placeholder="150" required className="w-full border border-border rounded-lg px-3 py-2 text-sm font-bold focus:border-primary outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground">Sıralama (Opsiyonel)</label>
                      <input name="sort_order" type="number" defaultValue="0" className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:border-primary outline-none" />
                    </div>
                  </div>
                  <Button type="submit" className="w-full mt-2" size="sm">
                    <Plus className="w-4 h-4 mr-2" /> Listeye Ekle
                  </Button>
               </form>

               {/* MEVCUT YAYINLAR LİSTESİ */}
               <div className="space-y-6">
                 {(() => {
                   // Aylara göre grupla
                   const months = Array.from(new Set(options.map((o: any) => o.month_name)))
                   return months.length === 0 ? (
                     <div className="text-center py-6 text-sm text-muted-foreground font-medium">Kayıtlı yayın bulunmuyor.</div>
                   ) : months.map((month: any) => (
                     <div key={month} className="space-y-3">
                       <h4 className="font-extrabold text-foreground uppercase tracking-widest text-sm bg-muted/50 px-4 py-2 rounded-lg border border-border inline-block">{month}</h4>
                       
                       <div className="space-y-4">
                         {classes.map((cls: any) => {
                           const optsForClass = options.filter((o: any) => o.month_name === month && o.level_name === cls.name)
                           if (optsForClass.length === 0) return null
                           return (
                             <div key={cls.id} className="border border-border/50 rounded-2xl p-4 bg-muted/10">
                               <h5 className="text-xs font-black text-primary mb-3">{cls.name} Yayınları</h5>
                               <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                 {optsForClass.map((opt: any) => (
                                   <div key={opt.id} className="border border-border rounded-2xl p-4 bg-background shadow-sm flex flex-col relative group hover:border-primary/50 transition-colors">
                                     <form action={async () => {
                                         "use server"
                                         await deleteKendinSecOption(opt.id)
                                       }}
                                       className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                     >
                                         <Button type="submit" variant="destructive" size="icon" className="h-6 w-6 rounded-full shadow-md">
                                           <Trash2 className="w-3 h-3" />
                                         </Button>
                                     </form>
                                     <div className="w-12 h-12 mx-auto mb-3 rounded-xl border border-border/50 bg-muted/30 flex items-center justify-center overflow-hidden">
                                        {opt.logo_url ? (
                                           <img src={opt.logo_url} alt={opt.publisher_name} className="w-full h-full object-cover rounded-xl" />
                                        ) : (
                                           <ImageIcon className="w-5 h-5 text-muted-foreground/50" />
                                        )}
                                     </div>
                                     <div className="text-center flex-1">
                                       <p className="font-bold text-sm leading-tight text-foreground line-clamp-1">{opt.publisher_name}</p>
                                       <p className="text-[10px] uppercase font-bold text-muted-foreground mt-1 line-clamp-1">{opt.series_name}</p>
                                     </div>
                                     <div className="text-center mt-3 pt-3 border-t border-border/50">
                                       <span className="font-black text-primary text-sm">₺{opt.price}</span>
                                     </div>
                                   </div>
                                 ))}
                               </div>
                             </div>
                           )
                         })}
                       </div>
                     </div>
                   ))
                 })()}
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}
