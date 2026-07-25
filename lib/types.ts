// Database Types
export interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name?: string;
  phone?: string;
  role: 'customer' | 'affiliate' | 'admin';
  is_affiliate: boolean;
  affiliate_code?: string;
  affiliate_username?: string;
  profile_image_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  long_description?: string;
  price_naira: number;
  category_id: string;
  image_urls: string[];
  stock_quantity: number;
  is_featured: boolean;
  is_bestseller: boolean;
  rating: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  added_at: string;
  product?: Product;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  added_at: string;
  product?: Product;
}

export interface Order {
  id: string;
  user_id: string;
  affiliate_id?: string;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  total_amount_naira: number;
  shipping_address_line1: string;
  shipping_address_line2?: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code?: string;
  shipping_country: string;
  billing_same_as_shipping: boolean;
  billing_address_line1?: string;
  billing_address_line2?: string;
  billing_city?: string;
  billing_state?: string;
  billing_postal_code?: string;
  billing_country?: string;
  customer_email: string;
  customer_phone?: string;
  tracking_number?: string;
  notes?: string;
  stripe_session_id?: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price_naira: number;
  created_at: string;
  product?: Product;
}

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  title?: string;
  comment?: string;
  verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
  user?: { first_name: string; last_name?: string };
}

export interface Commission {
  id: string;
  affiliate_id: string;
  order_id: string;
  commission_rate: number;
  commission_amount_naira: number;
  status: 'pending' | 'approved' | 'paid' | 'refunded';
  order_status?: string;
  created_at: string;
  approved_at?: string;
  paid_at?: string;
}

export interface AffiliateCustomer {
  id: string;
  affiliate_id: string;
  customer_id: string;
  referred_at: string;
  referral_source: string;
}

export interface WithdrawalRequest {
  id: string;
  affiliate_id: string;
  amount_naira: number;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  bank_account_number: string;
  bank_name: string;
  account_holder_name: string;
  requested_at: string;
  approved_at?: string;
  paid_at?: string;
  rejection_reason?: string;
}
