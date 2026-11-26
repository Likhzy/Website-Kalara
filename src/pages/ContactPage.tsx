import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';
import { getStoreSettings } from '../services/storeService';
import { StoreSettings } from '../types/database';

export const ContactPage: React.FC = () => {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    getStoreSettings().then(setSettings);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => {
      setFormSent(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            Kontak & Customer Service
          </h1>
          <p className="text-sm text-zinc-400 max-w-md mx-auto">
            Punya pertanyaan mengenai pesanan, konfirmasi pembayaran manual, atau kolaborasi brand? Hubungi tim KALARA DISTRO.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Details */}
          <div className="space-y-8">
            <div className="bg-zinc-950 border border-zinc-900 p-8 space-y-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white border-b border-zinc-800 pb-3">
                Flagship Store & Workshop
              </h2>

              <div className="space-y-5 text-xs text-zinc-400">
                <div className="flex items-start space-x-3">
                  <MapPin size={18} className="text-white mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-white block uppercase">Alamat Toko:</span>
                    <p className="mt-1 leading-relaxed">
                      {settings?.address || 'Jl. Trunojoyo No. 42, Citarum, Kec. Bandung Wetan, Kota Bandung, Jawa Barat 40115'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail size={18} className="text-white mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-white block uppercase">Email Support:</span>
                    <p className="mt-1 font-mono text-zinc-300">
                      {settings?.contact_email || 'support@kalaradistro.id'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone size={18} className="text-white mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-white block uppercase">WhatsApp Hotline:</span>
                    <p className="mt-1 font-mono text-zinc-300">
                      {settings?.contact_phone || '+62 812-3456-7890'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock size={18} className="text-white mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-white block uppercase">Jam Operasional:</span>
                    <p className="mt-1">Senin – Sabtu: 10.00 – 22.00 WIB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp Action */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase text-white">Butuh Respon Cepat?</h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">Chat langsung dengan customer service kami via WhatsApp</p>
              </div>
              <a
                href={`https://wa.me/${settings?.contact_whatsapp?.replace(/\D/g, '') || '6281234567890'}`}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase px-4 py-2.5 transition-colors"
              >
                Chat WhatsApp
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-zinc-950 border border-zinc-900 p-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white border-b border-zinc-800 pb-3 mb-6">
              Kirim Pesan
            </h2>

            {formSent ? (
              <div className="p-4 bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs">
                Pesan Anda telah berhasil terkirim! Tim kami akan membalas via email secepatnya.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Nama Anda *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 text-xs text-white p-3 focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Email Aktif *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 text-xs text-white p-3 focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Subjek Pertanyaan
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Contoh: Konfirmasi Pembayaran KLR-..."
                    className="w-full bg-zinc-900 border border-zinc-700 text-xs text-white p-3 focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Pesan Detail *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 text-xs text-white p-3 focus:outline-none focus:border-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-white hover:bg-zinc-200 text-black py-4 uppercase font-black tracking-widest text-xs flex items-center justify-center space-x-2 transition-all shadow-xl"
                >
                  <Send size={14} />
                  <span>Kirim Pesan Sekarang</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
