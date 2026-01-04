import { useEffect, useState } from 'react';
import { Gift, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function OfferBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [currentOffer, setCurrentOffer] = useState(0);

  const offers = [
    { text: "Free Shipping on orders above ₹999", icon: "🚚" },
    { text: "Use code FIRST15 for 15% off your first order", icon: "🎁" },
    { text: "Easy 7-day returns on all products", icon: "↩️" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOffer((prev) => (prev + 1) % offers.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="bg-primary text-primary-foreground py-3 relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_hsl(var(--accent))_1px,_transparent_1px)] bg-[length:20px_20px]" />
      </div>

      <div className="container-luxe relative">
        <div className="flex items-center justify-center gap-3">
          <Gift className="h-4 w-4 text-accent hidden md:block" />
          <div className="relative h-6 overflow-hidden">
            {offers.map((offer, index) => (
              <p
                key={index}
                className={cn(
                  'text-sm text-center absolute inset-0 transition-all duration-500 flex items-center justify-center gap-2',
                  currentOffer === index
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-6'
                )}
              >
                <span>{offer.icon}</span>
                <span>{offer.text}</span>
              </p>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-foreground/70 hover:text-primary-foreground transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}