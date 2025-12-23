import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SAMPLE_IMAGES } from '@/lib/constants';
import { cn } from '@/lib/utils';

// Sample products for display
const sampleProducts = [
  {
    id: '1',
    name: 'Classic White Tee',
    slug: 'classic-white-tee',
    base_price: 49,
    sale_price: null,
    images: [SAMPLE_IMAGES.products.tshirts[0]],
    is_new: true,
    is_on_sale: false,
  },
  {
    id: '2',
    name: 'Premium Oxford Shirt',
    slug: 'premium-oxford-shirt',
    base_price: 129,
    sale_price: 89,
    images: [SAMPLE_IMAGES.products.shirts[0]],
    is_new: false,
    is_on_sale: true,
  },
  {
    id: '3',
    name: 'Tailored Chinos',
    slug: 'tailored-chinos',
    base_price: 119,
    sale_price: null,
    images: [SAMPLE_IMAGES.products.pants[0]],
    is_new: false,
    is_on_sale: false,
  },
  {
    id: '4',
    name: 'Leather Bomber Jacket',
    slug: 'leather-bomber-jacket',
    base_price: 349,
    sale_price: 279,
    images: [SAMPLE_IMAGES.products.jackets[0]],
    is_new: true,
    is_on_sale: true,
  },
];

export function TrendingProducts() {
  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-luxe">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Trending Now
            </h2>
            <p className="text-muted-foreground">
              This season's most wanted pieces
            </p>
          </div>
          <Button variant="outline" asChild className="hidden md:flex">
            <Link to="/shop">View All</Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {sampleProducts.map((product, index) => (
            <div
              key={product.id}
              className="group product-card animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Link to={`/product/${product.slug}`} className="block">
                <div className="relative aspect-product overflow-hidden bg-muted rounded-sm mb-4">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover product-card-image"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.is_new && (
                      <span className="badge-new">New</span>
                    )}
                    {product.is_on_sale && (
                      <span className="badge-sale">Sale</span>
                    )}
                  </div>

                  {/* Quick actions */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="secondary" className="h-9 w-9">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Add to cart overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <Button className="w-full" size="sm">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>

                <h3 className="font-medium text-foreground group-hover:text-accent transition-colors mb-1">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2">
                  {product.sale_price ? (
                    <>
                      <span className="price-sale">${product.sale_price}</span>
                      <span className="price-original">${product.base_price}</span>
                    </>
                  ) : (
                    <span className="font-medium">${product.base_price}</span>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Button variant="outline" asChild>
            <Link to="/shop">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}