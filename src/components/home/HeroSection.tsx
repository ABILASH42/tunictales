import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroKurtiShop from '@/assets/hero-kurti-shop.jpg';

export function HeroSection() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroKurtiShop}
          alt="Fashion hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="container-luxe relative z-10">
        <div className="max-w-2xl animate-fade-in-up">
          <span className="inline-block text-accent font-medium tracking-widest uppercase text-sm mb-4">
            New Collection 2024
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
            Elevate Your
            <br />
            <span className="text-accent">Style</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg">
            Discover our curated collection of premium fashion pieces designed 
            for those who appreciate quality and timeless elegance.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="group" asChild>
              <Link to="/shop">
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/designer">
                Create Custom
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-foreground/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-foreground/50 rounded-full" />
        </div>
      </div>
    </section>
  );
}