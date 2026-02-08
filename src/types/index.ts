export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  category_id: string | null;
  base_price: number;
  sale_price: number | null;
  is_featured: boolean;
  is_on_sale: boolean;
  is_new: boolean;
  is_customizable: boolean;
  style_tags: string[];
  color_family: string | null;
  images: string[];
  created_at: string;
  updated_at: string;
  category?: Category;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  color: string;
  color_hex: string | null;
  stock_quantity: number;
  sku: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  sort_order: number;
  created_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  custom_design_id: string | null;
  created_at: string;
  updated_at: string;
  product?: Product;
  variant?: ProductVariant;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

export interface Review {
  id: string;
  user_id?: string; // Optional - not included in public view
  product_id: string;
  rating: number;
  title: string | null;
  content: string | null;
  is_verified_purchase: boolean | null;
  created_at: string | null;
  profile?: Profile;
}

// Public review view (without user_id for privacy)
export interface ReviewPublic {
  id: string;
  product_id: string;
  rating: number;
  title: string | null;
  content: string | null;
  is_verified_purchase: boolean | null;
  created_at: string | null;
}

export interface Order {
  id: string;
  user_id: string | null;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  discount_amount: number;
  shipping_amount: number;
  tax_amount: number;
  total: number;
  shipping_address: Address | null;
  billing_address: Address | null;
  payment_intent_id: string | null;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  notes: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  variant_details: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  custom_design_data: Record<string, unknown> | null;
  created_at: string;
}

export interface Address {
  id?: string;
  user_id?: string;
  label?: string;
  full_name: string;
  phone?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default?: boolean;
}

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomDesign {
  id: string;
  user_id: string | null;
  name: string;
  design_data: Record<string, unknown>;
  preview_url: string | null;
  base_product_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Offer {
  id: string;
  code: string | null;
  title: string;
  description: string | null;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_value: number | null;
  max_uses: number | null;
  used_count: number;
  is_active: boolean;
  starts_at: string;
  ends_at: string | null;
  banner_image: string | null;
  created_at: string;
}

export interface HomepageSection {
  id: string;
  section_type: string;
  title: string | null;
  content: Record<string, unknown> | null;
  is_visible: boolean;
  sort_order: number;
  updated_at: string;
}

export type UserRole = 'admin' | 'moderator' | 'user';