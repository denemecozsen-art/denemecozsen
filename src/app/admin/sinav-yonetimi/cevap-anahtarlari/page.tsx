'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { FileText, Plus, Search, Edit, Trash, Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { buildAdminPath } from '@/lib/admin-config'

export default function AdminAnswerKeysPage() {
  const supabase = createClient()
  
  const [levels, setLevels] = useState<any[]>([])
  const [answerKeys, setAnswerKeys] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    sinif: '',
    deneme_adi: '',
    seri: '',
    yil: new Date().getFullYear().toString(),
    pdf_url: ''
  })
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchLevels()
    fetchAnswerKeys()
  }, [])

  async function fetchLevels() {
    const { data } = await supabase.from('levels').select('*').order('sort_order', { ascending: true })
    if (data) setLevels(data)
  }

  async function fetchAnswerKeys() {
    setLoading(true)
    const { data } = await supabase.from('cevap_anahtarlari').select('*').order('created_at', { ascending: false })
    if (data) setAnswerKeys(data)
    setLoading(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0])
    }
  }

  const handleUploadPdf = async () => {
    if (!pdfFile) return null
    
    setUploading(true)
    try {
      const fileName = `${Date.now()}-${pdfFile.name}`
      const { data, error } = await supabase.storage.from('answer-keys').upload(fileName, pdfFile)
      
      if (error) throw error
      
      const { data: { publicUrl } } = supabase.storage.from('answer-keys').getPublicUrl(fileName)
      return publicUrl
    } catch (err) {
      console.error('PDF upload error:', err)
      setError('PDF yüklenemedi')
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    
    if (!formData.sinif || !formData.deneme_adi || !formData.seri) {
      setError('Lütfen sınıf, deneme adı ve seri alanlarını doldurun')
      return
    }

    setSubmitting(true)
    
    try {
      let pdfUrl = formData.pdf_url
      
      // PDF dosyası varsa yükle
      if (pdfFile) {
        const uploadedUrl = await handleUploadPdf()
        if (uploadedUrl) pdfUrl = uploadedUrl
      }

      const { error } = await supabase.from('cevap_anahtarlari').insert({
        sinif: formData.sinif,
        deneme_adi: formData.deneme_adi,
        seri: formData.seri,
        yil: formData.yil,
        pdf_url: pdfUrl
      })

      if (error) throw error

      setSuccess('Cevap anahtarı başarıyla eklendi')
      setFormData({ sinif: '', deneme_adi: '', seri: '', yil: new Date().getFullYear().toString(), pdf_url: '' })
      setPdfFile(null)
      fetchAnswerKeys()
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bu cevap anahtarını silmek istediğinize emin misiniz?')) return
    
    try {
      const { error } = await supabase.from('cevap_anahtarlari').delete().eq('id', id)
      if (error) throw error
      fetchAnswerKeys()
      setSuccess('Cevap anahtarı silindi')
    } catch (err: any) {
      setError(err.message || 'Silme işlemi başarısız')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Cevap Anahtarları
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Deneme cevap anahtarlarını yönetin (PDF yükleme, listeleme)</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold mb-4">Yeni Cevap Anahtarı Ekle</h2>
        
        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm mb-4">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
        
        {success && (
          <div className="flex items-center gap-2 p-3 bg-success/10 border border-success/20 rounded-lg text-success text-sm mb-4">
            <CheckCircle2 className="w-4 h-4" />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Sınıf *</label>
              <select
                value={formData.sinif}
                onChange={(e) => setFormData({ ...formData, sinif: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Sınıf seçin...</option>
                {levels.map((level) => (
                  <option key={level.id} value={level.name}>{level.name}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Deneme Adı *</label>
              <input
                type="text"
                value={formData.deneme_adi}
                onChange={(e) => setFormData({ ...formData, deneme_adi: e.target.value })}
                required
                placeholder="Örn: Türkiye Geneli Deneme 1"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Seri *</label>
              <input
                type="text"
                value={formData.seri}
                onChange={(e) => setFormData({ ...formData, seri: e.target.value })}
                required
                placeholder="Örn: Seri 1"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Yıl</label>
              <input
                type="text"
                value={formData.yil}
                onChange={(e) => setFormData({ ...formData, yil: e.target.value })}
                placeholder="2026"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">PDF Dosyası</label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background text-sm file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
              {uploading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
            </div>
            {pdfFile && <p className="text-xs text-muted-foreground">Seçilen: {pdfFile.name}</p>}
          </div>

          <Button type="submit" disabled={submitting || uploading} className="w-full sm:w-auto">
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Ekleniyor...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Cevap Anahtarı Ekle
              </>
            )}
          </Button>
        </form>
      </div>

      {/* List */}
      <div className="bg-card border border-border rounded-xl shadow-sm">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-bold">Kayıtlı Cevap Anahtarları</h2>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : answerKeys.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            Henüz cevap anahtarı eklenmemiş.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold">Sınıf</th>
                  <th className="px-6 py-4 font-semibold">Deneme Adı</th>
                  <th className="px-6 py-4 font-semibold">Seri</th>
                  <th className="px-6 py-4 font-semibold">Yıl</th>
                  <th className="px-6 py-4 font-semibold">PDF</th>
                  <th className="px-6 py-4 font-semibold text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {answerKeys.map((key) => (
                  <tr key={key.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium">{key.sinif}</td>
                    <td className="px-6 py-4">{key.deneme_adi}</td>
                    <td className="px-6 py-4">{key.seri}</td>
                    <td className="px-6 py-4">{key.yil}</td>
                    <td className="px-6 py-4">
                      {key.pdf_url ? (
                        <a href={key.pdf_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                          Görüntüle
                        </a>
                      ) : (
                        <span className="text-muted-foreground">Yüklü değil</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(key.id)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors bg-background border border-border rounded-md shadow-sm"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
