import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatRupiah } from '../lib/formatters';

export const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal, totalItems } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 text-center">
        <ShoppingBag size={56} className="text-zinc-700 mb-4" />
        <h1 className="text-2xl font-black uppercase tracking-tight text-white mb-2">
          Keranjang Belanja Masih Kosong
        </h1>
        <p className="text-zinc-400 text-sm max-w-md mb-8">
          Jelajahi rilisan koleksi streetwear terbaru dari KALARA DISTRO dan pilih ukuran favoritmu.
        </p>
        <Link
          to="/shop"
          className="bg-white text-black font-black uppercase tracking-widest text-xs px-8 py-4 hover:bg-zinc-200 transition-all"
        >
          Mulai Belanja Sekarang
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-zinc-800 pb-4 mb-8 flex justify-between items-end">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
              Shopping Cart
            </span>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white mt-1">
              Your Streetwear Bag ({totalItems})
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs font-mono text-zinc-500 hover:text-red-400 uppercase tracking-wider underline underline-offset-4"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Table / List of items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div
                key={item.variant_id}
                className="bg-zinc-950 border border-zinc-900 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image_url}
                    alt={item.product_name}
                    className="w-20 h-24 object-cover bg-zinc-900 border border-zinc-800 shrink-0"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase">{item.product_name}</h3>
                    <div className="text-xs font-mono text-zinc-500 mt-1">
                      SKU: {item.variant_sku} • Size: {item.size} • Color: {item.color}
                    </div>
                    <div className="text-xs font-mono text-zinc-400 mt-1">
                      {formatRupiah(item.unit_price)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-6">
                  {/* Quantity */}
                  <div className="flex items-center border border-zinc-800 bg-zinc-900">
                    <button
                      onClick={() => updateQuantity(item.variant_id, -1)}
                      className="px-3 py-1.5 text-zinc-400 hover:text-white"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="px-4 text-xs font-mono font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.variant_id, 1)}
                      className="px-3 py-1.5 text-zinc-400 hover:text-white"
                      disabled={item.quantity >= item.max_stock}
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-sm font-mono font-bold text-white min-w-[90px] text-right">
                    {formatRupiah(item.unit_price * item.quantity)}
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => removeFromCart(item.variant_id)}
                    className="text-zinc-600 hover:text-red-400 p-1"
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-zinc-950 border border-zinc-800 p-6 h-fit space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white border-b border-zinc-800 pb-3">
              Ringkasan Pesanan (Order Summary)
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal Produk</span>
                <span className="font-mono text-white">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Estimasi Pengiriman (Bandung/Jawa)</span>
                <span className="font-mono text-white">Rp18.000</span>
              </div>
              <div className="border-t border-zinc-800 pt-3 flex justify-between text-sm font-bold text-white">
                <span>Total Estimasi</span>
                <span className="font-mono">{formatRupiah(subtotal + 18000)}</span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-500 leading-relaxed">
              *Harga final dihitung di halaman checkout dengan verifikasi stok database secara atomik.
            </p>

            <Link
              to="/checkout"
              className="w-full bg-white hover:bg-zinc-200 text-black py-4 font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-2 transition-all shadow-xl"
            >
              <span>Lanjut ke Checkout</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/shop"
              className="block text-center text-xs font-mono uppercase text-zinc-400 hover:text-white tracking-wider"
            >
              ← Lanjut Belanja
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
