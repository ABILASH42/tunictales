import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Lock, Truck } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatINR } from '@/lib/currency';
import { toast } from 'sonner';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { user, profile } = useAuth();
  
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Shipping info
  const [shippingInfo, setShippingInfo] = useState({
    name: profile?.full_name || '',
    address: '',
    phone: '',
    pincode: '',
  });
  
  const [shippingMethod, setShippingMethod] = useState('standard');
  
  const shippingCost = shippingMethod === 'express' ? 149 : subtotal > 1000 ? 0 : 99;
  const tax = subtotal * 0.05; // 5% GST
  const total = subtotal + shippingCost + tax;

  if (!user) {
    navigate('/auth');
    return null;
  }

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Generate order number
      const orderNumber = `LT-${Date.now().toString(36).toUpperCase()}`;

      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          status: 'pending',
          subtotal: subtotal,
          shipping_amount: shippingCost,
          tax_amount: tax,
          total: total,
          shipping_address: shippingInfo,
          payment_status: 'paid', // Simulated
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        product_name: item.product?.name || 'Unknown Product',
        variant_details: item.variant ? `${item.variant.size} / ${item.variant.color}` : null,
        quantity: item.quantity,
        unit_price: item.product?.sale_price || item.product?.base_price || 0,
        total_price: (item.product?.sale_price || item.product?.base_price || 0) * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      await clearCart();

      toast.success('Order placed successfully!');
      navigate('/account');
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to process order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20 md:pt-24">
        <div className="container-luxe py-8">
          <Link to="/cart" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              {/* Progress */}
              <div className="flex items-center mb-8">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
                  1
                </div>
                <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-accent' : 'bg-muted'}`} />
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
                  2
                </div>
              </div>

              {step === 1 && (
                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  <div>
                    <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Shipping Information
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          placeholder="Enter your full name"
                          value={shippingInfo.name}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          placeholder="Enter your full address"
                          value={shippingInfo.address}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone No</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={shippingInfo.phone}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input
                          id="pincode"
                          placeholder="Enter your pincode"
                          value={shippingInfo.pincode}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, pincode: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-4">Shipping Method</h3>
                    <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                      <div className="flex items-center justify-between border rounded-sm p-4 cursor-pointer hover:border-accent">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="standard" id="standard" />
                          <Label htmlFor="standard" className="cursor-pointer">
                            <span className="font-medium">Standard Shipping</span>
                            <p className="text-sm text-muted-foreground">5-7 business days</p>
                          </Label>
                        </div>
                        <span className="font-medium">{subtotal > 1000 ? 'Free' : formatINR(99)}</span>
                      </div>
                      <div className="flex items-center justify-between border rounded-sm p-4 cursor-pointer hover:border-accent mt-2">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="express" id="express" />
                          <Label htmlFor="express" className="cursor-pointer">
                            <span className="font-medium">Express Shipping</span>
                            <p className="text-sm text-muted-foreground">2-3 business days</p>
                          </Label>
                        </div>
                        <span className="font-medium">{formatINR(149)}</span>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Continue to Payment
                  </Button>
                </form>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment
                    </h2>

                    <div className="bg-muted/50 border rounded-sm p-8 text-center">
                      <Lock className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-display text-lg font-semibold mb-2">Payment Gateway Coming Soon</h3>
                      <p className="text-muted-foreground text-sm max-w-md mx-auto">
                        We're integrating a secure payment gateway. Online ordering will be available shortly. Thank you for your patience!
                      </p>
                    </div>
                  </div>

                  <Button type="button" variant="outline" onClick={() => setStep(1)} className="w-full">
                    Back to Shipping
                  </Button>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-secondary/30 rounded-sm p-6 sticky top-24">
                <h2 className="font-display text-xl font-semibold mb-4">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.product?.images[0] || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&q=80'}
                        alt={item.product?.name}
                        className="w-16 h-20 object-cover rounded-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-1">{item.product?.name}</p>
                        {item.variant && (
                          <p className="text-xs text-muted-foreground">
                            {item.variant.size} / {item.variant.color}
                          </p>
                        )}
                        <p className="text-sm mt-1">
                          {formatINR(item.product?.sale_price || item.product?.base_price)} × {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatINR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shippingCost === 0 ? 'Free' : formatINR(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{formatINR(tax)}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatINR(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;