import { useState, useEffect } from 'react';
import { Save, Store, Globe, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const AdminSettings = () => {
  const [isSaving, setIsSaving] = useState(false);

  const [store, setStore] = useState({
    name: 'Tunic Tales',
    tagline: 'Premium Ethnic Boutique',
    email: 'tunic.tales2025@gmail.com',
    phone: '',
    address: '',
    currency: 'INR',
    gst: '5',
    freeShippingMin: '1000',
    standardShipping: '99',
    expressShipping: '149',
  });

  const [flags, setFlags] = useState({
    maintenanceMode: false,
    showSaleBanner: true,
    enableWishlist: true,
    enableReviews: true,
    enableDesigner: true,
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Settings are stored locally for now — can be migrated to DB later
    try {
      localStorage.setItem('admin_store_settings', JSON.stringify(store));
      localStorage.setItem('admin_feature_flags', JSON.stringify(flags));
      toast.success('Settings saved');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('admin_store_settings');
      const savedFlags = localStorage.getItem('admin_feature_flags');
      if (saved) setStore(JSON.parse(saved));
      if (savedFlags) setFlags(JSON.parse(savedFlags));
    } catch {}
  }, []);

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Store Info */}
      <div className="bg-card border rounded-sm p-6 space-y-4">
        <h3 className="font-display font-semibold flex items-center gap-2">
          <Store className="h-5 w-5" /> Store Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="store-name">Store Name</Label>
            <Input id="store-name" value={store.name} onChange={e => setStore(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input id="tagline" value={store.tagline} onChange={e => setStore(p => ({ ...p, tagline: e.target.value }))} />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Contact Email</Label>
            <Input id="email" type="email" value={store.email} onChange={e => setStore(p => ({ ...p, email: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Contact Phone</Label>
            <Input id="phone" value={store.phone} onChange={e => setStore(p => ({ ...p, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Store Address</Label>
          <Textarea id="address" rows={2} value={store.address} onChange={e => setStore(p => ({ ...p, address: e.target.value }))} placeholder="Enter store address" />
        </div>
      </div>

      {/* Shipping & Tax */}
      <div className="bg-card border rounded-sm p-6 space-y-4">
        <h3 className="font-display font-semibold flex items-center gap-2">
          <Globe className="h-5 w-5" /> Shipping & Tax
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gst">GST Rate (%)</Label>
            <Input id="gst" type="number" value={store.gst} onChange={e => setStore(p => ({ ...p, gst: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="freeShip">Free Shipping Minimum (₹)</Label>
            <Input id="freeShip" type="number" value={store.freeShippingMin} onChange={e => setStore(p => ({ ...p, freeShippingMin: e.target.value }))} />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="stdShip">Standard Shipping (₹)</Label>
            <Input id="stdShip" type="number" value={store.standardShipping} onChange={e => setStore(p => ({ ...p, standardShipping: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expShip">Express Shipping (₹)</Label>
            <Input id="expShip" type="number" value={store.expressShipping} onChange={e => setStore(p => ({ ...p, expressShipping: e.target.value }))} />
          </div>
        </div>
      </div>

      {/* Feature Flags */}
      <div className="bg-card border rounded-sm p-6 space-y-4">
        <h3 className="font-display font-semibold flex items-center gap-2">
          <Mail className="h-5 w-5" /> Feature Toggles
        </h3>
        {[
          { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Show maintenance page to visitors' },
          { key: 'showSaleBanner', label: 'Sale Banner', desc: 'Show promotional sale banner on homepage' },
          { key: 'enableWishlist', label: 'Wishlist', desc: 'Allow customers to save items to wishlist' },
          { key: 'enableReviews', label: 'Reviews', desc: 'Allow customers to leave product reviews' },
          { key: 'enableDesigner', label: 'Custom Designer', desc: 'Enable the custom product designer tool' },
        ].map(item => (
          <div key={item.key} className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-sm">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <Switch
              checked={flags[item.key as keyof typeof flags]}
              onCheckedChange={v => setFlags(p => ({ ...p, [item.key]: v }))}
            />
          </div>
        ))}
      </div>

      <Button onClick={handleSave} disabled={isSaving} className="w-full" size="lg">
        <Save className="h-4 w-4 mr-2" />
        {isSaving ? 'Saving...' : 'Save Settings'}
      </Button>
    </div>
  );
};

export default AdminSettings;