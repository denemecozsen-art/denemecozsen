"use client"

import Link from "next/link";
import { siteConfig } from "@/content/site";
import { useState } from "react";

export function SiteFooter() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ type: 'success', text: data.message })
        setEmail("")
      } else {
        setMessage({ type: 'error', text: data.error || 'Bir hata oluştu' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Bir hata oluştu' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer className="border-t bg-muted">
      <div className="container mx-auto px-4 lg:max-w-7xl py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-primary">{siteConfig.name}</h3>
            <p className="text-sm text-muted-foreground">
              {siteConfig.description}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Hızlı Erişim</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/paketler" className="hover:text-primary">Paketler</Link></li>
              <li><Link href="/hakkimizda" className="hover:text-primary">Kurumsal</Link></li>
              <li><Link href="/sss" className="hover:text-primary">Yardım/SSS</Link></li>
              <li><Link href="/iletisim" className="hover:text-primary">İletişim</Link></li>
              <li><Link href="/gizlilik-politikasi" className="hover:text-primary">Gizlilik Politikası</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">İletişim</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Beşiktaş, İstanbul, Türkiye</li>
              <li>iletisim@cozsen.com</li>
              <li>+90 (212) 000 00 00</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Bülten</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Gelişmelerden haberdar olmak için kayıt olun.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input 
                type="email" 
                placeholder="E-posta adresi" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" 
              />
              <button 
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                {loading ? '...' : 'Gönder'}
              </button>
            </form>
            {message && (
              <p className={`text-xs mt-2 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {message.text}
              </p>
            )}
          </div>
        </div>
        <div className="mt-8 border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} {siteConfig.name}. T&uuml;m Hakları Saklıdır.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
             <Link href="/gizlilik-politikasi" className="hover:text-primary">KVKK Aydınlatma Metni</Link>
             <Link href="/gizlilik-politikasi" className="hover:text-primary">Kullanım Şartları</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
