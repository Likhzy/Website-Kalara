import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Copy, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { getOrderByNumberAndEmail, getStoreSettings } from '../services/storeService';
import { Order, StoreSettings } from '../types/database';
import { formatRupiah, formatDate } from '../lib/formatters';

export const OrderConfirmationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || '';
  const email = searchParams.get('email') || '';

  const [order, setOrder] = useState<Order | null>(null);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (orderNumber && email) {
      getOrderByNumberAndEmail(orderNumber, email).then(setOrder);
    }
    getStoreSettings().then(setSettings);
  }, [orderNumber, email]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Success Header */}
        <div className="text-center space-y-4 mb-10">
          <div className="w-16 h-16 bg-white text-black mx-auto rounded-full flex items-center justify-center shadow-2xl">
            <CheckCircle size={32} />
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
            Order Successfully Placed
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Terima Kasih Atas Pesananmu!
          </h1>
          <p className="text-zinc-400 text-sm max-w-lg mx-auto">
            Pesanan telah tercatat di sistem KALARA DISTRO. Silakan lakukan pembayaran sesuai instruksi di bawah ini untuk memulai proses pengiriman.
          </p>
        </div>

        {/* Order Identifier Box */}
        <div className="bg-zinc-950 border border-zinc-800 p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">
              Nomor Pesanan (Order ID)
            </span>
            <span className="text-xl font-mono font-bold text-white tracking-wider">
              {orderNumber || 'KLR-20261126-PENDING'}
            </span>
          </div>
          <button
            onClick={() => copyToClipboard(orderNumber)}
            className="flex items-center space-x-1.5 border border-zinc-700 px-3 py-1.5 text-xs uppercase font-mono hover:bg-zinc-900 transition-colors"
          >
            <Copy size={13} />
            <span>{copied ? 'Tersalin!' : 'Salin Nomor Resi'}</span>
          </button>
        </div>

        {/* Payment Instruction Card */}
        <div className="bg-zinc-950 border border-zinc-800 p-6 sm:p-8 space-y-6 mb-8">
          <div className="border-b border-zinc-800 pb-4 flex justify-between items-center">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Petunjuk Transfer Pembayaran
            </h2>
            <span className="inline-flex items-center text-[11px] font-mono text-amber-400 bg-amber-950/40 border border-amber-800 px-2 py-0.5">
              <Clock size={12} className="mr-1" />
              Menunggu Pembayaran
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <span className="text-zinc-500 block uppercase font-mono text-[10px]">Bank Tujuan</span>
              <span className="text-sm font-bold text-white block mt-0.5">
                {settings?.bank_name || 'BCA (Bank Central Asia)'}
              </span>
            </div>
            <div>
              <span className="text-zinc-500 block uppercase font-mono text-[10px]">Nomor Rekening</span>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="text-base font-mono font-bold text-white">
                  {settings?.bank_account_number || '8830 1928 4710'}
                </span>
                <button
                  onClick={() => copyToClipboard(settings?.bank_account_number || '883019284710')}
                  className="text-zinc-400 hover:text-white"
                  title="Salin No Rekening"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>
            <div>
              <span className="text-zinc-500 block uppercase font-mono text-[10px]">Atas Nama Rekening</span>
              <span className="text-xs font-semibold text-zinc-200 block mt-0.5">
                {settings?.bank_account_name || 'PT KALARA DISTRO INDONESIA'}
              </span>
            </div>
            <div>
              <span className="text-zinc-500 block uppercase font-mono text-[10px]">Jumlah Yang Harus Ditransfer</span>
              <span className="text-lg font-mono font-bold text-emerald-400 block mt-0.5">
                {order ? formatRupiah(order.total_amount) : 'Rp-'}
              </span>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-4 text-xs text-zinc-400 space-y-2">
            <p className="font-semibold text-white">Penting:</p>
            <p>1. Transfer sesuai nominal tepat hingga digit terakhir.</p>
            <p>2. Cantumkan Order Number ({orderNumber}) pada berita transfer bank.</p>
            <p>3. Konfirmasi pembayaran otomatis atau kirim bukti via WhatsApp customer service.</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Link
            to={`/tracking?order=${orderNumber}&email=${encodeURIComponent(email)}`}
            className="bg-white text-black py-4 px-6 text-center text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center justify-center space-x-2"
          >
            <span>Lacak Status Pesanan Ini</span>
            <ArrowRight size={16} />
          </Link>
          <Link
            to="/shop"
            className="border border-zinc-700 text-zinc-300 py-4 px-6 text-center text-xs font-bold uppercase tracking-widest hover:border-white hover:text-white transition-all"
          >
            Kembali ke Katalog
          </Link>
        </div>
      </div>
    </div>
  );
};
