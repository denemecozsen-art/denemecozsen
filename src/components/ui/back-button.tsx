"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface GlobalBackButtonProps {
  label?: string;
  className?: string;
}

export function GlobalBackButton({ label = "Geri Dön", className = "" }: GlobalBackButtonProps) {
  const router = useRouter()

  return (
    <Button 
      variant="ghost" 
      onClick={() => router.back()} 
      className={`group flex items-center space-x-2 pl-2 hover:bg-muted ${className}`}
    >
      <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      <span className="text-muted-foreground group-hover:text-foreground font-medium transition-colors">{label}</span>
    </Button>
  )
}
