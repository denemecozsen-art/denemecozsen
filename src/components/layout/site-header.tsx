import Link from "next/link";
import { siteConfig } from "@/content/site";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { User, LogOut, ShoppingCart } from "lucide-react";
import { MobileDrawerWrapper } from "@/components/layout/mobile-drawer-wrapper";
import { CartBadge } from "@/components/layout/cart-badge";
import { LogoutButton } from "@/components/layout/logout-button";
import { NotificationBell } from "@/components/layout/notification-bell";

export async function SiteHeader() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 lg:max-w-7xl flex h-16 items-center justify-between gap-4">
        
        {/* Left: Hamburger (mobile) + Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile Drawer Trigger */}
          <MobileDrawerWrapper />

          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-primary">{siteConfig.name}</span>
          </Link>
        </div>

        {/* Center: Desktop nav */}
        <nav className="hidden md:flex gap-6 flex-1 justify-center">
          {siteConfig.mainNav.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {item.title}
            </Link>
          ))}
        </nav>
        
        {/* Right: Auth buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          <nav className="flex items-center space-x-2 hidden md:block">
            <Link
              href={siteConfig.links.answerKey}
              className="text-sm font-medium text-muted-foreground hover:text-primary mr-4"
            >
              Cevap Anahtarı
            </Link>
          </nav>
          
          <CartBadge />
          
          {user ? (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <NotificationBell />
              <Link href="/profil" className="flex items-center space-x-2 bg-muted hover:bg-muted/80 pl-1 pr-3 py-1 rounded-full transition-colors cursor-pointer border border-border">
                <div className="w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold max-w-[80px] sm:max-w-[120px] truncate hidden sm:block">
                  {user.email?.split('@')[0]}
                </span>
              </Link>
              <LogoutButton />
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
               <Link href="/login">
                 <Button variant="ghost" className="font-semibold">Giriş Yap</Button>
               </Link>
               <Link href="/kayit-ol">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">Kayıt Ol</Button>
               </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
