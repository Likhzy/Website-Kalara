export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  display_order: number;
  created_at?: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  size: string;
  color: string;
  stock_quantity: number;
  additional_price: number;
  created_at?: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text?: string;
  is_primary: boolean;
  display_order: number;
}

export interface Product {
  id: string;
  category_id?: string;
  name: string;
  slug: string;
  description: string;
  details?: string;
  base_price: number;
  compare_at_price?: number;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  category?: Category;
  images?: ProductImage[];
  variants?: ProductVariant[];
}

export interface CartItem {
  variant_id: string;
  product_id: string;
  product_name: string;
  variant_sku: string;
  size: string;
  color: string;
  unit_price: number;
  image_url: string;
  quantity: number;
  max_stock: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'pending_verification' | 'paid' | 'rejected' | 'refunded';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  variant_id?: string;
  product_name: string;
  variant_sku: string;
  size: string;
  color: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  image_url?: string;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  notes?: string;
  changed_by: string;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id?: string;
  customer_email: string;
  customer_name: string;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code?: string;
  shipping_courier: string;
  shipping_cost: number;
  subtotal: number;
  total_amount: number;
  payment_method: string;
  payment_status: PaymentStatus;
  payment_proof_url?: string;
  order_status: OrderStatus;
  tracking_number?: string;
  customer_notes?: string;
  admin_notes?: string;
  created_at: string;
  updated_at?: string;
  items?: OrderItem[];
  history?: OrderStatusHistory[];
}

export interface StoreSettings {
  id: string;
  store_name: string;
  tagline: string;
  about_text?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_whatsapp?: string;
  address?: string;
  bank_name?: string;
  bank_account_name?: string;
  bank_account_number?: string;
  flat_shipping_rate: number;
}

export interface Customer {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  postal_code?: string;
  notes?: string;
  total_orders: number;
  total_spend: number;
  created_at: string;
}
