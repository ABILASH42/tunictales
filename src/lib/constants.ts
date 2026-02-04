// Tunic Tales - Premium Indian Ethnic Boutique

// Sample product images
export const SAMPLE_IMAGES = {
  hero: [
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1920&q=80',
  ],
  products: {
    kurta: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-6c78276477e5?w=800&q=80',
    ],
    kurtaSets: [
      'https://images.unsplash.com/photo-1583391733956-6c78276477e5?w=800&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
    ],
    coordSets: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
    ],
    salwarSets: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
    ],
  },
  categories: {
    kurta: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
    kurtaSets: 'https://images.unsplash.com/photo-1583391733956-6c78276477e5?w=800&q=80',
    coordSets: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
    salwarSets: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
  },
  testimonials: [
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
  ],
};

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

export const COLORS = [
  { name: 'Dusty Rose', hex: '#d4a5a5' },
  { name: 'Sage Green', hex: '#9caf88' },
  { name: 'Terracotta', hex: '#c67d4d' },
  { name: 'Maroon', hex: '#722f37' },
  { name: 'Ivory', hex: '#f8f4e3' },
  { name: 'Mustard', hex: '#d4a43e' },
  { name: 'Navy', hex: '#2c3e50' },
  { name: 'Blush Pink', hex: '#e8c4c4' },
];

export const PRICE_RANGES = [
  { label: 'Under ₹1,500', min: 0, max: 1500 },
  { label: '₹1,500 - ₹3,000', min: 1500, max: 3000 },
  { label: '₹3,000 - ₹5,000', min: 3000, max: 5000 },
  { label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
  { label: 'Above ₹10,000', min: 10000, max: Infinity },
];

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Kurta', href: '/shop?category=kurta' },
];

export const FOOTER_LINKS = {
  shop: [
    { label: 'Kurta', href: '/shop?category=kurta' },
    { label: 'Kurta Sets', href: '/shop?category=kurta-sets' },
    { label: 'Coord Sets', href: '/shop?category=coord-sets' },
    { label: 'Salwar Sets', href: '/shop?category=salwar-sets' },
    { label: 'New Arrivals', href: '/shop?filter=new' },
  ],
  help: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Size Guide', href: '/size-guide' },
    { label: 'Shipping & Delivery', href: '/shipping' },
    { label: 'Returns & Exchange', href: '/returns' },
    { label: 'FAQs', href: '/faq' },
  ],
  about: [
    { label: 'Our Story', href: '/about' },
    { label: 'Artisan Partners', href: '/artisans' },
    { label: 'Sustainability', href: '/sustainability' },
    { label: 'Careers', href: '/careers' },
  ],
};

// Sample products for Tunic Tales
export const TUNIC_TALES_PRODUCTS = [
  {
    id: '1',
    name: 'Rosewood Embroidered Kurta',
    slug: 'rosewood-embroidered-kurta',
    base_price: 2499,
    sale_price: null,
    images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80'],
    is_new: true,
    is_on_sale: false,
    rating: 4.8,
    category: 'kurta',
  },
  {
    id: '2',
    name: 'Sage Garden Kurta Set',
    slug: 'sage-garden-kurta-set',
    base_price: 4999,
    sale_price: 3999,
    images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e5?w=800&q=80'],
    is_new: false,
    is_on_sale: true,
    rating: 4.9,
    category: 'kurta-sets',
  },
  {
    id: '3',
    name: 'Terracotta Coord Set',
    slug: 'terracotta-coord-set',
    base_price: 3799,
    sale_price: null,
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80'],
    is_new: true,
    is_on_sale: false,
    rating: 4.7,
    category: 'coord-sets',
  },
  {
    id: '4',
    name: 'Royal Maroon Salwar Set',
    slug: 'royal-maroon-salwar-set',
    base_price: 6999,
    sale_price: 5499,
    images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80'],
    is_new: false,
    is_on_sale: true,
    rating: 5.0,
    category: 'salwar-sets',
  },
  {
    id: '5',
    name: 'Pearl White Chikankari Kurta',
    slug: 'pearl-white-chikankari-kurta',
    base_price: 3299,
    sale_price: null,
    images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e5?w=800&q=80'],
    is_new: true,
    is_on_sale: false,
    rating: 4.6,
    category: 'kurta',
  },
  {
    id: '6',
    name: 'Blush Pink Palazzo Set',
    slug: 'blush-pink-palazzo-set',
    base_price: 4299,
    sale_price: 3599,
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80'],
    is_new: false,
    is_on_sale: true,
    rating: 4.8,
    category: 'kurta-sets',
  },
  {
    id: '7',
    name: 'Mustard Mirror Work Coord',
    slug: 'mustard-mirror-work-coord',
    base_price: 4599,
    sale_price: null,
    images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80'],
    is_new: true,
    is_on_sale: false,
    rating: 4.9,
    category: 'coord-sets',
  },
  {
    id: '8',
    name: 'Navy Blue Anarkali Set',
    slug: 'navy-blue-anarkali-set',
    base_price: 7999,
    sale_price: 6499,
    images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e5?w=800&q=80'],
    is_new: false,
    is_on_sale: true,
    rating: 4.7,
    category: 'salwar-sets',
  },
];
