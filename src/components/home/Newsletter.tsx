import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Gift, ArrowRight } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="py-20 bg-gradient-to-r from-primary via-primary to-primary relative overflow-hidden">
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_white_2px,_transparent_2px)] bg-[length:40px_40px]" />
      </div>

      <div className="container-luxe relative">
        <div className="max-w-2xl mx-auto text-center text-primary-foreground">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent mb-6">
            <Gift className="h-8 w-8 text-accent-foreground" />
          </div>

          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Join the Tunic Tales Family
          </h2>
          <p className="text-primary-foreground/80 mb-8">
            Subscribe and get 15% off your first order, plus exclusive access to 
            new arrivals and special offers.
          </p>

          {subscribed ? (
            <div className="animate-scale-in bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎉</span>
              </div>
              <h3 className="font-display text-2xl font-bold mb-2">Welcome to the Family!</h3>
              <p className="text-primary-foreground/80">
                Check your inbox for your exclusive 15% discount code.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-12 h-14 bg-white text-foreground border-0"
                />
              </div>
              <Button 
                type="submit" 
                size="lg"
                className="h-14 px-8 bg-accent text-accent-foreground hover:bg-accent/90 group"
              >
                Subscribe
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          )}

          <p className="text-xs text-primary-foreground/60 mt-4">
            By subscribing, you agree to our Privacy Policy and consent to receive updates.
          </p>
        </div>
      </div>
    </section>
  );
}