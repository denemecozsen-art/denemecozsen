import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

interface PackageCardProps {
  title: string;
  description: string;
  price: number | string;
  features?: string[];
  isPopular?: boolean;
  buttonText?: string;
  slug?: string;
}

export function PackageCard({ title, description, price, features = [], isPopular, buttonText = "İncele", slug }: PackageCardProps) {
  const detailUrl = slug ? `/paketler/${slug}` : "#";

  return (
    <div className={`relative flex flex-col p-6 bg-card rounded-2xl shadow-sm border
      ${isPopular ? 'border-primary shadow-lg scale-105' : 'border-border'} transition-all`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
          EN POPÜLER
        </div>
      )}
      
      <div className="space-y-4 flex-1">
        <h3 className="font-bold text-xl">{title}</h3>
        <p className="text-sm text-muted-foreground min-h-[40px]">{description}</p>
        
        <div className="flex items-baseline space-x-1">
          <span className="text-3xl font-extrabold">₺{price}</span>
          <span className="text-sm text-muted-foreground">/ Ay</span>
        </div>
        
        {features.length > 0 && (
          <ul className="space-y-3 pt-4 border-t border-border mt-4">
            {features.map((feature, i) => (
              <li key={i} className="flex items-center text-sm gap-2">
                <Check className={`w-4 h-4 ${isPopular ? 'text-success' : 'text-primary'}`} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="mt-8 flex gap-2">
        <Link href={detailUrl} className="flex-1">
          <Button 
            variant={isPopular ? "default" : "outline"}
            className={`w-full ${isPopular ? "bg-accent text-accent-foreground hover:bg-accent/90 border-0" : ""}`}
          >
            {buttonText}
          </Button>
        </Link>
        {slug && (
          <Link href={`/satin-al/${slug}`} className="flex-1">
            <Button variant="default" className="w-full font-bold">
               Satın Al
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
