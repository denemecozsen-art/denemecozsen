"use client"

import { useState } from "react"
import { Calendar, Package, ChevronRight } from "lucide-react"

interface Delivery {
    id: string
    month_or_period: string
    content_desc: string
    sort_order: number
    inline_publishers?: { name: string; url?: string }[]
}

interface PackageDetailTabsProps {
    contentHtml: string
    deliveries: Delivery[]
}

export function PackageDetailTabs({ contentHtml, deliveries }: PackageDetailTabsProps) {
    const [activeTab, setActiveTab] = useState<"details" | "delivery">("details")

    return (
        <div className="w-full">
            {/* Tab Header */}
            <div className="flex gap-1 bg-muted/60 p-1.5 rounded-2xl border border-border/50 mb-0">
                <button
                    onClick={() => setActiveTab("details")}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                        activeTab === "details"
                            ? "bg-card text-foreground shadow-lg shadow-black/5 scale-[1.02]"
                            : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                    }`}
                >
                    <Package className="w-4 h-4" />
                    Paket Detayları
                </button>
                <button
                    onClick={() => setActiveTab("delivery")}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                        activeTab === "delivery"
                            ? "bg-card text-foreground shadow-lg shadow-black/5 scale-[1.02]"
                            : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                    }`}
                >
                    <Calendar className="w-4 h-4" />
                    Teslimat Planı
                    {deliveries.length > 0 && (
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full transition-colors ${
                            activeTab === "delivery" 
                                ? "bg-primary/10 text-primary" 
                                : "bg-muted text-muted-foreground"
                        }`}>
                            {deliveries.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Tab Content */}
            <div className="mt-6 tab-content-animate">
                {activeTab === "details" ? (
                    <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 p-6 sm:p-8 shadow-sm">
                        <div
                            className="prose prose-sm sm:prose-base max-w-none text-foreground/80 font-medium !leading-relaxed selection:bg-primary/20 prose-headings:font-black prose-headings:text-foreground prose-a:text-primary"
                            dangerouslySetInnerHTML={{ __html: contentHtml || '<p class="text-muted-foreground italic">Henüz detaylı açıklama eklenmemiş.</p>' }}
                        />
                    </div>
                ) : (
                    <div className="space-y-3">
                        {deliveries.length === 0 ? (
                            <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 p-8 text-center">
                                <Calendar className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                                <p className="text-sm font-medium text-muted-foreground">
                                    Henüz teslimat planı eklenmemiş.
                                </p>
                            </div>
                        ) : (
                            deliveries.map((del, i) => (
                                <div
                                    key={del.id || i}
                                    className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 group"
                                >
                                    {/* Kargo Header */}
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-sm font-black">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <span className="text-sm font-black text-foreground">
                                                    {i + 1}. Kargo
                                                </span>
                                                {del.month_or_period && (
                                                    <span className="text-xs text-muted-foreground ml-2 font-medium">
                                                        • {del.month_or_period}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                                    </div>

                                    {/* Kargo Açıklama */}
                                    {del.content_desc && (
                                        <p className="text-xs font-medium text-foreground/70 mb-3 pl-11">
                                            {del.content_desc}
                                        </p>
                                    )}

                                    {/* İçerik Listesi */}
                                    {del.inline_publishers && Array.isArray(del.inline_publishers) && del.inline_publishers.length > 0 && (
                                        <div className="pl-11">
                                            <div className="flex flex-wrap gap-2">
                                                {del.inline_publishers.map((item, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center gap-1.5 bg-muted/50 border border-border/50 rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-foreground/80 hover:bg-primary/5 hover:border-primary/20 transition-colors"
                                                    >
                                                        {item.url && (
                                                            <img src={item.url} className="w-4 h-4 object-contain rounded-sm" alt={item.name} />
                                                        )}
                                                        {item.name}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
