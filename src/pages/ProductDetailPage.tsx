import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Check, Shield, Truck, RefreshCcw } from 'lucide-react';
import { Product, ProductVariant } from '../types/database';
import { getProductBySlug } from '../services/storeService';
import { formatRupiah } from '../lib/formatters';
import { useCart } from '../context/CartContext';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const data = await getProductBySlug(slug);
        if (data) {
          setProduct(data);
          const primary = data.images?.find(i => i.is_primary)?.image_url || data.images?.[0]?.image_url || '';
          setSelectedImage(primary);
          if (data.variants && data.variants.length > 0) {
            setSelectedVariant(data.variants[0]);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-[4/5] bg-zinc-900 border border-zinc-800 animate-pulse" />
          <div className="space-y-6">
            <div className="h-8 bg-zinc-900 w-3/4 animate-pulse" />
            <div className="h-6 bg-zinc-900 w-1/4 animate-pulse" />
            <div className="h-32 bg-zinc-900 w-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold uppercase mb-4 text-white">Produk Tidak Ditemukan</h2>
        <p className="text-zinc-500 mb-6">Artikel yang Anda cari mungkin sudah tidak tersedia atau link salah.</p>
        <Link to="/shop" className="bg-white text-black px-6 py-3 uppercase text-xs font-bold tracking-widest">
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const effectivePrice = product.base_price + (selectedVariant?.additional_price || 0);

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    addToCart({
      variant_id: selectedVariant.id,
      product_id: product.id,
      product_name: product.name,
      variant_sku: selectedVariant.sku,
      size: selectedVariant.size,
      color: selectedVariant.color,
      unit_price: effectivePrice,
      image_url: selectedImage,
      quantity,
      max_stock: selectedVariant.stock_quantity,
    });

    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center space-x-2 text-xs font-mono text-zinc-500">
          <Link to="/shop" className="hover:text-white flex items-center">
            <ArrowLeft size={14} className="mr-1" />
            Catalog
          </Link>
          <span>/</span>
          <span className="text-zinc-300 truncate">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gallery Column */}
          <div className="space-y-4">
            <div className="aspect-[4/5] bg-zinc-950 border border-zinc-800 overflow-hidden relative">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map(img => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img.image_url)}
                    className={`aspect-square border overflow-hidden ${
                      selectedImage === img.image_url ? 'border-white' : 'border-zinc-800 opacity-60'
                    }`}
                  >
                    <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Column */}
          <div className="space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 block">
                {product.category?.name || 'Streetwear Apparel'}
              </span>
              <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mt-1">
                {product.name}
              </h1>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-mono font-bold text-white">
                {formatRupiah(effectivePrice)}
              </span>
              {product.compare_at_price && product.compare_at_price > effectivePrice && (
                <span className="text-base font-mono text-zinc-500 line-through">
                  {formatRupiah(product.compare_at_price)}
                </span>
              )}
            </div>

            <div className="border-t border-zinc-800 pt-6">
              <p className="text-sm text-zinc-400 leading-relaxed font-light">
                {product.description}
              </p>
            </div>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4 border-t border-zinc-800 pt-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                      Pilih Ukuran & Varian (Size / Color)
                    </label>
                    <span className="text-[11px] font-mono text-zinc-500">
                      Stok: {selectedVariant?.stock_quantity ?? 0} pcs
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {product.variants.map(variant => {
                      const isSelected = selectedVariant?.id === variant.id;
                      const isOutOfStock = variant.stock_quantity <= 0;
                      return (
                        <button
                          key={variant.id}
                          disabled={isOutOfStock}
                          onClick={() => setSelectedVariant(variant)}
                          className={`p-3 text-left border transition-all text-xs ${
                            isSelected
                              ? 'border-white bg-white text-black font-bold'
                              : isOutOfStock
                              ? 'border-zinc-900 bg-zinc-950 text-zinc-600 cursor-not-allowed line-through'
                              : 'border-zinc-800 hover:border-zinc-600 text-zinc-300'
                          }`}
                        >
                          <div className="uppercase tracking-wider font-semibold">
                            Size {variant.size}
                          </div>
                          <div className="text-[10px] opacity-75 mt-0.5">
                            {variant.color}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quantity */}
                <div className="pt-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block mb-2">
                    Jumlah (Quantity)
                  </label>
                  <div className="inline-flex items-center border border-zinc-700 bg-zinc-950">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-zinc-800 font-mono"
                    >
                      -
                    </button>
                    <span className="px-5 py-2 font-mono text-sm font-bold">{quantity}</span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min((selectedVariant?.stock_quantity || 1), quantity + 1))
                      }
                      className="px-4 py-2 hover:bg-zinc-800 font-mono"
                      disabled={quantity >= (selectedVariant?.stock_quantity || 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* CTA Add to Cart */}
            <div className="pt-4">
              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stock_quantity <= 0}
                className="w-full bg-white hover:bg-zinc-200 text-black py-4 uppercase font-black tracking-widest text-xs flex items-center justify-center space-x-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xl"
              >
                <ShoppingBag size={18} />
                <span>
                  {!selectedVariant || selectedVariant.stock_quantity <= 0
                    ? 'Stok Habis (Sold Out)'
                    : 'Tambah ke Keranjang (Add to Bag)'}
                </span>
              </button>

              {addedToast && (
                <div className="mt-3 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs py-2 px-3 flex items-center space-x-2">
                  <Check size={14} />
                  <span>Item berhasil dimasukkan ke keranjang belanja!</span>
                </div>
              )}
            </div>

            {/* Product Specifications */}
            {product.details && (
              <div className="border-t border-zinc-800 pt-6 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-300">
                  Material & Specifications
                </h4>
                <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                  {product.details}
                </p>
              </div>
            )}

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-3 border-t border-zinc-800 pt-6 text-zinc-400 text-center">
              <div className="p-3 bg-zinc-950 border border-zinc-900">
                <Truck size={18} className="mx-auto mb-1 text-white" />
                <span className="text-[10px] uppercase font-bold block text-zinc-300">Fast Shipping</span>
                <span className="text-[9px] text-zinc-500">Kirim dari Bandung</span>
              </div>
              <div className="p-3 bg-zinc-950 border border-zinc-900">
                <Shield size={18} className="mx-auto mb-1 text-white" />
                <span className="text-[10px] uppercase font-bold block text-zinc-300">100% Original</span>
                <span className="text-[9px] text-zinc-500">Garansi Authentic</span>
              </div>
              <div className="p-3 bg-zinc-950 border border-zinc-900">
                <RefreshCcw size={18} className="mx-auto mb-1 text-white" />
                <span className="text-[10px] uppercase font-bold block text-zinc-300">Easy Return</span>
                <span className="text-[9px] text-zinc-500">Tukar Ukuran 3 Hari</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
