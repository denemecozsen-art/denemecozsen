"use client"

import { GlobalBackButton } from "@/components/ui/back-button"
import { CreditCard, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { use, useState } from "react"
import Link from "next/link"

export default function CheckoutPage({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { slug } = use(params)
  const search = use(searchParams)
  
  const formattedTitle = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

  const dynamicPriceParam = search?.price as string | undefined
  const dynamicItemsParam = search?.items as string | undefined

  const totalPrice = dynamicPriceParam ? Number(dynamicPriceParam) : 250
  const itemsCount = dynamicItemsParam ? Number(dynamicItemsParam) : 1

  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setIsSuccess(true)
    }, 2000)
  }

  if (isSuccess) {
    return (
      <div className="bg-muted min-h-screen py-24 flex items-center justify-center">
        <div className="bg-card p-12 rounded-3xl text-center max-w-md mx-auto shadow-2xl border border-border animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-extrabold text-primary mb-4">Sipariş Başarılı!</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            <strong>{formattedTitle}</strong> tercihiniz onaylandı. Mükemmel bir paketle öğrenci portalına yönlendiriliyorsunuz...
          </p>
          <Link href="/profil">
            <Button className="w-full text-lg h-16 font-bold bg-accent hover:bg-accent/90 shadow-lg">Portala Git</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-muted py-12 min-h-[calc(100vh-100px)]">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center gap-4 mb-10">
           <GlobalBackButton className="-ml-2" />
           <h1 className="text-3xl md:text-5xl font-extrabold text-primary tracking-tight">Güvenli Ödeme</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Form */}
          <div className="bg-card rounded-[2rem] p-8 md:p-10 shadow-xl shadow-primary/5 border border-border">
            <h2 className="text-2xl font-bold mb-8 flex items-center border-b border-border pb-4"><CreditCard className="w-7 h-7 mr-3 text-primary" /> Kart Bilgileri</h2>
            
            <form onSubmit={handlePay} className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest block">Kart Üzerindeki İsim</label>
                <input 
                  type="text" 
                  required 
                  className="w-full bg-background border-2 border-border rounded-2xl px-5 py-4 text-lg focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/40 font-medium" 
                  placeholder="Soyadınızla Birlikte Eksiksiz Girin" 
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest block">Kart Numarası</label>
                <input 
                  type="text" 
                  required 
                  maxLength={19} 
                  className="w-full bg-background border-2 border-border rounded-2xl px-5 py-4 text-lg focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/40 font-mono" 
                  placeholder="0000 0000 0000 0000" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest block">Son Kul. Tarihi</label>
                  <input 
                    type="text" 
                    required 
                    maxLength={5} 
                    className="w-full bg-background border-2 border-border rounded-2xl px-5 py-4 text-lg text-center focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/40 font-mono" 
                    placeholder="AA/YY" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest block">CVC Kodu</label>
                  <input 
                    type="text" 
                    required 
                    maxLength={3} 
                    className="w-full bg-background border-2 border-border rounded-2xl px-5 py-4 text-lg text-center focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/40 font-mono" 
                    placeholder="123" 
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-border mt-8">
                <Button disabled={isProcessing} className="w-full h-16 text-xl font-bold shadow-xl shadow-primary/20 bg-accent hover:bg-accent/90 text-accent-foreground hover:scale-[1.02] transition-transform">
                  {isProcessing ? "Güvenle İşleniyor..." : `₺${totalPrice.toLocaleString('tr-TR')} Öde`}
                </Button>
              </div>
            </form>
          </div>

          {/* Cart Summary */}
          <div className="bg-card rounded-[2rem] p-8 md:p-10 shadow-xl shadow-primary/5 border border-border sticky top-10 flex flex-col items-stretch">
             <h2 className="text-2xl font-bold mb-8 border-b border-border pb-4">Sipariş Özeti</h2>
             
             <div className="space-y-5 flex-1">
                <div className="flex justify-between items-start py-4 border-b border-border/50">
                   <div>
                     <span className="font-bold text-lg block">{formattedTitle}</span>
                     {dynamicItemsParam && (
                        <span className="text-sm text-muted-foreground mt-1 block">İçerik: {itemsCount} Adet Kurumsal Deneme</span>
                     )}
                   </div>
                   <span className="text-xl font-extrabold text-primary shrink-0">₺{totalPrice.toLocaleString('tr-TR')}</span>
                </div>
                
                <div className="flex justify-between items-center py-4 border-b border-border/50">
                   <span className="font-semibold text-muted-foreground text-lg">Kargo & Teslimat</span>
                   <span className="text-lg font-bold text-success bg-success/10 px-3 py-1 rounded-lg">Ücretsiz</span>
                </div>
                
                <div className="flex justify-between items-end pt-8">
                   <span className="text-xl font-extrabold text-foreground">Ödenecek Tutar</span>
                   <span className="text-4xl md:text-5xl font-black text-accent">₺{totalPrice.toLocaleString('tr-TR')}</span>
                </div>
             </div>
             
             <div className="mt-12 bg-muted/60 p-5 rounded-2xl flex items-start gap-4 text-sm font-semibold text-muted-foreground leading-relaxed">
                <ShieldCheck className="w-10 h-10 text-success shrink-0" />
                <p>256-bit SSL sertifikası ile bağlantınız şifrelenmiştir. Kredi kartı bilgileriniz doğrudan bankalara iletilir, sistemlerimizde kayıtlı tutulmaz.</p>
             </div>
          </div>

        </div>
      </div>
    </div>
  )
}
