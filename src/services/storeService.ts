import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Category, Product, Order, StoreSettings, Customer, CartItem } from '../types/database';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_ORDERS, DEFAULT_SETTINGS } from '../lib/mockData';

// Local storage keys for resilient offline/mock-fallback operation
const STORAGE_KEYS = {
  CATEGORIES: 'kalara_categories',
  PRODUCTS: 'kalara_products',
  ORDERS: 'kalara_orders',
  SETTINGS: 'kalara_settings',
  CUSTOMERS: 'kalara_customers',
};

const getLocal = <T>(key: string, fallback: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
};

const setLocal = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore
  }
};

// ==========================================
// STORE SETTINGS SERVICE
// ==========================================
export const getStoreSettings = async (): Promise<StoreSettings> => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('store_settings').select('*').eq('id', 'default').single();
      if (!error && data) return data as StoreSettings;
    } catch (e) {
      console.warn('Using local fallback for settings', e);
    }
  }
  return getLocal<StoreSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
};

export const updateStoreSettings = async (settings: Partial<StoreSettings>): Promise<StoreSettings> => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('store_settings').upsert({ id: 'default', ...settings, updated_at: new Date().toISOString() }).select().single();
      if (!error && data) return data as StoreSettings;
    } catch (e) {
      console.error('Supabase updateStoreSettings failed', e);
    }
  }
  const current = getLocal<StoreSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  const updated = { ...current, ...settings };
  setLocal(STORAGE_KEYS.SETTINGS, updated);
  return updated;
};

// ==========================================
// CATEGORIES SERVICE
// ==========================================
export const getCategories = async (): Promise<Category[]> => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('categories').select('*').order('display_order', { ascending: true });
      if (!error && data && data.length > 0) return data as Category[];
    } catch (e) {
      console.warn('Using local fallback for categories', e);
    }
  }
  return getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
};

export const upsertCategory = async (category: Partial<Category>): Promise<Category> => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('categories').upsert(category).select().single();
      if (!error && data) return data as Category;
    } catch (e) {
      console.error('Supabase upsertCategory error', e);
    }
  }
  const list = getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  let updatedList: Category[];
  const id = category.id || `cat-${Date.now()}`;
  const record: Category = {
    id,
    name: category.name || 'New Category',
    slug: category.slug || (category.name || '').toLowerCase().replace(/\s+/g, '-'),
    description: category.description,
    image_url: category.image_url,
    display_order: category.display_order ?? list.length + 1,
    created_at: category.created_at || new Date().toISOString(),
  };

  if (category.id && list.some(c => c.id === category.id)) {
    updatedList = list.map(c => (c.id === category.id ? { ...c, ...record } : c));
  } else {
    updatedList = [...list, record];
  }
  setLocal(STORAGE_KEYS.CATEGORIES, updatedList);
  return record;
};

export const deleteCategory = async (id: string): Promise<void> => {
  if (isSupabaseConfigured()) {
    try {
      await supabase.from('categories').delete().eq('id', id);
    } catch (e) {
      console.error(e);
    }
  }
  const list = getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  setLocal(STORAGE_KEYS.CATEGORIES, list.filter(c => c.id !== id));
};

