import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            'h-3 w-3',
            star <= Math.floor(rating)
              ? 'fill-accent text-accent'
              : star - 0.5 <= rating
              ? 'fill-accent/50 text-accent'
              : 'fill-muted text-muted'
          )}
        />
      ))}
      <span className="ml-1 text-xs text-muted-foreground">({rating})</span>
    </div>
  );
}

export function TrendingProducts() {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [addedToCart, setAddedToCart] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .limit(8);
      
      setProducts((data as Product[]) || []);
      setIsLoading(false);
    };
    
    fetchProducts();
  }, []);

  const handleAddToCart = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    addToCart(productId);
    setAddedToCart(productId);
    setTimeout(() => setAddedToCart(null), 1500);
  };

  const handleToggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    toggleWishlist(productId);
  };

  // Don't render section if no products
  if (!isLoading && products.length === 0) {
    return null;
  }

  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-luxe">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="inline-block text-accent font-medium tracking-[0.3em] uppercase text-xs mb-4">
              Curated For You
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-2">
              Trending Now
            </h2>
            <p className="text-muted-foreground max-w-lg">
              Our most loved pieces this season, handpicked for you
            </p>
          </div>
          <Button variant="outline" asChild className="hidden md:flex border-2">
            <Link to="/shop">View All Collections</Link>
          </Button>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-product bg-muted rounded-t-lg" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-muted rounded w-20" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, index) => {
              const inWishlist = isInWishlist(product.id);
              const justAdded = addedToCart === product.id;

              return (
                <div
                  key={product.id}
                  className="group product-card animate-fade-in rounded-lg bg-card"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Link to={`/product/${product.slug}`} className="block">
                    {/* Image Container */}
                    <div className="relative aspect-product overflow-hidden bg-muted rounded-t-lg">
                      <img
                        src={product.images?.[0] || '/placeholder.svg'}
                        alt={product.name}
                        className="w-full h-full object-cover product-card-image"
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.is_new && (
                          <span className="badge-new">New</span>
                        )}
                        {product.is_on_sale && product.sale_price && (
                          <span className="badge-sale">
                            {Math.round((1 - product.sale_price / product.base_price) * 100)}% Off
                          </span>
                        )}
                      </div>

                      {/* Quick actions */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                        <Button
                          size="icon"
                          variant="secondary"
                          className={cn(
                            'h-9 w-9 rounded-full shadow-lg transition-all',
                            inWishlist && 'bg-red-50 text-red-500 hover:bg-red-100'
                          )}
                          onClick={(e) => handleToggleWishlist(e, product.id)}
                        >
                          <Heart className={cn('h-4 w-4', inWishlist && 'fill-current')} />
                        </Button>
                      </div>

                      {/* Add to cart overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <Button 
                          className={cn(
                            'w-full btn-ripple transition-all',
                            justAdded && 'bg-green-600 hover:bg-green-600'
                          )} 
                          size="sm"
                          onClick={(e) => handleAddToCart(e, product.id)}
                        >
                          {justAdded ? (
                            <>
                              <span className="mr-2">✓</span>
                              Added!
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="h-4 w-4 mr-2" />
                              Add to Cart
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-medium text-foreground group-hover:text-primary transition-colors mt-2 mb-1 line-clamp-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        {product.sale_price ? (
                          <>
                            <span className="font-semibold text-primary">₹{product.sale_price.toLocaleString()}</span>
                            <span className="price-original">₹{product.base_price.toLocaleString()}</span>
                          </>
                        ) : (
                          <span className="font-semibold">₹{product.base_price.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {/* Mobile View All Button */}
        {products.length > 0 && (
          <div className="text-center mt-8 md:hidden">
            <Button variant="outline" asChild className="border-2">
              <Link to="/shop">View All Products</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
