import { GlobalBackButton } from "@/components/ui/back-button"
import { Calendar, User, Clock, Share2 } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!post) {
    notFound()
  }

  return (
    <article className="min-h-screen bg-background pb-20">
      {/* HEADER SECTION */}
      <div className="w-full h-[40vh] md:h-[50vh] bg-muted relative overflow-hidden">
        {post.image_url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img 
            src={post.image_url} 
            alt={post.title} 
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-end pb-12">
          <div className="container mx-auto px-4 lg:max-w-4xl">
            <GlobalBackButton className="mb-6 -ml-2 text-foreground/80 hover:text-foreground hover:bg-foreground/10" />
            
            <div className="space-y-4">
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {post.category || 'Genel'}
              </span>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-tight">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-muted-foreground pt-4">
                <div className="flex items-center"><User className="w-4 h-4 mr-2" /> {post.author}</div>
                <div className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {post.published_at ? new Date(post.published_at).toLocaleDateString('tr-TR') : new Date(post.created_at).toLocaleDateString('tr-TR')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ARTICLE CONTENT */}
      <div className="container mx-auto px-4 lg:max-w-4xl pt-12">
        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-primary prose-a:text-accent">
          {post.seo_description && (
            <p className="lead text-xl text-muted-foreground font-medium mb-8">
              {post.seo_description}
            </p>
          )}
          
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        <div className="mt-16 pt-8 border-t border-border flex justify-between items-center">
          <div className="font-semibold text-muted-foreground">Bu yazıyı faydalı buldunuz mu?</div>
          <button className="flex items-center bg-muted hover:bg-muted/80 text-foreground px-4 py-2 rounded-full font-bold transition">
             <Share2 className="w-4 h-4 mr-2" /> Paylaş
          </button>
        </div>
      </div>
    </article>
  )
}
