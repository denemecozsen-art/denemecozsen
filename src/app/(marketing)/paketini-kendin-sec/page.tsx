import { createClient } from "@/lib/supabase/server"
import { ClientWizard } from "./client-wizard"

export const dynamic = "force-dynamic"

export default async function CustomPackagePage() {
  const supabase = await createClient()

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

  const { data: levelsData } = await supabase
    .from('levels')
    .select('id, name')
    .order('sort_order', { ascending: true })

  const hasTables = settingsError?.code !== '42P01' && optionsError?.code !== '42P01'

  const settings = settingsData || {
    hero_title: 'Paketini Oluştur',
    step1_desc: 'Sana en uygun kaynakları görmek için eğitim seviyeni belirle.',
    step2_desc: 'Dilediğiniz Ayı ve Yayını Seçin. Seçtiğiniz sınıf için dilediğin ayın kurumsal denemelerini sepete ekle.',
    step3_desc: 'Netlerinizi görebileceğiniz, dijital karnelere ulaşabileceğiniz analiz panelini paketinize ekleyin.',
    shipping_rule_enabled: true,
    shipping_free_threshold: 3,
    shipping_penalty_fee: 150,
    portal_price: 100
  }

  const options = optionsData || []

  if (!hasTables) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-8 bg-amber-50 text-amber-800 rounded-xl border border-amber-200 text-center font-medium max-w-lg">
          <p className="font-bold text-lg mb-2">Veritabanı Kurulumu Gerekli</p>
          <p>Lütfen "schema_kendin_sec.sql" dosyasını çalıştırarak gerekli tabloları oluşturun.</p>
        </div>
      </div>
    )
  }

  // YKS ve Mezun birleştirme: Aynı yayınları paylaşırlar
  const rawClasses = levelsData?.map((l: any) => ({
    id: l.name,
    label: l.name.split(' ')[0] || l.name,
    sub: l.name.toUpperCase().includes("SINIF") ? "SINIF" : (l.name.toUpperCase().includes("MEZUN") ? "MEZUN" : "HAZIRLIK")
  })) || []

  // YKS ve Mezun'u birleştir
  const yksIndex = rawClasses.findIndex((c: any) => c.id.toUpperCase().includes('YKS') || c.id.includes('12'))
  const mezunIndex = rawClasses.findIndex((c: any) => c.id.toUpperCase().includes('MEZUN'))
  
  let classes = rawClasses
  if (yksIndex !== -1 && mezunIndex !== -1) {
    const merged = {
      id: rawClasses[yksIndex].id, // YKS id'sini kullan, filtreleme için
      label: `${rawClasses[yksIndex].label} / Mezun`,
      sub: "YKS HAZIRLIK"
    }
    classes = rawClasses.filter((_: any, i: number) => i !== yksIndex && i !== mezunIndex)
    classes.push(merged)
  }

  return <ClientWizard settings={settings} options={options} classes={classes} />
}
