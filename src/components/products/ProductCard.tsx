import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product, ProductVariant } from '@/types';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ProductCardProps {
  product: Product;
  className?: string;
  style?: React.CSSProperties;
}

function StarRating({ rating = 4.5 }: { rating?: number }) {
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

export function ProductCard({ product, className, style }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);
  const [justAdded, setJustAdded] = useState(false);
  const [totalStock, setTotalStock] = useState<number | null>(null);

  useEffect(() => {
    const fetchStock = async () => {
      const { data } = await supabase
        .from('product_variants')
        .select('stock_quantity')
        .eq('product_id', product.id);
      
      if (data) {
        const total = data.reduce((sum, v) => sum + (v.stock_quantity || 0), 0);
        setTotalStock(total);
      }
    };
    fetchStock();
  }, [product.id]);

  const isOutOfStock = totalStock !== null && totalStock === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;
    addToCart(product.id);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product.id);
  };

  return (
    <div className={cn('group product-card rounded-lg bg-card hover-lift', className)} style={style}>
      <Link to={`/product/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-product overflow-hidden bg-muted rounded-t-lg">
          <img
            src={product.images[0] || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80'}
            alt={product.name}
            className="w-full h-full object-cover product-card-image"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isOutOfStock && (
              <span className="bg-muted text-muted-foreground text-xs font-medium px-2.5 py-1 rounded">
                Out of Stock
              </span>
            )}
            {!isOutOfStock && product.is_new && (
              <span className="badge-new">New</span>
            )}
            {!isOutOfStock && product.is_on_sale && product.sale_price && (
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
              onClick={handleToggleWishlist}
            >
              <Heart className={cn('h-4 w-4', inWishlist && 'fill-current')} />
            </Button>
          </div>

          {/* Add to cart overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <Button 
              className={cn(
                'w-full btn-ripple transition-all',
                justAdded && 'bg-green-600 hover:bg-green-600',
                isOutOfStock && 'opacity-50 cursor-not-allowed'
              )} 
              size="sm"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              {isOutOfStock ? (
                'Out of Stock'
              ) : justAdded ? (
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
          <StarRating rating={4.5} />
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
}
