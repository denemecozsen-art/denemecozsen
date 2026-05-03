"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GlobalBackButton } from "@/components/ui/back-button"
import { Package, Trash2, Plus, Minus, ShoppingCart, ArrowRight } from "lucide-react"

interface CartItem {
  id: string
  title: string
  price: number
  qty: number
}

export default function SepetPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadCart()
    window.addEventListener('storage', loadCart)
    return () => window.removeEventListener('storage', loadCart)
  }, [])

  function loadCart() {
    const raw = localStorage.getItem('cart')
    if (raw) {
      try {
        const items = JSON.parse(raw)
        setCart(Array.isArray(items) ? items : [])
      } catch {
        setCart([])
      }
    }
  }

  function updateQty(id: string, delta: number) {
    setCart(prev => {
      const next = prev.map(item => {
        if (item.id === id) {
          const newQty = Math.max(1, item.qty + delta)
          return { ...item, qty: newQty }
        }
        return item
      })
      localStorage.setItem('cart', JSON.stringify(next))
      window.dispatchEvent(new Event('storage'))
      return next
    })
  }

  function removeItem(id: string) {
    setCart(prev => {
      const next = prev.filter(item => item.id !== id)
      localStorage.setItem('cart', JSON.stringify(next))
      window.dispatchEvent(new Event('storage'))
      return next
    })
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <GlobalBackButton className="mb-6 -ml-2" />

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">Sepetim</h1>
            <p className="text-sm text-muted-foreground font-medium">
              {cart.length} ürün — Toplam ₺{total.toLocaleString('tr-TR')}
            </p>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="bg-card rounded-3xl p-12 shadow-sm border text-center space-y-6">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
              <ShoppingCart className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold">Sepetiniz Boş</h2>
              <p className="text-muted-foreground">Size uygun paketleri inceleyin ve hemen başlayın.</p>
            </div>
            <Link href="/paketler">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 px-8 rounded-2xl">
                Paketleri İncele <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-card rounded-3xl shadow-sm border overflow-hidden">
              {cart.map((item, index) => (
                <div
                  key={item.id}
                  className={`p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center ${index > 0 ? 'border-t' : ''}`}
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                    <Package className="w-7 h-7 text-primary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground truncate">{item.title}</h3>
                    <p className="text-sm text-muted-foreground font-medium">
                      Birim: ₺{item.price.toLocaleString('tr-TR')}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-muted rounded-xl border">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-background rounded-l-xl transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-bold text-sm">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-background rounded-r-xl transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-right min-w-[80px]">
                      <p className="font-black text-lg">
                        ₺{(item.price * item.qty).toLocaleString('tr-TR')}
                      </p>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Özet */}
            <div className="bg-card rounded-3xl p-6 md:p-8 shadow-sm border space-y-6">
              <h3 className="font-bold text-lg">Sipariş Özeti</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Ara Toplam</span>
                  <span className="font-bold">₺{total.toLocaleString('tr-TR')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Kargo</span>
                  <span className="font-bold text-emerald-600">Ücretsiz</span>
                </div>
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="font-bold text-lg">Toplam</span>
                  <span className="text-2xl font-black text-primary">
                    ₺{total.toLocaleString('tr-TR')}
                  </span>
                </div>
              </div>

              {cart.map(item => (
                <Link
                  key={item.id}
                  href={`/odeme?paket=${encodeURIComponent(item.title)}&tutar=${item.price * item.qty}&qty=${item.qty}&paket_id=${item.id}`}
                >
                  <Button className="w-full h-14 bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg rounded-2xl shadow-lg">
                    {item.title} İçin Ödemeye Geç <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