// ==========================================
// PRODUCTS SERVICE
// ==========================================
export const getProducts = async (filters?: {
  categoryId?: string;
  categorySlug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  newArrival?: boolean;
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'name';
}): Promise<Product[]> => {
  let products: Product[] = [];

  if (isSupabaseConfigured()) {
    try {
      let query = supabase.from('products').select(`
        *,
        category:categories(*),
        images:product_images(*),
        variants:product_variants(*)
      `).eq('is_active', true);

      if (filters?.featured) query = query.eq('is_featured', true);
      if (filters?.newArrival) query = query.eq('is_new_arrival', true);
      if (filters?.categoryId) query = query.eq('category_id', filters.categoryId);

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        products = data as Product[];
      }
    } catch (e) {
      console.warn('Falling back to local products', e);
    }
  }

  if (products.length === 0) {
    products = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  }

  // Filter in memory for responsiveness and fallback
  let result = [...products];

  if (filters?.categorySlug) {
    const cats = await getCategories();
    const matched = cats.find(c => c.slug === filters.categorySlug);
    if (matched) {
      result = result.filter(p => p.category_id === matched.id);
    }
  }

  if (filters?.categoryId) {
    result = result.filter(p => p.category_id === filters.categoryId);
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase().trim();
    result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }

  if (filters?.minPrice !== undefined) {
    result = result.filter(p => p.base_price >= filters.minPrice!);
  }

  if (filters?.maxPrice !== undefined) {
    result = result.filter(p => p.base_price <= filters.maxPrice!);
  }

  if (filters?.featured) {
    result = result.filter(p => p.is_featured);
  }

  if (filters?.newArrival) {
    result = result.filter(p => p.is_new_arrival);
  }

  // Sorting
  if (filters?.sortBy === 'price-asc') {
    result.sort((a, b) => a.base_price - b.base_price);
  } else if (filters?.sortBy === 'price-desc') {
    result.sort((a, b) => b.base_price - a.base_price);
  } else if (filters?.sortBy === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    // Newest
    result.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
  }

  return result;
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  const products = await getProducts();
  return products.find(p => p.slug === slug) || null;
};

export const upsertProduct = async (product: Partial<Product>): Promise<Product> => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('products').upsert({
        id: product.id,
        category_id: product.category_id,
        name: product.name,
        slug: product.slug || (product.name || '').toLowerCase().replace(/\s+/g, '-'),
        description: product.description,
        details: product.details,
        base_price: product.base_price,
        compare_at_price: product.compare_at_price,
        is_featured: product.is_featured ?? false,
        is_new_arrival: product.is_new_arrival ?? false,
        is_active: product.is_active ?? true,
        updated_at: new Date().toISOString(),
      }).select().single();

      if (!error && data) return data as Product;
    } catch (e) {
      console.error(e);
    }
  }

  const list = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  const id = product.id || `prod-${Date.now()}`;
  const newProd: Product = {
    id,
    name: product.name || 'Untitled Streetwear',
    slug: product.slug || (product.name || '').toLowerCase().replace(/\s+/g, '-'),
    category_id: product.category_id,
    description: product.description || '',
    details: product.details || '',
    base_price: product.base_price || 100000,
    compare_at_price: product.compare_at_price,
    is_featured: product.is_featured ?? false,
    is_new_arrival: product.is_new_arrival ?? false,
    is_active: product.is_active ?? true,
    created_at: product.created_at || new Date().toISOString(),
    images: product.images || [
      { id: `img-${Date.now()}`, product_id: id, image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop', is_primary: true, display_order: 1 }
    ],
    variants: product.variants || [
      { id: `var-${Date.now()}-1`, product_id: id, sku: `${(product.name || 'PROD').substring(0, 3).toUpperCase()}-BLK-M`, size: 'M', color: 'Black', stock_quantity: 10, additional_price: 0 },
      { id: `var-${Date.now()}-2`, product_id: id, sku: `${(product.name || 'PROD').substring(0, 3).toUpperCase()}-BLK-L`, size: 'L', color: 'Black', stock_quantity: 15, additional_price: 0 },
    ]
  };

  const updatedList = list.some(p => p.id === id)
    ? list.map(p => (p.id === id ? { ...p, ...newProd } : p))
    : [newProd, ...list];

  setLocal(STORAGE_KEYS.PRODUCTS, updatedList);
  return newProd;
};

export const deleteProduct = async (id: string): Promise<void> => {
  if (isSupabaseConfigured()) {
    try {
      await supabase.from('products').delete().eq('id', id);
    } catch (e) {
      console.error(e);
    }
  }
  const list = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  setLocal(STORAGE_KEYS.PRODUCTS, list.filter(p => p.id !== id));
};

// ==========================================
// ORDERS & ATOMIC CHECKOUT SERVICE
// ==========================================
export interface CheckoutPayload {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code?: string;
  shipping_courier: string;
  payment_method: string;
  customer_notes?: string;
  items: CartItem[];
}

