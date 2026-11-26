import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, Shield, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Navbar: React.FC = () => {
  const { totalItems, setIsOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0c0c0c]/90 backdrop-blur-md border-b border-zinc-800">
      {/* Top Banner */}
      <div className="bg-white text-black py-1.5 px-4 text-center text-xs font-semibold tracking-widest uppercase">
        KARYA LOKAL, RASA ANAK MUDA — FREE SHIPPING BANDUNG & PROMO KHUSUS HARI INI
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-zinc-400 hover:text-white p-2"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Brand Logo */}
        <Link to="/" className="flex flex-col items-start group">
          <span className="text-2xl font-black tracking-tighter text-white uppercase group-hover:tracking-wider transition-all duration-300">
            KALARA<span className="text-zinc-500">.</span>DISTRO
          </span>
          <span className="text-[9px] tracking-widest uppercase text-zinc-400 font-mono">
            WEAR YOUR STYLE
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium uppercase tracking-wider text-zinc-300">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/shop" className="hover:text-white transition-colors">Shop All</Link>
          <Link to="/shop?category=t-shirts" className="hover:text-white transition-colors">T-Shirts</Link>
          <Link to="/shop?category=hoodies" className="hover:text-white transition-colors">Hoodies</Link>
          <Link to="/shop?category=crewnecks" className="hover:text-white transition-colors">Crewnecks</Link>
          <Link to="/tracking" className="hover:text-white transition-colors">Track Order</Link>
          <Link to="/about" className="hover:text-white transition-colors">About</Link>
          <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          {/* Quick Search */}
          {searchOpen ? (
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search streetwear..."
                autoFocus
                className="bg-zinc-900 border border-zinc-700 text-white text-xs px-3 py-1.5 rounded-none focus:outline-none focus:border-white w-40 sm:w-56"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="ml-2 text-zinc-400 hover:text-white text-xs uppercase"
              >
                ✕
              </button>
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="text-zinc-400 hover:text-white p-2 transition-colors"
              title="Search Products"
            >
              <Search size={20} />
            </button>
          )}

          {/* Cart Icon */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative text-zinc-400 hover:text-white p-2 transition-colors flex items-center"
            title="Shopping Cart"
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-black font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          {/* Admin link */}
          <Link
            to="/admin"
            className="hidden sm:flex items-center text-xs tracking-wider uppercase border border-zinc-700 px-3 py-1.5 rounded-none hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all"
            title="Admin Portal"
          >
            <Shield size={14} className="mr-1.5" />
            Admin
          </Link>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-950 border-b border-zinc-800 px-6 py-6 space-y-4">
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <div className="flex items-center bg-zinc-900 border border-zinc-700 px-3 py-2">
              <Search size={16} className="text-zinc-400 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="bg-transparent text-sm text-white focus:outline-none w-full"
              />
            </div>
          </form>

          <div className="flex flex-col space-y-3 font-semibold uppercase tracking-wider text-sm">
            <Link onClick={() => setMobileMenuOpen(false)} to="/" className="text-zinc-300 hover:text-white">Home</Link>
            <Link onClick={() => setMobileMenuOpen(false)} to="/shop" className="text-zinc-300 hover:text-white">Catalog / Shop All</Link>
            <Link onClick={() => setMobileMenuOpen(false)} to="/shop?category=t-shirts" className="text-zinc-400 hover:text-white pl-2">T-Shirts</Link>
            <Link onClick={() => setMobileMenuOpen(false)} to="/shop?category=hoodies" className="text-zinc-400 hover:text-white pl-2">Hoodies</Link>
            <Link onClick={() => setMobileMenuOpen(false)} to="/shop?category=crewnecks" className="text-zinc-400 hover:text-white pl-2">Crewnecks</Link>
            <Link onClick={() => setMobileMenuOpen(false)} to="/shop?category=casual-shirts" className="text-zinc-400 hover:text-white pl-2">Casual Shirts</Link>
            <Link onClick={() => setMobileMenuOpen(false)} to="/shop?category=pants" className="text-zinc-400 hover:text-white pl-2">Pants</Link>
            <Link onClick={() => setMobileMenuOpen(false)} to="/shop?category=caps" className="text-zinc-400 hover:text-white pl-2">Caps</Link>
            <div className="border-t border-zinc-800 pt-3">
              <Link onClick={() => setMobileMenuOpen(false)} to="/tracking" className="text-zinc-300 hover:text-white flex items-center justify-between">
                <span>Track Order</span>
                <ArrowRight size={16} />
              </Link>
            </div>
            <Link onClick={() => setMobileMenuOpen(false)} to="/about" className="text-zinc-300 hover:text-white">About Us</Link>
            <Link onClick={() => setMobileMenuOpen(false)} to="/contact" className="text-zinc-300 hover:text-white">Contact</Link>
            <Link onClick={() => setMobileMenuOpen(false)} to="/admin" className="text-zinc-400 hover:text-white text-xs pt-2">Admin Dashboard Portal</Link>
          </div>
        </div>
      )}
    </header>
  );
};
