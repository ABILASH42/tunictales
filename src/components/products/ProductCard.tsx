import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

interface ProductCardProps {
  product: Product;
  className?: string;
  style?: React.CSSProperties;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product.id);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product.id);
  };

  return (
    <div className={cn('group relative', className)}>
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-product overflow-hidden bg-muted rounded-sm mb-4">
          <img
            src={product.images[0] || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.is_new && (
              <span className="badge-new">New</span>
            )}
            {product.is_on_sale && product.sale_price && (
              <span className="badge-sale">
                -{Math.round((1 - product.sale_price / product.base_price) * 100)}%
              </span>
            )}
          </div>

          {/* Quick actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="secondary"
              className={cn('h-9 w-9', inWishlist && 'text-destructive')}
              onClick={handleToggleWishlist}
            >
              <Heart className={cn('h-4 w-4', inWishlist && 'fill-current')} />
            </Button>
            <Button size="icon" variant="secondary" className="h-9 w-9" asChild>
              <Link to={`/product/${product.slug}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Add to cart overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <Button className="w-full" size="sm" onClick={handleAddToCart}>
              <ShoppingBag className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>

        <h3 className="font-medium text-foreground group-hover:text-accent transition-colors mb-1 line-clamp-1">
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
  );
}