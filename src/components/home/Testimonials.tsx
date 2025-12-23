import { Star } from 'lucide-react';
import { SAMPLE_IMAGES } from '@/lib/constants';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Fashion Blogger',
    image: SAMPLE_IMAGES.testimonials[0],
    content: 'The quality of LUXE THREADS is unmatched. Every piece feels premium and the attention to detail is remarkable.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Creative Director',
    image: SAMPLE_IMAGES.testimonials[1],
    content: 'Finally found a brand that combines style with sustainability. Their custom design feature is a game-changer.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Emma Williams',
    role: 'Entrepreneur',
    image: SAMPLE_IMAGES.testimonials[2],
    content: 'From ordering to delivery, the experience was seamless. The fit is perfect and the fabrics are luxurious.',
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-luxe">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers who have elevated their wardrobe with LUXE THREADS
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-card p-6 lg:p-8 rounded-sm border border-border animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-foreground/80 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}