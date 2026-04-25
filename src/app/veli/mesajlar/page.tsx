import { MessageSquare, Send, Bot } from "lucide-react"

export default function VeliMesajlarPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 md:p-8 rounded-[2.5rem] shadow-sm shrink-0">
        <div>
           <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
              <div className="w-12 h-12 bg-sky-500/10 text-sky-600 rounded-xl flex items-center justify-center">
                 <MessageSquare className="w-6 h-6" />
              </div>
              Danışman Mesajları
           </h1>
           <p className="text-muted-foreground font-semibold mt-2">Öğrenci koçunuzla veya destek ekibiyle iletişime geçin.</p>
        </div>
      </div>

      <div className="flex-1 bg-card rounded-[2.5rem] border border-border/50 overflow-hidden flex flex-col shadow-sm">
         <div className="flex-1 p-8 overflow-y-auto space-y-6">
            
            <div className="flex justify-center mb-8">
               <span className="bg-muted/50 text-muted-foreground text-xs font-bold px-4 py-1.5 rounded-full">Bugün</span>
            </div>

            <div className="flex gap-4">
               <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5" />
               </div>
               <div className="bg-muted/30 border border-border/50 rounded-2xl p-4 max-w-2xl rounded-tl-none relative">
                  <p className="font-medium text-sm leading-relaxed text-foreground">
                     Merhaba! Ben Çözsen destek botu. Danışmanınız şu an hatta değil fakat mesaj bıraktığınızda size aynı gün içinde dönüş gerçekleştirecekler. Öğrencinizin gelişimi hakkında veya ödemeleriniz hakkında sormak istediğiniz bir şey var mı?
                  </p>
                  <span className="absolute -bottom-6 left-0 text-[10px] font-bold text-muted-foreground">10:45 AM</span>
               </div>
            </div>

         </div>

         <div className="p-4 border-t border-border/50 bg-background/50">
            <div className="bg-muted/40 border border-border/50 rounded-2xl flex items-center p-2 pr-4 shadow-inner">
               <input 
                  type="text" 
                  placeholder="Mesajınızı yazmaya başlayın..." 
                  className="flex-1 bg-transparent border-none outline-none px-4 font-semibold text-sm h-12"
                  readOnly 
               />
               <button className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center hover:scale-105 transition-transform" disabled>
                  <Send className="w-4 h-4 ml-1" />
               </button>
            </div>
         </div>
      </div>
    </div>
  )
}
