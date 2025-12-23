import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Tag } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductGridSkeleton } from '@/components/products/ProductSkeleton';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Product, Offer } from '@/types';

const Sale = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    
    // Fetch sale products
    const { data: productData } = await supabase
      .from('products')
      .select('*')
      .eq('is_on_sale', true)
      .order('created_at', { ascending: false });
    
    if (productData) setProducts(productData as Product[]);
    
    // Fetch active offers
    const { data: offerData } = await supabase
      .from('offers')
      .select('*')
      .eq('is_active', true);
    
    if (offerData) setOffers(offerData as Offer[]);
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20 md:pt-24">
        {/* Hero Banner */}
        <div className="bg-destructive text-destructive-foreground py-16">
          <div className="container-luxe text-center">
            <Tag className="h-12 w-12 mx-auto mb-4" />
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Sale
            </h1>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Up to 50% off on selected items. Limited time only!
            </p>
          </div>
        </div>

        {/* Offers */}
        {offers.length > 0 && (
          <section className="py-12 bg-secondary/30">
            <div className="container-luxe">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {offers.map(offer => (
                  <div
                    key={offer.id}
                    className="bg-card border rounded-sm p-6 flex items-center gap-4"
                  >
                    <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Tag className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{offer.title}</h3>
                      <p className="text-sm text-muted-foreground">{offer.description}</p>
                      {offer.code && (
                        <p className="text-sm mt-1">
                          Use code: <span className="font-mono font-bold text-accent">{offer.code}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Products */}
        <div className="container-luxe py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl font-bold">Sale Items</h2>
            <span className="text-muted-foreground">{products.length} products</span>
          </div>

          {isLoading ? (
            <ProductGridSkeleton />
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No sale items at the moment</p>
              <Button asChild>
                <Link to="/shop">Browse All Products</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Sale;