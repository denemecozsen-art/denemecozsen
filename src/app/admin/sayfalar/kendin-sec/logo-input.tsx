"use client"
import { useState } from "react"
import MediaPicker from "../../../../components/admin/MediaPicker"

export function LogoInput() {
  const [logoUrl, setLogoUrl] = useState("")
  
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-muted-foreground">Logo (Medya Galerisi)</label>
      <div className="flex gap-2">
        <input 
           name="logo_url" 
           value={logoUrl} 
           onChange={e => setLogoUrl(e.target.value)} 
           placeholder="Medya Galerisinden Seçin" 
           className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:border-primary outline-none" 
        />
        <MediaPicker onSelect={(url: string) => setLogoUrl(url)} buttonText="Galeri" />
      </div>
    </div>
  )
}
