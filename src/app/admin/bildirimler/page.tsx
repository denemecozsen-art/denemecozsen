"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Send, Loader2, Megaphone, Users, Trash2 } from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  type: string
  created_at: string
}

export default function AdminNotificationsPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [history, setHistory] = useState<Notification[]>([])
  const [users, setUsers] = useState<any[]>([])

  const [form, setForm] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'warning' | 'success' | 'package',
    target: 'all' as 'all' | 'students' | 'parents' | 'single',
    userId: '',
  })

  useEffect(() => {
    fetchHistory()
    fetchUsers()
  }, [])

  async function fetchHistory() {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (data) setHistory(data)
  }

  async function fetchUsers() {
    const { data } = await supabase
      .from('profiles')
      .select('id, email, first_name, last_name, role')
      .limit(200)

    if (data) setUsers(data)
  }

  async function handleSend() {
    if (!form.title || !form.message) {
      alert('Başlık ve mesaj zorunludur.')
      return
    }

    setSending(true)

    let targetUsers: string[] = []

    if (form.target === 'single') {
      if (!form.userId) {
        alert('Lütfen bir kullanıcı seçin.')
        setSending(false)
        return
      }
      targetUsers = [form.userId]
    } else {
      const roleFilter = form.target === 'students' ? 'student' : form.target === 'parents' ? 'parent' : null
      let query = supabase.from('profiles').select('id')
      if (roleFilter) query = query.eq('role', roleFilter)
      const { data } = await query
      targetUsers = data?.map((u: any) => u.id) || []
    }

    if (targetUsers.length === 0) {
      alert('Hedef kullanıcı bulunamadı.')
      setSending(false)
      return
    }

    const notifications = targetUsers.map(userId => ({
      user_id: userId,
      title: form.title,
      message: form.message,
      type: form.type,
      is_read: false,
    }))

    // Batch insert in chunks of 100
    const chunkSize = 100
    for (let i = 0; i < notifications.length; i += chunkSize) {
      const chunk = notifications.slice(i, i + chunkSize)
      const { error } = await supabase.from('notifications').insert(chunk)
      if (error) {
        alert('Gönderim hatası: ' + error.message)
        setSending(false)
        return
      }
    }

    alert(`${targetUsers.length} kullanıcıya bildirim gönderildi.`)
    setForm({ title: '', message: '', type: 'info', target: 'all', userId: '' })
    await fetchHistory()
    setSending(false)
  }

  async function deleteNotification(id: string) {
    if (!confirm('Bu bildirimi silmek istediğinize emin misiniz?')) return
    await supabase.from('notifications').delete().eq('id', id)
    await fetchHistory()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="w-6 h-6 text-primary" />
          Bildirim Yönetimi
        </h1>
        <p className="text-muted-foreground text-sm">Kullanıcılara toplu veya bireysel bildirim gönderin.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-primary" /> Yeni Bildirim Gönder
            </h2>

            <div className="space-y-2">
              <Label className="font-semibold">Başlık</Label>
              <Input
                placeholder="Bildirim başlığı..."
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Mesaj</Label>
              <Textarea
                rows={3}
                placeholder="Bildirim içeriği..."
                value={form.message}
                onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                className="rounded-xl resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Tür</Label>
              <Select value={form.type} onValueChange={(v: any) => setForm(prev => ({ ...prev, type: v }))}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Bilgi</SelectItem>
                  <SelectItem value="warning">Uyarı</SelectItem>
                  <SelectItem value="success">Başarı</SelectItem>
                  <SelectItem value="package">Paket</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Hedef Kitle</Label>
              <Select value={form.target} onValueChange={(v: any) => setForm(prev => ({ ...prev, target: v }))}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Kullanıcılar</SelectItem>
                  <SelectItem value="students">Sadece Öğrenciler</SelectItem>
                  <SelectItem value="parents">Sadece Veliler</SelectItem>
                  <SelectItem value="single">Bireysel Kullanıcı</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {form.target === 'single' && (
              <div className="space-y-2">
                <Label className="font-semibold">Kullanıcı</Label>
                <Select value={form.userId || undefined} onValueChange={(v) => setForm(prev => ({ ...prev, userId: v || '' }))}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Kullanıcı seçin..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {users.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.first_name || ''} {u.last_name || ''} ({u.email}) [{u.role}]
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button
              onClick={handleSend}
              disabled={sending}
              className="w-full rounded-xl font-bold h-12"
            >
              {sending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Gönderiliyor...</>
              ) : (
                <><Send className="w-4 h-4 mr-2" /> Bildirim Gönder</>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> Son Gönderilenler
            </h2>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {history.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Henüz bildirim gönderilmemiş.</p>
              ) : (
                history.map((n) => (
                  <div key={n.id} className="flex items-start justify-between gap-2 p-3 rounded-xl bg-muted/50">
                    <div className="min-w-0">
                      <p className="text-sm font-bold">{n.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{n.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{new Date(n.created_at).toLocaleString('tr-TR')}</p>
                    </div>
                    <button onClick={() => deleteNotification(n.id)} className="text-muted-foreground hover:text-destructive shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
