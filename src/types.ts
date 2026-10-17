export interface ColorVariant {
  name: string;
  image?: string;
  hex?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  currentPrice: number;
  originalPrice?: number;
  badge?: string; // e.g. "ডেলিভারি ফ্রি" or "৪০ টাকা ছাড়", "৪২০ টাকা ছাড়"
  badgeType?: 'free_delivery' | 'discount';
  section: 'hot_deals' | 'flash_sale' | 'top_rated' | 'best_sells' | 'temporary';
  visualType: string;
  rating?: number;
  inStock?: boolean;
  thumbnailUrl?: string;
  imageUrl?: string;
  galleryImages?: string[];
  sizes?: string[];
  colors?: string[];
  colorVariants?: ColorVariant[];
  sku?: string;
  brand?: string;
  description?: string;
  subcategory?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  selectedColor?: string;
  selectedSize?: string;
  selectedImage?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  deliveryArea: 'dhaka' | 'outside_dhaka';
  deliveryFee: number;
  paymentMethod: 'cod' | 'bkash' | 'nagad';
  items: CartItem[];
  subtotal: number;
  discount?: number;
  total: number;
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'In Transit' | 'Delivered' | 'Cancelled';
  courier?: string;
  courierTrackingCode?: string;
  notes?: string;
  createdAt: string;
}

export interface SubCategoryItem {
  id: string;
  name: string;
  slug?: string;
  description?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  visualType?: string;
  imageUrl?: string;
  subcategories?: SubCategoryItem[];
}

export interface BrandItem {
  id: string;
  name: string;
  logoText?: string;
  logoColor?: string;
  imageUrl?: string;
  productsCount?: number;
  createdDate?: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface SentEmailItem {
  id: string;
  to: string;
  toName: string;
  from: string;
  subject: string;
  bodyHtml?: string;
  bodyText: string;
  otpCode?: string;
  type: 'welcome' | 'reset_password' | 'password_changed';
  sentAt: string;
}

