import React from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatRupiah } from '../lib/formatters';

export const CartDrawer: React.FC = () => {
  const { cart, isOpen, setIsOpen, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-zinc-950 border-l border-zinc-800 text-white flex flex-col h-full z-10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
          <div className="flex items-center space-x-2">
            <ShoppingBag size={20} className="text-zinc-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider">
              Shopping Cart ({totalItems})
            </h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-zinc-400 hover:text-white p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-zinc-900">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <ShoppingBag size={48} className="text-zinc-700 mb-4" />
              <p className="text-zinc-400 text-sm uppercase tracking-wider mb-2 font-semibold">
                Keranjang Belanja Kosong
              </p>
              <p className="text-zinc-600 text-xs max-w-xs mb-6">
                Belum ada produk streetwear yang dipilih. Jelajahi koleksi kami sekarang.
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-white text-black text-xs font-bold uppercase tracking-widest px-6 py-3 hover:bg-zinc-200 transition-all"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.variant_id} className="py-4 flex space-x-4">
                <img
                  src={item.image_url}
                  alt={item.product_name}
                  className="w-20 h-24 object-cover bg-zinc-900 border border-zinc-800 shrink-0"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <h3 className="text-sm font-medium text-zinc-200 line-clamp-1">
                        {item.product_name}
                      </h3>
                      <button
                        onClick={() => removeFromCart(item.variant_id)}
                        className="text-zinc-600 hover:text-red-400 p-1"
                        title="Hapus Item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wider mt-1">
                      Size: {item.size} • Color: {item.color}
                    </div>
                    <div className="text-xs font-mono text-zinc-400 mt-1">
                      {formatRupiah(item.unit_price)}
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-zinc-800 bg-zinc-900">
                      <button
                        onClick={() => updateQuantity(item.variant_id, -1)}
                        className="px-2.5 py-1 text-zinc-400 hover:text-white"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-3 text-xs font-mono font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.variant_id, 1)}
                        className="px-2.5 py-1 text-zinc-400 hover:text-white"
                        disabled={item.quantity >= item.max_stock}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="text-xs font-mono font-semibold text-white">
                      {formatRupiah(item.unit_price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Checkout CTA */}
        {cart.length > 0 && (
          <div className="border-t border-zinc-800 p-6 bg-zinc-950 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400 uppercase tracking-wider text-xs">Subtotal</span>
              <span className="font-mono font-bold text-white text-base">
                {formatRupiah(subtotal)}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500">
              Ongkos kirim dihitung otomatis saat pengisian alamat checkout.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/cart"
                onClick={() => setIsOpen(false)}
                className="border border-zinc-700 hover:border-zinc-500 text-zinc-200 text-xs font-bold uppercase tracking-wider py-3 text-center transition-all"
              >
                Lihat Cart
              </Link>
              <Link
                to="/checkout"
                onClick={() => setIsOpen(false)}
                className="bg-white hover:bg-zinc-200 text-black text-xs font-bold uppercase tracking-wider py-3 flex items-center justify-center space-x-2 transition-all"
              >
                <span>Checkout</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
