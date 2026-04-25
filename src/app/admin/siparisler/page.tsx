import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Search, Filter, Clock, CheckCircle2, XCircle, AlertCircle, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { buildAdminPath } from "@/lib/admin-config"

export const dynamic = 'force-dynamic'

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

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { status?: string }
}) {
  const supabase = await createClient()

  let query = supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (searchParams.status) {
    if (searchParams.status === 'pending') {
      query = query.eq('payment_status', 'pending')
    } else if (searchParams.status === 'cancelled') {
      // İptal ve İadeler: hem cancelled hem refunded siparişleri göster
      query = query.or('order_status.eq.canceled,payment_status.eq.refunded')
    } else {
      query = query.eq('order_status', searchParams.status)
    }
  }

  const { data: orders, error } = await query

  const hasOrdersTable = error?.code !== '42P01'

  let pageTitle = "Tüm Siparişler"
  if (searchParams.status === 'pending') pageTitle = "Ödeme Bekleyen Siparişler"
  if (searchParams.status === 'confirmed') pageTitle = "Onaylı Siparişler"
  if (searchParams.status === 'shipped') pageTitle = "Kargodaki Siparişler"
  if (searchParams.status === 'cancelled') pageTitle = "İptal ve İadeler"

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Sipariş Yönetimi</h2>
        <p className="text-muted-foreground">Tüm e-ticaret siparişlerini, PayTR ödemelerini ve kargo durumlarını takip edin.</p>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" /> {pageTitle}
            </CardTitle>
            <CardDescription>Toplam {orders?.length || 0} kayıt bulundu.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Veli, Sipariş No..." className="pl-9 w-[250px] bg-muted/50" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!hasOrdersTable ? (
            <div className="bg-destructive/10 text-destructive p-4 rounded-xl border border-destructive/20 mb-4 text-sm font-medium">
              Veritabanında henüz "orders" tablosu bulunmuyor.
            </div>
          ) : !orders || orders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-xl">
              Henüz kayıtlı sipariş bulunmuyor.
            </div>
          ) : (
            <div className="rounded-xl border overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 border-b border-border text-xs font-bold uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Sipariş No</th>
                    <th className="px-4 py-3">Müşteri</th>
                    <th className="px-4 py-3">Paket</th>
                    <th className="px-4 py-3">Tarih</th>
                    <th className="px-4 py-3 text-right">Tutar</th>
                    <th className="px-4 py-3 text-center">Ödeme</th>
                    <th className="px-4 py-3 text-center">Durum</th>
                    <th className="px-4 py-3 text-center">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {order.merchant_oid || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-foreground">{order.buyer_first_name} {order.buyer_last_name}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[150px]">{order.buyer_email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold truncate max-w-[200px]">{order.package_name}</div>
                        <div className="text-xs text-muted-foreground">{order.package_type}</div>
                      </td>
                      <td className="px-4 py-3 text-xs font-medium text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-4 py-3 text-right font-black">
                        ₺{parseFloat(order.amount).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge status={order.payment_status} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <OrderStatusBadge status={order.order_status} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Link href={buildAdminPath(`/siparisler/${order.id}`)}>
                          <Button variant="ghost" size="sm" className="h-8 text-xs font-bold">
                            Detay
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
