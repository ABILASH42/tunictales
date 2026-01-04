import { Link } from 'react-router-dom';
import categoryKurta from '@/assets/category-kurta.jpg';
import categoryKurtaSets from '@/assets/category-kurta-sets.jpg';
import categoryCoordSets from '@/assets/category-coord-sets.jpg';
import categorySalwarSets from '@/assets/category-salwar-sets.jpg';

const categories = [
  { 
    name: 'Kurta', 
    description: 'Elegant everyday wear',
    image: categoryKurta, 
    href: '/shop?category=kurta',
    color: 'from-rose/80'
  },
  { 
    name: 'Kurta Sets', 
    description: 'Complete ethnic ensembles',
    image: categoryKurtaSets, 
    href: '/shop?category=kurta-sets',
    color: 'from-sage/80'
  },
  { 
    name: 'Coord Sets', 
    description: 'Modern coordinated looks',
    image: categoryCoordSets, 
    href: '/shop?category=coord-sets',
    color: 'from-terracotta/80'
  },
  { 
    name: 'Salwar Sets', 
    description: 'Traditional sophistication',
    image: categorySalwarSets, 
    href: '/shop?category=salwar-sets',
    color: 'from-maroon/80'
  },
];

export function FeaturedCategories() {
  return (
    <section className="section-padding">
      <div className="container-luxe">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block text-accent font-medium tracking-[0.3em] uppercase text-xs mb-4 animate-fade-in">
            Our Collections
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4 animate-fade-in-up">
            Shop by Category
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Explore our thoughtfully curated collections, crafted by skilled artisans 
            using traditional techniques passed down through generations
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              to={category.href}
              className="group relative aspect-[3/4] overflow-hidden rounded-lg hover-lift animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${category.color} via-transparent to-transparent opacity-80`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <h3 className="font-display text-xl md:text-2xl font-semibold text-white mb-1">
                  {category.name}
                </h3>
                <p className="text-white/80 text-sm mb-3 hidden md:block">
                  {category.description}
                </p>
                <span className="inline-flex items-center text-sm text-white group-hover:text-accent transition-colors">
                  Shop Now 
                  <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/30 rounded-lg transition-all duration-300" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
