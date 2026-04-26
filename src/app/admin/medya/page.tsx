"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { UploadCloud, Image as ImageIcon, Copy, Trash2, Check, RefreshCw } from "lucide-react"

export default function MediaAdminPage() {
  const [mediaFiles, setMediaFiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchMedia()
  }, [])

  async function fetchMedia() {
    setLoading(true)
    const { data, error } = await supabase.storage.from('media').list('', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' }
    })
    
    if (data) {
      // Get Public URLs
      const filesWithUrls = (data as any[]).map(file => {
         const { data: urlData } = supabase.storage.from('media').getPublicUrl(file.name)
         return { ...file, publicUrl: urlData.publicUrl }
      })
      setMediaFiles(filesWithUrls)
    }
    setLoading(false)
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    setUploading(true)

    // Generate safe unique filename
    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`

    const { error } = await supabase.storage.from('media').upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })

    if (!error) {
       await fetchMedia()
    } else {
       alert("Dosya yüklenirken hata oluştu: " + error.message)
    }
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  async function handleDelete(fileName: string) {
    if (confirm(`Bu dosyayı (${fileName}) silmek istediğinize emin misiniz?`)) {
       const { error } = await supabase.storage.from('media').remove([fileName])
       if (!error) {
          fetchMedia()
       }
    }
  }

  function handleCopy(url: string, id: string) {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  function formatBytes(bytes: number) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-8 pb-10">
      
      {/* HEADER */}
      <div className="flex sm:flex-row flex-col sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
             <ImageIcon className="w-8 h-8 text-primary" /> Medya Galerisi
          </h2>
          <p className="text-muted-foreground mt-2 font-medium">Yayınevi logolarını, paket görsellerini ve site içi tüm medya dosyalarını Supabase üzerinden yönetin.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <Button variant="outline" size="icon" onClick={fetchMedia} disabled={loading} className="shrink-0 h-10 w-10 text-muted-foreground hover:text-foreground">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
           </Button>
           <Button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="shrink-0 bg-primary font-bold shadow-md shadow-primary/20">
             {uploading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <UploadCloud className="w-4 h-4 mr-2" />} 
             {uploading ? "Yükleniyor..." : "Yeni Medya Yükle"}
           </Button>
           <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
        </div>
      </div>

      {/* DRAG & DROP ZONE */}
      {mediaFiles.length === 0 && !loading && (
        <Card className="border-dashed border-2 bg-muted/30">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground space-y-4">
            <div className="w-20 h-20 bg-background rounded-full shadow-sm flex items-center justify-center">
               <UploadCloud className="w-10 h-10 text-primary/50" />
            </div>
            <div>
               <p className="font-bold text-foreground text-lg">Galeriniz Şuan Boş</p>
               <p className="text-sm mt-1 font-medium max-w-sm">"Yeni Medya Yükle" butonunu kullanarak ilk görseli yükleyebilirsiniz. (PNG, JPG, WEBP destekler)</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* MEDIA GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {mediaFiles.filter(item => item.name !== '.emptyFolderPlaceholder').map((file) => (
          <div key={file.id} className="group overflow-hidden relative border-2 border-border/50 rounded-2xl hover:border-primary/50 hover:shadow-xl transition-all duration-300 bg-card">
             
             {/* CHECKERBOARD BACKGROUND FOR TRANSPARENCY */}
            <div className="aspect-square bg-muted flex items-center justify-center relative bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] p-4">
               
               <img src={file.publicUrl} alt={file.name} className="w-full h-full object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-110" />
               
               {/* Overlay Actions */}
               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                 <button 
                   onClick={() => handleCopy(file.publicUrl, file.id)}
                   className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors" 
                   title="URL Kopyala"
                 >
                   {copiedId === file.id ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                 </button>
                 <button 
                   onClick={() => handleDelete(file.name)}
                   className="w-10 h-10 rounded-full bg-destructive/80 hover:bg-destructive text-white flex items-center justify-center transition-colors shadow-lg"
                 >
                   <Trash2 className="w-5 h-5" />
                 </button>
               </div>
            </div>

            <div className="p-4 border-t border-border/50">
               <p className="text-xs font-bold truncate text-foreground" title={file.name}>{file.name}</p>
               <div className="flex justify-between items-center mt-2 text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                 <span>{formatBytes(file.metadata?.size || 0)}</span>
                 <span className="bg-muted px-2 py-0.5 rounded">{file.metadata?.mimetype?.split('/')[1] || 'img'}</span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
