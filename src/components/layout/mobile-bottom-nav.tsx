import Link from "next/link"
import { Search, MessageCircle, ArrowRightCircle, User } from "lucide-react"

export function MobileBottomNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-t border-border pb-safe">
      <div className="flex items-center justify-around px-2 py-3">
        <button className="flex flex-col items-center justify-center w-full px-2 py-1 text-muted-foreground hover:text-primary transition">
          <Search className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold">Arama</span>
        </button>
        
        <Link href="https://wa.me/905551234567" target="_blank" className="flex flex-col items-center justify-center w-full px-2 py-1 text-muted-foreground hover:text-success transition mt-[-2px]">
          <MessageCircle className="w-6 h-6 mb-1 text-success" />
          <span className="text-[10px] font-bold text-success">WhatsApp</span>
        </Link>
        
        <Link href="/erken-kayit" className="flex flex-col items-center justify-center w-full px-2 py-1 text-muted-foreground hover:text-primary transition">
          <div className="bg-primary text-primary-foreground rounded-full p-2 mb-1 shadow-lg shadow-primary/20 -mt-8 border-4 border-background">
             <ArrowRightCircle className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold text-primary">Erken Kayıt</span>
        </Link>
        
        <Link href="/profil" className="flex flex-col items-center justify-center w-full px-2 py-1 text-muted-foreground hover:text-accent transition">
          <User className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold">Profil</span>
        </Link>
      </div>
    </div>
  )
}
