import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid3X3, List, SlidersHorizontal, X } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFilters } from '@/components/products/ProductFilters';
import { ProductGridSkeleton } from '@/components/products/ProductSkeleton';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import { cn } from '@/lib/utils';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  
  // Filters
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 15000]);

  const categorySlug = searchParams.get('category');

  useEffect(() => {
    fetchProducts();
  }, [sortBy, categorySlug]);

  const fetchProducts = async () => {
    setIsLoading(true);
    
    // First get category_id if category slug is provided
    let categoryId: string | null = null;
    if (categorySlug) {
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .maybeSingle();
      categoryId = categoryData?.id || null;
    }
    
    let query = supabase.from('products').select('*');
    
    // Filter by category if provided
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }
    
    if (searchParams.get('filter') === 'new') {
      query = query.eq('is_new', true);
    }
    
    switch (sortBy) {
      case 'price-low':
        query = query.order('base_price', { ascending: true });
        break;
      case 'price-high':
        query = query.order('base_price', { ascending: false });
        break;
      case 'popular':
        query = query.eq('is_featured', true).order('created_at', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }
    
    const { data } = await query;
    
    let filteredProducts = (data as Product[]) || [];
    
    // Client-side filtering for price
    filteredProducts = filteredProducts.filter(p => {
      const price = p.sale_price || p.base_price;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    
    setProducts(filteredProducts);
    setIsLoading(false);
  };

  const clearFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange([0, 15000]);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20 md:pt-24">
        {/* Page Header */}
        <div className="bg-secondary/30 py-12">
          <div className="container-luxe">
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              {categorySlug ? categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1).replace(/-/g, ' ') : 'Shop'}
            </h1>
            <p className="text-muted-foreground">
              {categorySlug ? `Browse our ${categorySlug.replace(/-/g, ' ')} collection` : 'Discover our curated collection of premium fashion'}
            </p>
          </div>
        </div>

        <div className="container-luxe py-8">
          <div className="flex lg:gap-8">
            {/* Desktop Filters */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <ProductFilters
                selectedSizes={selectedSizes}
                selectedColors={selectedColors}
                priceRange={priceRange}
                onSizesChange={setSelectedSizes}
                onColorsChange={setSelectedColors}
                onPriceChange={setPriceRange}
                onClearFilters={clearFilters}
              />
            </aside>

            {/* Products */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  {/* Mobile Filter Button */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="lg:hidden">
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <ProductFilters
                          selectedSizes={selectedSizes}
                          selectedColors={selectedColors}
                          priceRange={priceRange}
                          onSizesChange={setSelectedSizes}
                          onColorsChange={setSelectedColors}
                          onPriceChange={setPriceRange}
                          onClearFilters={clearFilters}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>

                  <span className="text-sm text-muted-foreground">
                    {products.length} products
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="popular">Popular</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* View Mode */}
                  <div className="hidden md:flex items-center border rounded-sm">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={cn(
                        'p-2 transition-colors',
                        viewMode === 'grid' ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'
                      )}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={cn(
                        'p-2 transition-colors',
                        viewMode === 'list' ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'
                      )}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              {isLoading ? (
                <ProductGridSkeleton />
              ) : products.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground mb-4">No products found</p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className={cn(
                  'grid gap-4 md:gap-6',
                  viewMode === 'grid' ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
                )}>
                  {products.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` } as React.CSSProperties}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;