export const createOrder = async (payload: CheckoutPayload): Promise<{ success: boolean; order_number: string; order_id: string; total_amount: number; error?: string }> => {
  // If Supabase is connected, invoke atomic RPC
  if (isSupabaseConfigured()) {
    try {
      const rpcItems = payload.items.map(item => ({
        variant_id: item.variant_id,
        quantity: item.quantity,
      }));

      const { data, error } = await supabase.rpc('create_order_atomic', {
        p_customer_name: payload.customer_name,
        p_customer_email: payload.customer_email,
        p_customer_phone: payload.customer_phone,
        p_shipping_address: payload.shipping_address,
        p_shipping_city: payload.shipping_city,
        p_shipping_postal_code: payload.shipping_postal_code || '',
        p_shipping_courier: payload.shipping_courier,
        p_payment_method: payload.payment_method,
        p_customer_notes: payload.customer_notes || '',
        p_items: rpcItems,
      });

      if (error) {
        console.error('Supabase atomic RPC error details:', error);
        throw new Error(error.message);
      }

      if (data && data.success) {
        return {
          success: true,
          order_id: data.order_id,
          order_number: data.order_number,
          total_amount: data.total_amount,
        };
      }
    } catch (err: unknown) {
      console.error('Supabase atomic RPC failed:', err);
      // Lempar error asli ke UI agar admin/user tahu persis penyebabnya dan tidak diam-diam fallback offline
      const message = err instanceof Error ? err.message : 'Gagal memproses pesanan ke database Supabase';
      throw new Error(`Database Error: ${message}`);
    }
  }

  // Atomic fallback handler with verified calculations and stock deduction
  const settings = await getStoreSettings();
  const products = await getProducts();
  
  let verifiedSubtotal = 0;
  const verifiedOrderItems = [];

  // Deduct stock in memory and verify quantities
  for (const item of payload.items) {
    const parentProd = products.find(p => p.id === item.product_id);
    const variant = parentProd?.variants?.find(v => v.id === item.variant_id);

    if (!parentProd || !variant) {
      throw new Error(`Product or variant not found: ${item.product_name}`);
    }

    if (variant.stock_quantity < item.quantity) {
      throw new Error(`Stok tidak mencukupi untuk ${item.product_name} (${variant.size}). Tersedia: ${variant.stock_quantity}`);
    }

    // Deduct stock atomically
    variant.stock_quantity -= item.quantity;

    const unitPrice = parentProd.base_price + (variant.additional_price || 0);
    const lineSubtotal = unitPrice * item.quantity;
    verifiedSubtotal += lineSubtotal;

    verifiedOrderItems.push({
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      order_id: '',
      product_id: parentProd.id,
      variant_id: variant.id,
      product_name: parentProd.name,
      variant_sku: variant.sku,
      size: variant.size,
      color: variant.color,
      quantity: item.quantity,
      unit_price: unitPrice,
      subtotal: lineSubtotal,
      image_url: parentProd.images?.[0]?.image_url,
    });
  }

  // Persist deducted products
  setLocal(STORAGE_KEYS.PRODUCTS, products);

  const orderId = `ord-${Date.now()}`;
  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const orderNumber = `KLR-${dateStr}-${randomSuffix}`;
  const totalAmount = verifiedSubtotal + (settings.flat_shipping_rate || 18000);

  const newOrder: Order = {
    id: orderId,
    order_number: orderNumber,
    customer_email: payload.customer_email,
    customer_name: payload.customer_name,
    customer_phone: payload.customer_phone,
    shipping_address: payload.shipping_address,
    shipping_city: payload.shipping_city,
    shipping_postal_code: payload.shipping_postal_code,
    shipping_courier: payload.shipping_courier,
    shipping_cost: settings.flat_shipping_rate || 18000,
    subtotal: verifiedSubtotal,
    total_amount: totalAmount,
    payment_method: payload.payment_method,
    payment_status: 'unpaid',
    order_status: 'pending',
    customer_notes: payload.customer_notes,
    created_at: new Date().toISOString(),
    items: verifiedOrderItems.map(i => ({ ...i, order_id: orderId })),
    history: [
      {
        id: `hist-${Date.now()}`,
        order_id: orderId,
        order_status: 'pending',
        payment_status: 'unpaid',
        notes: 'Order placed by customer via checkout',
        changed_by: 'customer',
        created_at: new Date().toISOString(),
      }
    ]
  };

  const existingOrders = getLocal<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  setLocal(STORAGE_KEYS.ORDERS, [newOrder, ...existingOrders]);

  return {
    success: true,
    order_id: orderId,
    order_number: orderNumber,
    total_amount: totalAmount,
  };
};

