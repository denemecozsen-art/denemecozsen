import { createClient } from '@/lib/supabase/server'
import {
  Package, CreditCard, MapPin, User, Phone, Mail,
  GraduationCap, Clock, CheckCircle2, XCircle, AlertCircle,
  ChevronDown, Calendar, Truck, Receipt, ArrowRight,
  BadgeCheck, Hash, Layers
} from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; icon: any; className: string }> = {
    pending: {
      label: 'Bekliyor',
      icon: Clock,
      className: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    success: {
      label: 'Ödeme Alındı',
      icon: CheckCircle2,
      className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    failed: {
      label: 'Başarısız',
      icon: XCircle,
      className: 'bg-red-50 text-red-700 border-red-200',
    },
    refunded: {
      label: 'İade Edildi',
      icon: AlertCircle,
      className: 'bg-slate-50 text-slate-600 border-slate-200',
    },
  }

  const c = config[status] ?? config['pending']
  const Icon = c.icon

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${c.className}`}>
      <Icon className="w-3.5 h-3.5" />
      {c.label}
    </span>
  )
}

function OrderStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    new: { label: 'Yeni Sipariş', className: 'bg-blue-50 text-blue-700 border-blue-200' },
    confirmed: { label: 'Onaylandı', className: 'bg-violet-50 text-violet-700 border-violet-200' },
    shipped: { label: 'Kargoya Verildi', className: 'bg-amber-50 text-amber-700 border-amber-200' },
    delivered: { label: 'Teslim Edildi', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    cancelled: { label: 'İptal Edildi', className: 'bg-red-50 text-red-700 border-red-200' },
  }
  const c = config[status] ?? config['new']
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${c.className}`}>
      {c.label}
    </span>
  )
}

