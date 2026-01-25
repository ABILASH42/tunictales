import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Product, ProductVariant } from '@/types';
import { toast } from 'sonner';
import { SIZES, COLORS } from '@/lib/constants';

const AdminProductStock = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // New variant form
  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('');
  const [newStock, setNewStock] = useState(0);

  useEffect(() => {
    if (productId) {
      fetchProductAndVariants();
    }
  }, [productId]);

  const fetchProductAndVariants = async () => {
    setIsLoading(true);
    
    const { data: productData } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .maybeSingle();
    
    if (productData) {
      setProduct(productData as Product);
    }

    const { data: variantsData } = await supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', productId)
      .order('size', { ascending: true });
    
    if (variantsData) {
      setVariants(variantsData as ProductVariant[]);
    }
    
    setIsLoading(false);
  };

  const updateVariantStock = async (variantId: string, newQuantity: number) => {
    const { error } = await supabase
      .from('product_variants')
      .update({ stock_quantity: newQuantity })
      .eq('id', variantId);

    if (error) {
      toast.error('Failed to update stock');
    } else {
      setVariants(prev => 
        prev.map(v => v.id === variantId ? { ...v, stock_quantity: newQuantity } : v)
      );
      toast.success('Stock updated');
    }
  };

  const addVariant = async () => {
    if (!newSize || !newColor) {
      toast.error('Please select size and color');
      return;
    }

    // Check if variant already exists
    const exists = variants.some(v => v.size === newSize && v.color === newColor);
    if (exists) {
      toast.error('This size/color combination already exists');
      return;
    }

    const colorData = COLORS.find(c => c.name === newColor);
    
    const { data, error } = await supabase
      .from('product_variants')
      .insert({
        product_id: productId,
        size: newSize,
        color: newColor,
        color_hex: colorData?.hex || null,
        stock_quantity: newStock,
        sku: `${product?.slug}-${newSize}-${newColor}`.toLowerCase().replace(/\s+/g, '-')
      })
      .select()
      .single();

    if (error) {
      toast.error('Failed to add variant');
    } else {
      setVariants(prev => [...prev, data as ProductVariant]);
      setNewSize('');
      setNewColor('');
      setNewStock(0);
      toast.success('Variant added');
    }
  };

  const deleteVariant = async (variantId: string) => {
    if (!confirm('Are you sure you want to delete this variant?')) return;

    const { error } = await supabase
      .from('product_variants')
      .delete()
      .eq('id', variantId);

    if (error) {
      toast.error('Failed to delete variant');
    } else {
      setVariants(prev => prev.filter(v => v.id !== variantId));
      toast.success('Variant deleted');
    }
  };

  const getTotalStock = () => {
    return variants.reduce((sum, v) => sum + (v.stock_quantity || 0), 0);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Product not found</p>
        <Button asChild>
          <Link to="/admin/products">Back to Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/admin/products">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-semibold">Manage Stock: {product.name}</h1>
          <p className="text-sm text-muted-foreground">
            Total stock: {getTotalStock()} units across {variants.length} variants
          </p>
        </div>
      </div>

      {/* Add New Variant */}
      <div className="bg-card border rounded-sm p-6">
        <h2 className="font-medium mb-4">Add New Variant</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <Label>Size</Label>
            <select
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              className="w-full h-10 px-3 border rounded-sm bg-background"
            >
              <option value="">Select size</option>
              {SIZES.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Color</Label>
            <select
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="w-full h-10 px-3 border rounded-sm bg-background"
            >
              <option value="">Select color</option>
              {COLORS.map(color => (
                <option key={color.name} value={color.name}>{color.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Initial Stock</Label>
            <Input
              type="number"
              min="0"
              value={newStock}
              onChange={(e) => setNewStock(parseInt(e.target.value) || 0)}
            />
          </div>
          <Button onClick={addVariant}>
            <Plus className="h-4 w-4 mr-2" />
            Add Variant
          </Button>
        </div>
      </div>

      {/* Existing Variants */}
      <div className="bg-card border rounded-sm">
        <div className="p-4 border-b">
          <h2 className="font-medium">Product Variants</h2>
        </div>
        
        {variants.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No variants yet. Add size/color combinations above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left p-4">Size</th>
                  <th className="text-left p-4">Color</th>
                  <th className="text-left p-4">SKU</th>
                  <th className="text-left p-4">Stock</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {variants.map(variant => (
                  <tr key={variant.id} className="border-b last:border-0">
                    <td className="p-4 font-medium">{variant.size}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {variant.color_hex && (
                          <div 
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: variant.color_hex }}
                          />
                        )}
                        {variant.color}
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground text-sm">
                      {variant.sku || '-'}
                    </td>
                    <td className="p-4">
                      <Input
                        type="number"
                        min="0"
                        value={variant.stock_quantity}
                        onChange={(e) => updateVariantStock(variant.id, parseInt(e.target.value) || 0)}
                        className="w-24"
                      />
                    </td>
                    <td className="p-4">
                      {variant.stock_quantity > 10 ? (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          In Stock
                        </span>
                      ) : variant.stock_quantity > 0 ? (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          Low Stock
                        </span>
                      ) : (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteVariant(variant.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductStock;
