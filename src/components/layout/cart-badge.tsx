"use client"

import { ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export function CartBadge() {
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const updateCount = () => {
      const cart = localStorage.getItem('cart')
      if (cart) {
        try {
          const items = JSON.parse(cart)
          if (Array.isArray(items)) {
            setCartCount(items.reduce((sum: number, item: any) => sum + (item.qty || 1), 0))
          } else {
            setCartCount(0)
          }
        } catch {
          setCartCount(0)
        }
      } else {
        setCartCount(0)
      }
    }

    updateCount()
    window.addEventListener('storage', updateCount)
    return () => window.removeEventListener('storage', updateCount)
  }, [])

  return (
    <Link href="/sepet" className="relative p-2 hover:bg-muted rounded-lg transition-colors">
      <ShoppingCart className="w-5 h-5 text-foreground" />
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-background">
          {cartCount > 9 ? '9+' : cartCount}
        </span>
      )}
    </Link>
  )
}
