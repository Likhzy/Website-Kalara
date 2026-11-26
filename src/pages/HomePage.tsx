import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { Product, Category } from '../types/database';
import { getProducts, getCategories } from '../services/storeService';
import { ProductCard } from '../components/ProductCard';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [cats, feat, news] = await Promise.all([
          getCategories(),
          getProducts({ featured: true }),
          getProducts({ newArrival: true }),
        ]);
        setCategories(cats);
        setFeaturedProducts(feat.slice(0, 4));
        setNewArrivals(news.slice(0, 4));
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-black overflow-hidden border-b border-zinc-800">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-40 scale-105 transform hover:scale-100 transition-all duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1800&auto=format&fit=crop')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-black/60 to-black/80 z-10" />

        <div className="relative z-20 max-w-5xl mx-auto px-4 text-center space-y-6 py-20">
          <div className="inline-flex items-center space-x-2 bg-zinc-900/80 border border-zinc-700/80 px-3.5 py-1.5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-mono tracking-widest text-zinc-300 uppercase">
              DROP 02 / GENESIS COLLECTION
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter text-white leading-none">
            WEAR YOUR STYLE.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-600">
              SHOW YOUR IDENTITY.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-400 font-light tracking-wide leading-relaxed">
            Karya Lokal, Rasa Anak Muda. Streetwear kontemporer dengan potongan boxy berkarakter,
            heavyweight cotton pilihan, dan rancangan grafis berani dari Aceh untuk Indonesia.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/shop"
              className="w-full sm:w-auto bg-white text-black text-xs font-black uppercase tracking-widest px-8 py-4 hover:bg-zinc-200 transition-all flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>Explore Collection</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/shop?category=hoodies"
              className="w-full sm:w-auto border border-zinc-700 text-white text-xs font-bold uppercase tracking-widest px-8 py-4 hover:bg-zinc-900 transition-all"
            >
              Shop Hoodies
            </Link>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITIONS */}
      <section className="border-b border-zinc-800 bg-zinc-950/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-zinc-400">
          <div className="flex items-center space-x-3">
            <Zap size={20} className="text-white shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Heavyweight 240+ GSM</h4>
              <p className="text-[11px] text-zinc-500">Kain tebal, kokoh & tidak mudah melar</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <ShieldCheck size={20} className="text-white shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">100% Karya Lokal</h4>
              <p className="text-[11px] text-zinc-500">Dibuat langsung oleh pengrajin Bandung</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Truck size={20} className="text-white shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Fast Courier Dispatch</h4>
              <p className="text-[11px] text-zinc-500">Kirim tiap hari dengan resi otomatis</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <RefreshCw size={20} className="text-white shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Size Exchange Guarantee</h4>
              <p className="text-[11px] text-zinc-500">Garansi tukar ukuran bila kurang pas</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY SHOWCASE */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 block">
              Curated Wardrobe
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
              Shop By Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.slug}`}
              className="group relative aspect-square overflow-hidden bg-zinc-900 border border-zinc-800 flex flex-col justify-end p-4"
            >
              <img
                src={cat.image_url}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-40 transition-all duration-500"
              />
              <div className="relative z-10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white group-hover:tracking-widest transition-all">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-zinc-400 font-mono block mt-0.5">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS */}
      <section className="py-16 bg-zinc-950 border-y border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 block">
                Editor's Pick
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
                Featured Streetwear
              </h2>
            </div>
            <Link
              to="/shop?featured=true"
              className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white flex items-center space-x-1"
            >
              <span>See More</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="h-96 bg-zinc-900 animate-pulse border border-zinc-800" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(prod => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. NEW ARRIVALS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 block">
              Just Dropped
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
              New Arrivals
            </h2>
          </div>
          <Link
            to="/shop?newArrival=true"
            className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 6. EDITORIAL BRAND STORY BANNER */}
      <section className="relative py-28 bg-zinc-950 border-t border-zinc-900 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6 relative z-10">
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
            About Kalara Distro
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            "KARYA LOKAL, RASA ANAK MUDA"
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-light">
            Kami menolak produksi massal tanpa jiwa. Setiap siluet, sablon discharge, dan jahitan rantai
            pada koleksi KALARA DISTRO diciptakan untuk kamu yang bangga menunjukkan jati diri di jalanan.
          </p>
          <div>
            <Link
              to="/about"
              className="inline-block border border-white text-white text-xs font-black uppercase tracking-widest px-8 py-3.5 hover:bg-white hover:text-black transition-all"
            >
              Read Our Full Story
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
