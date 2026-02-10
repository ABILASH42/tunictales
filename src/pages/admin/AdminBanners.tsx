import { useState, useEffect } from 'react';
import { Plus, Trash2, Eye, EyeOff, GripVertical, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Banner {
  id: string;
  title: string | null;
  content: {
    image_url: string;
    link?: string;
    subtitle?: string;
  } | null;
  is_visible: boolean | null;
  sort_order: number | null;
}

const AdminBanners = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formLink, setFormLink] = useState('');
  const [formImage, setFormImage] = useState<File | null>(null);
  const [formPreview, setFormPreview] = useState('');

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('homepage_sections')
      .select('*')
      .eq('section_type', 'banner')
      .order('sort_order', { ascending: true });

    if (data) {
      setBanners(data.map(d => ({
        ...d,
        content: d.content as Banner['content'],
      })));
    }
    if (error) console.error('Error fetching banners:', error);
    setIsLoading(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }
    setFormImage(file);
    setFormPreview(URL.createObjectURL(file));
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split('.').pop();
    const fileName = `banner-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from('banners')
      .upload(fileName, file);

    if (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('banners')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formImage) {
      toast.error('Please select a banner image');
      return;
    }

    setUploading(true);
    try {
      const imageUrl = await uploadImage(formImage);
      if (!imageUrl) return;

      const { error } = await supabase
        .from('homepage_sections')
        .insert({
          section_type: 'banner',
          title: formTitle || null,
          content: {
            image_url: imageUrl,
            subtitle: formSubtitle || undefined,
            link: formLink || undefined,
          },
          is_visible: true,
          sort_order: banners.length,
        });

      if (error) throw error;

      toast.success('Banner added successfully');
      resetForm();
      fetchBanners();
    } catch (error) {
      console.error('Error adding banner:', error);
      toast.error('Failed to add banner');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormTitle('');
    setFormSubtitle('');
    setFormLink('');
    setFormImage(null);
    setFormPreview('');
    setShowForm(false);
  };

  const toggleVisibility = async (banner: Banner) => {
    const { error } = await supabase
      .from('homepage_sections')
      .update({ is_visible: !banner.is_visible })
      .eq('id', banner.id);

    if (error) {
      toast.error('Failed to update visibility');
    } else {
      toast.success(banner.is_visible ? 'Banner hidden' : 'Banner visible');
      fetchBanners();
    }
  };

  const deleteBanner = async (banner: Banner) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    // Delete image from storage
    if (banner.content?.image_url) {
      const path = banner.content.image_url.split('/banners/')[1];
      if (path) {
        await supabase.storage.from('banners').remove([path]);
      }
    }

    const { error } = await supabase
      .from('homepage_sections')
      .delete()
      .eq('id', banner.id);

    if (error) {
      toast.error('Failed to delete banner');
    } else {
      toast.success('Banner deleted');
      fetchBanners();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          Manage promotional banners displayed on your homepage
        </p>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          {showForm ? 'Cancel' : 'Add Banner'}
        </Button>
      </div>

      {/* Add Banner Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border rounded-sm p-6 space-y-4">
          <h3 className="font-display font-semibold">New Banner</h3>

          <div className="space-y-2">
            <Label>Banner Image *</Label>
            {formPreview ? (
              <div className="relative">
                <img
                  src={formPreview}
                  alt="Preview"
                  className="w-full max-h-48 object-cover rounded-sm"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => { setFormImage(null); setFormPreview(''); }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-sm cursor-pointer hover:border-accent transition-colors">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Click to upload (max 5MB)</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSelect}
                />
              </label>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title (optional)</Label>
              <Input
                id="title"
                placeholder="e.g., Summer Sale"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle (optional)</Label>
              <Input
                id="subtitle"
                placeholder="e.g., Up to 50% off"
                value={formSubtitle}
                onChange={(e) => setFormSubtitle(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">Link URL (optional)</Label>
            <Input
              id="link"
              placeholder="e.g., /shop?category=kurta"
              value={formLink}
              onChange={(e) => setFormLink(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={uploading || !formImage}>
            {uploading ? 'Uploading...' : 'Add Banner'}
          </Button>
        </form>
      )}

      {/* Banners List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="bg-card border rounded-sm p-8 text-center text-muted-foreground">
            Loading banners...
          </div>
        ) : banners.length === 0 ? (
          <div className="bg-card border rounded-sm p-8 text-center text-muted-foreground">
            No banners yet. Click "Add Banner" to create one.
          </div>
        ) : (
          banners.map((banner) => (
            <div
              key={banner.id}
              className={cn(
                'bg-card border rounded-sm p-4 flex items-center gap-4',
                !banner.is_visible && 'opacity-60'
              )}
            >
              <GripVertical className="h-5 w-5 text-muted-foreground flex-shrink-0" />

              {banner.content?.image_url && (
                <img
                  src={banner.content.image_url}
                  alt={banner.title || 'Banner'}
                  className="w-32 h-20 object-cover rounded-sm flex-shrink-0"
                />
              )}

              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {banner.title || 'Untitled Banner'}
                </p>
                {banner.content?.subtitle && (
                  <p className="text-sm text-muted-foreground truncate">{banner.content.subtitle}</p>
                )}
                {banner.content?.link && (
                  <p className="text-xs text-accent truncate">{banner.content.link}</p>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Switch
                  checked={banner.is_visible ?? true}
                  onCheckedChange={() => toggleVisibility(banner)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteBanner(banner)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminBanners;