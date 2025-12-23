// Sample product images from Unsplash
export const SAMPLE_IMAGES = {
  hero: [
    'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&q=80',
    'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&q=80',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80',
  ],
  products: {
    tshirts: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
    ],
    shirts: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
    ],
    pants: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80',
    ],
    jackets: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
      'https://images.unsplash.com/photo-1544923246-77307dd628b8?w=800&q=80',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
    ],
    dresses: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80',
    ],
    accessories: [
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
      'https://images.unsplash.com/photo-1509941943102-10c232fc06e0?w=800&q=80',
    ],
  },
  categories: {
    men: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80',
    women: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80',
    accessories: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80',
    newArrivals: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80',
  },
  testimonials: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
  ],
};

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

export const COLORS = [
  { name: 'Black', hex: '#1a1a1a' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Navy', hex: '#1e3a5f' },
  { name: 'Gray', hex: '#6b7280' },
  { name: 'Beige', hex: '#d4c5b5' },
  { name: 'Olive', hex: '#556b2f' },
  { name: 'Burgundy', hex: '#722f37' },
  { name: 'Camel', hex: '#c19a6b' },
];

export const PRICE_RANGES = [
  { label: 'Under $50', min: 0, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: '$100 - $200', min: 100, max: 200 },
  { label: '$200 - $500', min: 200, max: 500 },
  { label: 'Over $500', min: 500, max: Infinity },
];

export const NAV_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'New Arrivals', href: '/shop?filter=new' },
  { label: 'Sale', href: '/sale' },
  { label: 'Custom', href: '/designer' },
];

export const FOOTER_LINKS = {
  shop: [
    { label: 'New Arrivals', href: '/shop?filter=new' },
    { label: 'Best Sellers', href: '/shop?sort=popular' },
    { label: 'Sale', href: '/sale' },
    { label: 'All Products', href: '/shop' },
  ],
  help: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQs', href: '/faq' },
    { label: 'Shipping', href: '/shipping' },
    { label: 'Returns', href: '/returns' },
  ],
  about: [
    { label: 'Our Story', href: '/about' },
    { label: 'Sustainability', href: '/sustainability' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
  ],
};