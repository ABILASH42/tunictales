import { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, Tag, 
  Image, Settings, LogOut, Menu, X, ChevronRight, Plus,
  Edit, Trash2, Eye, Sparkles, Boxes
} from 'lucide-react';
import { AIImageGenerator } from '@/components/admin/AIImageGenerator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Product, Order, Category } from '@/types';
import { formatINR } from '@/lib/currency';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, signOut, isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
    }
  }, [user, isAdmin, isLoading, navigate]);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
    { icon: Tag, label: 'Categories', path: '/admin/categories' },
    { icon: Image, label: 'Banners', path: '/admin/banners' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className={cn(
        'fixed top-0 left-0 z-40 h-screen bg-card border-r transition-transform',
        isSidebarOpen ? 'w-64' : 'w-16',
        'lg:translate-x-0'
      )}>
        <div className="flex items-center justify-between h-16 px-4 border-b">
          {isSidebarOpen && (
            <Link to="/admin" className="font-display font-bold text-lg">
              LUXE<span className="text-accent">ADMIN</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-sm transition-colors',
                location.pathname === item.path
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-muted'
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {isSidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3"
            onClick={() => signOut()}
          >
            <LogOut className="h-5 w-5" />
            {isSidebarOpen && 'Sign Out'}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className={cn(
        'transition-all',
        isSidebarOpen ? 'lg:ml-64' : 'lg:ml-16'
      )}>
        <header className="h-16 bg-card border-b flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="font-display text-xl font-semibold">
              {navItems.find(item => item.path === location.pathname)?.label || 'Admin'}
            </h1>
          </div>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            View Store →
          </Link>
        </header>

        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

// Dashboard Page
const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const { data: products } = await supabase.from('products').select('id');
    const { data: orders } = await supabase.from('orders').select('*');

    if (products && orders) {
      const revenue = orders.reduce((sum, o) => sum + Number(o.total), 0);
      const pending = orders.filter(o => o.status === 'pending').length;

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue: revenue,
        pendingOrders: pending,
      });

      setRecentOrders(orders.slice(0, 5) as unknown as Order[]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border rounded-sm p-6">
          <p className="text-sm text-muted-foreground">Total Products</p>
          <p className="text-3xl font-bold mt-2">{stats.totalProducts}</p>
        </div>
        <div className="bg-card border rounded-sm p-6">
          <p className="text-sm text-muted-foreground">Total Orders</p>
          <p className="text-3xl font-bold mt-2">{stats.totalOrders}</p>
        </div>
        <div className="bg-card border rounded-sm p-6">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-3xl font-bold mt-2">{formatINR(stats.totalRevenue)}</p>
        </div>
        <div className="bg-card border rounded-sm p-6">
          <p className="text-sm text-muted-foreground">Pending Orders</p>
          <p className="text-3xl font-bold mt-2">{stats.pendingOrders}</p>
        </div>
      </div>

      {/* AI Demo Section */}
      <AIImageGenerator />

      <div className="bg-card border rounded-sm p-6">
        <h2 className="font-display text-lg font-semibold mb-4">Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <p className="text-muted-foreground">No orders yet</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium">#{order.order_number}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatINR(Number(order.total))}</p>
                  <span className={cn(
                    'text-xs px-2 py-1 rounded-full',
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  )}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Products Page
const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setProducts(data as Product[]);
    setIsLoading(false);
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    const { error } = await supabase.from('products').delete().eq('id', id);
    
    if (error) {
      toast.error('Failed to delete product');
    } else {
      toast.success('Product deleted');
      fetchProducts();
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button asChild>
          <Link to="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="bg-card border rounded-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left p-4">Product</th>
                <th className="text-left p-4">Price</th>
                <th className="text-left p-4">Status</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    Loading...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => (
                  <tr key={product.id} className="border-b last:border-0">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0] || 'https://via.placeholder.com/50'}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {product.sale_price ? (
                        <div>
                          <span className="font-medium text-destructive">{formatINR(product.sale_price)}</span>
                          <span className="text-sm text-muted-foreground line-through ml-2">
                            {formatINR(product.base_price)}
                          </span>
                        </div>
                      ) : (
                        <span className="font-medium">{formatINR(product.base_price)}</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {product.is_featured && (
                          <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">Featured</span>
                        )}
                        {product.is_new && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">New</span>
                        )}
                        {product.is_on_sale && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Sale</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild title="View">
                          <Link to={`/product/${product.slug}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild title="Manage Stock">
                          <Link to={`/admin/products/${product.id}/stock`}>
                            <Boxes className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild title="Edit">
                          <Link to={`/admin/products/${product.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteProduct(product.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Orders Page
const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setOrders(data as unknown as Order[]);
    setIsLoading(false);
  };

  const updateStatus = async (orderId: string, status: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);
    
    if (error) {
      toast.error('Failed to update status');
    } else {
      toast.success('Status updated');
      fetchOrders();
    }
  };

  return (
    <div className="bg-card border rounded-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b">
            <tr>
              <th className="text-left p-4">Order</th>
              <th className="text-left p-4">Customer</th>
              <th className="text-left p-4">Total</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  Loading...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  No orders yet
                </td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.id} className="border-b last:border-0">
                  <td className="p-4 font-medium">#{order.order_number}</td>
                  <td className="p-4 text-muted-foreground">{order.user_id?.slice(0, 8)}...</td>
                  <td className="p-4 font-medium">{formatINR(Number(order.total))}</td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { AdminLayout, AdminDashboard, AdminProducts, AdminOrders };