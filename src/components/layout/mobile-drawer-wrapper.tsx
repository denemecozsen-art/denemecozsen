"use client"
import { MobileDrawer } from "@/components/layout/mobile-drawer"

export function MobileDrawerWrapper() {
  return (
    <div className="md:hidden">
      <MobileDrawer />
    </div>
  )
}
