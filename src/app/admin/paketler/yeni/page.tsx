"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
   Save, Eye, ListOrdered, Tag, CreditCard, Image as ImageIcon, Plus, Trash2,
   ChevronDown, ArrowLeft, AlertCircle, Bold, Italic, Heading1, Heading2,
   List as ListIcon, ListOrdered as OrderedList, ImagePlus, Loader2, CheckCircle2, Edit2
} from "lucide-react"
import MediaPicker from "@/components/admin/MediaPicker"

// TIPTAP EDITOR IMPORTS
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TiptapImage from '@tiptap/extension-image'
import imageCompression from 'browser-image-compression'

// ICONS & BADGES PRESETS
const ICON_PRESETS = ["🚀", "⭐", "🔥", "💎", "🎯", "👑", "⚡", "📖", "🏆", "💡"]
const BADGE_PRESETS = [
   { id: "", label: "Rozet Yok" },
   { id: "Yeni Ürün", label: "Yeni Ürün (Yeşil)" },
   { id: "Çok Satan", label: "Çok Satan (Ateş)" },
   { id: "Fırsat", label: "Fırsat (Sarı)" },
   { id: "Tavsiye", label: "Uzman Tavsiyesi (Mavi)" },
]

function PackageBuilderInner() {
   const router = useRouter()
   const searchParams = useSearchParams()
   const editId = searchParams.get('id')
   const supabase = createClient()

   const [activeTab, setActiveTab] = useState("genel")
   const [isSaving, setIsSaving] = useState(false)
   const [errorMsg, setErrorMsg] = useState("")

   // Lookups
   const [dbLevels, setDbLevels] = useState<any[]>([])
   const [dbPublishers, setDbPublishers] = useState<any[]>([])

   // Basic Info
   const [title, setTitle] = useState("")
   const [slug, setSlug] = useState("")
   const [levelId, setLevelId] = useState("")
   const [badge, setBadge] = useState("")
   const [iconChar, setIconChar] = useState("🚀")
   const [trialCount, setTrialCount] = useState<number>(0)

   // Content & SEO
   const [shortDesc, setShortDesc] = useState("")
   const [seoTitle, setSeoTitle] = useState("")
   const [seoDesc, setSeoDesc] = useState("")
   const [seoSlug, setSeoSlug] = useState("")
   const [images, setImages] = useState<{ id: string, url: string, name: string }[]>([])
   const [isImageUploading, setIsImageUploading] = useState(false)
   const fileInputRef = useRef<HTMLInputElement>(null)

   // Deliveries (Teslimat Ayrıntıları - Month Picker -> Date Range & Inline Publishers)
   const [deliveries, setDeliveries] = useState<{ id: string, start_date: string, end_date: string, month_or_period: string, content_desc: string, inline_publishers: { id: string, url: string, name: string }[] }[]>([])

   // Publishers & Series (Media Library Based)
   const [selectedPublishers, setSelectedPublishers] = useState<{ id: string, media_url: string, series: string, old_pub_id?: string }[]>([])

   // Pricing & Settings (Advanced)
   const [paymentCycle, setPaymentCycle] = useState("Aylık")
   const [price, setPrice] = useState<number>(0)
   const [priceOld, setPriceOld] = useState<number>(0)
   const [isActive, setIsActive] = useState(true)
   const [packageType, setPackageType] = useState("Aylık") // Aylık veya Yıllık
   const [durationDays, setDurationDays] = useState<number>(30)
   const [hasPortalSupport, setHasPortalSupport] = useState(false)

   // TIPTAP EDITOR SETUP (LONG DESC)
   const editor = useEditor({
      immediatelyRender: false,
      extensions: [
         StarterKit,
         TiptapImage.configure({ inline: true, HTMLAttributes: { class: 'rounded-xl max-w-full h-auto my-4 border border-border shadow-sm' } })
      ],
      content: '<p>Gelişmiş paket açıklamasına buradan başlayın...</p>',
      editorProps: {
         attributes: {
            class: 'prose prose-sm sm:prose-base dark:prose-invert focus:outline-none min-h-[300px] w-full max-w-none p-6 font-medium bg-background',
         },
      },
   })

   // TIPTAP EDITOR SETUP (SHORT DESC)
   const shortEditor = useEditor({
      immediatelyRender: false,
      extensions: [StarterKit],
      content: '<p>Kısa ve vurucu açıklamanızı (Spot) buraya yazın...</p>',
      editorProps: {
         attributes: {
            class: 'prose prose-sm dark:prose-invert focus:outline-none min-h-[120px] w-full max-w-none p-4 font-medium bg-background',
         },
      },
   })

   useEffect(() => {
      loadLookups()
      // defaultType parametresiyle Yıllık ön seçimli başlatma
      const defaultType = searchParams.get('defaultType')
      if (defaultType) {
         setPackageType(decodeURIComponent(defaultType))
         setPaymentCycle(decodeURIComponent(defaultType) === 'Yıllık' ? 'Yıllık' : 'Aylık')
         setDurationDays(decodeURIComponent(defaultType) === 'Yıllık' ? 365 : 30)
      }
      if (editId) loadPackageData(editId)
   }, [editId])

   useEffect(() => {
      // Auto SEO Generation trigger (Only if creating new or manually updating)
      if (!editId && title) {
         setSeoSlug(generateSlug(title))
         setSeoTitle(`${title} | Çözsen Deneme Kulübü`)
         const generatedDesc = `Yeni ${title} ile öğrencilerinizi başarıya taşıyın. Uzman yayınevi denemeleri kapınıza kadar kargo ile gelsin. Hemen incele!`
         if (!seoDesc) setSeoDesc(generatedDesc)
      }
   }, [title])

   // ================= DATA LOADING =================
   async function loadLookups() {
      const { data: levels } = await supabase.from('levels').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: true })
      if (levels) setDbLevels(levels)

      const { data: pubs } = await supabase.from('publishers').select('*').order('name', { ascending: true })
      if (pubs) setDbPublishers(pubs)
   }

   async function loadPackageData(id: string) {
      const { data: pkg } = await supabase.from('packages').select('*').eq('id', id).single()
      if (pkg) {
         setTitle(pkg.title || "")
         setSlug(pkg.slug || "")
         setLevelId(pkg.level_id || "")
         setBadge(pkg.badge || "")
         setIconChar(pkg.icon || "🚀")
         setTrialCount(Number(pkg.trial_count) || 0)
         setShortDesc(pkg.short_desc || "")
         setSeoTitle(pkg.seo_title || "")
         setSeoDesc(pkg.seo_description || "")
         setSeoSlug(pkg.seo_slug || pkg.slug || "")
         setImages(pkg.images || (pkg.cover_image ? [{ id: 'old', url: pkg.cover_image, name: 'Kapak Görseli' }] : []))

         setPaymentCycle(pkg.payment_cycle || "Aylık")
         setPackageType(pkg.package_type || "Aylık")
         setDurationDays(pkg.duration_days || 30)
         setHasPortalSupport(pkg.has_portal_support ?? false)
         setPrice(pkg.price || pkg.price_monthly || 0) // Fallback to old schema column temporarily if null
         setPriceOld(pkg.price_old || pkg.price_monthly_old || 0)
         setIsActive(pkg.is_active ?? true)

         if (editor && pkg.content_html) {
            editor.commands.setContent(pkg.content_html)
         } else if (editor && pkg.long_desc) {
            editor.commands.setContent(pkg.long_desc) // Fallback for old records
         }

         if (shortEditor && pkg.short_desc) {
            shortEditor.commands.setContent(pkg.short_desc)
         }
      }

      const { data: pubRels } = await supabase.from('package_publishers').select('*').eq('package_id', id)
      if (pubRels) {
         setSelectedPublishers(pubRels.map((p: any) => ({
            id: p.id || Math.random().toString(),
            media_url: p.media_url || "",
            series: p.series_name || "",
            old_pub_id: p.publisher_id
         })))
      }

      const { data: dels } = await supabase.from('package_deliveries').select('*').eq('package_id', id).order('sort_order', { ascending: true })
      if (dels) {
         setDeliveries(dels.map((d: any) => ({
            id: d.id || Math.random().toString(),
            start_date: d.start_date || "",
            end_date: d.end_date || "",
            month_or_period: d.month_or_period || "",
            content_desc: d.content_desc || "",
            inline_publishers: d.inline_publishers || []
         })))
      }
   }

   // ================= HELPERS & UPLOADERS =================
   const generateSlug = (text: string) => text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '')

   const uploadToStorage = async (file: File, bucket: string): Promise<string | null> => {
      try {
         const options = { maxSizeMB: 1, maxWidthOrHeight: 1200, useWebWorker: true, webp: true }
         const compressedFile = await imageCompression(file, options)

         const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`
         const { data, error } = await supabase.storage.from(bucket).upload(fileName, compressedFile, { cacheControl: '3600', upsert: false })

         if (error) throw error
         const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName)
         return urlData.publicUrl
      } catch (err: any) {
         console.error(err);
         alert("Görsel yüklenirken bir sorun oluştu.");
         return null;
      }
   }

   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      if (files.length === 0) return
      setIsImageUploading(true)

      const uploadedImages: { id: string, url: string, name: string }[] = []
      for (const file of files) {
         const publicUrl = await uploadToStorage(file, 'media')
         if (publicUrl) {
            uploadedImages.push({ id: Date.now().toString() + Math.random().toString(), url: publicUrl, name: file.name.split('.')[0] })
         }
      }

      setImages(prev => [...prev, ...uploadedImages])
      setIsImageUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
   }

   const removeImage = (id: string) => setImages(prev => prev.filter(img => img.id !== id))

   const renameImage = (id: string, newName: string) => {
      setImages(prev => prev.map(img => img.id === id ? { ...img, name: newName } : img))
   }

   const insertImageToEditor = async () => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = async (e: any) => {
         const file = e.target.files?.[0]
         if (file) {
            setIsSaving(true)
            const url = await uploadToStorage(file, 'media')
            if (url && editor) {
               editor.chain().focus().setImage({ src: url }).run()
            }
            setIsSaving(false)
         }
      }
      input.click()
   }

   // ================= SAVE LOGIC =================
   async function handleSave() {
      setErrorMsg("")
      setIsSaving(true)

      if (!title || !levelId) {
         setErrorMsg("Paket Adı ve Sınıf alanları zorunludur.")
         setIsSaving(false); return
      }

      const htmlContent = editor?.getHTML() || ""
      const jsonContent = editor?.getJSON() || {}
      const shortHtmlContent = shortEditor?.getHTML() || shortDesc

      const payload = {
         title,
         slug: slug || generateSlug(title),
         badge,
         icon: iconChar,
         short_desc: shortHtmlContent,
         seo_title: seoTitle,
         seo_description: seoDesc,
         seo_slug: seoSlug || slug || generateSlug(title),
         images: images,
         level_id: levelId || null,
         trial_count: trialCount.toString(),
         cover_image: images.length > 0 ? images[0].url : "",
         content_html: htmlContent,
         content_json: jsonContent,
         long_desc: "", // Deprecated column backwards compatibility
         payment_cycle: paymentCycle,
         package_type: packageType,
         duration_days: durationDays,
         has_portal_support: hasPortalSupport,
         price: price,
         price_old: priceOld,
         is_active: isActive
      }

      let savedId = editId

      if (editId) {
         const { error } = await supabase.from('packages').update(payload).eq('id', editId)
         if (error) { setErrorMsg(error.message); setIsSaving(false); return }
      } else {
         const { data, error } = await supabase.from('packages').insert([payload]).select().single()
         if (error) { setErrorMsg(error.message); setIsSaving(false); return }
         savedId = data.id
      }

      if (!savedId) return;

      // Save Publishers
      await supabase.from('package_publishers').delete().eq('package_id', savedId)
      if (selectedPublishers.length > 0) {
         const pubsToInsert = selectedPublishers.map(p => ({
            package_id: savedId,
            publisher_id: p.old_pub_id || null,
            media_url: p.media_url,
            series_name: p.series
         }))
         await supabase.from('package_publishers').insert(pubsToInsert)
      }

      // Save Deliveries
      await supabase.from('package_deliveries').delete().eq('package_id', savedId)
      if (deliveries.length > 0) {
         const delsToInsert = deliveries.map((d, idx) => ({
            package_id: savedId,
            month_or_period: d.month_or_period,
            start_date: d.start_date || null,
            end_date: d.end_date || null,
            inline_publishers: d.inline_publishers,
            content_desc: d.content_desc,
            sort_order: idx
         }))
         await supabase.from('package_deliveries').insert(delsToInsert)
      }

      setIsSaving(false)
      router.push('/uraz/paketler')
   }

   const togglePublisher = (pubId: string) => {
      const exists = selectedPublishers.find(p => p.id === pubId)
      if (exists) {
         setSelectedPublishers(selectedPublishers.filter(p => p.id !== pubId))
      } else {
         setSelectedPublishers([...selectedPublishers, { id: pubId, media_url: "", series: "" }])
      }
   }

   const updatePubSeries = (pubId: string, series: string) => {
      setSelectedPublishers(prev => prev.map(p => p.id === pubId ? { ...p, series } : p))
   }

   const tabs = [
      { id: "genel", label: "Genel Veri & İçerik", icon: Tag },
      { id: "mufredat", label: "Teslimat & Yayınevi", icon: ListOrdered },
      { id: "fiyat", label: "Satış & Fiyatlandırma", icon: CreditCard },
   ]

   return (
      <div className="space-y-8 pb-10">
         <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 border-b border-border pb-6">
            <div>
               <button onClick={() => router.push('/uraz/paketler')} className="text-muted-foreground hover:text-foreground flex items-center text-sm font-bold mb-4">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Listeye Dön
               </button>
               <div className="flex items-center gap-2 mb-2">
                  <span className="bg-primary/15 text-primary text-xs font-black uppercase tracking-widest px-3 py-1 rounded-md">ADVANCED PACKAGER</span>
                  {isActive ? <span className="bg-success/15 text-success text-xs font-black uppercase tracking-widest px-3 py-1 rounded-md">Aktif</span> : <span className="bg-destructive/15 text-destructive text-xs font-black uppercase px-3 py-1 rounded-md">Pasif</span>}
               </div>
               <h1 className="text-3xl font-black text-foreground mt-2">{title || "Yeni Kurumsal Paket"}</h1>
            </div>

            <div className="flex gap-3 w-full lg:w-auto shrink-0">
               <Button variant="outline" className="h-12 px-6 font-bold border-2 hover:bg-muted" onClick={() => window.open('/paketler', '_blank')}>
                  <Eye className="w-5 h-5 mr-2" /> Sitede Gör
               </Button>
               <Button onClick={handleSave} disabled={isSaving} className="h-12 px-8 font-black bg-primary rounded-xl hover:scale-105 transition-transform text-base shadow-xl shadow-primary/20">
                  {isSaving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                  {editId ? "Güncelle" : "Yayınla"}
               </Button>
            </div>
         </div>

         {errorMsg && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-xl flex items-center font-bold border-2 border-destructive/20">
               <AlertCircle className="w-5 h-5 mr-3" /> {errorMsg}
            </div>
         )}

         <div className="flex flex-col xl:flex-row gap-8">
            {/* TABS SIDEBAR */}
            <div className="w-full xl:w-72 shrink-0">
               <div className="bg-card border-2 border-border rounded-[2rem] p-4 shadow-sm sticky top-24">
                  <nav className="space-y-2">
                     {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center px-5 py-4 rounded-2xl transition-all font-black text-sm ${activeTab === tab.id ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                           <tab.icon className={`w-5 h-5 mr-4 ${activeTab === tab.id ? 'opacity-100' : 'opacity-70'}`} />
                           {tab.label}
                        </button>
                     ))}
                  </nav>
               </div>
            </div>

            {/* CONTENT AREA */}
            <div className="flex-1 min-w-0">

               {/* TAB 1: GENEL & ICERIK */}
               {activeTab === "genel" && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div className="bg-card border-2 border-border rounded-[2rem] p-8 shadow-sm space-y-8">
                     <h2 className="text-xl font-black text-primary border-b border-border pb-4">Temel Vitrin Kimliği</h2>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                           <label className="text-xs font-black text-muted-foreground uppercase">Paket Adı (*)</label>
                           <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Örn: Limit VIP Deneme Kampı" className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 text-lg font-bold outline-none focus:border-primary" />
                        </div>
                        <div className="space-y-3">
                           <label className="text-xs font-black text-muted-foreground uppercase">Bağlı Olduğu Sınıf (*)</label>
                           <select value={levelId} onChange={e => setLevelId(e.target.value)} className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-primary appearance-none">
                              <option value="">Kategori / Sınıf Seçin</option>
                              {dbLevels.map(lvl => <option key={lvl.id} value={lvl.id}>{lvl.name}</option>)}
                           </select>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                           <label className="text-xs font-black text-muted-foreground uppercase">Toplam Deneme Sayısı</label>
                           <input type="number" value={trialCount} onChange={e => setTrialCount(Number(e.target.value))} placeholder="15" className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-primary" />
                        </div>
                        <div className="space-y-3">
                           <label className="text-xs font-black text-muted-foreground uppercase">Özel Rozet Algoritması</label>
                           <select value={badge} onChange={e => setBadge(e.target.value)} className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-primary">
                              {BADGE_PRESETS.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
                           </select>
                        </div>
                        <div className="space-y-3">
                           <label className="text-xs font-black text-muted-foreground uppercase">Vitrin İkonu</label>
                           <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                              {ICON_PRESETS.map(icon => (
                                 <button key={icon} onClick={() => setIconChar(icon)} className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center text-xl transition-all border-2 ${iconChar === icon ? 'border-primary bg-primary/10' : 'border-border bg-background hover:border-primary/50'}`}>
                                    {icon}
                                 </button>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* OTOMATİK SEO YÖNETİMİ & KISA AÇIKLAMA */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     <div className="bg-card border-2 border-border rounded-[2rem] p-8 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 border-b border-border pb-4">
                           <div className="bg-primary/10 p-2 rounded-xl">
                              <Tag className="w-5 h-5 text-primary" />
                           </div>
                           <h2 className="text-xl font-black text-primary">Arama Motoru (SEO)</h2>
                        </div>

                        <div className="space-y-4">
                           <div className="space-y-2">
                              <label className="text-xs font-black text-muted-foreground uppercase text-primary">SEO Başlığı</label>
                              <input type="text" value={seoTitle} onChange={e => setSeoTitle(e.target.value)} className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-primary transition-colors" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-black text-muted-foreground uppercase text-primary">Kalıcı Bağlantı (Slug)</label>
                              <div className="flex items-center">
                                 <span className="bg-muted px-3 py-2.5 rounded-l-xl border border-r-0 border-border text-xs font-medium text-muted-foreground truncate max-w-[120px] md:max-w-none">cozsen.com/paket/</span>
                                 <input type="text" value={seoSlug} onChange={e => setSeoSlug(e.target.value)} className="flex-1 min-w-0 bg-muted/50 border border-border rounded-r-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-primary transition-colors" />
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-black text-muted-foreground uppercase text-primary">SEO Açıklaması</label>
                              <textarea rows={3} value={seoDesc} onChange={e => setSeoDesc(e.target.value)} className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-primary transition-colors resize-none"></textarea>
                           </div>
                        </div>
                     </div>

                     <div className="bg-card border-2 border-border rounded-[2rem] p-8 shadow-sm space-y-6 flex flex-col">
                        <div className="flex items-center justify-between border-b border-border pb-4">
                           <div className="flex items-center gap-2">
                              <div className="bg-primary/10 p-2 rounded-xl">
                                 <ImageIcon className="w-5 h-5 text-primary" />
                              </div>
                              <h2 className="text-xl font-black text-primary">Paket Görselleri</h2>
                           </div>
                           <Button onClick={() => fileInputRef.current?.click()} size="sm" variant="secondary" className="font-bold rounded-lg shadow-sm" disabled={isImageUploading}>
                              <Plus className="w-4 h-4 mr-2" /> Görsel Ekle
                           </Button>
                           <input type="file" accept="image/*" multiple ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                        </div>

                        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4 auto-rows-max place-content-start">
                           {images.map((img, idx) => (
                              <div key={img.id} className="group relative border-2 border-border rounded-2xl overflow-hidden bg-background shadow-sm hover:border-primary/50 transition-colors flex flex-col pb-8 aspect-square">
                                 <div className="absolute top-2 left-2 z-10 bg-black/60 text-white text-[10px] font-black px-2 py-1 rounded border border-white/20 backdrop-blur-sm shadow-xl">
                                    {idx === 0 ? "Kapak" : `${idx + 1}. Görsel`}
                                 </div>
                                 <button onClick={() => removeImage(img.id)} className="absolute top-2 right-2 z-10 bg-destructive/90 hover:bg-destructive text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-xl" title="Sil">
                                    <Trash2 className="w-4 h-4" />
                                 </button>

                                 <div className="w-full flex-1 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-muted flex items-center justify-center p-2 relative">
                                    <img src={img.url} alt={img.name} className="absolute inset-0 w-full h-full object-contain p-2 drop-shadow-md group-hover:scale-110 transition-transform duration-500" />
                                 </div>

                                 <div className="absolute bottom-0 h-8 inset-x-0 bg-background/95 backdrop-blur border-t border-border flex items-center px-1">
                                    <input type="text" value={img.name} onChange={(e) => renameImage(img.id, e.target.value)} placeholder="İsimlendir..." className="w-full bg-transparent text-xs font-bold text-center outline-none focus:text-primary transition-colors placeholder:text-muted-foreground/50" />
                                 </div>
                              </div>
                           ))}

                           {isImageUploading && (
                              <div className="border-2 border-dashed border-primary/40 rounded-2xl aspect-square flex flex-col items-center justify-center bg-primary/5 shadow-inner relative overflow-hidden">
                                 <div className="absolute inset-0 border-[4px] border-t-primary border-r-transparent border-b-primary/30 border-l-transparent rounded-full opacity-20 animate-spin" style={{ margin: "-20%" }}></div>
                                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg relative z-10 border border-primary/20">
                                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                                 </div>
                                 <span className="text-[10px] font-black text-primary mt-3 relative z-10 tracking-widest uppercase animate-pulse">Yükleniyor...</span>
                              </div>
                           )}

                           {images.length === 0 && !isImageUploading && (
                              <div onClick={() => fileInputRef.current?.click()} className="col-span-full border-2 border-dashed border-border rounded-2xl h-32 flex flex-col items-center justify-center text-muted-foreground hover:bg-primary/5 hover:border-primary hover:text-primary transition-colors cursor-pointer group">
                                 <ImageIcon className="w-8 h-8 mb-2 opacity-50 group-hover:scale-110 transition-transform" />
                                 <span className="text-sm font-bold">Resim yüklemek için tıklayın</span>
                              </div>
                           )}
                        </div>
                     </div>
                  </div>

                  {/* ADVANCED TIPTAP EDITOR SECTION */}
                  <div className="bg-card border-2 border-border rounded-[2rem] shadow-sm overflow-hidden flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-border">
                     {/* SHORT DESC */}
                     <div className="w-full lg:w-1/3 flex flex-col">
                        <div className="px-6 py-4 border-b border-border bg-muted/20 flex items-center justify-between">
                           <h3 className="font-black text-sm uppercase tracking-widest text-primary flex items-center gap-2"><ListIcon className="w-4 h-4" /> Kısa Açıklama</h3>
                        </div>
                        <div className="flex-1 bg-background">
                           <EditorContent editor={shortEditor} />
                        </div>
                     </div>

                     {/* LONG DESC */}
                     <div className="w-full lg:w-2/3 flex flex-col">
                        <div className="p-4 border-b border-border flex items-center gap-2 flex-wrap bg-muted/20">
                           <Button variant="ghost" size="sm" onClick={() => editor?.chain().focus().toggleBold().run()} className={editor?.isActive('bold') ? 'bg-muted' : ''}><Bold className="w-4 h-4" /></Button>
                           <Button variant="ghost" size="sm" onClick={() => editor?.chain().focus().toggleItalic().run()} className={editor?.isActive('italic') ? 'bg-muted' : ''}><Italic className="w-4 h-4" /></Button>
                           <div className="w-px h-6 bg-border mx-2" />
                           <Button variant="ghost" size="sm" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className={editor?.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}><Heading1 className="w-4 h-4" /></Button>
                           <Button variant="ghost" size="sm" onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} className={editor?.isActive('heading', { level: 3 }) ? 'bg-muted' : ''}><Heading2 className="w-4 h-4" /></Button>
                           <div className="w-px h-6 bg-border mx-2" />
                           <Button variant="ghost" size="sm" onClick={() => editor?.chain().focus().toggleBulletList().run()} className={editor?.isActive('bulletList') ? 'bg-muted' : ''}><ListIcon className="w-4 h-4" /></Button>
                           <Button variant="ghost" size="sm" onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={editor?.isActive('orderedList') ? 'bg-muted' : ''}><OrderedList className="w-4 h-4" /></Button>
                           <div className="w-px h-6 bg-border mx-2" />
                           <Button variant="outline" size="sm" onClick={insertImageToEditor} className="font-bold border-primary text-primary hover:bg-primary hover:text-white transition-colors"><ImagePlus className="w-4 h-4 mr-2" /> Resim Ekle</Button>
                        </div>
                        <div className="bg-background">
                           <EditorContent editor={editor} />
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {/* TAB 2: MÜFREDAT & TAKVİM */}
            {activeTab === "mufredat" && (
               <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* YAYINEVI SECIMI */}
                  <div className="bg-card border-2 border-border rounded-[2rem] p-8 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                     <div>
                        <h2 className="text-xl font-black text-foreground">Yayınevi ve Seri Eşleştirmesi</h2>
                        <p className="text-xs text-muted-foreground mt-1">Paket ile satılacak yayınevlerini medya kütüphanesinden seçin.</p>
                     </div>
                     <MediaPicker onSelect={(url, name) => setSelectedPublishers(prev => [...prev, { id: Math.random().toString(), media_url: url, series: name.split('.')[0] }])} buttonText="Yayınevi Ekle" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                     {selectedPublishers.map(pub => (
                        <div key={pub.id} className="border-2 border-primary/20 bg-primary/5 rounded-2xl p-4 flex flex-col items-center gap-4 transition-all shadow-sm relative group">
                           <button onClick={() => setSelectedPublishers(prev => prev.filter(p => p.id !== pub.id))} className="absolute top-2 right-2 bg-destructive/90 hover:bg-destructive text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                              <Trash2 className="w-4 h-4" />
                           </button>
                           <div className="h-16 w-full flex items-center justify-center p-2 bg-white rounded-xl border border-border">
                              <img src={pub.media_url} className="max-h-full max-w-full object-contain drop-shadow-sm" alt="Yayınevi" />
                           </div>
                           <div className="w-full">
                              <input
                                 type="text"
                                 placeholder="Örn: 3. Deneme Serisi"
                                 value={pub.series}
                                 onChange={(e) => setSelectedPublishers(prev => prev.map(p => p.id === pub.id ? { ...p, series: e.target.value } : p))}
                                 className="w-full bg-background border border-border focus:border-primary rounded-lg px-3 py-2 text-xs font-bold outline-none text-center"
                              />
                           </div>
                        </div>
                     ))}
                     {selectedPublishers.length === 0 && (
                        <div className="col-span-full py-8 text-center text-muted-foreground border-2 border-dashed border-border rounded-xl bg-background">
                           <p className="font-bold text-sm">Pakete yayınevi eklenmedi.</p>
                        </div>
                     )}
                  </div>
               </div>

               {/* TESLIMAT TAKVIMI & SIRA */}
               <div className="bg-card border-2 border-primary/20 rounded-[2rem] p-8 shadow-sm space-y-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
                     <div>
                        <h2 className="text-xl font-black text-primary">Detaylı Teslimat Takvimi</h2>
                        <p className="text-xs font-semibold text-muted-foreground mt-1">Kargoların ne zaman ve içinde hangi yayınlarla gideceğini planlayın.</p>
                     </div>
                     <Button type="button" onClick={() => setDeliveries([...deliveries, { id: Math.random().toString(), start_date: "", end_date: "", month_or_period: "", content_desc: "", inline_publishers: [] }])} className="font-bold border-2 bg-background text-primary hover:bg-muted shadow-sm whitespace-nowrap">
                        <Plus className="w-4 h-4 mr-2" /> Teslimat Ekle
                     </Button>
                  </div>

                  <div className="space-y-6">
                     {deliveries.map((del, i) => (
                        <div key={del.id} className="bg-background border-2 border-border rounded-2xl p-6 space-y-4 group hover:border-primary/50 transition-colors shadow-sm relative">
                           <div className="absolute top-4 right-4">
                              <Button type="button" variant="ghost" size="icon" onClick={() => setDeliveries(prev => prev.filter(d => d.id !== del.id))} className="text-destructive hover:bg-destructive/10">
                                 <Trash2 className="w-5 h-5" />
                              </Button>
                           </div>

                           <div className="flex items-center gap-3 pb-2 border-b border-border/50">
                              <span className="bg-primary/10 text-primary text-sm font-black px-4 py-1.5 rounded-lg">{i + 1}. Teslimat (Kargo)</span>
                           </div>

                           <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                 <div className="flex items-center gap-2">
                                    <div className="flex-1 space-y-1">
                                       <label className="text-[10px] font-black uppercase text-muted-foreground">Başlangıç</label>
                                       <input type="date" value={del.start_date} onChange={e => setDeliveries(prev => prev.map(d => d.id === del.id ? { ...d, start_date: e.target.value } : d))} className="w-full bg-muted/50 border border-border focus:border-primary px-3 py-2 rounded-lg text-sm font-bold outline-none" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                       <label className="text-[10px] font-black uppercase text-muted-foreground">Bitiş</label>
                                       <input type="date" value={del.end_date} onChange={e => setDeliveries(prev => prev.map(d => d.id === del.id ? { ...d, end_date: e.target.value } : d))} className="w-full bg-muted/50 border border-border focus:border-primary px-3 py-2 rounded-lg text-sm font-bold outline-none" />
                                    </div>
                                 </div>
                                 <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-muted-foreground">Kısa Açıklama & İçerik Başlığı</label>
                                    <input type="text" value={del.content_desc} onChange={e => setDeliveries(prev => prev.map(d => d.id === del.id ? { ...d, content_desc: e.target.value } : d))} placeholder="Örn: 1. Dönem TYT Kamp Seti" className="w-full bg-background border border-border focus:border-primary px-4 py-2 rounded-lg text-sm font-bold outline-none" />
                                 </div>
                              </div>

                              <div className="bg-muted/30 border border-border rounded-xl p-4 flex flex-col">
                                 <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-black text-muted-foreground uppercase">Bu Kargo İle Gidecek Yayınlar</span>
                                    <MediaPicker
                                       buttonText="Logo Ekle"
                                       onSelect={(url, name) => setDeliveries(prev => prev.map(d => d.id === del.id ? { ...d, inline_publishers: [...(d.inline_publishers || []), { id: Math.random().toString(), url, name: name.split('.')[0] }] } : d))}
                                    >
                                       <Button type="button" size="sm" variant="outline" className="h-7 text-[10px] px-2 font-bold hover:bg-primary hover:text-white transition-colors border-primary/30 text-primary"><Plus className="w-3 h-3 mr-1" /> Logo Ekle</Button>
                                    </MediaPicker>
                                 </div>
                                 <div className="flex-1 flex flex-wrap gap-2 content-start">
                                    {(del.inline_publishers || []).map(ip => (
                                       <div key={ip.id} className="bg-white border border-border rounded-lg p-1.5 pr-2 flex items-center gap-2 shadow-sm group/ip">
                                          <img src={ip.url} className="w-6 h-6 object-contain rounded" alt="" />
                                          <input type="text" value={ip.name} onChange={(e) => setDeliveries(prev => prev.map(d => d.id === del.id ? { ...d, inline_publishers: d.inline_publishers.map(idx => idx.id === ip.id ? { ...idx, name: e.target.value } : idx) } : d))} className="w-20 sm:w-28 text-[11px] font-bold outline-none bg-transparent" placeholder="İsim..." />
                                          <button type="button" onClick={() => setDeliveries(prev => prev.map(d => d.id === del.id ? { ...d, inline_publishers: d.inline_publishers.filter(idx => idx.id !== ip.id) } : d))} className="text-destructive/50 hover:text-destructive transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                       </div>
                                    ))}
                                    {(!del.inline_publishers || del.inline_publishers.length === 0) && (
                                       <span className="text-xs text-muted-foreground/60 font-medium italic py-2">Yayın seçilmedi.</span>
                                    )}
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}

                     {deliveries.length === 0 && (
                        <div className="text-center py-10 px-4 text-muted-foreground border-2 border-dashed border-border rounded-2xl bg-muted/20">
                           <ListOrdered className="w-12 h-12 mx-auto mb-3 opacity-20" />
                           <p className="font-black text-lg text-foreground">Gönderim Takvimi Boş</p>
                           <p className="text-sm mt-1 max-w-sm mx-auto">Veliye hangi tarihler arasında paket gönderileceğini planlamak için "Teslimat Ekle" butonunu kullanın.</p>
                        </div>
                     )}
                  </div>
               </div>
            </div>
            )}

            {/* TAB 3: FİYATLAMA & SATIŞ AYARLARI */}
            {activeTab === "fiyat" && (
               <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-card border-2 border-border rounded-[2rem] p-10 shadow-sm space-y-10 max-w-3xl mx-auto">
               <h2 className="text-2xl font-black border-b border-border pb-4 flex items-center text-foreground justify-center">
                  <CreditCard className="w-8 h-8 mr-3 text-primary" /> Satış & Fiyatlandırma Matrisi
               </h2>

               <div className="space-y-8 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-3">
                        <label className="text-xs font-black text-muted-foreground uppercase tracking-widest block">Paket Türü</label>
                        <select value={packageType} onChange={e => setPackageType(e.target.value)} className="w-full bg-background border-2 border-border rounded-xl px-4 py-4 text-sm font-bold outline-none focus:border-primary appearance-none cursor-pointer">
                           <option value="Aylık">Aylık Abonelik (Aylık Gönderim)</option>
                           <option value="Yıllık">Yıllık Paket (Ana Sayfa + Yıllık Sekme)</option>
                        </select>
                        {packageType === 'Yıllık' && (
                           <p className="text-[10px] text-accent font-bold bg-accent/5 border border-accent/15 rounded-lg px-3 py-2">
                             ✨ Bu paket otomatik olarak ana sayfanın &ldquo;Sınıfını Seç&rdquo; bölümünde ve /paketler Yıllık sekmesinde görünecek.
                           </p>
                        )}
                     </div>

                     <div className="space-y-3">
                        <label className="text-xs font-black text-muted-foreground uppercase tracking-widest block">Ödeme & Vade Türü</label>
                        <select value={paymentCycle} onChange={e => setPaymentCycle(e.target.value)} className="w-full bg-background border-2 border-border rounded-xl px-4 py-4 text-sm font-bold outline-none focus:border-primary appearance-none cursor-pointer">
                           <option value="Aylık">Aylık Çekim (Kredi Kartı Aboneliği)</option>
                           <option value="Yıllık">Tek Seferde Tam Ödeme</option>
                        </select>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-primary/5 p-6 rounded-2xl border border-primary/20">
                     <div>
                        <label className="text-xs font-black text-primary uppercase tracking-widest">Abonelik Süresi (Gün)</label>
                        <p className="text-[10px] text-muted-foreground font-medium mb-3 mt-1">Öğrencinin erişimi bu gün sonunda sonlanır.</p>
                        <div className="flex items-center">
                           <input type="number" value={durationDays} onChange={e => setDurationDays(Number(e.target.value))} className="w-full bg-background border-2 border-primary/50 rounded-l-xl px-4 py-3 text-xl text-primary font-black outline-none focus:border-primary text-center" />
                           <span className="bg-primary text-white border-2 border-primary rounded-r-xl px-4 py-3 text-sm font-black flex items-center justify-center">GÜN</span>
                        </div>
                     </div>

                     <div className="flex flex-col justify-center">
                        <label className="text-xs font-black text-primary uppercase tracking-widest">Çözsen Portal Desteği</label>
                        <p className="text-[10px] text-muted-foreground font-medium mb-3 mt-1">Video çözüm, karneler ve panellere erişim.</p>

                        <div className="flex items-center gap-4 bg-background p-4 rounded-xl border-2 border-primary/20 cursor-pointer group hover:border-primary/50 transition-all" onClick={() => setHasPortalSupport(!hasPortalSupport)}>
                           <div className={`w-6 h-6 shrink-0 rounded border-2 flex items-center justify-center transition-all ${hasPortalSupport ? 'bg-primary border-primary text-white' : 'border-border'}`}>
                              {hasPortalSupport && <CheckCircle2 className="w-4 h-4" />}
                           </div>
                           <div className="flex flex-col">
                              <span className="font-bold text-sm">Portal Erişimi Ver</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 bg-muted/20 p-8 rounded-[2rem] border-2 border-border">
                     <div>
                        <label className="text-xs font-black text-foreground uppercase tracking-widest text-center block">Geçerli İndirimli Fiyat (₺)</label>
                        <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full bg-background border-2 border-foreground rounded-xl px-4 py-4 text-3xl text-foreground font-black mt-3 outline-none focus:border-primary text-center shadow-inner" />
                     </div>
                     <div>
                        <label className="text-xs font-black text-muted-foreground uppercase tracking-widest text-center block">Üstü Çizili/Eski Fiyat (₺)</label>
                        <input type="number" value={priceOld} onChange={e => setPriceOld(Number(e.target.value))} className="w-full bg-background border-2 border-border rounded-xl px-4 py-4 text-3xl font-black mt-3 outline-none text-center text-muted-foreground/50 line-through" />
                     </div>
                  </div>

                  <div className="flex items-center gap-5 mt-8 bg-emerald-500/10 p-6 rounded-[2rem] border-2 border-emerald-500/20 cursor-pointer group hover:bg-emerald-500/20 transition-all" onClick={() => setIsActive(!isActive)}>
                     <div className={`w-10 h-10 shrink-0 rounded-xl border-2 flex items-center justify-center transition-all ${isActive ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/40' : 'border-emerald-500/50 text-emerald-500/50'}`}>
                        {isActive && <CheckCircle2 className="w-6 h-6" />}
                     </div>
                     <div className="flex flex-col">
                        <span className={`font-black text-xl ${isActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-emerald-500/50'}`}>Paketi Satışa/Yayına Al</span>
                        <span className="text-sm font-medium text-emerald-600/70 dark:text-emerald-400/70">Kaldırırsanız paket taslakta (offline) bekler ve kullanıcılara görünmez.</span>
                     </div>
                  </div>
                     </div>
                  </div>
               </div>
            )}

         </div>
      </div>
    </div>
  )
}

export default function LmsPackageBuilder() {
   return (
      <Suspense fallback={<div className="flex items-center justify-center min-h-[400px] text-muted-foreground font-bold">Paket Builder yükleniyor...</div>}>
         <PackageBuilderInner />
      </Suspense>
   )
}
