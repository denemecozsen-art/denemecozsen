import Link from 'next/link'
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react'

export default function OdemeBasarisizPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-lg w-full text-center space-y-6">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-800 mb-2">Ödeme Başarısız</h1>
          <p className="text-slate-500 font-medium">
            Ödeme işleminiz tamamlanamadı. Kart bilgilerinizi kontrol edip tekrar deneyin.
          </p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-700 font-medium text-left space-y-1">
          <p className="font-bold">Olası nedenler:</p>
          <ul className="list-disc list-inside space-y-1 text-amber-600">
            <li>Kart bakiyesi yetersiz</li>
            <li>Kart bilgileri hatalı girildi</li>
            <li>3D Secure doğrulaması başarısız</li>
            <li>Bankanız işlemi reddetmiş olabilir</li>
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <Link
            href="/odeme"
            className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Tekrar Dene
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 text-slate-500 hover:text-slate-700 font-medium text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  )
}
