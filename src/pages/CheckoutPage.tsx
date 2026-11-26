import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatRupiah } from '../lib/formatters';
import { createOrder, getStoreSettings } from '../services/storeService';
import { StoreSettings } from '../types/database';

export const CheckoutPage: React.FC = () => {
  const { cart, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    shipping_city: 'Bandung',
    shipping_postal_code: '',
    shipping_courier: 'JNE Regular',
    payment_method: 'Transfer Bank BCA',
    customer_notes: '',
  });

  useEffect(() => {
    getStoreSettings().then(setSettings);
  }, []);

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold uppercase text-white mb-3">Keranjang Anda Kosong</h2>
        <p className="text-zinc-500 mb-6 text-sm">Tambahkan beberapa item sebelum melakukan checkout.</p>
        <Link to="/shop" className="bg-white text-black px-6 py-3 uppercase text-xs font-bold tracking-widest">
          Belanja Sekarang
        </Link>
      </div>
    );
  }

  const shippingFee = settings?.flat_shipping_rate || 18000;
  const grandTotal = subtotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.customer_name || !formData.customer_email || !formData.customer_phone || !formData.shipping_address) {
      setErrorMsg('Mohon lengkapi semua data penerima dan alamat pengiriman.');
      return;
    }

    setLoading(true);
    try {
      const result = await createOrder({
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        shipping_address: formData.shipping_address,
        shipping_city: formData.shipping_city,
        shipping_postal_code: formData.shipping_postal_code,
        shipping_courier: formData.shipping_courier,
        payment_method: formData.payment_method,
        customer_notes: formData.customer_notes,
        items: cart,
      });

      if (result.success) {
        clearCart();
        navigate(`/order-confirmation?orderNumber=${result.order_number}&email=${encodeURIComponent(formData.customer_email)}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan pemrosesan pesanan.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center space-x-2 text-xs font-mono text-zinc-500">
          <Link to="/cart" className="hover:text-white flex items-center">
            <ArrowLeft size={14} className="mr-1" />
            Kembali ke Cart
          </Link>
        </div>

        <div className="border-b border-zinc-800 pb-4 mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">Checkout Process</span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white mt-1">
            Informasi Pengiriman & Pembayaran
          </h1>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-950/60 border border-red-500 text-red-200 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form details (2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Customer Information */}
            <div className="bg-zinc-950 border border-zinc-900 p-6 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white border-b border-zinc-800 pb-2 flex items-center justify-between">
                <span>1. Data Pemesan (Customer Details)</span>
                <span className="text-[10px] font-mono text-zinc-500">Guest Checkout Supported</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase font-bold text-zinc-400 block mb-1.5">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customer_name}
                    onChange={e => setFormData({ ...formData, customer_name: e.target.value })}
                    placeholder="Contoh: Rafi Pratama"
                    className="w-full bg-zinc-900 border border-zinc-700 text-xs text-white p-3 focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase font-bold text-zinc-400 block mb-1.5">
                    Email Aktif * (Untuk Tracking & Notifikasi)
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.customer_email}
                    onChange={e => setFormData({ ...formData, customer_email: e.target.value })}
                    placeholder="rafi@email.com"
                    className="w-full bg-zinc-900 border border-zinc-700 text-xs text-white p-3 focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs uppercase font-bold text-zinc-400 block mb-1.5">
                  Nomor WhatsApp / HP *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.customer_phone}
                  onChange={e => setFormData({ ...formData, customer_phone: e.target.value })}
                  placeholder="081234567890"
                  className="w-full bg-zinc-900 border border-zinc-700 text-xs text-white p-3 focus:outline-none focus:border-white"
                />
              </div>
            </div>

            {/* 2. Shipping Address */}
            <div className="bg-zinc-950 border border-zinc-900 p-6 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white border-b border-zinc-800 pb-2">
                2. Alamat Pengiriman (Shipping Address)
              </h2>

              <div>
                <label className="text-xs uppercase font-bold text-zinc-400 block mb-1.5">
                  Alamat Lengkap (Jalan, No Rumah, RT/RW, Kelurahan, Kecamatan) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.shipping_address}
                  onChange={e => setFormData({ ...formData, shipping_address: e.target.value })}
                  placeholder="Jl. Cihampelas No. 102, RT 02/RW 05, Kel. Cipaganti..."
                  className="w-full bg-zinc-900 border border-zinc-700 text-xs text-white p-3 focus:outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase font-bold text-zinc-400 block mb-1.5">
                    Kota / Kabupaten *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.shipping_city}
                    onChange={e => setFormData({ ...formData, shipping_city: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 text-xs text-white p-3 focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase font-bold text-zinc-400 block mb-1.5">
                    Kode Pos
                  </label>
                  <input
                    type="text"
                    value={formData.shipping_postal_code}
                    onChange={e => setFormData({ ...formData, shipping_postal_code: e.target.value })}
                    placeholder="40131"
                    className="w-full bg-zinc-900 border border-zinc-700 text-xs text-white p-3 focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase font-bold text-zinc-400 block mb-1.5">
                    Pilihan Ekspedisi
                  </label>
                  <select
                    value={formData.shipping_courier}
                    onChange={e => setFormData({ ...formData, shipping_courier: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 text-xs text-white p-3 focus:outline-none"
                  >
                    <option value="JNE Regular">JNE Regular (1-2 Hari)</option>
                    <option value="J&T Express">J&T Express</option>
                    <option value="SiCepat BEST">SiCepat BEST</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase font-bold text-zinc-400 block mb-1.5">
                    Catatan Pesanan (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formData.customer_notes}
                    onChange={e => setFormData({ ...formData, customer_notes: e.target.value })}
                    placeholder="Misal: Titip di satpam"
                    className="w-full bg-zinc-900 border border-zinc-700 text-xs text-white p-3 focus:outline-none focus:border-white"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-zinc-950 border border-zinc-900 p-6 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white border-b border-zinc-800 pb-2">
                3. Metode Pembayaran (Payment Method)
              </h2>

              <div className="space-y-3">
                <label className="flex items-center p-4 border border-zinc-800 bg-zinc-900 cursor-pointer hover:border-zinc-600 transition-all">
                  <input
                    type="radio"
                    name="payment_method"
                    value="Transfer Bank BCA"
                    checked={formData.payment_method === 'Transfer Bank BCA'}
                    onChange={e => setFormData({ ...formData, payment_method: e.target.value })}
                    className="text-white focus:ring-0 mr-3"
                  />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider block text-white">
                      Transfer Bank Manual ({settings?.bank_name || 'BCA'})
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      Rekening: {settings?.bank_account_number || '8830 1928 4710'} a/n {settings?.bank_account_name || 'KALARA DISTRO'}
                    </span>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-zinc-800 bg-zinc-900 cursor-pointer hover:border-zinc-600 transition-all">
                  <input
                    type="radio"
                    name="payment_method"
                    value="QRIS Instant / E-Wallet"
                    checked={formData.payment_method === 'QRIS Instant / E-Wallet'}
                    onChange={e => setFormData({ ...formData, payment_method: e.target.value })}
                    className="text-white focus:ring-0 mr-3"
                  />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider block text-white">
                      QRIS / GoPay / OVO / Dana
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      Scan kode QRIS yang otomatis muncul setelah pesanan dibuat
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Checkout sidebar summary */}
          <div className="bg-zinc-950 border border-zinc-800 p-6 h-fit space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-zinc-800 pb-3">
              Order Review
            </h3>

            {/* Item thumbnails */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-zinc-900">
              {cart.map(item => (
                <div key={item.variant_id} className="pt-2 flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-2.5">
                    <img src={item.image_url} alt="" className="w-10 h-12 object-cover bg-zinc-900" />
                    <div>
                      <p className="font-semibold text-zinc-200 line-clamp-1">{item.product_name}</p>
                      <p className="text-[10px] text-zinc-500 font-mono">
                        {item.size} • {item.quantity} pcs
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-zinc-300">
                    {formatRupiah(item.unit_price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-800 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span className="font-mono text-white">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Ongkos Kirim ({formData.shipping_courier})</span>
                <span className="font-mono text-white">{formatRupiah(shippingFee)}</span>
              </div>
              <div className="border-t border-zinc-800 pt-3 flex justify-between text-base font-bold text-white">
                <span>Total Pembayaran</span>
                <span className="font-mono">{formatRupiah(grandTotal)}</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white hover:bg-zinc-200 text-black py-4 font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-2 transition-all shadow-xl disabled:opacity-50"
              >
                {loading ? (
                  <span>Memproses Pesanan...</span>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Buat Pesanan Sekarang</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center space-x-2 text-[10px] font-mono text-zinc-500">
                <ShieldCheck size={14} />
                <span>Transaksi Terenkripsi & Verifikasi Atomic</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
