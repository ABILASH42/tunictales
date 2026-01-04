import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/tunic-tales-hero.jpg';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Tunic Tales - Premium Indian Ethnic Wear"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-32 h-32 rounded-full bg-accent/10 blur-3xl animate-float" />
      <div className="absolute bottom-40 left-20 w-40 h-40 rounded-full bg-primary/10 blur-3xl animate-float" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="container-luxe relative z-10 pt-20">
        <div className="max-w-2xl">
          {/* Tagline */}
          <div className="flex items-center gap-2 mb-6 animate-fade-in-down">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="inline-block text-accent font-medium tracking-[0.3em] uppercase text-xs md:text-sm">
              Handcrafted with Love
            </span>
          </div>

          {/* Brand Name */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] mb-6 animate-fade-in-up">
            <span className="block text-foreground">Tunic</span>
            <span className="block text-primary italic">Tales</span>
          </h1>

          {/* Subtitle */}
          <p 
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed animate-fade-in"
            style={{ animationDelay: '0.3s' }}
          >
            Where every stitch tells a story. Discover our exquisite collection of 
            handcrafted Indian ethnic wear, designed for the modern woman.
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-wrap gap-4 animate-fade-in"
            style={{ animationDelay: '0.5s' }}
          >
            <Button 
              size="lg" 
              className="group btn-ripple glow-on-hover h-14 px-8 text-base" 
              asChild
            >
              <Link to="/shop?category=kurta">
                Shop Kurta
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="h-14 px-8 text-base border-2 hover:bg-secondary" 
              asChild
            >
              <Link to="/shop?category=kurta-sets">
                Explore Sets
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div 
            className="flex flex-wrap items-center gap-6 mt-12 text-sm text-muted-foreground animate-fade-in"
            style={{ animationDelay: '0.7s' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span>Premium Quality</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span>100% Authentic</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-7 h-12 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-primary/50 rounded-full animate-fade-in" />
        </div>
      </div>
    </section>
  );
}
