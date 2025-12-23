import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function OfferBanner() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-accent text-accent-foreground py-4">
      <div className="container-luxe">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span className="font-medium">Flash Sale - Up to 50% Off</span>
          </div>
          
          <div className="flex items-center gap-2 font-mono text-lg">
            <div className="bg-accent-foreground/20 px-2 py-1 rounded">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <span>:</span>
            <div className="bg-accent-foreground/20 px-2 py-1 rounded">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <span>:</span>
            <div className="bg-accent-foreground/20 px-2 py-1 rounded">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
          </div>
          
          <Button variant="secondary" size="sm" asChild>
            <Link to="/sale">Shop Now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}