import { Link } from 'react-router-dom';
import { SAMPLE_IMAGES } from '@/lib/constants';

const categories = [
  { name: 'Men', image: SAMPLE_IMAGES.categories.men, href: '/shop?category=men' },
  { name: 'Women', image: SAMPLE_IMAGES.categories.women, href: '/shop?category=women' },
  { name: 'Accessories', image: SAMPLE_IMAGES.categories.accessories, href: '/shop?category=accessories' },
  { name: 'New Arrivals', image: SAMPLE_IMAGES.categories.newArrivals, href: '/shop?filter=new' },
];

export function FeaturedCategories() {
  return (
    <section className="section-padding">
      <div className="container-luxe">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Shop by Category
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our curated collections designed for every style and occasion
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              to={category.href}
              className="group relative aspect-[3/4] overflow-hidden rounded-sm animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <h3 className="font-display text-xl md:text-2xl font-semibold text-primary-foreground mb-2">
                  {category.name}
                </h3>
                <span className="text-sm text-primary-foreground/80 group-hover:text-accent transition-colors">
                  Shop Now →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}