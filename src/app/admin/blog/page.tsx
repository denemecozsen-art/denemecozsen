"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Plus, Search, Edit, Trash, Eye, Globe, Loader2 } from "lucide-react"
import Link from "next/link"
import { buildAdminPath } from "@/lib/admin-config"
import { createClient } from "@/lib/supabase/client"

export default function AdminBlogPage() {
  const supabase = createClient()
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    setLoading(true)
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setPosts(data)
    setLoading(false)
  }

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const publishedCount = posts.filter(p => p.status === 'published').length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Blog Yönetimi
          </h1>
          <p className="text-muted-foreground text-sm mt-1">SEO uyumlu makaleler, duyurular ve rehberlik yazıları yayınlayın.</p>
        </div>
        <Link href={buildAdminPath("/blog/yeni")}>
           <Button className="font-bold whitespace-nowrap">
              <Plus className="w-4 h-4 mr-2" /> Yeni Yazı Ekle
           </Button>
        </Link>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm">
         <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/20">
            <div className="relative w-full sm:w-80">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
               <input 
                 type="text" 
                 placeholder="Yazılarda başlık veya içerik ara..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" 
               />
            </div>
            
            <div className="flex w-full sm:w-auto gap-2">
               <select className="bg-background border border-border rounded-lg px-4 py-2 text-sm outline-none w-full sm:w-auto appearance-none pr-8">
                  <option>Toptan İşlemler</option>
                  <option>Seçilenleri Sil</option>
                  <option>Yayından Kaldır</option>
               </select>
               <Button variant="outline" className="text-muted-foreground whitespace-nowrap">
                  Uygula
               </Button>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                  <tr>
                     <th className="px-6 py-4 w-12"><input type="checkbox" className="rounded" /></th>
                     <th className="px-6 py-4 font-semibold">Yazı Başlığı</th>
                     <th className="px-6 py-4 font-semibold">Yazar</th>
                     <th className="px-6 py-4 font-semibold">Tarih</th>
                     <th className="px-6 py-4 font-semibold">Durum</th>
                     <th className="px-6 py-4 font-semibold text-right">İşlemler</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground mx-auto" />
                      </td>
                    </tr>
                  ) : filteredPosts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                        Henüz blog yazısı eklenmemiş.
                      </td>
                    </tr>
                  ) : (
                    filteredPosts.map((post: any) => (
                      <tr key={post.id} className="hover:bg-muted/30 transition-colors group">
                         <td className="px-6 py-4"><input type="checkbox" className="rounded border-border" /></td>
                         <td className="px-6 py-4">
                            <div className="font-bold text-foreground hover:text-primary cursor-pointer transition">{post.title}</div>
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                               {post.status === "published" && <Link href={`/blog/${post.slug}`} className="hover:text-primary font-medium flex items-center"><Globe className="w-3 h-3 mr-1" /> Sitede Gör</Link>}
                            </div>
                         </td>
                         <td className="px-6 py-4 font-medium">{post.author}</td>
                         <td className="px-6 py-4 text-muted-foreground text-xs">{new Date(post.created_at).toLocaleDateString('tr-TR')}</td>
                         <td className="px-6 py-4">
                           <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              post.status === "published" ? "bg-success/10 text-success" : 
                              post.status === "draft" ? "bg-accent/10 text-accent" : 
                              "bg-muted text-muted-foreground"
                           }`}>
                             {post.status === "published" ? "Yayında" : post.status === "draft" ? "Taslak" : post.status}
                           </span>
                         </td>
                         <td className="px-6 py-4 text-right">
                           <div className="flex items-center justify-end gap-2">
                              <button className="p-2 text-muted-foreground hover:text-primary transition-colors bg-background border border-border rounded-md shadow-sm tooltip-trigger"><Edit className="w-4 h-4" /></button>
                              <button className="p-2 text-muted-foreground hover:text-destructive transition-colors bg-background border border-border rounded-md shadow-sm"><Trash className="w-4 h-4" /></button>
                           </div>
                         </td>
                      </tr>
                    ))
                  )}
               </tbody>
            </table>
         </div>

         <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground gap-4">
            <span>Toplam <strong>{posts.length}</strong> yazı bulundu. ({publishedCount} Yayında)</span>
            <div className="flex gap-2 w-full sm:w-auto justify-end">
               <Button variant="outline" size="sm" disabled>Önceki</Button>
               <Button variant="outline" size="sm" disabled>Sonraki</Button>
            </div>
         </div>
      </div>
    </div>
  )
}