export const getOrderByNumberAndEmail = async (orderNumber: string, email: string): Promise<Order | null> => {
  const cleanOrderNum = orderNumber.trim().toUpperCase();
  const cleanEmail = email.trim().toLowerCase();

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*),
          history:order_status_history(*)
        `)
        .ilike('order_number', cleanOrderNum)
        .ilike('customer_email', cleanEmail)
        .single();

      if (!error && data) return data as Order;
    } catch (e) {
      console.warn('Supabase tracking lookup fallback', e);
    }
  }

  const orders = getLocal<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  return (
    orders.find(
      o => o.order_number.toUpperCase() === cleanOrderNum && o.customer_email.toLowerCase() === cleanEmail
    ) || null
  );
};

export const getAllOrders = async (): Promise<Order[]> => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`*, items:order_items(*), history:order_status_history(*)`)
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data as Order[];
    } catch (e) {
      console.warn(e);
    }
  }
  return getLocal<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
};

export const updateOrderStatus = async (
  orderId: string,
  updates: {
    order_status?: Order['order_status'];
    payment_status?: Order['payment_status'];
    tracking_number?: string;
    admin_notes?: string;
  },
  note?: string
): Promise<Order> => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .select(`*, items:order_items(*), history:order_status_history(*)`)
        .single();

      if (!error && data) {
        if (note || updates.order_status || updates.payment_status) {
          await supabase.from('order_status_history').insert({
            order_id: orderId,
            order_status: updates.order_status || data.order_status,
            payment_status: updates.payment_status || data.payment_status,
            notes: note || 'Order status updated by admin',
            changed_by: 'admin',
          });
        }
        return data as Order;
      }
    } catch (e) {
      console.error(e);
    }
  }

  const list = getLocal<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  const order = list.find(o => o.id === orderId);
  if (!order) throw new Error('Order not found');

  const updatedOrder: Order = {
    ...order,
    ...updates,
    updated_at: new Date().toISOString(),
    history: [
      {
        id: `hist-${Date.now()}`,
        order_id: orderId,
        order_status: updates.order_status || order.order_status,
        payment_status: updates.payment_status || order.payment_status,
        notes: note || 'Status updated by admin',
        changed_by: 'admin',
        created_at: new Date().toISOString(),
      },
      ...(order.history || []),
    ]
  };

  const updatedList = list.map(o => (o.id === orderId ? updatedOrder : o));
  setLocal(STORAGE_KEYS.ORDERS, updatedList);
  return updatedOrder;
};

// ==========================================
// CUSTOMERS SERVICE
// ==========================================
export const getCustomers = async (): Promise<Customer[]> => {
  const orders = await getAllOrders();
  const customerMap: Record<string, Customer> = {};

  orders.forEach(o => {
    const key = o.customer_email.toLowerCase();
    if (!customerMap[key]) {
      customerMap[key] = {
        id: `cust-${key}`,
        email: o.customer_email,
        full_name: o.customer_name,
        phone: o.customer_phone,
        address: o.shipping_address,
        city: o.shipping_city,
        postal_code: o.shipping_postal_code,
        total_orders: 0,
        total_spend: 0,
        created_at: o.created_at,
      };
    }
    customerMap[key].total_orders += 1;
    if (o.payment_status === 'paid') {
      customerMap[key].total_spend += o.total_amount;
    }
  });

  return Object.values(customerMap);
};
