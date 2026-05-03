"use client"

import { usePathname } from "next/navigation"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"

export function GlobalMobileNav() {
  const pathname = usePathname()

  // Hide on admin pages
  const isAdminPage = pathname?.startsWith('/admin') || pathname?.startsWith('/uraz')
  if (isAdminPage) return null

  return <MobileBottomNav />
}
