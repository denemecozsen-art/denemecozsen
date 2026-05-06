"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { X, Menu, Package, Layers, Zap, CalendarCheck, Info, BookKey, ChevronRight } from "lucide-react"

const navItems = [
  { title: "Paketler", href: "/paketler", icon: Package, desc: "Kurumsal deneme setleri" },
  { title: "Paketini Kendin Seç", href: "/paketini-kendin-sec", icon: Layers, desc: "Kendi setini oluştur" },
  { title: "2026-2027 Erken Kayıt", href: "/erken-kayit", icon: CalendarCheck, desc: "Kampanya fiyatlarını yakala" },
  { title: "Hakkımızda", href: "/hakkimizda", icon: Info, desc: "Biz kimiz?" },
  { title: "Cevap Anahtarı", href: "/cevap-anahtari", icon: BookKey, desc: "Sınav sonuçlarım" },
]

export function MobileDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  // Mount check for portal (SSR safe)
  useEffect(() => { setMounted(true) }, [])

  // Close on route change
  useEffect(() => { setIsOpen(false) }, [pathname])

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  const drawer = (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99998,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: isOpen ? "blur(4px)" : "none",
          WebkitBackdropFilter: isOpen ? "blur(4px)" : "none",
          transition: "opacity 0.25s",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
      />

      {/* Drawer panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 99999,
          width: "min(82vw, 340px)",
          display: "flex",
          flexDirection: "column",
          background: "hsl(var(--background))",
          borderRight: "2px solid hsl(var(--border))",
          boxShadow: "12px 0 60px rgba(0,0,0,0.45), 4px 0 0 hsl(var(--border))",
          transition: "transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        {/* Logo header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 20px",
          borderBottom: "2px solid hsl(var(--border))",
          background: "linear-gradient(135deg, hsl(var(--primary)/0.15) 0%, hsl(var(--background)) 100%)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "hsl(var(--primary))",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px hsl(var(--primary)/0.35)",
            }}>
              <Zap style={{ width: 18, height: 18, color: "white" }} />
            </div>
            <div>
              <p style={{ fontWeight: 900, fontSize: 15, lineHeight: 1.2, color: "hsl(var(--foreground))" }}>Çözsen</p>
              <p style={{ fontWeight: 700, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "hsl(var(--muted-foreground))", lineHeight: 1.2 }}>Deneme Kulübü</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              width: 34, height: 34, borderRadius: 10,
              border: "1.5px solid hsl(var(--border))",
              background: "hsl(var(--muted))",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X style={{ width: 16, height: 16, color: "hsl(var(--muted-foreground))" }} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "12px 12px" }}>
          <p style={{
            fontSize: 9, fontWeight: 800, letterSpacing: "0.14em",
            textTransform: "uppercase", color: "hsl(var(--muted-foreground))",
            padding: "6px 12px 10px",
          }}>
            Kategoriler
          </p>
          {navItems.map((item, i) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={i}
                href={item.href}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 14px",
                  borderRadius: 16,
                  marginBottom: 4,
                  background: isActive ? "hsl(var(--primary))" : "transparent",
                  color: isActive ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))",
                  textDecoration: "none",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = "hsl(var(--muted))"
                }}
                onMouseLeave={e => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent"
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: isActive ? "rgba(255,255,255,0.2)" : "hsl(var(--muted)/0.9)",
                  border: isActive ? "none" : "1.5px solid hsl(var(--border))",
                }}>
                  <item.icon style={{ width: 16, height: 16 }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 800, fontSize: 13, lineHeight: 1.35 }}>{item.title}</p>
                  <p style={{
                    fontSize: 11, fontWeight: 500,
                    color: isActive ? "rgba(255,255,255,0.65)" : "hsl(var(--muted-foreground))",
                    lineHeight: 1.3,
                  }}>{item.desc}</p>
                </div>
                <ChevronRight style={{ width: 14, height: 14, opacity: 0.4, flexShrink: 0 }} />
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div style={{
          padding: "14px 20px",
          borderTop: "1px solid hsl(var(--border))",
          textAlign: "center",
        }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: "hsl(var(--muted-foreground))" }}>
            © 2026 Çözsen Deneme Kulübü
          </p>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Hamburger trigger - only visible on mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 38, height: 38,
          borderRadius: 10,
          background: "hsl(var(--muted))",
          border: "1.5px solid hsl(var(--border))",
          cursor: "pointer",
        }}
        aria-label="Menüyü Aç"
      >
        <Menu style={{ width: 18, height: 18, color: "hsl(var(--foreground))" }} />
      </button>

      {/* Portal: renders directly on body, outside all stacking contexts */}
      {mounted && createPortal(drawer, document.body)}
    </>
  )
}
