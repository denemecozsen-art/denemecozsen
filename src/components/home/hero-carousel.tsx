"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function HeroCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  )

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full relative"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {/* Slide 1 - Current Laptop Mockup */}
        <CarouselItem>
          <div className="relative w-full pb-4 pr-4 pl-4 pt-4">
             <div className="absolute inset-0 bg-success/20 rounded-3xl transform rotate-3 scale-105"></div>
             <div className="relative bg-success p-4 rounded-3xl shadow-xl border-4 border-white/20">
                <div className="aspect-video bg-[#132B40] rounded-xl flex items-center justify-center p-2 relative overflow-hidden">
                   <div className="absolute inset-x-8 top-8 bottom-0 bg-white rounded-t-lg flex flex-col items-center pt-8 px-4">
                     <div className="w-full h-1/2 bg-slate-100 rounded mb-4 flex gap-4 p-4">
                        <div className="w-1/3 bg-white shadow rounded h-full"></div>
                        <div className="w-2/3 h-full flex flex-col gap-2">
                           <div className="h-4 bg-slate-200 w-1/2 rounded"></div>
                           <div className="h-4 bg-slate-200 w-3/4 rounded"></div>
                           <div className="h-full bg-slate-200 rounded mt-2"></div>
                        </div>
                     </div>
                     <div className="flex w-full justify-between items-end h-32 gap-2 mt-auto">
                        <div className="w-8 bg-blue-400 rounded-t-sm h-16"></div>
                        <div className="w-8 bg-blue-400 rounded-t-sm h-24"></div>
                        <div className="w-8 bg-blue-400 rounded-t-sm h-32"></div>
                        <div className="w-8 bg-blue-400 rounded-t-sm h-12"></div>
                        <div className="w-8 bg-blue-400 rounded-t-sm h-20"></div>
                     </div>
                   </div>
                </div>
                <div className="w-3/4 h-3 mx-auto bg-gray-300 rounded-b-xl border-t border-gray-400 mt-1"></div>
             </div>
          </div>
        </CarouselItem>

        {/* Slide 2 - Exam/Analytics Mockup */}
        <CarouselItem>
          <div className="relative w-full pb-4 pr-4 pl-4 pt-4">
             <div className="absolute inset-0 bg-purple-500/20 rounded-3xl transform -rotate-2 scale-105"></div>
             <div className="relative bg-purple-500 p-4 rounded-3xl shadow-xl border-4 border-white/20 flex flex-col items-center justify-center aspect-video text-white">
                <h3 className="text-3xl font-bold mb-4">Türkiye Geneli Sıralama</h3>
                <div className="grid grid-cols-2 gap-4 w-full px-8">
                  <div className="bg-white/20 rounded-xl p-4 flex flex-col items-center">
                    <span className="text-sm uppercase opacity-80">Sıralaman</span>
                    <span className="text-4xl font-black mt-2">#1.452</span>
                  </div>
                  <div className="bg-white/20 rounded-xl p-4 flex flex-col items-center">
                    <span className="text-sm uppercase opacity-80">Yüzdelik Dilim</span>
                    <span className="text-4xl font-black mt-2">%8.4</span>
                  </div>
                </div>
                <div className="w-3/4 h-3 mx-auto bg-gray-300/30 rounded-b-xl border-t border-gray-400/30 mt-6 mt-1"></div>
             </div>
          </div>
        </CarouselItem>

        {/* Slide 3 - Box / Package Delivery */}
        <CarouselItem>
          <div className="relative w-full pb-4 pr-4 pl-4 pt-4">
             <div className="absolute inset-0 bg-blue-500/20 rounded-3xl transform rotate-1 scale-105"></div>
             <div className="relative bg-blue-500 p-4 rounded-3xl shadow-xl border-4 border-white/20 aspect-video flex flex-col items-center justify-center text-white">
                <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                </div>
                <h3 className="text-3xl font-bold">Kapına Kadar Teslim</h3>
                <p className="text-blue-100 mt-2">Her ay yeni deneme paketleri kapında.</p>
                <div className="w-3/4 h-3 mx-auto bg-gray-300/30 rounded-b-xl border-t border-gray-400/30 mt-4 mt-1"></div>
             </div>
          </div>
        </CarouselItem>
      </CarouselContent>
      <div className="hidden sm:block">
        <CarouselPrevious className="left-[-2rem] bg-background/80 hover:bg-background" />
        <CarouselNext className="right-[-2rem] bg-background/80 hover:bg-background" />
      </div>
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {/* Simple dots representation for mockup since embla provides internal API for dots, leaving visual only as requested */}
        <div className="w-2 h-2 rounded-full bg-primary" />
        <div className="w-2 h-2 rounded-full bg-primary/30" />
        <div className="w-2 h-2 rounded-full bg-primary/30" />
      </div>
    </Carousel>
  )
}
