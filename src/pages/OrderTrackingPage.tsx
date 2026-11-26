import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, CheckCircle2, Clock, Truck, AlertCircle, FileText } from 'lucide-react';
import { getOrderByNumberAndEmail } from '../services/storeService';
import { Order, OrderStatus } from '../types/database';
import { formatRupiah, formatDate } from '../lib/formatters';

const STATUS_STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'pending', label: 'Pesanan Dibuat' },
  { key: 'confirmed', label: 'Dikonfirmasi' },
  { key: 'processing', label: 'Diproses Gudang' },
  { key: 'shipped', label: 'Dalam Pengiriman' },
  { key: 'completed', label: 'Selesai Diterima' },
];

export const OrderTrackingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialOrder = searchParams.get('order') || '';
  const initialEmail = searchParams.get('email') || '';

  const [orderNumber, setOrderNumber] = useState(initialOrder);
  const [email, setEmail] = useState(initialEmail);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialOrder && initialEmail) {
      handleSearch(initialOrder, initialEmail);
    }
  }, [initialOrder, initialEmail]);

  const handleSearch = async (ord: string, eml: string) => {
    setErrorMsg('');
    setLoading(true);
    setSearched(true);
    try {
      const result = await getOrderByNumberAndEmail(ord, eml);
      if (result) {
        setOrder(result);
      } else {
        setOrder(null);
        setErrorMsg('Pesanan tidak ditemukan. Periksa kembali kombinasi Nomor Pesanan dan Email Anda.');
      }
    } catch {
      setErrorMsg('Gagal memuat status pesanan.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber || !email) {
      setErrorMsg('Harap masukkan Nomor Pesanan dan Email.');
      return;
    }
    handleSearch(orderNumber, email);
  };

  const getCurrentStepIndex = (status: OrderStatus) => {
    if (status === 'cancelled') return -1;
    return STATUS_STEPS.findIndex(s => s.key === status);
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Title */}
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
            Realtime Order Tracker
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Lacak Pesanan Streetwear Anda
          </h1>
          <p className="text-sm text-zinc-400 max-w-md mx-auto">
            Masukkan Order ID (contoh: KLR-20261126-XXXX) dan email pemesan untuk memeriksa progres pengiriman.
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-zinc-950 border border-zinc-800 p-6 mb-10">
          <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                Order ID / Nomor Pesanan
              </label>
              <input
                type="text"
                required
                value={orderNumber}
                onChange={e => setOrderNumber(e.target.value)}
                placeholder="KLR-20261126-..."
                className="w-full bg-zinc-900 border border-zinc-700 text-xs text-white p-3 font-mono focus:outline-none focus:border-white uppercase"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                Email Pemesan
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@anda.com"
                className="w-full bg-zinc-900 border border-zinc-700 text-xs text-white p-3 focus:outline-none focus:border-white"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white hover:bg-zinc-200 text-black p-3 text-xs font-black uppercase tracking-widest flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                <Search size={14} />
                <span>{loading ? 'Mencari...' : 'Lacak Status'}</span>
              </button>
            </div>
          </form>

          {errorMsg && (
            <div className="mt-4 p-3 bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center space-x-2">
              <AlertCircle size={14} />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Tracking Details Result */}
        {order && (
          <div className="bg-zinc-950 border border-zinc-800 p-6 sm:p-8 space-y-8 animate-fade-in">
            {/* Header info */}
            <div className="border-b border-zinc-800 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs font-mono text-zinc-500">Order ID: {order.order_number}</span>
                <h2 className="text-xl font-bold uppercase text-white mt-1">
                  Pesanan untuk {order.customer_name}
                </h2>
                <span className="text-xs text-zinc-400 block mt-0.5">
                  Dibuat pada {formatDate(order.created_at)}
                </span>
              </div>

              <div className="flex flex-col sm:items-end gap-1">
                <span className={`text-xs uppercase font-mono px-3 py-1 font-bold ${
                  order.order_status === 'completed'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : order.order_status === 'cancelled'
                    ? 'bg-red-950 text-red-300 border border-red-800'
                    : 'bg-zinc-900 text-zinc-200 border border-zinc-700'
                }`}>
                  Status: {order.order_status}
                </span>
                <span className="text-[11px] font-mono text-zinc-400">
                  Pembayaran: <span className="font-bold text-white">{order.payment_status}</span>
                </span>
              </div>
            </div>

            {/* Stepper tracker */}
            {order.order_status !== 'cancelled' ? (
              <div className="py-4">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {STATUS_STEPS.map((step, idx) => {
                    const currentIdx = getCurrentStepIndex(order.order_status);
                    const isDone = currentIdx >= idx;
                    const isCurrent = currentIdx === idx;
                    return (
                      <div
                        key={step.key}
                        className={`p-3 border text-center transition-all ${
                          isCurrent
                            ? 'border-white bg-white text-black font-bold'
                            : isDone
                            ? 'border-zinc-700 bg-zinc-900 text-zinc-200'
                            : 'border-zinc-900 bg-zinc-950 text-zinc-600'
                        }`}
                      >
                        <div className="text-[10px] font-mono uppercase mb-1">
                          Step 0{idx + 1}
                        </div>
                        <div className="text-xs uppercase tracking-wider">
                          {step.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-red-950/40 border border-red-800 text-red-200 text-xs">
                Pesanan ini telah dibatalkan.
              </div>
            )}

            {/* Shipping details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-zinc-900/50 p-5 border border-zinc-900 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-1">
                  Informasi Pengiriman
                </span>
                <p className="font-semibold text-white">{order.shipping_courier}</p>
                <p className="text-zinc-400 mt-1">{order.shipping_address}, {order.shipping_city} {order.shipping_postal_code}</p>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-1">
                  Nomor Resi Pelacakan (Tracking No.)
                </span>
                <p className="font-mono text-base font-bold text-emerald-400">
                  {order.tracking_number || 'Belum Diterbitkan (Dalam Persiapan Pengemasan)'}
                </p>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Resi akan diperbarui secara otomatis setelah paket diserahkan ke kurir.
                </p>
              </div>
            </div>

            {/* Purchased Items List */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-3 flex items-center space-x-1.5">
                <Package size={14} />
                <span>Rincian Produk Dalam Paket</span>
              </h3>
              <div className="divide-y divide-zinc-900 border-y border-zinc-900">
                {order.items?.map(item => (
                  <div key={item.id} className="py-3 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-semibold text-white uppercase">{item.product_name}</p>
                      <p className="text-[11px] font-mono text-zinc-500">
                        Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-mono text-zinc-300">
                      {formatRupiah(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-4 flex justify-between text-sm font-bold text-white">
                <span>Total Biaya (Termasuk Ongkir)</span>
                <span className="font-mono">{formatRupiah(order.total_amount)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
