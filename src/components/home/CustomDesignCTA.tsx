import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CustomDesignCTA() {
  return (
    <section className="section-padding">
      <div className="container-luxe">
        <div className="relative overflow-hidden rounded-sm bg-primary text-primary-foreground">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--accent)),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)),transparent_50%)]" />
          </div>
          
          <div className="relative grid lg:grid-cols-2 gap-8 p-8 md:p-12 lg:p-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-medium mb-4">
                <Sparkles className="h-4 w-4" />
                Custom Design Studio
              </div>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Create Your Own
                <br />
                <span className="text-accent">Unique Style</span>
              </h2>
              <p className="text-primary-foreground/70 mb-8 max-w-lg">
                Express yourself with our custom t-shirt designer. Upload your artwork, 
                add text, and create something truly one-of-a-kind.
              </p>
              <Button size="lg" variant="secondary" className="group" asChild>
                <Link to="/designer">
                  Start Designing
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
            
            <div className="relative aspect-square max-w-md mx-auto lg:mx-0">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-transparent rounded-lg" />
              <img
                src="https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80"
                alt="Custom t-shirt design"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}