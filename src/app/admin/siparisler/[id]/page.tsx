"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Package, User, MapPin, CreditCard, Truck, CheckCircle2, XCircle, Clock, AlertCircle, ShieldAlert, Ban, Loader2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { buildAdminPath } from "@/lib/admin-config"
import { createClient } from "@/lib/supabase/client"

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; icon: any; className: string }> = {
    pending: { label: 'Bekliyor', icon: Clock, className: 'bg-amber-50 text-amber-700 border-amber-200' },
    success: { label: 'Ödendi', icon: CheckCircle2, className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    failed: { label: 'Başarısız', icon: XCircle, className: 'bg-red-50 text-red-700 border-red-200' },
    refunded: { label: 'İade', icon: AlertCircle, className: 'bg-slate-50 text-slate-600 border-slate-200' },
  }
  const c = config[status] ?? config['pending']
  const Icon = c.icon
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-bold ${c.className}`}>
      <Icon className="w-3.5 h-3.5" />
      {c.label}
    </span>
  )
}

function OrderStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    new: { label: 'Yeni', className: 'bg-blue-50 text-blue-700 border-blue-200' },
    confirmed: { label: 'Onaylandı', className: 'bg-violet-50 text-violet-700 border-violet-200' },
    shipped: { label: 'Kargoda', className: 'bg-amber-50 text-amber-700 border-amber-200' },
    delivered: { label: 'Teslim Edildi', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    cancelled: { label: 'İptal', className: 'bg-red-50 text-red-700 border-red-200' },
  }
  const c = config[status] ?? config['new']
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-bold ${c.className}`}>
      {c.label}
    </span>
  )
}

const STATUS_FLOW: Record<string, { label: string; description: string; icon: any; color: string; next: string[] }> = {
  new: {
    label: 'Yeni',
    description: 'Sipariş alındı, henüz onaylanmadı.',
    icon: Package,
    color: 'bg-blue-500',
    next: ['confirmed', 'cancelled']
  },
  confirmed: {
    label: 'Onaylandı',
    description: 'Sipariş onaylandı, kargoya hazırlanıyor.',
    icon: CheckCircle2,
    color: 'bg-violet-500',
    next: ['shipped', 'cancelled']
  },
  shipped: {
    label: 'Kargoda',
    description: 'Sipariş kargoya verildi.',
    icon: Truck,
    color: 'bg-amber-500',
    next: ['delivered', 'cancelled']
  },
  delivered: {
    label: 'Teslim Edildi',
    description: 'Sipariş müşteriye teslim edildi.',
    icon: CheckCircle2,
    color: 'bg-emerald-500',
    next: []
  },
  cancelled: {
    label: 'İptal',
    description: 'Sipariş iptal edildi.',
    icon: Ban,
    color: 'bg-red-500',
    next: []
  },
}

