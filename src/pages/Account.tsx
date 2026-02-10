import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, Heart, MapPin, LogOut, Settings, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCard } from '@/components/products/ProductCard';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { supabase } from '@/integrations/supabase/client';
import { Order, Address } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { formatINR } from '@/lib/currency';

const ChangePasswordSection = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsChanging(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
    setIsChanging(false);
  };

  return (
    <div className="border-t pt-6">
      <h3 className="font-display text-lg font-semibold mb-4">Change Password</h3>
      <form onSubmit={handleChangePassword} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="new-pw">New Password</Label>
          <div className="relative">
            <Input
              id="new-pw"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-pw">Confirm New Password</Label>
          <Input
            id="confirm-pw"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" variant="outline" disabled={isChanging}>
          {isChanging ? 'Changing...' : 'Change Password'}
        </Button>
      </form>
    </div>
  );
};

const DeleteAccountSection = ({ onDeleted }: { onDeleted: () => void }) => {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }

    setIsDeleting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const res = await supabase.functions.invoke('delete-account', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (res.error) throw res.error;

      toast.success('Account deleted successfully');
      onDeleted();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="border-t pt-6">
      <h3 className="font-display text-lg font-semibold mb-2 text-destructive flex items-center gap-2">
        <AlertTriangle className="h-5 w-5" />
        Delete Account
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        This action is permanent and cannot be undone. All your data, orders, and saved information will be deleted.
      </p>

      {!showConfirm ? (
        <Button variant="destructive" onClick={() => setShowConfirm(true)}>
          Delete My Account
        </Button>
      ) : (
        <div className="space-y-3 border border-destructive/30 rounded-sm p-4 bg-destructive/5">
          <p className="text-sm font-medium">Type <strong>DELETE</strong> to confirm:</p>
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE"
          />
          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting || confirmText !== 'DELETE'}
            >
              {isDeleting ? 'Deleting...' : 'Permanently Delete Account'}
            </Button>
            <Button variant="outline" onClick={() => { setShowConfirm(false); setConfirmText(''); }}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const Account = () => {
  const navigate = useNavigate();
  const { user, profile, signOut, updateProfile, isLoading: authLoading } = useAuth();
  const { items: wishlistItems } = useWishlist();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Profile form
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
    }
  }, [profile]);

  const fetchUserData = async () => {
    setIsLoading(true);
    
    // Fetch orders
    const { data: orderData } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (orderData) setOrders(orderData as unknown as Order[]);
    
    // Fetch addresses
    const { data: addressData } = await supabase
      .from('addresses')
      .select('*')
      .order('is_default', { ascending: false });
    
    if (addressData) setAddresses(addressData as Address[]);
    
    setIsLoading(false);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const { error } = await updateProfile({ full_name: fullName, phone });
    
    if (error) {
      toast.error('Failed to update profile');
    } else {
      toast.success('Profile updated');
    }
    setIsSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20 md:pt-24">
        <div className="container-luxe py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold mb-1">My Account</h1>
              <p className="text-muted-foreground">Welcome back, {profile?.full_name || 'Guest'}</p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>

          <Tabs defaultValue="orders" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
              <TabsTrigger value="orders" className="gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="gap-2">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Wishlist</span>
              </TabsTrigger>
              <TabsTrigger value="addresses" className="gap-2">
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Addresses</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>

            {/* Orders */}
            <TabsContent value="orders">
              <div className="space-y-4">
                <h2 className="font-display text-xl font-semibold">Order History</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-12 bg-muted/30 rounded-sm">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No orders yet</p>
                    <Button asChild>
                      <Link to="/shop">Start Shopping</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order.id} className="border rounded-sm p-4">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                          <div>
                            <p className="font-medium">Order #{order.order_number}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatINR(order.total)}</p>
                            <span className={cn(
                              'text-xs px-2 py-1 rounded-full',
                              order.status === 'delivered' ? 'bg-success/10 text-success' :
                              order.status === 'shipped' ? 'bg-info/10 text-info' :
                              order.status === 'cancelled' ? 'bg-destructive/10 text-destructive' :
                              'bg-muted text-muted-foreground'
                            )}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Wishlist */}
            <TabsContent value="wishlist">
              <div className="space-y-4">
                <h2 className="font-display text-xl font-semibold">My Wishlist</h2>
                {wishlistItems.length === 0 ? (
                  <div className="text-center py-12 bg-muted/30 rounded-sm">
                    <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">Your wishlist is empty</p>
                    <Button asChild>
                      <Link to="/shop">Explore Products</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {wishlistItems.map(item => (
                      item.product && <ProductCard key={item.id} product={item.product} />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Addresses */}
            <TabsContent value="addresses">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl font-semibold">Saved Addresses</h2>
                  <Button variant="outline" size="sm">Add Address</Button>
                </div>
                {addresses.length === 0 ? (
                  <div className="text-center py-12 bg-muted/30 rounded-sm">
                    <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No saved addresses</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {addresses.map(address => (
                      <div key={address.id} className="border rounded-sm p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{address.label}</span>
                          {address.is_default && (
                            <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">Default</span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {address.full_name}<br />
                          {address.address_line1}<br />
                          {address.address_line2 && <>{address.address_line2}<br /></>}
                          {address.city}, {address.state} {address.postal_code}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Settings */}
            <TabsContent value="settings">
              <div className="max-w-md space-y-6">
                <h2 className="font-display text-xl font-semibold">Account Settings</h2>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={profile?.email || ''} disabled />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>

                {/* Change Password Section */}
                <ChangePasswordSection />

                {/* Delete Account Section */}
                <DeleteAccountSection onDeleted={() => { signOut(); navigate('/'); }} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Account;