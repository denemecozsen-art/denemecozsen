"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PackageCard } from "@/components/cards/package-card"
import { heroPackages } from "@/content/packages"
import Link from "next/link"
import { LevelsPackagesSection } from "@/components/home/levels-packages-section"
import { BarChart, CheckCircle2, MapPin, Truck, ArrowRight, Calendar, Loader2 } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HeroCarousel } from "@/components/home/hero-carousel"
import { InstagramSection } from "@/components/home/instagram-section"
import { createClient } from "@/lib/supabase/client"

const faqs = [
  { question: "Denemeler nasıl gönderiliyor?", answer: "Türkiye geneli denemeler, adrese teslim paketler şeklinde kargo ile düzenli olarak evlerinize gönderilir." },
  { question: "Portal destekli paket ile portalsız paket arasındaki fark nedir?", answer: "Portal destekli paketlerde Türkiye geneli sıralamanızı, detaylı sonuç analizlerinizi ve eksik konu kazanım karnenizi görebildiğiniz özel bir öğrenci paneli erişimi bulunmaktadır." },
  { question: "Cevap anahtarlarına nasıl ulaşılır?", answer: "Öğrenci paneli üzerinden veya sitemizdeki cevap anahtarları sayfasından ilgili sınavın PDF çözüm anahtarına kolayca erişebilirsiniz." },
  { question: "Sonuçlar ne zaman açıklanır?", answer: "Optiğinizi sisteme girdikten kısa bir süre sonra Türkiye geneli sonuçlarınız anlık olarak panelinize yansımaktadır." },
  { question: "Hangi sınıflar için paketler mevcut?", answer: "5, 6, 7. sınıflar, LGS hazırlık (8. sınıf) ile YKS ve TYT hazırlık grupları için güncel deneme paketlerimiz bulunmaktadır." },
  { question: "Erken kayıt fırsatı nedir?", answer: "2026-2027 eğitim yılı için kontenjanlar dolmadan avantajlı fiyatlar ile katılabildiğiniz özel ve öncelikli bir kayıt sistemidir." }
]

