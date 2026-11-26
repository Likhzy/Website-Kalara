import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types/database';
import { formatRupiah } from '../lib/formatters';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const primaryImage = product.images?.find(img => img.is_primary)?.image_url || product.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop';
  const secondaryImage = product.images?.[1]?.image_url || primaryImage;

  return (
    <div className="group relative flex flex-col bg-zinc-950 border border-zinc-900 hover:border-zinc-700 transition-all duration-300">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {product.is_new_arrival && (
          <span className="bg-white text-black text-[10px] font-black uppercase tracking-widest px-2 py-0.5">
            NEW
          </span>
        )}
        {product.compare_at_price && product.compare_at_price > product.base_price && (
          <span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5">
            SALE
          </span>
        )}
      </div>

      {/* Image with hover swap */}
      <Link to={`/product/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-zinc-900">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {secondaryImage !== primaryImage && (
          <img
            src={secondaryImage}
            alt={`${product.name} alternate view`}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}
      </Link>

      {/* Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block mb-1">
            {product.category?.name || 'Streetwear'}
          </span>
          <Link to={`/product/${product.slug}`}>
            <h3 className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-mono font-bold text-white">
              {formatRupiah(product.base_price)}
            </span>
            {product.compare_at_price && product.compare_at_price > product.base_price && (
              <span className="text-xs font-mono text-zinc-500 line-through">
                {formatRupiah(product.compare_at_price)}
              </span>
            )}
          </div>
          <Link
            to={`/product/${product.slug}`}
            className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 group-hover:text-white underline decoration-zinc-700 underline-offset-4"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};
