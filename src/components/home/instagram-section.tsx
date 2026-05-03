"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Camera, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

interface InstagramEmbed {
  id: string
  name: string
  embed_url: string
  sort_order: number
  is_active: boolean
}

export function InstagramSection() {
  const supabase = createClient()
  const [embeds, setEmbeds] = useState<InstagramEmbed[]>([])
  const [loading, setLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchEmbeds()
  }, [])

  // Instagram embed.js yüklendikten sonra process çağır
  useEffect(() => {
    if (embeds.length === 0) return

    function loadAndProcess() {
      if ((window as any).instgrm) {
        ;(window as any).instgrm.Embeds.process()
        return
      }
      const script = document.createElement("script")
      script.async = true
      script.src = "//www.instagram.com/embed.js"
      script.onload = () => {
        ;(window as any).instgrm?.Embeds?.process()
      }
      document.body.appendChild(script)
    }

    loadAndProcess()
  }, [embeds])

  async function fetchEmbeds() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('instagram_embeds')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (!error && data) {
        // Only keep entries with valid Instagram URLs
        setEmbeds(data.filter((d: InstagramEmbed) =>
          d.embed_url && d.embed_url.startsWith('https://www.instagram.com/')
        ))
      }
    } catch {
      // Table may not exist yet
    }
    setLoading(false)
  }

  function scroll(direction: 'left' | 'right') {
    if (scrollRef.current) {
      const amount = 400
      scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' })
    }
  }

  if (loading) {
    return (
      <section className="py-12 bg-background border-t border-border">
        <div className="container mx-auto px-4 lg:max-w-7xl flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </section>
    )
  }

  if (embeds.length === 0) return null

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-background to-purple-50/20 border-t border-border">
      <div className="container mx-auto px-4 lg:max-w-7xl" ref={containerRef}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-200">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-primary">Instagram&apos;da Biz</h2>
              <p className="text-sm text-muted-foreground font-medium">Güncel paylaşımlarımızdan haberdar olun</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => scroll('left')} className="w-10 h-10 rounded-xl border border-border bg-card flex items-center justify-center hover:bg-muted transition shadow-sm">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => scroll('right')} className="w-10 h-10 rounded-xl border border-border bg-card flex items-center justify-center hover:bg-muted transition shadow-sm">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Instagram Embed Cards */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {embeds.map((embed) => (
            <div
              key={embed.id}
              className="snap-start shrink-0"
              style={{ minWidth: 326, maxWidth: 540 }}
            >
              <blockquote
                className="instagram-media"
                data-instgrm-permalink={embed.embed_url}
                data-instgrm-version="14"
                style={{
                  background: '#FFF',
                  border: 0,
                  borderRadius: '3px',
                  boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
                  margin: '1px',
                  maxWidth: '540px',
                  minWidth: '326px',
                  padding: 0,
                  width: 'calc(100% - 2px)',
                }}
              />
              {/* Custom caption — sadece 2 satır */}
              <p className="mt-3 px-2 text-sm font-bold text-foreground line-clamp-2" title={embed.name}>
                {embed.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
