import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart, Minus, Plus, Star, Truck, RotateCcw, Shield } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCard } from '@/components/products/ProductCard';
import { supabase } from '@/integrations/supabase/client';
import { Product, ProductVariant, Review } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { SIZES, COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';

const ProductDetail = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const fetchProduct = async () => {
    setIsLoading(true);
    
    // Fetch product
    const { data: productData } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    
    if (productData) {
      setProduct(productData as Product);
      
      // Fetch variants
      const { data: variantData } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', productData.id);
      
      if (variantData) {
        setVariants(variantData as ProductVariant[]);
        if (variantData.length > 0) {
          setSelectedSize(variantData[0].size);
          setSelectedColor(variantData[0].color);
        }
      }
      
      // Fetch reviews
      const { data: reviewData } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productData.id)
        .order('created_at', { ascending: false });
      
      if (reviewData) setReviews(reviewData as Review[]);
      
      // Fetch recommendations
      const { data: recData } = await supabase
        .from('product_recommendations')
        .select('recommended_product_id')
        .eq('product_id', productData.id);
      
      if (recData && recData.length > 0) {
        const recIds = recData.map(r => r.recommended_product_id);
        const { data: recProducts } = await supabase
          .from('products')
          .select('*')
          .in('id', recIds);
        
        if (recProducts) setRecommendations(recProducts as Product[]);
      } else {
        // Fallback: get similar products from same category
        const { data: similarProducts } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', productData.category_id)
          .neq('id', productData.id)
          .limit(4);
        
        if (similarProducts) setRecommendations(similarProducts as Product[]);
      }
    }
    
    setIsLoading(false);
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    const selectedVariant = variants.find(
      v => v.size === selectedSize && v.color === selectedColor
    );
    
    addToCart(product.id, selectedVariant?.id, quantity);
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const availableSizes = [...new Set(variants.map(v => v.size))];
  const availableColors = [...new Set(variants.map(v => v.color))];

  const selectedVariant = variants.find(
    v => v.size === selectedSize && v.color === selectedColor
  );
  const inStock = selectedVariant ? selectedVariant.stock_quantity > 0 : true;
  const inWishlist = product ? isInWishlist(product.id) : false;

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-20 md:pt-24">
          <div className="container-luxe py-8">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              <div className="aspect-product bg-muted animate-pulse rounded-sm" />
              <div className="space-y-4">
                <div className="h-8 bg-muted animate-pulse rounded w-3/4" />
                <div className="h-6 bg-muted animate-pulse rounded w-1/4" />
                <div className="h-24 bg-muted animate-pulse rounded" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-20 md:pt-24">
          <div className="container-luxe py-16 text-center">
            <h1 className="font-display text-2xl mb-4">Product Not Found</h1>
            <Button asChild>
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20 md:pt-24">
        <div className="container-luxe py-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/shop" className="hover:text-foreground">Shop</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-product overflow-hidden bg-muted rounded-sm">
                <img
                  src={product.images[selectedImage] || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage(prev => prev === 0 ? product.images.length - 1 : prev - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm p-2 rounded-full hover:bg-background transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setSelectedImage(prev => prev === product.images.length - 1 ? 0 : prev + 1)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm p-2 rounded-full hover:bg-background transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
              
              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto scrollbar-thin">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={cn(
                        'flex-shrink-0 w-20 h-20 rounded-sm overflow-hidden border-2 transition-colors',
                        selectedImage === i ? 'border-accent' : 'border-transparent hover:border-border'
                      )}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                {product.is_new && <span className="badge-new mb-2">New Arrival</span>}
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
                
                {/* Rating */}
                {reviews.length > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            'h-4 w-4',
                            i < Math.round(averageRating) ? 'fill-accent text-accent' : 'text-muted'
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({reviews.length} reviews)
                    </span>
                  </div>
                )}
                
                {/* Price */}
                <div className="flex items-center gap-3">
                  {product.sale_price ? (
                    <>
                      <span className="text-2xl font-bold text-destructive">${product.sale_price}</span>
                      <span className="text-lg text-muted-foreground line-through">${product.base_price}</span>
                      <span className="badge-sale">
                        Save {Math.round((1 - product.sale_price / product.base_price) * 100)}%
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold">${product.base_price}</span>
                  )}
                </div>
              </div>

              <p className="text-muted-foreground">{product.description || product.short_description}</p>

              {/* Size Selection */}
              {availableSizes.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Size</span>
                    <button className="text-sm text-accent hover:underline">Size Guide</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SIZES.map(size => {
                      const isAvailable = availableSizes.includes(size);
                      return (
                        <button
                          key={size}
                          onClick={() => isAvailable && setSelectedSize(size)}
                          disabled={!isAvailable}
                          className={cn(
                            'w-12 h-12 border rounded-sm font-medium transition-colors',
                            selectedSize === size
                              ? 'border-accent bg-accent text-accent-foreground'
                              : isAvailable
                              ? 'border-border hover:border-accent'
                              : 'border-border text-muted-foreground opacity-50 cursor-not-allowed'
                          )}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {availableColors.length > 0 && (
                <div>
                  <span className="font-medium block mb-2">Color: {selectedColor}</span>
                  <div className="flex flex-wrap gap-2">
                    {availableColors.map(color => {
                      const colorInfo = COLORS.find(c => c.name === color) || { name: color, hex: '#888' };
                      return (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={cn(
                            'w-10 h-10 rounded-full border-2 transition-all',
                            selectedColor === color
                              ? 'border-accent ring-2 ring-accent ring-offset-2'
                              : 'border-border hover:border-accent'
                          )}
                          style={{ backgroundColor: colorInfo.hex }}
                          title={color}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <span className="font-medium block mb-2">Quantity</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-sm">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="p-3 hover:bg-muted transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="p-3 hover:bg-muted transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  {selectedVariant && (
                    <span className="text-sm text-muted-foreground">
                      {selectedVariant.stock_quantity} in stock
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={!inStock}
                >
                  {inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => product && toggleWishlist(product.id)}
                >
                  <Heart className={cn('h-5 w-5', inWishlist && 'fill-current text-destructive')} />
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                <div className="text-center">
                  <Truck className="h-6 w-6 mx-auto mb-2 text-accent" />
                  <span className="text-xs text-muted-foreground">Free Shipping</span>
                </div>
                <div className="text-center">
                  <RotateCcw className="h-6 w-6 mx-auto mb-2 text-accent" />
                  <span className="text-xs text-muted-foreground">30-Day Returns</span>
                </div>
                <div className="text-center">
                  <Shield className="h-6 w-6 mx-auto mb-2 text-accent" />
                  <span className="text-xs text-muted-foreground">2-Year Warranty</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="details" className="mt-16">
            <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
              <TabsTrigger
                value="details"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-6 py-3"
              >
                Details
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-6 py-3"
              >
                Reviews ({reviews.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="pt-6">
              <div className="prose max-w-none">
                <p>{product.description || 'No additional details available.'}</p>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="pt-6">
              {reviews.length === 0 ? (
                <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
              ) : (
                <div className="space-y-6">
                  {reviews.map(review => (
                    <div key={review.id} className="border-b pb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                'h-4 w-4',
                                i < review.rating ? 'fill-accent text-accent' : 'text-muted'
                              )}
                            />
                          ))}
                        </div>
                        {review.is_verified_purchase && (
                          <span className="text-xs text-success font-medium">Verified Purchase</span>
                        )}
                      </div>
                      {review.title && <h4 className="font-medium mb-1">{review.title}</h4>}
                      <p className="text-muted-foreground">{review.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <section className="mt-16">
              <h2 className="font-display text-2xl font-bold mb-8">Complete the Look</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {recommendations.map(rec => (
                  <ProductCard key={rec.id} product={rec} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;