export default function HomePage() {
  const supabase = createClient()
  const [mounted, setMounted] = useState(false)
  const [blogPosts, setBlogPosts] = useState<any[]>([])
  const [blogLoading, setBlogLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    fetchBlogPosts()
  }, [])

  async function fetchBlogPosts() {
    try {
      setBlogLoading(true)
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false, nullsFirst: false })
        .limit(3)
      
      if (error) {
        // Table may not exist yet — fail silently
        setBlogPosts([])
        return
      }
      if (data) setBlogPosts(data)
    } catch {
      // Table may not exist yet — fail silently
      setBlogPosts([])
    } finally {
      setBlogLoading(false)
    }
  }
  return (
    <>
      {/* HERO SECTION */}
      <section className="bg-muted overflow-hidden">
        <div className="container px-4 py-20 lg:py-32 mx-auto lg:max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent font-semibold text-sm">
              YENİ NESİL DENEME PLATFORMU
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary">
              Türkiye geneli <br />
              denemelerle <br />
              <span className="text-accent">seviyeni ölç</span>, <br />
              sınava <br />
              planlı hazırlan.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Denemelerle evine gelsin, optiğini kodla, sıralaman ve konu analizin hemen gör.
              Akademik başarısı için hazırlanmış profesyonel takip sistemi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/paketler">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg w-full sm:w-auto h-14 px-8">
                  Paketleri İncele
                </Button>
              </Link>
              <Link href="/erken-kayit">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold bg-background border-2 border-border">
                  Erken Kayıt Ol (2026-2027)
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <HeroCarousel />
          </div>
        </div>
      </section>

      {/* TRUST CARDS */}
      <section className="container mx-auto px-4 lg:max-w-7xl -mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: BarChart, title: "Türkiye geneli sıralama" },
            { icon: Truck, title: "Adrese Teslim" },
            { icon: CheckCircle2, title: "Hızlı Analiz" },
            { icon: MapPin, title: "Seçili Yayınlar" },
          ].map((card, i) => (
            <div key={i} className="bg-background rounded-2xl p-6 shadow-lg border border-border flex flex-col items-center justify-center text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <card.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-sm md:text-base text-primary">{card.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="bg-primary text-primary-foreground py-12 md:py-16 mt-20">
        <div className="container mx-auto px-4 lg:max-w-7xl">
          <div className="bg-primary-foreground/10 rounded-3xl p-6 md:p-10 border border-primary-foreground/20">
            <div className="flex items-center justify-center gap-4 md:gap-12 lg:gap-20 overflow-x-auto pb-2">
              {[
                { value: "10.000", label: "Ulaştırılan Deneme", border: "border-emerald-400" },
                { value: "8.000", label: "Aktif Öğrenci", border: "border-sky-400" },
                { value: "%98", label: "Memnuniyet Oranı", border: "border-amber-400" },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center gap-2 md:gap-3 shrink-0">
                  <div className={`w-16 h-16 md:w-28 md:h-28 lg:w-36 lg:h-36 rounded-full border-3 md:border-4 ${stat.border} flex items-center justify-center bg-primary-foreground/5 backdrop-blur-sm`}>
                    <span className="text-lg md:text-3xl lg:text-5xl font-extrabold">{stat.value}</span>
                  </div>
                  <p className="text-[10px] md:text-sm font-bold text-primary-foreground/80 text-center max-w-[80px] md:max-w-none leading-tight">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <LevelsPackagesSection />


      {/* HOW IT WORKS */}
      <section className="bg-background py-12 md:py-16 border-t border-border">
        <div className="container mx-auto px-4 lg:max-w-6xl">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-xl md:text-3xl font-bold text-primary">Sistem Nasıl İşler?</h2>
          </div>
          <div className="flex items-center justify-center gap-2 md:gap-8 relative max-w-4xl mx-auto overflow-x-auto pb-4 hide-scrollbar">
            {[
              { icon: "🛍️", title: "Paketini Seç", desc: "Sana uygun deneme paketini belirle ve kaydını tamamla." },
              { icon: "📦", title: "Denemen Gelsin", desc: "Deneme kitapçıkların kargo ile düzenli olarak sana ulaşsın." },
              { icon: "📈", title: "Sonucunu Gör", desc: "Optiğini okut, Türkiye geneli sıralamanı anında öğren." },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-2 md:space-y-3 relative z-10 min-w-[100px] md:min-w-[130px] flex-1 px-1">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-muted rounded-full shadow-sm flex items-center justify-center text-lg md:text-2xl shrink-0 ring-4 ring-background">
                  {step.icon}
                </div>
                <div className="space-y-1 md:space-y-2">
                  <h3 className="text-xs md:text-lg font-bold text-primary">{step.title}</h3>
                  <p className="text-muted-foreground text-[10px] md:text-sm leading-relaxed max-w-[200px] md:max-w-[240px] mx-auto">{step.desc}</p>
                </div>
                {/* Divider between steps */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-6 right-0 w-8 h-px bg-border/50 -translate-x-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG SECTION */}
      {/* BLOG SECTION */}
      <section className="py-16 md:py-24 bg-muted border-t border-border">
        <div className="container mx-auto px-4 lg:max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 gap-4">
            <div className="space-y-2 md:space-y-4 max-w-2xl">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary">Rehberlik & Blog</h2>
              <p className="text-sm md:text-base text-muted-foreground">Sınav sürecinde işinize yarayacak, motivasyon ve taktik içeren güncel içerikler.</p>
            </div>
            <Link href="/blog">
              <Button variant="outline" className="hidden md:flex gap-2 font-semibold hover:bg-primary hover:text-primary-foreground transition-colors">
                Tüm Yazıları Gör <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          <div className="flex overflow-x-auto gap-4 md:gap-6 pb-6 snap-x hide-scrollbar md:grid md:grid-cols-3 md:overflow-visible">
            {blogLoading ? (
              <div className="col-span-3 flex justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : blogPosts.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-muted-foreground text-sm">
                Henüz blog yazısı yayınlanmamış.
              </div>
            ) : (
              blogPosts.map((post: any) => (
                <Link href={`/blog/${post.slug}`} key={post.id} className="min-w-[260px] max-w-[85vw] sm:min-w-[45vw] md:min-w-0 md:w-auto shrink-0 snap-center group cursor-pointer rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-lg transition-all flex flex-col">
                  {post.image_url && (
                    <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={post.image_url} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </div>
                  )}
                  <div className="p-4 md:p-6 space-y-3 md:space-y-4 flex-1 flex flex-col">
                    <div className="flex items-center justify-between text-xs md:text-sm text-muted-foreground font-medium">
                      <span className="flex items-center"><Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />{post.published_at ? new Date(post.published_at).toLocaleDateString('tr-TR') : new Date(post.created_at).toLocaleDateString('tr-TR')}</span>
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-[10px] md:text-xs">{post.category || 'Genel'}</span>
                    </div>
                    <h3 className="font-bold text-lg md:text-xl text-primary leading-tight line-clamp-2">{post.title}</h3>
                    <p className="text-sm md:text-base text-muted-foreground line-clamp-3 leading-relaxed flex-1">{post.seo_description || post.content?.substring(0, 100)}</p>
                    <div className="pt-2 mt-auto">
                      <span className="text-sm md:text-base text-accent font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Devamını Oku <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
          <div className="mt-2 flex justify-center md:hidden">
            <Link href="/blog" className="w-full">
               <Button variant="outline" className="w-full gap-2 font-semibold">Tüm Yazıları Gör <ArrowRight className="w-4 h-4"/></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* INSTAGRAM SECTION */}
      <InstagramSection />

      {/* FAQ SECTION */}
      <section className="bg-muted py-24">
        <div className="container mx-auto px-4 lg:max-w-3xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Sıkça Sorulan Sorular</h2>
            <p className="text-muted-foreground">Aklınıza takılan sorular ve süreçle ilgili bilmeniz gereken detaylar.</p>
          </div>
          <Accordion className="w-full bg-background rounded-2xl px-6 py-4 shadow-sm">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-border">
                <AccordionTrigger className="text-left font-semibold text-primary hover:text-accent hover:no-underline py-4 text-base md:text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-base pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FINAL CTA AREA */}
      <section className="container mx-auto px-4 lg:max-w-7xl my-24">
        <div className="bg-accent rounded-[32px] p-12 text-center text-accent-foreground flex flex-col items-center justify-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <h2 className="text-4xl md:text-5xl font-extrabold relative z-10">Hemen Paketini Seç, Geleceğini Garantile</h2>
          <p className="text-lg text-accent-foreground/90 max-w-2xl relative z-10">
            Binlerce öğrenci arasındaki yerini al, sınav stresini profesyonel bir takiple yen.
          </p>
          <div className="flex gap-4 relative z-10">
            <Link href="/erken-kayit">
              <Button className="bg-background text-primary hover:bg-background/90 text-lg py-6 px-10 font-bold">
                Erken Kayıt Ol
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </>
  )
}
