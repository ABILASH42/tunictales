import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

const Cart = () => {
  const { items, itemCount, subtotal, removeFromCart, updateQuantity, isLoading } = useCart();
  const { user } = useAuth();
  const [couponCode, setCouponCode] = useState('');

  const shipping = subtotal > 1000 ? 0 : 99;
  const total = subtotal + shipping;

  if (!user) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-20 md:pt-24">
          <div className="container-luxe py-16 text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="font-display text-2xl font-bold mb-2">Your Cart</h1>
            <p className="text-muted-foreground mb-6">Sign in to view your cart</p>
            <Button asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-20 md:pt-24">
          <div className="container-luxe py-16 text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="font-display text-2xl font-bold mb-2">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-6">Looks like you haven't added anything yet</p>
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
          <h1 className="font-display text-3xl font-bold mb-8">Shopping Cart ({itemCount})</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex gap-4 p-4 border rounded-sm">
                  <Link to={`/product/${item.product?.slug}`} className="flex-shrink-0">
                    <img
                      src={item.product?.images[0] || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&q=80'}
                      alt={item.product?.name}
                      className="w-24 h-32 object-cover rounded-sm"
                    />
                  </Link>
                  
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.product?.slug}`}>
                      <h3 className="font-medium hover:text-accent transition-colors line-clamp-1">
                        {item.product?.name}
                      </h3>
                    </Link>
                    {item.variant && (
                      <p className="text-sm text-muted-foreground">
                        {item.variant.size} / {item.variant.color}
                      </p>
                    )}
                    <p className="font-medium mt-2">
                      ₹{(item.product?.sale_price || item.product?.base_price)?.toLocaleString()}
                    </p>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border rounded-sm">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-muted transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-10 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-muted transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-secondary/30 rounded-sm p-6 sticky top-24">
                <h2 className="font-display text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `₹${shipping.toLocaleString()}`}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-accent">
                      Add ₹{(1000 - subtotal).toLocaleString()} more for free shipping
                    </p>
                  )}
                </div>
                
                <div className="border-t my-4" />
                
                {/* Coupon */}
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button variant="outline" size="sm">Apply</Button>
                </div>
                
                <div className="flex justify-between font-semibold text-lg mb-6">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                
                <Button className="w-full" size="lg" asChild>
                  <Link to="/checkout">
                    Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                
                <p className="text-xs text-center text-muted-foreground mt-4">
                  Secure checkout powered by Stripe
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;