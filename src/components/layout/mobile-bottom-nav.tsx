"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package, Wand2, ShoppingCart, ArrowRightCircle, User } from "lucide-react"
import { useState, useEffect } from "react"

export function MobileBottomNav() {
  const pathname = usePathname()
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const updateCount = () => {
      const cart = localStorage.getItem('cart')
      if (cart) {
        try {
          const items = JSON.parse(cart)
          if (Array.isArray(items)) {
            setCartCount(items.reduce((sum: number, item: any) => sum + (item.qty || 1), 0))
          }
        } catch { setCartCount(0) }
      } else { setCartCount(0) }
    }
    updateCount()
    window.addEventListener('storage', updateCount)
    return () => window.removeEventListener('storage', updateCount)
  }, [])

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-t border-border/60 pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.06)]" style={{ transform: 'translateZ(0)', willChange: 'transform' }}>
      <div className="flex items-center justify-around px-2 py-2">
        {/* 1. Paketler */}
        <Link
          href="/paketler"
          className={`flex flex-col items-center justify-center w-full px-1 py-1.5 rounded-xl transition ${isActive('/paketler') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Package className="w-5 h-5 mb-0.5" />
          <span className="text-[9px] font-bold tracking-wide">Paketler</span>
        </Link>

        {/* 2. Paketini Kendin Seç */}
        <Link
          href="/paketini-kendin-sec"
          className={`flex flex-col items-center justify-center w-full px-1 py-1.5 rounded-xl transition ${isActive('/paketini-kendin-sec') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Wand2 className="w-5 h-5 mb-0.5" />
          <span className="text-[9px] font-bold tracking-wide">Kendi Seç</span>
        </Link>

        {/* 3. Floating CTA - Erken Kayıt */}
        <Link href="/erken-kayit" className="relative -top-3">
          <div className="bg-gradient-to-tr from-violet-500 to-indigo-600 text-white rounded-full p-2.5 shadow-lg shadow-violet-500/30 border-4 border-background flex flex-col items-center">
            <ArrowRightCircle className="w-6 h-6" />
          </div>
          <span className="text-[9px] font-bold text-violet-600 block text-center mt-0.5">Erken Kayıt</span>
        </Link>

        {/* 4. Sepet */}
        <Link
          href="/sepet"
          className={`flex flex-col items-center justify-center w-full px-1 py-1.5 rounded-xl transition relative ${isActive('/sepet') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 mb-0.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-destructive text-white text-[8px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </div>
          <span className="text-[9px] font-bold tracking-wide">Sepet</span>
        </Link>

        {/* 5. Profil */}
        <Link
          href="/profil"
          className={`flex flex-col items-center justify-center w-full px-1 py-1.5 rounded-xl transition ${isActive('/profil') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[9px] font-bold tracking-wide">Profil</span>
        </Link>
      </div>
    </div>
  )
}
