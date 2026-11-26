import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 text-zinc-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-4">
            <span className="text-2xl font-black tracking-tighter text-white uppercase block">
              KALARA<span className="text-zinc-500">.</span>DISTRO
            </span>
            <p className="text-xs uppercase font-mono tracking-widest text-zinc-500">
              Karya Lokal, Rasa Anak Muda
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Brand fashion streetwear lokal Aceh dengan dedikasi pada material premium, grafis berani, dan siluet modern kontemporer.
            </p>
            <div className="flex space-x-3 pt-2 text-zinc-400">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 border border-zinc-800 hover:border-white hover:text-white flex items-center justify-center transition-all font-mono text-xs font-bold"
              >
                IG
              </a>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 border border-zinc-800 hover:border-white hover:text-white flex items-center justify-center transition-all"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/shop?category=t-shirts" className="hover:text-white transition-colors">T-Shirts (Rp75k–120k)</Link></li>
              <li><Link to="/shop?category=hoodies" className="hover:text-white transition-colors">Hoodies (Rp150k–220k)</Link></li>
              <li><Link to="/shop?category=crewnecks" className="hover:text-white transition-colors">Crewnecks (Rp130k–180k)</Link></li>
              <li><Link to="/shop?category=casual-shirts" className="hover:text-white transition-colors">Casual Shirts (Rp100k–160k)</Link></li>
              <li><Link to="/shop?category=pants" className="hover:text-white transition-colors">Cargo & Sweatpants</Link></li>
              <li><Link to="/shop?category=caps" className="hover:text-white transition-colors">Streetwear Caps</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              Customer Support
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/tracking" className="hover:text-white transition-colors">Lacak Pesanan (Tracking)</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Cerita Brand Kami</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Hubungi Layanan CS</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Katalog & Drop Terbaru</Link></li>
              <li><Link to="/admin" className="text-zinc-600 hover:text-zinc-400 text-xs">Admin Management Portal</Link></li>
            </ul>
          </div>

          {/* Store Location */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              Store & Flagship
            </h4>
            <div className="flex items-start text-sm space-x-2.5">
              <MapPin size={18} className="text-zinc-500 mt-1 shrink-0" />
              <span>Jl. Japakeh Desa Leu-Ue, Kecamatan Darul Imarah,23352</span>
            </div>
            <div className="flex items-center text-sm space-x-2.5">
              <Mail size={16} className="text-zinc-500 shrink-0" />
              <span>support@kalaradistro.id</span>
            </div>
            <div className="pt-2 text-xs text-zinc-500 uppercase tracking-widest">
              Buka Setiap Hari: 10.00 – 22.00 WIB
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-900 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-600 space-y-4 sm:space-y-0">
          <div>
            © {new Date().getFullYear()} KALARA DISTRO. All rights reserved.
          </div>
          <div className="font-mono uppercase tracking-widest text-zinc-500">
            WEAR YOUR STYLE, SHOW YOUR IDENTITY.
          </div>
        </div>
      </div>
    </footer>
  );
};
