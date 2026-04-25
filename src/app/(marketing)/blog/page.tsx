"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { GlobalBackButton } from "@/components/ui/back-button"
import { Calendar, ArrowRight, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function BlogListPage() {
  const supabase = createClient()
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    setLoading(true)
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false, nullsFirst: false })
    if (data) setPosts(data)
    setLoading(false)
  }

  return (
    <div className="py-12 bg-background min-h-screen">
      <div className="container mx-auto px-4 lg:max-w-7xl">
        <GlobalBackButton className="mb-6 -ml-2" />
        
        <div className="mb-12 space-y-4">
           <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">Blog & Rehberlik</h1>
           <p className="text-xl text-muted-foreground max-w-2xl">Sınav maratonunda ihtiyacın olan tüm taktikler, güncel gelişmeler ve motivasyon içerikleri burada.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            Henüz blog yazısı yayınlanmamış.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {posts.map((post) => (
                <Link href={`/blog/${post.slug}`} key={post.id} className="group cursor-pointer rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-xl transition-all flex flex-col h-full">
                  {post.image_url && (
                    <div className="aspect-[16/10] w-full overflow-hidden bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={post.image_url} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>
                  )}
                  <div className="p-6 space-y-4 flex-1 flex flex-col">
                     <div className="flex items-center justify-between text-sm text-muted-foreground font-medium">
                        <span className="flex items-center"><Calendar className="w-4 h-4 mr-2" />{post.published_at ? new Date(post.published_at).toLocaleDateString('tr-TR') : new Date(post.created_at).toLocaleDateString('tr-TR')}</span>
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">{post.category || 'Genel'}</span>
                     </div>
                     <h3 className="font-bold text-xl text-primary leading-tight line-clamp-2">{post.title}</h3>
                     <p className="text-muted-foreground line-clamp-3 leading-relaxed flex-1">{post.seo_description || post.content?.substring(0, 150)}</p>
                     <div className="pt-4 mt-auto border-t border-border/50">
                        <span className="text-accent font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                          Haberi Oku <ArrowRight className="w-4 h-4"/>
                        </span>
                     </div>
                  </div>
                </Link>
             ))}
          </div>
        )}
      </div>
    </div>
  )
}
