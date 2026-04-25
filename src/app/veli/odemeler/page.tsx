import { CreditCard, Download, ExternalLink } from "lucide-react"

export default function VeliOdemelerPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-8 rounded-[2.5rem] shadow-sm">
        <div>
           <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center">
                 <CreditCard className="w-6 h-6" />
              </div>
              Ödemeler & Siparişler
           </h1>
           <p className="text-muted-foreground font-semibold mt-2">Faturalarınızı ve satın aldığınız paketlerin taksit detaylarını izleyin.</p>
        </div>
      </div>

      <div className="bg-card rounded-[2.5rem] border border-border/50 overflow-hidden shadow-sm">
         <div className="p-6 md:p-8 bg-muted/20 border-b border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
               <h3 className="text-xl font-black">2026 Süper Set Kurumsal YKS Kampı</h3>
               <p className="text-muted-foreground font-semibold">Aktif Abonelik - Aylık Ödeme</p>
            </div>
            <div className="flex items-center gap-3">
               <span className="text-emerald-500 bg-emerald-500/10 font-black text-sm px-3 py-1 rounded-full">Devam Ediyor</span>
            </div>
         </div>
         <div className="divide-y divide-border/50">
            {/* Mock Satır */}
            <div className="p-6 md:p-8 flex justify-between items-center hover:bg-muted/10 transition-colors">
               <div className="flex flex-col gap-1">
                  <span className="font-black">1. Taksit (Peşinat)</span>
                  <span className="text-muted-foreground font-semibold text-sm">18 Eylül 2025</span>
               </div>
               <div className="flex items-center gap-6">
                  <span className="text-xl font-black">₺1,490</span>
                  <span className="text-emerald-500 font-bold bg-emerald-500/10 px-3 py-1 rounded-lg text-xs flex items-center gap-1">
                     Ödendi <Download className="w-3 h-3 ml-1 cursor-pointer" />
                  </span>
               </div>
            </div>
            <div className="p-6 md:p-8 flex justify-between items-center hover:bg-muted/10 transition-colors">
               <div className="flex flex-col gap-1">
                  <span className="font-black text-muted-foreground">2. Taksit (Bekleyen)</span>
                  <span className="font-semibold text-sm text-amber-600">18 Ekim 2025</span>
               </div>
               <div className="flex items-center gap-6">
                  <span className="text-xl font-black">₺1,490</span>
                  <span className="text-amber-600 font-bold bg-amber-600/10 px-3 py-1 rounded-lg text-xs flex items-center gap-1">
                     Bekliyor <ExternalLink className="w-3 h-3 ml-1 cursor-pointer" />
                  </span>
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}
