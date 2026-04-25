"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Image as ImageIcon, Loader2, UploadCloud, Check } from "lucide-react"

interface MediaFile {
  id: string
  name: string
  publicUrl: string
}

interface MediaPickerProps {
  onSelect: (url: string, name: string) => void
  children?: React.ReactNode
  buttonText?: string
}

export default function MediaPicker({ onSelect, children, buttonText = "Medya Seç" }: MediaPickerProps) {
  const [open, setOpen] = useState(false)
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    if (open) {
      fetchMedia()
    }
  }, [open])

  async function fetchMedia() {
    setLoading(true)
    const { data, error } = await supabase.storage.from('media').list('', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' }
    })

    if (data) {
      const filesWithUrls = data
        .filter(file => file.name !== '.emptyFolderPlaceholder')
        .map(file => {
          const { data: urlData } = supabase.storage.from('media').getPublicUrl(file.name)
          return { id: file.id ?? file.name, name: file.name, publicUrl: urlData.publicUrl }
        })
      setMediaFiles(filesWithUrls)
    }
    setLoading(false)
  }

  function handleSelect(file: MediaFile) {
    onSelect(file.publicUrl, file.name)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button type="button" variant="outline" className="gap-2">
            <ImageIcon className="w-4 h-4" /> {buttonText}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-4xl max-h-[85vh] flex flex-col p-6 rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-primary" /> Medya Kütüphanesi
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-[300px] mt-4 p-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
              <p className="font-bold">Medyalar yükleniyor...</p>
            </div>
          ) : mediaFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground border-2 border-dashed border-border rounded-xl p-8">
              <UploadCloud className="w-12 h-12 mb-4 text-muted-foreground/50" />
              <p className="font-bold text-lg">Kütüphane Boş</p>
              <p className="text-sm">Önce Medya Yönetimi sayfasından görsel yükleyin.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {mediaFiles.map((file) => (
                <div
                  key={file.id}
                  onClick={() => handleSelect(file)}
                  className="group relative cursor-pointer border-2 border-border/50 rounded-2xl hover:border-primary/50 transition-all overflow-hidden bg-card aspect-square"
                >
                  <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-muted flex items-center justify-center p-2">
                    <img
                      src={file.publicUrl}
                      alt={file.name}
                      className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                    <Check className="w-8 h-8 text-white mb-2" />
                    <p className="text-white text-xs font-bold text-center break-words w-full px-2">{file.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
