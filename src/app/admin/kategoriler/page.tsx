import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { createCategory, deleteCategory } from "./actions"
import { Trash2, Plus } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function CategoriesAdminPage() {
  const supabase = await createClient()
  
  // NOTE: If 'categories' table does not exist yet, this will fail gracefully or return empty array if we handle it.
  // We use standard error catching for robust loading.
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: false })

  const hasCategoriesTable = error?.code !== '42P01' // 42P01 is Postgres "undefined_table"
  const displayCategories = categories || []

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Kategori Yönetimi</h2>
        <p className="text-muted-foreground">Blog yazılarınızı veya içeriklerinizi gruplamak için kategorileri yönetin.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* ADD CATEGORY FORM */}
        <Card className="lg:col-span-1 border-border shadow-sm h-fit">
          <CardHeader>
            <CardTitle>Yeni Ekle</CardTitle>
            <CardDescription>Sisteme yeni bir içerik kategorisi tanımlayın.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={async (formData) => { "use server"; await createCategory(formData); }} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Kategori Adı</label>
                <Input name="name" placeholder="Örn: Rehberlik" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Açıklama (Opsiyonel)</label>
                <Input name="description" placeholder="Kısa bir açıklama girin..." />
              </div>
              <div className="pt-3 border-t border-border">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">SEO Ayarları</p>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">SEO Başlığı (meta title)</label>
                    <Input name="seo_title" placeholder="Örn: Rehberlik Makaleleri | Çözsen" />
                    <p className="text-[10px] text-muted-foreground">Boş bırakılırsa kategori adı kullanılır. Max 60 karakter.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Meta Açıklaması</label>
                    <Input name="seo_description" placeholder="Google arama sonucunda görünecek açıklama" />
                    <p className="text-[10px] text-muted-foreground">Max 160 karakter.</p>
                  </div>
                </div>
              </div>
              <Button type="submit" className="w-full">
                <Plus className="w-4 h-4 mr-2" /> Oluştur
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* LIST CATEGORIES */}
        <Card className="lg:col-span-2 border-border shadow-sm">
          <CardHeader>
            <CardTitle>Mevcut Kategoriler</CardTitle>
            <CardDescription>Sistemdeki tüm kategoriler ve kısa yolları.</CardDescription>
          </CardHeader>
          <CardContent>
             {!hasCategoriesTable ? (
                <div className="bg-destructive/10 text-destructive p-4 rounded-xl border border-destructive/20 mb-4 text-sm font-medium">
                  Veritabanında henüz "categories" tablosu bulunmuyor. Supabase üzerinden bu tabloyu (id, name, slug, description, created_at) oluşturmanız gerekmektedir.
                </div>
             ) : displayCategories.length === 0 ? (
               <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-xl">
                 Kayıtlı kategori bulunamadı.
               </div>
             ) : (
               <div className="rounded-md border">
                 <div className="w-full">
                    {displayCategories.map((cat, i) => (
                      <div key={cat.id} className={`flex items-center justify-between p-4 ${i !== displayCategories.length - 1 ? 'border-b border-border' : ''} hover:bg-muted/50 transition-colors`}>
                        <div>
                          <p className="font-semibold text-primary">{cat.name}</p>
                          <p className="text-sm text-muted-foreground">/{cat.slug}</p>
                        </div>
                        <form action={async () => {
                          "use server"
                          await deleteCategory(cat.id)
                        }}>
                          <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </form>
                      </div>
                    ))}
                 </div>
               </div>
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