export default function OrderDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const supabase = createClient()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Dialog states
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  // Cancellation safety check
  const [cancelConfirmText, setCancelConfirmText] = useState('')
  const [cancelReason, setCancelReason] = useState('')

  useEffect(() => {
    fetchOrder()
  }, [params.id])

  async function fetchOrder() {
    setLoading(true)
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !data) {
      setError('Sipariş bulunamadı.')
    } else {
      setOrder(data)
    }
    setLoading(false)
  }

  async function updateStatus(newStatus: string) {
    setActionLoading(true)
    const { error } = await supabase
      .from('orders')
      .update({
        order_status: newStatus,
        updated_at: new Date().toISOString(),
        ...(newStatus === 'cancelled' ? { cancellation_reason: cancelReason, cancelled_at: new Date().toISOString() } : {})
      })
      .eq('id', params.id)

    if (error) {
      alert('Durum güncellenirken hata: ' + error.message)
    } else {
      await fetchOrder()
      router.refresh()
    }
    setActionLoading(false)
    setConfirmOpen(false)
    setCancelOpen(false)
    setPendingStatus(null)
    setCancelConfirmText('')
    setCancelReason('')
  }

  function openConfirm(status: string) {
    setPendingStatus(status)
    if (status === 'cancelled') {
      setCancelOpen(true)
    } else {
      setConfirmOpen(true)
    }
  }

  const isCancelConfirmed = cancelConfirmText.toLowerCase() === 'iptal et'

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="p-8">
        <Link href={buildAdminPath('/siparisler')}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri Dön
          </Button>
        </Link>
        <div className="bg-destructive/10 text-destructive p-4 rounded-xl border border-destructive/20">
          {error || 'Sipariş bulunamadı.'}
        </div>
      </div>
    )
  }

  const currentFlow = STATUS_FLOW[order.order_status] || STATUS_FLOW.new
  const allowedNext = currentFlow.next

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={buildAdminPath('/siparisler')}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Sipariş Detayı</h1>
          <p className="text-muted-foreground text-sm">Sipariş No: {order.merchant_oid || order.id}</p>
        </div>
      </div>

      {/* Durum Akışı Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Truck className="w-5 h-5" /> Sipariş Durum Akışı
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 flex-wrap">
            {(['new', 'confirmed', 'shipped', 'delivered'] as const).map((s, i, arr) => {
              const isCurrent = order.order_status === s
              const isPast = arr.indexOf(order.order_status as any) > i
              const isCancelled = order.order_status === 'cancelled'
              const flow = STATUS_FLOW[s]
              const Icon = flow.icon
              return (
                <div key={s} className="flex items-center gap-2">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border ${
                    isCancelled && isCurrent ? 'bg-red-50 text-red-700 border-red-200' :
                    isCurrent ? `${flow.color} text-white border-transparent shadow-md` :
                    isPast ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    'bg-muted text-muted-foreground border-border'
                  }`}>
                    <Icon className="w-4 h-4" />
                    {flow.label}
                  </div>
                  {i < arr.length - 1 && (
                    <div className={`w-6 h-0.5 ${isPast ? 'bg-emerald-400' : 'bg-border'}`} />
                  )}
                </div>
              )
            })}
            {order.order_status === 'cancelled' && (
              <div className="flex items-center gap-2 ml-2">
                <div className="w-6 h-0.5 bg-red-400" />
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border bg-red-50 text-red-700 border-red-200">
                  <Ban className="w-4 h-4" /> İptal Edildi
                </div>
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-4 font-medium">
            {order.order_status === 'cancelled'
              ? `Bu sipariş iptal edilmiştir. Sebep: ${order.cancellation_reason || 'Belirtilmemiş'}. Geri alınamaz.`
              : currentFlow.description}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5" />
              Müşteri Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Ad Soyad</p>
              <p className="font-semibold">{order.buyer_first_name} {order.buyer_last_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">E-posta</p>
              <p className="font-semibold">{order.buyer_email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Telefon</p>
              <p className="font-semibold">{order.buyer_phone || '-'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="w-5 h-5" />
              Teslimat Adresi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Adres</p>
              <p className="font-semibold">{order.buyer_address || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Şehir</p>
              <p className="font-semibold">{order.buyer_city || '-'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="w-5 h-5" />
              Sipariş Detayları
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Paket Adı</p>
              <p className="font-semibold">{order.package_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tutar</p>
              <p className="font-black text-lg">₺{parseFloat(order.amount).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sipariş Tarihi</p>
              <p className="font-semibold">{new Date(order.created_at).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="w-5 h-5" />
              Ödeme Durumu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Durum</p>
              <StatusBadge status={order.payment_status} />
            </div>
            {order.payment_status === 'success' && (
              <div>
                <p className="text-sm text-muted-foreground">Ödeme Tarihi</p>
                <p className="font-semibold">{order.payment_date ? new Date(order.payment_date).toLocaleDateString('tr-TR') : '-'}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Durum Değiştir */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShieldAlert className="w-5 h-5" />
              Durum Değiştir (Onay Gerekli)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Mevcut Durum</p>
              <OrderStatusBadge status={order.order_status} />
            </div>

            {order.order_status === 'cancelled' || order.order_status === 'delivered' ? (
              <div className="bg-muted/50 rounded-xl p-4 text-sm text-muted-foreground font-medium">
                Bu siparişin durumu sonlandırılmıştır. Değişiklik yapılamaz.
              </div>
            ) : (
              <div className="border-t pt-4">
                <p className="text-sm font-semibold mb-3">İzin Verilen Geçişler</p>
                <div className="flex flex-wrap gap-2">
                  {allowedNext.map((nextStatus) => {
                    const flow = STATUS_FLOW[nextStatus]
                    const Icon = flow.icon
                    const isCancel = nextStatus === 'cancelled'
                    return (
                      <Button
                        key={nextStatus}
                        variant={isCancel ? 'destructive' : 'outline'}
                        size="sm"
                        onClick={() => openConfirm(nextStatus)}
                        className="h-10 px-4 font-bold"
                      >
                        <Icon className="w-4 h-4 mr-1.5" />
                        {isCancel ? 'İptal Et' : flow.label + ' Yap'}
                      </Button>
                    )
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Her durum değişikliği için onay gereklidir. İptal işlemi geri alınamaz.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Normal Onay Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader className="space-y-3">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7 text-primary" />
            </div>
            <DialogTitle className="text-center text-xl font-black">
              Durum Değişikliği Onayı
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground font-medium">
              Sipariş durumunu <strong>&quot;{STATUS_FLOW[pendingStatus || '']?.label || pendingStatus}&quot;</strong> olarak değiştirmek istediğinize emin misiniz?
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted/50 rounded-xl p-4 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground mb-1">Mevcut Durum:</p>
            <p className="mb-2">{STATUS_FLOW[order.order_status]?.label} → {STATUS_FLOW[pendingStatus || '']?.label}</p>
            <p className="text-xs">Bu işlem geri alınamaz ve müşteriye otomatik bildirim gönderilebilir.</p>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              className="w-full sm:w-auto rounded-xl font-bold h-12"
            >
              Vazgeç
            </Button>
            <Button
              onClick={() => pendingStatus && updateStatus(pendingStatus)}
              disabled={actionLoading}
              className="w-full sm:w-auto rounded-xl font-bold h-12"
            >
              {actionLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Güncelleniyor...</>
              ) : (
                'Evet, Onaylıyorum'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* İptal Dialog - Çift Onaylı, Güvenli */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-destructive/20">
          <DialogHeader className="space-y-3">
            <div className="w-14 h-14 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto">
              <Ban className="w-7 h-7 text-destructive" />
            </div>
            <DialogTitle className="text-center text-xl font-black text-destructive">
              Sipariş İptali
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground font-medium">
              Bu işlem <strong>geri alınamaz</strong>! Siparişi iptal etmek istediğinize emin misiniz?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div className="text-sm space-y-1">
                  <p className="font-bold text-destructive">ÖNEMLİ UYARILAR:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                    <li>İptal edilen siparişler geri alınamaz.</li>
                    <li>Eğer ödeme yapıldıysa PayTR üzerinden iade süreci başlatılmalıdır.</li>
                    <li>Müşteriye otomatik iptal bildirimi gider.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cancel-reason" className="text-sm font-semibold">İptal Sebebi (Zorunlu)</Label>
              <Input
                id="cancel-reason"
                placeholder="Örn: Müşteri talebi, stok yetersizliği..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-text" className="text-sm font-semibold">
                Onay için <span className="text-destructive font-black">&quot;iptal et&quot;</span> yazın
              </Label>
              <Input
                id="confirm-text"
                placeholder="iptal et"
                value={cancelConfirmText}
                onChange={(e) => setCancelConfirmText(e.target.value)}
                className="rounded-xl"
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setCancelOpen(false)
                setCancelConfirmText('')
                setCancelReason('')
              }}
              className="w-full sm:w-auto rounded-xl font-bold h-12"
            >
              Vazgeç
            </Button>
            <Button
              variant="destructive"
              onClick={() => updateStatus('cancelled')}
              disabled={actionLoading || !isCancelConfirmed || !cancelReason.trim()}
              className="w-full sm:w-auto rounded-xl font-bold h-12"
            >
              {actionLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> İptal Ediliyor...</>
              ) : (
                'Siparişi İptal Et'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
