"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface AddToCartWidgetProps {
    slugOrId: string
    price: number
    title: string
}

export function AddToCartWidget({ slugOrId, price, title }: AddToCartWidgetProps) {
    const [qty, setQty] = useState(1)

    const handleQty = (delta: number) => {
        setQty(prev => Math.max(1, Math.min(99, prev + delta)))
    }

    const handleBuy = () => {
        // Sepete ekle
        const existingCart = localStorage.getItem('cart')
        let cart = existingCart ? JSON.parse(existingCart) : []
        if (!Array.isArray(cart)) cart = []

        const existingIndex = cart.findIndex((item: any) => item.id === slugOrId)
        if (existingIndex >= 0) {
            cart[existingIndex].qty += qty
        } else {
            cart.push({ id: slugOrId, title, price, qty })
        }

        localStorage.setItem('cart', JSON.stringify(cart))
        window.dispatchEvent(new Event('storage'))
        // Doğrudan ödemeye git
        window.location.href = `/odeme?paket=${encodeURIComponent(title)}&tutar=${price * qty}&qty=${qty}&paket_id=${slugOrId}`
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between bg-muted rounded-xl p-2 border border-border mt-4">
                <span className="text-sm font-bold ml-4">Miktar:</span>
                <div className="flex items-center gap-4 bg-background border border-border rounded-lg p-1 shadow-sm">
                    <button onClick={() => handleQty(-1)} className="w-8 h-8 flex items-center justify-center text-xl font-medium text-muted-foreground hover:bg-muted rounded-md transition-colors">-</button>
                    <span className="text-lg font-black w-8 text-center">{qty}</span>
                    <button onClick={() => handleQty(1)} className="w-8 h-8 flex items-center justify-center text-xl font-medium text-muted-foreground hover:bg-muted rounded-md transition-colors">+</button>
                </div>
            </div>

            <div className="flex justify-between items-center py-2 px-1">
                <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Toplam Tutar:</span>
                <span className="text-2xl font-black text-primary">₺{(price * qty).toLocaleString('tr-TR')}</span>
            </div>

            <Button onClick={handleBuy} className="w-full h-14 text-lg font-bold bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:scale-[1.02] transition-transform">
                Sepete Ekle / Hemen Al
            </Button>
            <p className="text-[10px] text-center text-muted-foreground uppercase tracking-wider font-semibold">
                Güvenli Ödeme Onayı • Hızlı Teslimat
            </p>
        </div>
    )
}
