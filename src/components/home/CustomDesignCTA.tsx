import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Palette, Scissors } from 'lucide-react';

export function CustomDesignCTA() {
  return (
    <section className="section-padding bg-gradient-to-br from-secondary via-background to-secondary/50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />

      <div className="container-luxe relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-8 animate-float">
            <Sparkles className="h-8 w-8 text-accent" />
          </div>

          {/* Content */}
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            Design Your Own
            <span className="text-primary italic"> Story</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Create something uniquely yours. Our skilled artisans will bring your vision to life
            with handcrafted precision and traditional techniques.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="flex flex-col items-center p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover-lift">
              <Palette className="h-8 w-8 text-accent mb-4" />
              <h3 className="font-display font-semibold mb-2">Choose Colors</h3>
              <p className="text-sm text-muted-foreground">
                Pick from our exclusive palette of traditional hues
              </p>
            </div>
            <div className="flex flex-col items-center p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover-lift">
              <Scissors className="h-8 w-8 text-accent mb-4" />
              <h3 className="font-display font-semibold mb-2">Select Fabric</h3>
              <p className="text-sm text-muted-foreground">
                Premium fabrics like cotton, silk, and georgette
              </p>
            </div>
            <div className="flex flex-col items-center p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover-lift">
              <Sparkles className="h-8 w-8 text-accent mb-4" />
              <h3 className="font-display font-semibold mb-2">Add Details</h3>
              <p className="text-sm text-muted-foreground">
                Embroidery, mirror work, and embellishments
              </p>
            </div>
          </div>

          {/* CTA */}
          <Button size="lg" className="h-14 px-10 text-base glow-on-hover" asChild>
            <Link to="/designer">
              Start Designing
              <Sparkles className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}