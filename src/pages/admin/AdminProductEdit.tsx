import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AIDescriptionGenerator } from '@/components/admin/AIDescriptionGenerator';
import { supabase } from '@/integrations/supabase/client';
import { formatINR } from '@/lib/currency';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  slug: string;
}

const AdminProductEdit = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const isNew = productId === 'new';

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageUploading, setImageUploading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    short_description: '',
    description: '',
    base_price: '',
    sale_price: '',
    category_id: '',
    color_family: '',
    style_tags: '',
    images: [] as string[],
    is_featured: false,
    is_new: false,
    is_on_sale: false,
    is_customizable: false,
  });

  useEffect(() => {
    fetchCategories();
    if (!isNew && productId) fetchProduct(productId);
  }, [productId]);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('id, name, slug');
    if (data) setCategories(data);
  };

  const fetchProduct = async (id: string) => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      toast.error('Product not found');
      navigate('/admin/products');
      return;
    }

    setForm({
      name: data.name,
      slug: data.slug,
      short_description: data.short_description || '',
      description: data.description || '',
      base_price: String(data.base_price),
      sale_price: data.sale_price ? String(data.sale_price) : '',
      category_id: data.category_id || '',
      color_family: data.color_family || '',
      style_tags: (data.style_tags || []).join(', '),
      images: data.images || [],
      is_featured: data.is_featured || false,
      is_new: data.is_new || false,
      is_on_sale: data.is_on_sale || false,
      is_customizable: data.is_customizable || false,
    });
    setIsLoading(false);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    setForm(prev => ({
      ...prev,
      name,
      slug: isNew ? generateSlug(name) : prev.slug,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setImageUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `product-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('product-images').upload(fileName, file);
      if (error) throw error;

      const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName);
      setForm(prev => ({ ...prev, images: [...prev.images, urlData.publicUrl] }));
      toast.success('Image uploaded');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setImageUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.slug || !form.base_price) {
      toast.error('Please fill in required fields');
      return;
    }

    setIsSaving(true);
    try {
      const productData = {
        name: form.name,
        slug: form.slug,
        short_description: form.short_description || null,
        description: form.description || null,
        base_price: Number(form.base_price),
        sale_price: form.sale_price ? Number(form.sale_price) : null,
        category_id: form.category_id || null,
        color_family: form.color_family || null,
        style_tags: form.style_tags ? form.style_tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        images: form.images,
        is_featured: form.is_featured,
        is_new: form.is_new,
        is_on_sale: form.is_on_sale,
        is_customizable: form.is_customizable,
      };

      if (isNew) {
        const { error } = await supabase.from('products').insert(productData);
        if (error) throw error;
        toast.success('Product created');
      } else {
        const { error } = await supabase.from('products').update(productData).eq('id', productId!);
        if (error) throw error;
        toast.success('Product updated');
      }

      navigate('/admin/products');
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.message || 'Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><div className="animate-pulse">Loading...</div></div>;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/admin/products"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <h2 className="font-display text-xl font-semibold">
          {isNew ? 'Add New Product' : `Edit: ${form.name}`}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-card border rounded-sm p-6 space-y-4">
          <h3 className="font-semibold">Basic Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" value={form.name} onChange={e => handleNameChange(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input id="slug" value={form.slug} onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="short_desc">Short Description</Label>
            <Input id="short_desc" value={form.short_description} onChange={e => setForm(prev => ({ ...prev, short_description: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Full Description</Label>
            <Textarea id="description" rows={4} value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} />
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-card border rounded-sm p-6 space-y-4">
          <h3 className="font-semibold">Pricing</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="base_price">Base Price (₹) *</Label>
              <Input id="base_price" type="number" step="0.01" value={form.base_price} onChange={e => setForm(prev => ({ ...prev, base_price: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sale_price">Sale Price (₹)</Label>
              <Input id="sale_price" type="number" step="0.01" value={form.sale_price} onChange={e => setForm(prev => ({ ...prev, sale_price: e.target.value }))} />
            </div>
          </div>
        </div>

        {/* Category & Tags */}
        <div className="bg-card border rounded-sm p-6 space-y-4">
          <h3 className="font-semibold">Category & Tags</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category_id} onValueChange={v => setForm(prev => ({ ...prev, category_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color Family</Label>
              <Input id="color" value={form.color_family} onChange={e => setForm(prev => ({ ...prev, color_family: e.target.value }))} placeholder="e.g., Pink, Blue" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Style Tags (comma-separated)</Label>
            <Input id="tags" value={form.style_tags} onChange={e => setForm(prev => ({ ...prev, style_tags: e.target.value }))} placeholder="e.g., casual, festive, party" />
          </div>
        </div>

        {/* Images */}
        <div className="bg-card border rounded-sm p-6 space-y-4">
          <h3 className="font-semibold">Images</h3>
          <div className="flex flex-wrap gap-3">
            {form.images.map((url, i) => (
              <div key={i} className="relative group">
                <img src={url} alt="" className="w-24 h-24 object-cover rounded-sm border" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <label className="w-24 h-24 border-2 border-dashed rounded-sm flex flex-col items-center justify-center cursor-pointer hover:border-accent transition-colors">
              <Upload className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground mt-1">Add</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={imageUploading} />
            </label>
          </div>
          {imageUploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
        </div>

        {/* Flags */}
        <div className="bg-card border rounded-sm p-6 space-y-4">
          <h3 className="font-semibold">Product Flags</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { key: 'is_featured', label: 'Featured' },
              { key: 'is_new', label: 'New Arrival' },
              { key: 'is_on_sale', label: 'On Sale' },
              { key: 'is_customizable', label: 'Customizable' },
            ].map(flag => (
              <div key={flag.key} className="flex items-center gap-2">
                <Switch
                  checked={form[flag.key as keyof typeof form] as boolean}
                  onCheckedChange={v => setForm(prev => ({ ...prev, [flag.key]: v }))}
                />
                <Label>{flag.label}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="button" variant="outline" asChild className="flex-1">
            <Link to="/admin/products">Cancel</Link>
          </Button>
          <Button type="submit" className="flex-1" disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : isNew ? 'Create Product' : 'Update Product'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductEdit;