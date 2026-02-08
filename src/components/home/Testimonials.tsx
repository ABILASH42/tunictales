import { Star, Quote } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80',
    rating: 5,
    text: "The quality of the kurta set I received was beyond my expectations. The embroidery work is so intricate and the fabric feels luxurious. Tunic Tales has become my go-to for ethnic wear!",
    product: 'Sage Garden Kurta Set',
  },
  {
    id: 2,
    name: 'Ananya Patel',
    location: 'Delhi',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    rating: 5,
    text: "I wore my Tunic Tales coord set to a wedding and received so many compliments! The fit was perfect and the color was exactly as shown. Will definitely order again.",
    product: 'Terracotta Coord Set',
  },
  {
    id: 3,
    name: 'Meera Krishnan',
    location: 'Bangalore',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    rating: 5,
    text: "Finally found a brand that understands modern Indian women! The designs are contemporary yet rooted in tradition. The customer service was also exceptional.",
    product: 'Pearl White Chikankari Kurta',
  },
];

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="section-padding">
      <div className="container-luxe">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-accent font-medium tracking-[0.3em] uppercase text-xs mb-4">
            Customer Love
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of happy customers who have made Tunic Tales their favorite
          </p>
        </div>

        {/* Testimonial Cards - Desktop */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-card rounded-xl p-8 border border-border/50 hover-lift animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Quote Icon */}
              <Quote className="h-8 w-8 text-accent/30 mb-4" />
              
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>

              {/* Text */}
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Product */}
              <p className="text-sm text-accent font-medium mb-4">
                Purchased: {testimonial.product}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial Carousel - Mobile */}
        <div className="md:hidden relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="w-full flex-shrink-0 px-2"
                >
                  <div className="bg-card rounded-xl p-6 border border-border/50">
                    <Quote className="h-6 w-6 text-accent/30 mb-3" />
                    
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                      ))}
                    </div>

                    <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                      "{testimonial.text}"
                    </p>

                    <div className="flex items-center gap-3">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-sm">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  activeIndex === index ? 'bg-primary w-6' : 'bg-muted'
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}