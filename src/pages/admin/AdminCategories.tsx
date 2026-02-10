import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number | null;
  parent_id: string | null;
}

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({ name: '', slug: '', description: '', image_url: '' });

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    const { data } = await supabase.from('categories').select('*').order('sort_order');
    if (data) setCategories(data);
    setIsLoading(false);
  };

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleNameChange = (name: string) => {
    setForm(prev => ({ ...prev, name, slug: editingId ? prev.slug : generateSlug(name) }));
  };

  const resetForm = () => {
    setForm({ name: '', slug: '', description: '', image_url: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (cat: Category) => {
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      image_url: cat.image_url || '',
    });
    setEditingId(cat.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.slug) { toast.error('Name and slug are required'); return; }

    const data = {
      name: form.name,
      slug: form.slug,
      description: form.description || null,
      image_url: form.image_url || null,
    };

    if (editingId) {
      const { error } = await supabase.from('categories').update(data).eq('id', editingId);
      if (error) { toast.error('Failed to update category'); return; }
      toast.success('Category updated');
    } else {
      const { error } = await supabase.from('categories').insert({ ...data, sort_order: categories.length });
      if (error) { toast.error('Failed to create category'); return; }
      toast.success('Category created');
    }
    resetForm();
    fetchCategories();
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Delete this category? Products in this category will be uncategorized.')) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) { toast.error('Failed to delete category'); return; }
    toast.success('Category deleted');
    fetchCategories();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">Manage product categories</p>
        <Button onClick={() => { resetForm(); setShowForm(!showForm); }}>
          {showForm ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          {showForm ? 'Cancel' : 'Add Category'}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border rounded-sm p-6 space-y-4">
          <h3 className="font-display font-semibold">{editingId ? 'Edit Category' : 'New Category'}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cat-name">Name *</Label>
              <Input id="cat-name" value={form.name} onChange={e => handleNameChange(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-slug">Slug *</Label>
              <Input id="cat-slug" value={form.slug} onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cat-desc">Description</Label>
            <Textarea id="cat-desc" rows={2} value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cat-img">Image URL</Label>
            <Input id="cat-img" value={form.image_url} onChange={e => setForm(prev => ({ ...prev, image_url: e.target.value }))} placeholder="https://..." />
          </div>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            {editingId ? 'Update' : 'Create'}
          </Button>
        </form>
      )}

      <div className="bg-card border rounded-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Slug</th>
                <th className="text-left p-4">Description</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
              ) : categories.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No categories yet</td></tr>
              ) : categories.map(cat => (
                <tr key={cat.id} className="border-b last:border-0">
                  <td className="p-4 font-medium">{cat.name}</td>
                  <td className="p-4 text-muted-foreground">{cat.slug}</td>
                  <td className="p-4 text-muted-foreground text-sm truncate max-w-xs">{cat.description || '—'}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => startEdit(cat)} title="Edit">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteCategory(cat.id)} title="Delete">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;