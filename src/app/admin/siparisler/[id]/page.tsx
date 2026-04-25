import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Package, User, MapPin, CreditCard, Truck, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"
import { buildAdminPath } from "@/lib/admin-config"
import { revalidatePath } from "next/cache"

export const dynamic = 'force-dynamic'

async function updateOrderStatus(orderId: string, newStatus: string) {
  'use server'
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('orders')
    .update({ order_status: newStatus })
    .eq('id', orderId)
  
  if (error) {
    return { success: false, error: error.message }
  }
  
  revalidatePath(buildAdminPath('/siparisler'))
  revalidatePath(buildAdminPath(`/siparisler/${orderId}`))
  
  return { success: true }
}

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

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()

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
          Sipariş bulunamadı.
        </div>
      </div>
    )
  }

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
              <p className="font-semibold">{order.billing_address || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Şehir</p>
              <p className="font-semibold">{order.billing_city || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">İlçe</p>
              <p className="font-semibold">{order.billing_district || '-'}</p>
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
              <p className="text-sm text-muted-foreground">Paket Tipi</p>
              <p className="font-semibold">{order.package_type}</p>
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

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Truck className="w-5 h-5" />
              Sipariş Durumu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Mevcut Durum</p>
              <OrderStatusBadge status={order.order_status} />
            </div>
            
            <div className="border-t pt-4">
              <p className="text-sm font-semibold mb-3">Durum Değiştir</p>
              <div className="flex flex-wrap gap-2">
                <form action={async () => {
                  'use server'
                  await updateOrderStatus(order.id, 'new')
                }}>
                  <Button
                    type="submit"
                    variant={order.order_status === 'new' ? 'default' : 'outline'}
                    size="sm"
                    disabled={order.order_status === 'new'}
                  >
                    Yeni
                  </Button>
                </form>
                <form action={async () => {
                  'use server'
                  await updateOrderStatus(order.id, 'confirmed')
                }}>
                  <Button
                    type="submit"
                    variant={order.order_status === 'confirmed' ? 'default' : 'outline'}
                    size="sm"
                    disabled={order.order_status === 'confirmed'}
                  >
                    Onayla
                  </Button>
                </form>
                <form action={async () => {
                  'use server'
                  await updateOrderStatus(order.id, 'shipped')
                }}>
                  <Button
                    type="submit"
                    variant={order.order_status === 'shipped' ? 'default' : 'outline'}
                    size="sm"
                    disabled={order.order_status === 'shipped'}
                  >
                    Kargoya Ver
                  </Button>
                </form>
                <form action={async () => {
                  'use server'
                  await updateOrderStatus(order.id, 'delivered')
                }}>
                  <Button
                    type="submit"
                    variant={order.order_status === 'delivered' ? 'default' : 'outline'}
                    size="sm"
                    disabled={order.order_status === 'delivered'}
                  >
                    Teslim Edildi
                  </Button>
                </form>
                <form action={async () => {
                  'use server'
                  await updateOrderStatus(order.id, 'cancelled')
                }}>
                  <Button
                    type="submit"
                    variant={order.order_status === 'cancelled' ? 'destructive' : 'outline'}
                    size="sm"
                    disabled={order.order_status === 'cancelled'}
                  >
                    İptal
                  </Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
