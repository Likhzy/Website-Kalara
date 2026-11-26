import { Category, Product, StoreSettings, Order } from '../types/database';

export const DEFAULT_SETTINGS: StoreSettings = {
  id: 'default',
  store_name: 'KALARA DISTRO',
  tagline: 'WEAR YOUR STYLE, SHOW YOUR IDENTITY.',
  about_text: 'KALARA DISTRO berdiri dari semangat "Karya Lokal, Rasa Anak Muda". Kami menciptakan pakaian streetwear kontemporer berkualitas tinggi dengan cutting presisi, grafis berani, dan material berstandar internasional yang dirancang untuk ekspresi autentik generasi muda.',
  contact_email: 'support@kalaradistro.id',
  contact_phone: '+62 812-3456-7890',
  contact_whatsapp: '+6281234567890',
  address: 'Jl. Trunojoyo No. 42, Citarum, Kec. Bandung Wetan, Kota Bandung, Jawa Barat 40115',
  bank_name: 'BCA (Bank Central Asia)',
  bank_account_name: 'PT KALARA DISTRO INDONESIA',
  bank_account_number: '8830 1928 4710',
  flat_shipping_rate: 18000,
};

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'T-Shirts',
    slug: 't-shirts',
    description: 'Heavyweight cotton graphic tees and boxy streetwear essentials. Rp75.000–120.000',
    image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
    display_order: 1,
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Hoodies',
    slug: 'hoodies',
    description: 'Oversized fleece drop-shoulder hoodies built for durability and comfort. Rp150.000–220.000',
    image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop',
    display_order: 2,
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Crewnecks',
    slug: 'crewnecks',
    description: 'Clean minimalist french terry crewnecks with subtle luxury detailing. Rp130.000–180.000',
    image_url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop',
    display_order: 3,
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    name: 'Casual Shirts',
    slug: 'casual-shirts',
    description: 'Relaxed fit short-sleeve resort shirts and workwear utility button-ups. Rp100.000–160.000',
    image_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop',
    display_order: 4,
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    name: 'Pants',
    slug: 'pants',
    description: 'Wide-leg utility cargo pants, loose denim, and relaxed sweatpants. Rp120.000–200.000',
    image_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop',
    display_order: 5,
  },
  {
    id: '66666666-6666-6666-6666-666666666666',
    name: 'Caps',
    slug: 'caps',
    description: 'Distressed vintage dad caps, embroidered 5-panel hats, and beanies. Rp45.000–75.000',
    image_url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop',
    display_order: 6,
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    category_id: '11111111-1111-1111-1111-111111111111',
    name: 'Kalara Genesis Boxy Heavyweight Tee',
    slug: 'kalara-genesis-boxy-heavyweight-tee',
    description: 'Oversized boxy tee cut from 240 GSM combed cotton. High-density tactile puff print on chest & spine.',
    details: '100% Combed Cotton 240 GSM. Pre-shrunk finish. Seamless tubular body construction. Made in Bandung.',
    base_price: 115000,
    compare_at_price: 145000,
    is_featured: true,
    is_new_arrival: true,
    is_active: true,
    created_at: new Date().toISOString(),
    images: [
      { id: 'img-1', product_id: 'a0000000-0000-0000-0000-000000000001', image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop', is_primary: true, display_order: 1 },
      { id: 'img-2', product_id: 'a0000000-0000-0000-0000-000000000001', image_url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop', is_primary: false, display_order: 2 }
    ],
    variants: [
      { id: 'var-1', product_id: 'a0000000-0000-0000-0000-000000000001', sku: 'TEE-GEN-BLK-S', size: 'S', color: 'Black', stock_quantity: 25, additional_price: 0 },
      { id: 'var-2', product_id: 'a0000000-0000-0000-0000-000000000001', sku: 'TEE-GEN-BLK-M', size: 'M', color: 'Black', stock_quantity: 30, additional_price: 0 },
      { id: 'var-3', product_id: 'a0000000-0000-0000-0000-000000000001', sku: 'TEE-GEN-BLK-L', size: 'L', color: 'Black', stock_quantity: 20, additional_price: 0 },
      { id: 'var-4', product_id: 'a0000000-0000-0000-0000-000000000001', sku: 'TEE-GEN-BLK-XL', size: 'XL', color: 'Black', stock_quantity: 15, additional_price: 0 },
      { id: 'var-5', product_id: 'a0000000-0000-0000-0000-000000000001', sku: 'TEE-GEN-WHT-M', size: 'M', color: 'White', stock_quantity: 18, additional_price: 0 },
      { id: 'var-6', product_id: 'a0000000-0000-0000-0000-000000000001', sku: 'TEE-GEN-WHT-L', size: 'L', color: 'White', stock_quantity: 22, additional_price: 0 }
    ]
  },
  {
    id: 'a0000000-0000-0000-0000-000000000002',
    category_id: '11111111-1111-1111-1111-111111111111',
    name: 'Identity Monogram Raw Edge Tee',
    slug: 'identity-monogram-raw-edge-tee',
    description: 'Minimalist vintage wash tee with raw bottom hem and tonal embroidered Kalara monogram.',
    details: '100% Washed Vintage Cotton 220 GSM. Bio-wash treated for ultra-soft hand feel.',
    base_price: 95000,
    compare_at_price: 120000,
    is_featured: false,
    is_new_arrival: true,
    is_active: true,
    created_at: new Date().toISOString(),
    images: [
      { id: 'img-3', product_id: 'a0000000-0000-0000-0000-000000000002', image_url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop', is_primary: true, display_order: 1 }
    ],
    variants: [
      { id: 'var-7', product_id: 'a0000000-0000-0000-0000-000000000002', sku: 'TEE-IDN-RAW-M', size: 'M', color: 'Off-White', stock_quantity: 15, additional_price: 0 },
      { id: 'var-8', product_id: 'a0000000-0000-0000-0000-000000000002', sku: 'TEE-IDN-RAW-L', size: 'L', color: 'Off-White', stock_quantity: 20, additional_price: 0 }
    ]
  },
  {
    id: 'a0000000-0000-0000-0000-000000000003',
    category_id: '11111111-1111-1111-1111-111111111111',
    name: 'Karya Lokal Cyberpunk Graphic Tee',
    slug: 'karya-lokal-cyberpunk-graphic-tee',
    description: 'Futuristic urban streetwear illustration celebrating Indonesian youth culture through a sci-fi lens.',
    details: '100% Ring-Spun Cotton 210 GSM. High resistance plastisol silkscreen.',
    base_price: 85000,
    compare_at_price: 110000,
    is_featured: true,
    is_new_arrival: false,
    is_active: true,
    created_at: new Date().toISOString(),
    images: [
      { id: 'img-4', product_id: 'a0000000-0000-0000-0000-000000000003', image_url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop', is_primary: true, display_order: 1 }
    ],
    variants: [
      { id: 'var-9', product_id: 'a0000000-0000-0000-0000-000000000003', sku: 'TEE-CYB-BLK-M', size: 'M', color: 'Black', stock_quantity: 18, additional_price: 0 },
      { id: 'var-10', product_id: 'a0000000-0000-0000-0000-000000000003', sku: 'TEE-CYB-BLK-L', size: 'L', color: 'Black', stock_quantity: 12, additional_price: 0 }
    ]
  },
  {
    id: 'b0000000-0000-0000-0000-000000000001',
    category_id: '22222222-2222-2222-2222-222222222222',
    name: 'Architect Heavyweight Drop-Shoulder Hoodie',
    slug: 'architect-heavyweight-drop-shoulder-hoodie',
    description: 'Substantial 380 GSM cotton fleece pullover hoodie. Generous double-lined hood and seamless kangaroo pocket.',
    details: '380 GSM Cotton Fleece. No drawstrings for a modern editorial silhouette. Heavy rib cuffs.',
    base_price: 195000,
    compare_at_price: 245000,
    is_featured: true,
    is_new_arrival: true,
    is_active: true,
    created_at: new Date().toISOString(),
    images: [
      { id: 'img-5', product_id: 'b0000000-0000-0000-0000-000000000001', image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop', is_primary: true, display_order: 1 },
      { id: 'img-6', product_id: 'b0000000-0000-0000-0000-000000000001', image_url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop', is_primary: false, display_order: 2 }
    ],
    variants: [
      { id: 'var-11', product_id: 'b0000000-0000-0000-0000-000000000001', sku: 'HD-ARC-BLK-M', size: 'M', color: 'Washed Black', stock_quantity: 12, additional_price: 0 },
      { id: 'var-12', product_id: 'b0000000-0000-0000-0000-000000000001', sku: 'HD-ARC-BLK-L', size: 'L', color: 'Washed Black', stock_quantity: 15, additional_price: 0 },
      { id: 'var-13', product_id: 'b0000000-0000-0000-0000-000000000001', sku: 'HD-ARC-BLK-XL', size: 'XL', color: 'Washed Black', stock_quantity: 8, additional_price: 0 },
      { id: 'var-14', product_id: 'b0000000-0000-0000-0000-000000000001', sku: 'HD-ARC-GRY-L', size: 'L', color: 'Heather Grey', stock_quantity: 10, additional_price: 0 }
    ]
  },
  {
    id: 'b0000000-0000-0000-0000-000000000002',
    category_id: '22222222-2222-2222-2222-222222222222',
    name: 'Nocturne Distressed Acid Wash Hoodie',
    slug: 'nocturne-distressed-acid-wash-hoodie',
    description: 'Hand-treated acid wash hoodie with subtle distressing around pocket trims and cuffs.',
    details: '360 GSM Terry Fleece. Individually enzyme and acid washed.',
    base_price: 215000,
    compare_at_price: 260000,
    is_featured: false,
    is_new_arrival: true,
    is_active: true,
    created_at: new Date().toISOString(),
    images: [
      { id: 'img-7', product_id: 'b0000000-0000-0000-0000-000000000002', image_url: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=800&auto=format&fit=crop', is_primary: true, display_order: 1 }
    ],
    variants: [
      { id: 'var-15', product_id: 'b0000000-0000-0000-0000-000000000002', sku: 'HD-NOC-ACD-M', size: 'M', color: 'Acid Charcoal', stock_quantity: 8, additional_price: 0 },
      { id: 'var-16', product_id: 'b0000000-0000-0000-0000-000000000002', sku: 'HD-NOC-ACD-L', size: 'L', color: 'Acid Charcoal', stock_quantity: 12, additional_price: 0 }
    ]
  },
  {
    id: 'c0000000-0000-0000-0000-000000000001',
    category_id: '33333333-3333-3333-3333-333333333333',
    name: 'Statement Minimalist French Terry Crewneck',
    slug: 'statement-minimalist-french-terry-crewneck',
    description: 'Clean luxury streetwear pullover. Refined tonal embroidery at collar line with custom raglan cut.',
    details: '330 GSM French Terry Cotton. Raglan sleeve cut. Custom woven neck tag.',
    base_price: 155000,
    compare_at_price: 185000,
    is_featured: true,
    is_new_arrival: false,
    is_active: true,
    created_at: new Date().toISOString(),
    images: [
      { id: 'img-8', product_id: 'c0000000-0000-0000-0000-000000000001', image_url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop', is_primary: true, display_order: 1 }
    ],
    variants: [
      { id: 'var-17', product_id: 'c0000000-0000-0000-0000-000000000001', sku: 'CRW-STM-BLK-M', size: 'M', color: 'Jet Black', stock_quantity: 14, additional_price: 0 },
      { id: 'var-18', product_id: 'c0000000-0000-0000-0000-000000000001', sku: 'CRW-STM-BLK-L', size: 'L', color: 'Jet Black', stock_quantity: 18, additional_price: 0 }
    ]
  },
  {
    id: 'd0000000-0000-0000-0000-000000000001',
    category_id: '44444444-4444-4444-4444-444444444444',
    name: 'Urban Camp Collar Resort Shirt',
    slug: 'urban-camp-collar-resort-shirt',
    description: 'Relaxed boxy silhouette with classic camp collar and matte horn buttons. Breathable rayon blend drape.',
    details: 'Rayon Cotton Blend. Camp cuban collar. Chest welt pocket with brand tab.',
    base_price: 135000,
    compare_at_price: 160000,
    is_featured: true,
    is_new_arrival: true,
    is_active: true,
    created_at: new Date().toISOString(),
    images: [
      { id: 'img-9', product_id: 'd0000000-0000-0000-0000-000000000001', image_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop', is_primary: true, display_order: 1 }
    ],
    variants: [
      { id: 'var-19', product_id: 'd0000000-0000-0000-0000-000000000001', sku: 'SHR-RES-BLK-M', size: 'M', color: 'Onyx Black', stock_quantity: 12, additional_price: 0 },
      { id: 'var-20', product_id: 'd0000000-0000-0000-0000-000000000001', sku: 'SHR-RES-BLK-L', size: 'L', color: 'Onyx Black', stock_quantity: 16, additional_price: 0 }
    ]
  },
  {
    id: 'e0000000-0000-0000-0000-000000000001',
    category_id: '55555555-5555-5555-5555-555555555555',
    name: 'Subway Wide-Leg Cargo Trousers',
    slug: 'subway-wide-leg-cargo-trousers',
    description: 'Relaxed wide cut with modular multi-pocket setup, adjustable ankle toggles, and elasticated back waistband.',
    details: 'Cotton Ripstop Fabric. YKK zippers. Multi-function utility loops and deep pockets.',
    base_price: 185000,
    compare_at_price: 225000,
    is_featured: true,
    is_new_arrival: true,
    is_active: true,
    created_at: new Date().toISOString(),
    images: [
      { id: 'img-10', product_id: 'e0000000-0000-0000-0000-000000000001', image_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop', is_primary: true, display_order: 1 }
    ],
    variants: [
      { id: 'var-21', product_id: 'e0000000-0000-0000-0000-000000000001', sku: 'CRG-SUB-BLK-28', size: '28-30 (S)', color: 'Matte Black', stock_quantity: 10, additional_price: 0 },
      { id: 'var-22', product_id: 'e0000000-0000-0000-0000-000000000001', sku: 'CRG-SUB-BLK-32', size: '31-33 (M)', color: 'Matte Black', stock_quantity: 15, additional_price: 0 },
      { id: 'var-23', product_id: 'e0000000-0000-0000-0000-000000000001', sku: 'CRG-SUB-BLK-34', size: '34-36 (L)', color: 'Matte Black', stock_quantity: 8, additional_price: 0 }
    ]
  },
  {
    id: 'f0000000-0000-0000-0000-000000000001',
    category_id: '66666666-6666-6666-6666-666666666666',
    name: 'Kalara Identity Unstructured Dad Cap',
    slug: 'kalara-identity-unstructured-dad-cap',
    description: 'Low profile unstructured 6-panel cap in washed cotton chino. Front embroidery and antique brass buckle closure.',
    details: '100% Washed Cotton Chino. Antique brass slider closure. Embroidered eyelets.',
    base_price: 65000,
    compare_at_price: 85000,
    is_featured: true,
    is_new_arrival: true,
    is_active: true,
    created_at: new Date().toISOString(),
    images: [
      { id: 'img-11', product_id: 'f0000000-0000-0000-0000-000000000001', image_url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop', is_primary: true, display_order: 1 }
    ],
    variants: [
      { id: 'var-24', product_id: 'f0000000-0000-0000-0000-000000000001', sku: 'CAP-DAD-BLK-OS', size: 'One Size', color: 'Vintage Black', stock_quantity: 45, additional_price: 0 }
    ]
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    order_number: 'KLR-20261126-A892F1',
    customer_email: 'ramadhan. streetwear@gmail.com',
    customer_name: 'Fikri Ramadhan',
    customer_phone: '081298765432',
    shipping_address: 'Jl. Dago Asri No. 18',
    shipping_city: 'Bandung',
    shipping_postal_code: '40135',
    shipping_courier: 'JNE Regular',
    shipping_cost: 18000,
    subtotal: 310000,
    total_amount: 328000,
    payment_method: 'BCA Transfer',
    payment_status: 'paid',
    order_status: 'processing',
    tracking_number: 'JNE8829102919ID',
    customer_notes: 'Tolong jangan dilipat lehernya kak',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    items: [
      {
        id: 'item-1',
        order_id: 'ord-1001',
        product_name: 'Kalara Genesis Boxy Heavyweight Tee',
        variant_sku: 'TEE-GEN-BLK-L',
        size: 'L',
        color: 'Black',
        quantity: 1,
        unit_price: 115000,
        subtotal: 115000,
        image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop'
      },
      {
        id: 'item-2',
        order_id: 'ord-1001',
        product_name: 'Architect Heavyweight Drop-Shoulder Hoodie',
        variant_sku: 'HD-ARC-BLK-L',
        size: 'L',
        color: 'Washed Black',
        quantity: 1,
        unit_price: 195000,
        subtotal: 195000,
        image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop'
      }
    ],
    history: [
      {
        id: 'hist-1',
        order_id: 'ord-1001',
        order_status: 'pending',
        payment_status: 'unpaid',
        notes: 'Order placed by customer',
        changed_by: 'customer',
        created_at: new Date(Date.now() - 3600000 * 5).toISOString()
      },
      {
        id: 'hist-2',
        order_id: 'ord-1001',
        order_status: 'processing',
        payment_status: 'paid',
        notes: 'BCA Payment confirmed by admin',
        changed_by: 'admin',
        created_at: new Date(Date.now() - 3600000 * 4).toISOString()
      }
    ]
  }
];
