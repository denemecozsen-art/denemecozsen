"use client"

import { useState } from "react"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { logout } from "@/app/auth/logout/actions"

export function LogoutButton() {
  const [open, setOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleConfirm() {
    setLoggingOut(true)
    await logout()
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors shrink-0"
        title="Güvenli Çıkış Yap"
      >
        <LogOut className="w-5 h-5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader className="space-y-3">
            <div className="w-14 h-14 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto">
              <LogOut className="w-7 h-7 text-destructive" />
            </div>
            <DialogTitle className="text-center text-xl font-black">
              Çıkış Yapmak İstiyor musunuz?
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground font-medium">
              Oturumunuzu sonlandırmak üzeresiniz. Tekrar giriş yapmanız gerekecek.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto rounded-xl font-bold h-12"
            >
              Vazgeç
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={loggingOut}
              className="w-full sm:w-auto rounded-xl font-bold h-12"
            >
              {loggingOut ? "Çıkış Yapılıyor..." : "Evet, Çıkış Yap"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
