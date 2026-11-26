import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, RefreshCw } from 'lucide-react';
import { Product, Category } from '../types/database';
import { getProducts, getCategories } from '../services/storeService';
import { ProductCard } from '../components/ProductCard';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state from query parameters
  const activeCategory = searchParams.get('category') || '';
  const activeSearch = searchParams.get('search') || '';
  const activeSort = (searchParams.get('sort') || 'newest') as 'newest' | 'price-asc' | 'price-desc' | 'name';
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;

  const [searchInput, setSearchInput] = useState(activeSearch);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  useEffect(() => {
    setSearchInput(activeSearch);
  }, [activeSearch]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [cats, prods] = await Promise.all([
          getCategories(),
          getProducts({
            categorySlug: activeCategory || undefined,
            search: activeSearch || undefined,
            sortBy: activeSort,
            minPrice,
            maxPrice,
          }),
        ]);
        setCategories(cats);
        setProducts(prods);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeCategory, activeSearch, activeSort, minPrice, maxPrice]);

  const updateParam = (key: string, value: string | undefined) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam('search', searchInput.trim() || undefined);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
    setSearchInput('');
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="border-b border-zinc-800 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
              Kalara Catalog
            </span>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mt-1">
              {activeCategory
                ? categories.find(c => c.slug === activeCategory)?.name || 'Katalog Produk'
                : 'All Streetwear Collection'}
            </h1>
          </div>
          <span className="text-xs font-mono text-zinc-400">
            Showing {products.length} Items Available
          </span>
        </div>

        {/* Top Controls Bar */}
        <div className="bg-zinc-950 border border-zinc-800 p-4 mb-8 flex flex-wrap items-center justify-between gap-4">
          {/* Search box */}
          <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[240px] max-w-md">
            <div className="relative flex items-center">
              <Search size={16} className="absolute left-3 text-zinc-500" />
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Cari artikel hoodie, tee, cargo..."
                className="w-full bg-zinc-900 border border-zinc-700 text-xs text-white pl-9 pr-3 py-2.5 focus:outline-none focus:border-white"
              />
            </div>
          </form>

          {/* Sort dropdown */}
          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Sort by:</span>
            <select
              value={activeSort}
              onChange={e => updateParam('sort', e.target.value)}
              className="bg-zinc-900 border border-zinc-700 text-xs text-white px-3 py-2 focus:outline-none"
            >
              <option value="newest">Terbaru (Newest Drop)</option>
              <option value="price-asc">Harga Terendah (Price: Low to High)</option>
              <option value="price-desc">Harga Tertinggi (Price: High to Low)</option>
              <option value="name">Nama Produk (A–Z)</option>
            </select>

            <button
              onClick={() => setShowMobileFilter(!showMobileFilter)}
              className="md:hidden flex items-center space-x-1.5 bg-zinc-800 px-3 py-2 text-xs uppercase font-bold"
            >
              <SlidersHorizontal size={14} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className={`md:block ${showMobileFilter ? 'block' : 'hidden'} space-y-8`}>
            {/* Category filter */}
            <div className="bg-zinc-950 border border-zinc-800 p-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-4 pb-2 border-b border-zinc-800">
                Categories
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => updateParam('category', undefined)}
                  className={`w-full text-left text-xs uppercase tracking-wider py-1.5 transition-colors ${
                    !activeCategory ? 'text-white font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  All Categories
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => updateParam('category', cat.slug)}
                    className={`w-full text-left text-xs uppercase tracking-wider py-1.5 transition-colors flex justify-between ${
                      activeCategory === cat.slug ? 'text-white font-bold' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-zinc-600 font-mono">→</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price filter preset */}
            <div className="bg-zinc-950 border border-zinc-800 p-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-4 pb-2 border-b border-zinc-800">
                Price Ranges (IDR)
              </h3>
              <div className="space-y-2 text-xs">
                <button
                  onClick={() => {
                    updateParam('minPrice', undefined);
                    updateParam('maxPrice', '100000');
                  }}
                  className="w-full text-left py-1 text-zinc-400 hover:text-white"
                >
                  Under Rp100.000
                </button>
                <button
                  onClick={() => {
                    updateParam('minPrice', '100000');
                    updateParam('maxPrice', '150000');
                  }}
                  className="w-full text-left py-1 text-zinc-400 hover:text-white"
                >
                  Rp100.000 – Rp150.000
                </button>
                <button
                  onClick={() => {
                    updateParam('minPrice', '150000');
                    updateParam('maxPrice', '250000');
                  }}
                  className="w-full text-left py-1 text-zinc-400 hover:text-white"
                >
                  Rp150.000 – Rp250.000
                </button>
              </div>

              {(activeCategory || activeSearch || minPrice || maxPrice) && (
                <button
                  onClick={clearAllFilters}
                  className="mt-6 w-full border border-zinc-700 text-zinc-300 hover:text-white hover:border-white text-xs uppercase font-bold py-2 transition-all flex items-center justify-center space-x-1"
                >
                  <RefreshCw size={12} />
                  <span>Reset Filter</span>
                </button>
              )}
            </div>
          </div>

          {/* Product Grid */}
          <div className="md:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <div key={n} className="h-96 bg-zinc-900 border border-zinc-800 animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-zinc-950 border border-zinc-800 p-12 text-center">
                <p className="text-sm font-bold uppercase tracking-wider text-zinc-300 mb-2">
                  Tidak Ada Produk Ditemukan
                </p>
                <p className="text-xs text-zinc-500 mb-6">
                  Coba ubah kata kunci pencarian atau reset filter untuk melihat katalog lengkap.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-white text-black text-xs font-bold uppercase tracking-widest px-6 py-3 hover:bg-zinc-200 transition-all"
                >
                  Reset Semua Filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
