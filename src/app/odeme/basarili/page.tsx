import Link from 'next/link'
import { CheckCircle2, ArrowRight, Package } from 'lucide-react'

export default function OdemeBasariliPage({
  searchParams,
}: {
  searchParams: { merchant_oid?: string }
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-lg w-full text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-800 mb-2">Ödeme Başarılı! 🎉</h1>
          <p className="text-slate-500 font-medium">
            Siparişiniz başarıyla alındı. Paketiniz en kısa sürede kargoya verilecektir.
          </p>
        </div>
        {searchParams.merchant_oid && (
          <div className="bg-slate-50 rounded-2xl p-4 text-sm">
            <span className="text-slate-400 font-medium">Sipariş No:</span>
            <span className="ml-2 font-black text-slate-700 font-mono">{searchParams.merchant_oid}</span>
          </div>
        )}
        <div className="flex flex-col gap-3">
          <Link
            href="/profile/veli/siparislerim"
            className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            <Package className="w-4 h-4" />
            Siparişlerimi Görüntüle
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className="text-slate-500 hover:text-slate-700 font-medium text-sm transition-colors"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  )
}