export default async function SiparislerimPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-400 font-medium">Lütfen giriş yapın.</p>
      </div>
    )
  }

  // Velinin siparişlerini çek
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('parent_id', user.id)
    .order('created_at', { ascending: false })

  const hasOrdersTable = error?.code !== '42P01'

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* BAŞLIK */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Package className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800">Siparişlerim</h1>
              <p className="text-slate-500 font-medium text-sm mt-1">
                Tüm satın alma geçmişiniz ve sipariş detaylarınız
              </p>
            </div>
          </div>
          <Link
            href="/paketler"
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold px-5 py-3 rounded-xl transition-colors text-sm shadow-md shadow-violet-500/20"
          >
            <Package className="w-4 h-4" />
            Yeni Paket Al
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Tablo yok hatası */}
      {!hasOrdersTable && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-bold text-amber-800">Veritabanı kurulumu gerekiyor</p>
            <p className="text-amber-600 text-sm font-medium mt-1">
              &quot;orders&quot; tablosu henüz oluşturulmamış. Supabase SQL Editor&apos;de <code>schema_orders.sql</code> dosyasını çalıştırın.
            </p>
          </div>
        </div>
      )}

      {/* Sipariş yok */}
      {hasOrdersTable && (!orders || orders.length === 0) && (
        <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 p-12 text-center flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-slate-100 rounded-[1.5rem] flex items-center justify-center mb-6">
            <Package className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-black text-slate-700 mb-2">Henüz Sipariş Yok</h3>
          <p className="text-slate-400 font-medium max-w-sm mb-8">
            Çözsen deneme paketlerinden birini satın alarak başlayın.
          </p>
          <Link
            href="/paketler"
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-md shadow-violet-500/20"
          >
            Paketlere Göz At <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* SİPARİŞLER LİSTESİ */}
      {hasOrdersTable && orders && orders.length > 0 && (
        <div className="space-y-5">
          {orders.map((order: any, idx: number) => (
            <div key={order.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">

              {/* Sipariş Başlığı */}
              <div className="p-6 md:p-7 bg-slate-50 border-b border-slate-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md shadow-violet-500/20">
                      #{idx + 1}
                    </div>
                    <div>
                      <h2 className="font-black text-slate-800 text-lg leading-tight">{order.package_name}</h2>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(order.created_at).toLocaleDateString('tr-TR', {
                            day: 'numeric', month: 'long', year: 'numeric'
                          })}
                        </span>
                        {order.merchant_oid && (
                          <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                            <Hash className="w-3 h-3" />
                            {order.merchant_oid}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <StatusBadge status={order.payment_status} />
                    <OrderStatusBadge status={order.order_status} />
                    <span className="text-2xl font-black text-slate-800">
                      ₺{parseFloat(order.amount).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detay Grid */}
              <div className="p-6 md:p-7 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                {/* VELİ BİLGİLERİ */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Veli Bilgileri
                  </h3>
                  <div className="bg-slate-50 rounded-2xl p-4 space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      <User className="w-4 h-4 text-violet-500 shrink-0" />
                      <span className="font-bold text-slate-700 text-sm">
                        {order.buyer_first_name} {order.buyer_last_name}
                      </span>
                    </div>
                    {order.buyer_email && (
                      <div className="flex items-center gap-2.5">
                        <Mail className="w-4 h-4 text-violet-500 shrink-0" />
                        <span className="text-sm font-medium text-slate-600 truncate">{order.buyer_email}</span>
                      </div>
                    )}
                    {order.buyer_phone && (
                      <div className="flex items-center gap-2.5">
                        <Phone className="w-4 h-4 text-violet-500 shrink-0" />
                        <span className="text-sm font-medium text-slate-600">{order.buyer_phone}</span>
                      </div>
                    )}
                    {order.buyer_city && (
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-slate-600">
                          {order.buyer_district && `${order.buyer_district}, `}{order.buyer_city}
                          {order.buyer_address && (
                            <span className="block text-xs text-slate-400 mt-0.5">{order.buyer_address}</span>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* ÖĞRENCİ BİLGİLERİ */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5" /> Öğrenci Bilgileri
                  </h3>
                  <div className="bg-slate-50 rounded-2xl p-4 space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      <GraduationCap className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="font-bold text-slate-700 text-sm">
                        {order.student_name || 'Belirtilmemiş'}
                      </span>
                    </div>
                    {order.student_class && (
                      <div className="flex items-center gap-2.5">
                        <Layers className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="text-sm font-medium text-slate-600">{order.student_class}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2.5">
                      <BadgeCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${order.payment_status === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {order.payment_status === 'success' ? 'Portal Erişimi Aktif' : 'Ödeme Bekleniyor'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ÖDEME DETAYLARI */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5" /> Ödeme Detayları
                  </h3>
                  <div className="bg-slate-50 rounded-2xl p-4 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-400">Tutar</span>
                      <span className="font-black text-slate-800">
                        ₺{parseFloat(order.amount).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    {order.payment_type && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400">Yöntem</span>
                        <span className="text-sm font-bold text-slate-600 capitalize">{order.payment_type === 'card' ? 'Kredi Kartı' : 'Havale/EFT'}</span>
                      </div>
                    )}
                    {order.installment_count && order.installment_count > 1 && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400">Taksit</span>
                        <span className="text-sm font-bold text-slate-600">{order.installment_count} Taksit</span>
                      </div>
                    )}
                    {order.payment_date && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400">Tarih</span>
                        <span className="text-xs font-bold text-slate-600">
                          {new Date(order.payment_date).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-400">Durum</span>
                      <StatusBadge status={order.payment_status} />
                    </div>
                    {order.failed_reason_msg && (
                      <div className="bg-red-50 border border-red-100 rounded-xl p-2.5 text-xs text-red-600 font-medium">
                        ⚠️ {order.failed_reason_msg}
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Kargo Durumu (eğer onaylandı / kargoya verildi ise) */}
              {(order.order_status === 'confirmed' || order.order_status === 'shipped' || order.order_status === 'delivered') && (
                <div className="px-6 md:px-7 pb-6 md:pb-7">
                  <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-violet-600 shrink-0" />
                      <div className="flex-1">
                        <p className="font-bold text-slate-800 text-sm">
                          {order.order_status === 'shipped'
                            ? 'Paketiniz Kargoya Verildi!'
                            : order.order_status === 'delivered'
                              ? 'Paketiniz Teslim Edildi!'
                              : 'Sipariş Onaylandı — Kargo Hazırlanıyor'}
                        </p>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                          {order.order_status === 'confirmed'
                            ? '1-3 iş günü içinde kargoya verilecektir.'
                            : order.order_status === 'shipped'
                              ? 'Yakında elinizde olacak.'
                              : 'Hayırlı olsun! İyi çalışmalar dileriz.'}
                        </p>
                      </div>
                      <OrderStatusBadge status={order.order_status} />
                    </div>
                  </div>
                </div>
              )}

              {/* İptal bilgisi */}
              {order.order_status === 'cancelled' && order.failed_reason_msg && (
                <div className="px-6 md:px-7 pb-6 md:pb-7">
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-red-700 text-sm">Sipariş İptal Edildi</p>
                      <p className="text-red-500 text-xs font-medium mt-0.5">{order.failed_reason_msg}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tekrar Ödeme Butonu (Başarısız olanlar için) */}
              {order.payment_status === 'failed' && (
                <div className="px-6 md:px-7 pb-6 md:pb-7">
                  <Link
                    href={`/odeme?paket=${encodeURIComponent(order.package_name)}&tutar=${order.amount}`}
                    className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm"
                  >
                    <Receipt className="w-4 h-4" />
                    Tekrar Ödeme Yap
                  </Link>
                </div>
              )}

            </div>
          ))}
        </div>
      )}

    </div>
  )
}
