import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  TrendingUp,
  AlertTriangle,
  Plus,
  Trash2,
  Edit,
  Check,
  Search,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AdminLoginPage } from './AdminLoginPage';
import {
  getAllOrders,
  getProducts,
  getCategories,
  getStoreSettings,
  getCustomers,
  updateOrderStatus,
  upsertProduct,
  deleteProduct,
  upsertCategory,
  deleteCategory,
  updateStoreSettings
} from '../../services/storeService';
import { Order, Product, Category, StoreSettings, Customer } from '../../types/database';
import { formatRupiah, formatDate } from '../../lib/formatters';

type AdminTab = 'overview' | 'orders' | 'products' | 'categories' | 'customers' | 'settings';

export const AdminDashboardPage: React.FC = () => {
  const { isAdmin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Core Data States
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal / Editing states
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [trackingInput, setTrackingInput] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Search & Filter
  const [orderSearch, setOrderSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const refreshAllData = async () => {
    setLoading(true);
    try {
      const [ord, prd, cat, cst, stg] = await Promise.all([
        getAllOrders(),
        getProducts(),
        getCategories(),
        getCustomers(),
        getStoreSettings(),
      ]);
      setOrders(ord);
      setProducts(prd);
      setCategories(cat);
      setCustomers(cst);
      setSettings(stg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      refreshAllData();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return <AdminLoginPage />;
  }

  // Metrics Calculations
  const totalRevenue = orders.reduce(
    (sum, o) => (o.payment_status === 'paid' ? sum + o.total_amount : sum),
    0
  );
  const pendingOrdersCount = orders.filter(o => o.order_status === 'pending').length;
  const lowStockVariants = products.flatMap(p =>
    (p.variants || [])
      .filter(v => v.stock_quantity <= 5)
      .map(v => ({ product: p, variant: v }))
  );

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleUpdateOrderStatus = async (
    orderId: string,
    order_status: Order['order_status'],
    payment_status: Order['payment_status'],
    tracking?: string
  ) => {
    try {
      await updateOrderStatus(orderId, { order_status, payment_status, tracking_number: tracking });
      showToast('Status pesanan berhasil diperbarui!');
      refreshAllData();
      if (viewingOrder && viewingOrder.id === orderId) {
        setViewingOrder(prev => prev ? { ...prev, order_status, payment_status, tracking_number: tracking || prev.tracking_number } : null);
      }
    } catch {
      showToast('Gagal mengubah status pesanan');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      await upsertProduct(editingProduct);
      setEditingProduct(null);
      showToast('Produk streetwear berhasil disimpan!');
      refreshAllData();
    } catch {
      showToast('Gagal menyimpan produk');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.')) {
      await deleteProduct(id);
      showToast('Produk berhasil dihapus');
      refreshAllData();
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    try {
      await upsertCategory(editingCategory);
      setEditingCategory(null);
      showToast('Kategori berhasil disimpan!');
      refreshAllData();
    } catch {
      showToast('Gagal menyimpan kategori');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Hapus kategori ini?')) {
      await deleteCategory(id);
      showToast('Kategori dihapus');
      refreshAllData();
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      await updateStoreSettings(settings);
      showToast('Pengaturan toko berhasil diperbarui!');
    } catch {
      showToast('Gagal memperbarui pengaturan');
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col md:flex-row">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-white text-black px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center space-x-2 shadow-2xl">
          <Check size={16} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Admin Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-zinc-950 border-r border-zinc-800 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          <div>
            <span className="text-xl font-black uppercase tracking-tighter text-white block">
              KALARA<span className="text-zinc-500">.</span>ADMIN
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
              Management Portal
            </span>
          </div>

          <nav className="space-y-1.5 font-medium text-xs uppercase tracking-wider">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 transition-colors ${
                activeTab === 'overview' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <LayoutDashboard size={16} />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3 py-2.5 transition-colors ${
                activeTab === 'orders' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <ShoppingBag size={16} />
                <span>Orders</span>
              </div>
              {pendingOrdersCount > 0 && (
                <span className="bg-amber-500 text-black text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {pendingOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 transition-colors ${
                activeTab === 'products' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Package size={16} />
              <span>Products</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 transition-colors ${
                activeTab === 'categories' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Layers size={16} />
              <span>Categories</span>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 transition-colors ${
                activeTab === 'customers' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Users size={16} />
              <span>Customers</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 transition-colors ${
                activeTab === 'settings' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Settings size={16} />
              <span>Store Settings</span>
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-zinc-900 space-y-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between text-xs text-zinc-400 hover:text-white py-1"
          >
            <span>Live Storefront</span>
            <ExternalLink size={12} />
          </a>
          <button
            onClick={logout}
            className="w-full flex items-center space-x-2 text-xs uppercase font-mono text-zinc-500 hover:text-red-400 py-2"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="border-b border-zinc-800 pb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">Dashboard</span>
              <h1 className="text-2xl font-black uppercase tracking-tight text-white mt-1">
                Storefront Analytics & Overview
              </h1>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-zinc-950 border border-zinc-800 p-5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">Total Revenue</span>
                <span className="text-2xl font-mono font-bold text-white block mt-1">
                  {formatRupiah(totalRevenue)}
                </span>
                <span className="text-[11px] text-emerald-400 mt-2 block font-mono">Paid Transactions</span>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 p-5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">Total Orders</span>
                <span className="text-2xl font-mono font-bold text-white block mt-1">
                  {orders.length} Orders
                </span>
                <span className="text-[11px] text-zinc-400 mt-2 block font-mono">{pendingOrdersCount} Pending Verification</span>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 p-5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">Active Streetwear</span>
                <span className="text-2xl font-mono font-bold text-white block mt-1">
                  {products.length} Products
                </span>
                <span className="text-[11px] text-zinc-400 mt-2 block font-mono">{categories.length} Categories</span>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 p-5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">Low Stock Alert</span>
                <span className="text-2xl font-mono font-bold text-amber-400 block mt-1">
                  {lowStockVariants.length} SKUs
                </span>
                <span className="text-[11px] text-amber-500/80 mt-2 block font-mono">≤ 5 units remaining</span>
              </div>
            </div>

            {/* Low stock alerts */}
            {lowStockVariants.length > 0 && (
              <div className="bg-zinc-950 border border-amber-900/50 p-6 space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
                  <AlertTriangle size={16} />
                  <span>Low Stock Warning (Perlu Restock)</span>
                </h2>
                <div className="divide-y divide-zinc-900 text-xs">
                  {lowStockVariants.slice(0, 4).map(({ product, variant }) => (
                    <div key={variant.id} className="py-2.5 flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-white">{product.name}</span>
                        <span className="text-zinc-500 font-mono text-[10px] ml-2">
                          (SKU: {variant.sku} • {variant.size} • {variant.color})
                        </span>
                      </div>
                      <span className="font-mono font-bold text-amber-400">
                        Tersisa {variant.stock_quantity} pcs
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Orders table */}
            <div className="bg-zinc-950 border border-zinc-800 p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-white">Pesanan Terbaru</h2>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs uppercase font-mono text-zinc-400 hover:text-white"
                >
                  Lihat Semua →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-500 uppercase font-mono text-[10px]">
                      <th className="py-3">Order Number</th>
                      <th className="py-3">Customer</th>
                      <th className="py-3">Date</th>
                      <th className="py-3">Total</th>
                      <th className="py-3">Order Status</th>
                      <th className="py-3">Payment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {orders.slice(0, 5).map(o => (
                      <tr key={o.id} className="hover:bg-zinc-900/40">
                        <td className="py-3 font-mono font-bold text-white">{o.order_number}</td>
                        <td className="py-3 text-zinc-300">{o.customer_name}</td>
                        <td className="py-3 text-zinc-500">{formatDate(o.created_at)}</td>
                        <td className="py-3 font-mono font-bold text-white">{formatRupiah(o.total_amount)}</td>
                        <td className="py-3 uppercase font-mono text-[10px]">{o.order_status}</td>
                        <td className="py-3 uppercase font-mono text-[10px]">{o.payment_status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="border-b border-zinc-800 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">Orders</span>
                <h1 className="text-2xl font-black uppercase tracking-tight text-white mt-1">
                  Order & Dispatch Management
                </h1>
              </div>

              {/* Search Orders */}
              <div className="flex items-center bg-zinc-900 border border-zinc-700 px-3 py-1.5 w-full sm:w-64">
                <Search size={14} className="text-zinc-500 mr-2" />
                <input
                  type="text"
                  placeholder="Cari Order / Email..."
                  value={orderSearch}
                  onChange={e => setOrderSearch(e.target.value)}
                  className="bg-transparent text-xs text-white focus:outline-none w-full"
                />
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-zinc-950 border border-zinc-800 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 uppercase font-mono text-[10px]">
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Order Status</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {orders
                    .filter(
                      o =>
                        o.order_number.toLowerCase().includes(orderSearch.toLowerCase()) ||
                        o.customer_name.toLowerCase().includes(orderSearch.toLowerCase()) ||
                        o.customer_email.toLowerCase().includes(orderSearch.toLowerCase())
                    )
                    .map(order => (
                      <tr key={order.id} className="hover:bg-zinc-900/40">
                        <td className="p-4 font-mono font-bold text-white">{order.order_number}</td>
                        <td className="p-4">
                          <p className="font-semibold text-white">{order.customer_name}</p>
                          <p className="text-[10px] text-zinc-500">{order.customer_email}</p>
                        </td>
                        <td className="p-4 text-zinc-400">{formatDate(order.created_at)}</td>
                        <td className="p-4 font-mono font-bold text-white">{formatRupiah(order.total_amount)}</td>
                        <td className="p-4">
                          <span className={`text-[10px] font-mono px-2 py-0.5 uppercase ${
                            order.order_status === 'completed'
                              ? 'bg-emerald-950 text-emerald-300'
                              : order.order_status === 'shipped'
                              ? 'bg-blue-950 text-blue-300'
                              : order.order_status === 'cancelled'
                              ? 'bg-red-950 text-red-300'
                              : 'bg-zinc-900 text-zinc-300'
                          }`}>
                            {order.order_status}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`text-[10px] font-mono px-2 py-0.5 uppercase ${
                            order.payment_status === 'paid'
                              ? 'bg-emerald-950 text-emerald-300'
                              : 'bg-amber-950 text-amber-300'
                          }`}>
                            {order.payment_status}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => {
                              setViewingOrder(order);
                              setTrackingInput(order.tracking_number || '');
                            }}
                            className="border border-zinc-700 hover:border-white px-2.5 py-1 text-[11px] uppercase font-bold text-white transition-colors"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCTS CRUD */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="border-b border-zinc-800 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">Inventory</span>
                <h1 className="text-2xl font-black uppercase tracking-tight text-white mt-1">
                  Product & Variant Management
                </h1>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Filter produk..."
                  value={productSearch}
                  onChange={e => setProductSearch(e.target.value)}
                  className="bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white focus:outline-none"
                />
                <button
                  onClick={() =>
                    setEditingProduct({
                      name: '',
                      slug: '',
                      category_id: categories[0]?.id,
                      base_price: 100000,
                      description: '',
                      details: '',
                      is_active: true,
                      is_featured: false,
                      is_new_arrival: true,
                    })
                  }
                  className="bg-white hover:bg-zinc-200 text-black px-4 py-2 text-xs font-bold uppercase tracking-widest flex items-center space-x-1.5 shrink-0"
                >
                  <Plus size={14} />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-zinc-950 border border-zinc-800 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 uppercase font-mono text-[10px]">
                    <th className="p-4">Streetwear Article</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Base Price</th>
                    <th className="p-4">Variants & Stock</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {products
                    .filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()))
                    .map(product => {
                      const totalStock = (product.variants || []).reduce((s, v) => s + v.stock_quantity, 0);
                      const catName = categories.find(c => c.id === product.category_id)?.name || 'General';
                      return (
                        <tr key={product.id} className="hover:bg-zinc-900/40">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={product.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop'}
                                alt=""
                                className="w-10 h-12 object-cover bg-zinc-900"
                              />
                              <div>
                                <p className="font-semibold text-white">{product.name}</p>
                                <p className="text-[10px] text-zinc-500 font-mono">/{product.slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-zinc-300">{catName}</td>
                          <td className="p-4 font-mono font-bold text-white">{formatRupiah(product.base_price)}</td>
                          <td className="p-4">
                            <span className="font-mono">{totalStock} pcs</span>
                            <span className="text-[10px] text-zinc-500 block">
                              ({product.variants?.length || 0} variants)
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`text-[10px] font-mono px-2 py-0.5 uppercase ${
                              product.is_active ? 'bg-emerald-950 text-emerald-300' : 'bg-red-950 text-red-300'
                            }`}>
                              {product.is_active ? 'Active' : 'Draft'}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => setEditingProduct(product)}
                              className="text-zinc-400 hover:text-white p-1"
                              title="Edit"
                            >
                              <Edit size={15} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-zinc-600 hover:text-red-400 p-1"
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CATEGORIES CRUD */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="border-b border-zinc-800 pb-4 flex justify-between items-center">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">Taxonomy</span>
                <h1 className="text-2xl font-black uppercase tracking-tight text-white mt-1">
                  Category Management
                </h1>
              </div>
              <button
                onClick={() => setEditingCategory({ name: '', slug: '', description: '', image_url: '' })}
                className="bg-white hover:bg-zinc-200 text-black px-4 py-2 text-xs font-bold uppercase tracking-widest flex items-center space-x-1.5"
              >
                <Plus size={14} />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map(cat => (
                <div key={cat.id} className="bg-zinc-950 border border-zinc-800 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-base font-bold text-white uppercase">{cat.name}</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingCategory(cat)}
                          className="text-zinc-400 hover:text-white"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="text-zinc-600 hover:text-red-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs font-mono text-zinc-500 mb-2">Slug: {cat.slug}</p>
                    <p className="text-xs text-zinc-400 line-clamp-2">{cat.description || '-'}</p>
                  </div>
                  {cat.image_url && (
                    <img src={cat.image_url} alt="" className="w-full h-32 object-cover mt-4 bg-zinc-900 border border-zinc-900" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CUSTOMERS */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="border-b border-zinc-800 pb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">Directory</span>
              <h1 className="text-2xl font-black uppercase tracking-tight text-white mt-1">
                Customer Database & Lifetime Spend
              </h1>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 uppercase font-mono text-[10px]">
                    <th className="p-4">Customer Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">City</th>
                    <th className="p-4">Total Orders</th>
                    <th className="p-4">Lifetime Spend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {customers.map(c => (
                    <tr key={c.id} className="hover:bg-zinc-900/40">
                      <td className="p-4 font-bold text-white">{c.full_name}</td>
                      <td className="p-4 text-zinc-300 font-mono">{c.email}</td>
                      <td className="p-4 text-zinc-400 font-mono">{c.phone}</td>
                      <td className="p-4 text-zinc-300">{c.city}</td>
                      <td className="p-4 font-mono">{c.total_orders} Orders</td>
                      <td className="p-4 font-mono font-bold text-emerald-400">{formatRupiah(c.total_spend)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: STORE SETTINGS */}
        {activeTab === 'settings' && settings && (
          <div className="max-w-2xl space-y-6">
            <div className="border-b border-zinc-800 pb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">Configuration</span>
              <h1 className="text-2xl font-black uppercase tracking-tight text-white mt-1">
                Store Settings & Payment Details
              </h1>
            </div>

            <form onSubmit={handleSaveSettings} className="bg-zinc-950 border border-zinc-800 p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold uppercase text-zinc-400 block mb-1">Nama Brand / Toko</label>
                <input
                  type="text"
                  value={settings.store_name}
                  onChange={e => setSettings({ ...settings, store_name: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 p-2.5 text-white"
                />
              </div>

              <div>
                <label className="font-bold uppercase text-zinc-400 block mb-1">Tagline</label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={e => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 p-2.5 text-white"
                />
              </div>

              <div>
                <label className="font-bold uppercase text-zinc-400 block mb-1">Nama Bank Pembayaran</label>
                <input
                  type="text"
                  value={settings.bank_name || ''}
                  onChange={e => setSettings({ ...settings, bank_name: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold uppercase text-zinc-400 block mb-1">Nomor Rekening Bank</label>
                  <input
                    type="text"
                    value={settings.bank_account_number || ''}
                    onChange={e => setSettings({ ...settings, bank_account_number: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold uppercase text-zinc-400 block mb-1">Atas Nama Rekening</label>
                  <input
                    type="text"
                    value={settings.bank_account_name || ''}
                    onChange={e => setSettings({ ...settings, bank_account_name: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold uppercase text-zinc-400 block mb-1">Flat Ongkos Kirim (IDR)</label>
                <input
                  type="number"
                  value={settings.flat_shipping_rate}
                  onChange={e => setSettings({ ...settings, flat_shipping_rate: Number(e.target.value) })}
                  className="w-full bg-zinc-900 border border-zinc-700 p-2.5 text-white font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-white hover:bg-zinc-200 text-black py-3 uppercase font-black tracking-widest text-xs"
              >
                Simpan Perubahan Pengaturan
              </button>
            </form>
          </div>
        )}
      </main>

      {/* MODAL: VIEW / MANAGE ORDER */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-500">Order Management</span>
                <h2 className="text-lg font-bold text-white uppercase">{viewingOrder.order_number}</h2>
              </div>
              <button onClick={() => setViewingOrder(null)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-zinc-500 uppercase font-mono text-[10px]">Customer</p>
                <p className="font-bold text-white mt-0.5">{viewingOrder.customer_name}</p>
                <p className="text-zinc-400">{viewingOrder.customer_email}</p>
                <p className="text-zinc-400">{viewingOrder.customer_phone}</p>
              </div>
              <div>
                <p className="text-zinc-500 uppercase font-mono text-[10px]">Alamat Kirim</p>
                <p className="text-zinc-300 mt-0.5">{viewingOrder.shipping_address}, {viewingOrder.shipping_city}</p>
                <p className="text-zinc-500 font-mono mt-1">Kurir: {viewingOrder.shipping_courier}</p>
              </div>
            </div>

            {/* Quick status updater */}
            <div className="bg-zinc-900 p-4 border border-zinc-800 space-y-3">
              <h4 className="text-xs font-bold uppercase text-white">Update Status & Resi</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">Status Pesanan</label>
                  <select
                    value={viewingOrder.order_status}
                    onChange={e => handleUpdateOrderStatus(viewingOrder.id, e.target.value as Order['order_status'], viewingOrder.payment_status, trackingInput)}
                    className="w-full bg-zinc-950 border border-zinc-700 p-2 text-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">Status Pembayaran</label>
                  <select
                    value={viewingOrder.payment_status}
                    onChange={e => handleUpdateOrderStatus(viewingOrder.id, viewingOrder.order_status, e.target.value as Order['payment_status'], trackingInput)}
                    className="w-full bg-zinc-950 border border-zinc-700 p-2 text-white"
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="pending_verification">Pending Verification</option>
                    <option value="paid">Paid (Lunas)</option>
                    <option value="rejected">Rejected</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">Nomor Resi Kurir (Tracking Number)</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={trackingInput}
                    onChange={e => setTrackingInput(e.target.value)}
                    placeholder="Contoh: JNE882910..."
                    className="flex-1 bg-zinc-950 border border-zinc-700 p-2 text-xs text-white font-mono uppercase"
                  />
                  <button
                    onClick={() => handleUpdateOrderStatus(viewingOrder.id, viewingOrder.order_status, viewingOrder.payment_status, trackingInput)}
                    className="bg-white text-black text-xs font-bold uppercase px-4 py-2 hover:bg-zinc-200"
                  >
                    Simpan Resi
                  </button>
                </div>
              </div>
            </div>

            {/* Line items list */}
            <div className="border-t border-zinc-800 pt-3">
              <h4 className="text-xs font-bold uppercase text-zinc-400 mb-2">Item Terpesan</h4>
              <div className="divide-y divide-zinc-900 text-xs">
                {viewingOrder.items?.map(it => (
                  <div key={it.id} className="py-2 flex justify-between">
                    <div>
                      <p className="font-semibold text-white">{it.product_name}</p>
                      <p className="text-[10px] text-zinc-500 font-mono">Size {it.size} • Color {it.color} • Qty {it.quantity}</p>
                    </div>
                    <span className="font-mono">{formatRupiah(it.subtotal)}</span>
                  </div>
                ))}
              </div>
              <div className="pt-3 flex justify-between text-sm font-bold border-t border-zinc-800 mt-2">
                <span>Total Pesanan</span>
                <span className="font-mono">{formatRupiah(viewingOrder.total_amount)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PRODUCT */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveProduct} className="bg-zinc-950 border border-zinc-800 w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
              <h3 className="font-bold uppercase text-white">
                {editingProduct.id ? 'Edit Streetwear Article' : 'Tambah Produk Streetwear Baru'}
              </h3>
              <button type="button" onClick={() => setEditingProduct(null)} className="text-zinc-500 hover:text-white">✕</button>
            </div>

            <div>
              <label className="font-bold uppercase text-zinc-400 block mb-1">Nama Produk *</label>
              <input
                type="text"
                required
                value={editingProduct.name || ''}
                onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 p-2.5 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-bold uppercase text-zinc-400 block mb-1">Kategori *</label>
                <select
                  value={editingProduct.category_id || categories[0]?.id}
                  onChange={e => setEditingProduct({ ...editingProduct, category_id: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 p-2.5 text-white"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-bold uppercase text-zinc-400 block mb-1">Base Price (IDR) *</label>
                <input
                  type="number"
                  required
                  value={editingProduct.base_price || 0}
                  onChange={e => setEditingProduct({ ...editingProduct, base_price: Number(e.target.value) })}
                  className="w-full bg-zinc-900 border border-zinc-700 p-2.5 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-bold uppercase text-zinc-400 block mb-1">Deskripsi Produk</label>
              <textarea
                rows={3}
                value={editingProduct.description || ''}
                onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 p-2.5 text-white"
              />
            </div>

            <div>
              <label className="font-bold uppercase text-zinc-400 block mb-1">Spesifikasi Material / Details</label>
              <input
                type="text"
                value={editingProduct.details || ''}
                onChange={e => setEditingProduct({ ...editingProduct, details: e.target.value })}
                placeholder="100% Combed Cotton 240 GSM..."
                className="w-full bg-zinc-900 border border-zinc-700 p-2.5 text-white"
              />
            </div>

            <div className="flex space-x-4 pt-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={editingProduct.is_featured ?? false}
                  onChange={e => setEditingProduct({ ...editingProduct, is_featured: e.target.checked })}
                />
                <span className="text-zinc-300">Featured</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={editingProduct.is_new_arrival ?? false}
                  onChange={e => setEditingProduct({ ...editingProduct, is_new_arrival: e.target.checked })}
                />
                <span className="text-zinc-300">New Arrival</span>
              </label>
            </div>

            <div className="pt-3 flex space-x-3">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="flex-1 border border-zinc-700 py-3 text-zinc-300 uppercase font-bold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 bg-white text-black py-3 uppercase font-black tracking-widest hover:bg-zinc-200"
              >
                Simpan Produk
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: EDIT CATEGORY */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveCategory} className="bg-zinc-950 border border-zinc-800 w-full max-w-md p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
              <h3 className="font-bold uppercase text-white">Kategori Streetwear</h3>
              <button type="button" onClick={() => setEditingCategory(null)} className="text-zinc-500 hover:text-white">✕</button>
            </div>

            <div>
              <label className="font-bold uppercase text-zinc-400 block mb-1">Nama Kategori *</label>
              <input
                type="text"
                required
                value={editingCategory.name || ''}
                onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 p-2.5 text-white"
              />
            </div>

            <div>
              <label className="font-bold uppercase text-zinc-400 block mb-1">Image URL</label>
              <input
                type="url"
                value={editingCategory.image_url || ''}
                onChange={e => setEditingCategory({ ...editingCategory, image_url: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-zinc-900 border border-zinc-700 p-2.5 text-white font-mono"
              />
            </div>

            <div>
              <label className="font-bold uppercase text-zinc-400 block mb-1">Deskripsi & Rentang Harga</label>
              <input
                type="text"
                value={editingCategory.description || ''}
                onChange={e => setEditingCategory({ ...editingCategory, description: e.target.value })}
                placeholder="Rp75.000–120.000"
                className="w-full bg-zinc-900 border border-zinc-700 p-2.5 text-white"
              />
            </div>

            <div className="pt-2 flex space-x-3">
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="flex-1 border border-zinc-700 py-3 text-zinc-300 uppercase font-bold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 bg-white text-black py-3 uppercase font-black tracking-widest hover:bg-zinc-200"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
