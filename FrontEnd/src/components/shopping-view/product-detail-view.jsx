'use client';

import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import {
  Plus,
  Minus,
  Check,
  ChevronRight,
  Package,
  Layers,
  Sparkles,
} from 'lucide-react';
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice';
import { useToast } from '../ui/use-toast';
import { motion } from 'framer-motion';

const STORAGE_OPTIONS = ['128GB', '256GB', '512GB', '1TB'];

const COLOR_OPTIONS = [
  { name: 'Space Black', hex: '#1f2022' },
  { name: 'Natural Titanium', hex: '#9d988d' },
  { name: 'Deep Blue', hex: '#1e3a5f' },
  { name: 'Silver', hex: '#e2e4e6' },
  { name: 'Midnight', hex: '#161925' },
];

export default function ProductDetailView({ product, isDialog = false, onClose }) {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.shopCart);
  const { toast } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [selectedCondition, setSelectedCondition] = useState(
    product?.condition || 'Brand New'
  );

  // Parse default storage from title if present, otherwise default to first
  const initialStorage = useMemo(() => {
    if (!product?.title) return '128GB';
    const found = STORAGE_OPTIONS.find((s) =>
      new RegExp(`\\b${s}\\b`, 'i').test(product.title)
    );
    return found || '128GB';
  }, [product?.title]);

  const [selectedStorage, setSelectedStorage] = useState(initialStorage);
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0].name);

  const galleryImages = useMemo(() => {
    if (Array.isArray(product?.images) && product.images.length > 0) {
      return product.images.slice(0, 3);
    }
    return product?.image ? [product.image] : [];
  }, [product]);

  const [activeImage, setActiveImage] = useState(
    (Array.isArray(product?.images) && product.images[0]) || product?.image
  );

  // Sync active image when product changes
  React.useEffect(() => {
    const primary = (Array.isArray(product?.images) && product.images[0]) || product?.image;
    if (primary) {
      setActiveImage(primary);
    }
    if (product?.condition) {
      setSelectedCondition(product.condition);
    }
  }, [product]);

  const currentPrice =
    product?.salePrice > 0 ? product?.salePrice : product?.price || 0;
  const originalPrice =
    product?.salePrice > 0 && product?.price > product?.salePrice
      ? product?.price
      : null;
  const savings = originalPrice ? originalPrice - currentPrice : 0;
  const discountPercent = originalPrice
    ? Math.round((savings / originalPrice) * 100)
    : 0;

  const totalPrice = currentPrice * quantity;
  const isOutOfStock = product?.totalStock === 0;

  function handleQuantityChange(type) {
    if (type === 'increment') {
      if (quantity < (product?.totalStock || 1)) {
        setQuantity(quantity + 1);
      } else {
        toast({
          title: `Stock limit reached`,
          description: `Only ${product?.totalStock} unit(s) available.`,
          variant: 'destructive',
        });
      }
    } else if (type === 'decrement' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  }

  async function handleAddToCartClick() {
    if (isOutOfStock) return;
    try {
      const response = await dispatch(
        addToCart({
          productId: product?._id,
          quantity,
        })
      ).unwrap();

      if (response?.success) {
        await dispatch(fetchCartItems()).unwrap();
        toast({
          title: 'Added to cart!',
          description: `${quantity} × ${product?.title} (${selectedCondition}, ${selectedStorage}) added to your cart.`,
        });
        if (onClose) onClose();
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to add item to cart. Please try again.',
        variant: 'destructive',
      });
    }
  }

  if (!product) return null;

  return (
    <div className="font-manrope text-[#20231e]">
      {/* Breadcrumbs (with padding on right to clear dialog close button on mobile) */}
      <nav className="flex items-center gap-1.5 text-[11px] sm:text-[12px] font-semibold text-[#62665d] mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap [scrollbar-width:none] pr-8 sm:pr-0">
        <a href="/" className="hover:text-[#DF5E00] transition-colors shrink-0">
          Home
        </a>
        <ChevronRight size={12} className="text-[#9ca3af] shrink-0" />
        <a
          href="/shop/listing"
          className="hover:text-[#DF5E00] transition-colors capitalize shrink-0"
        >
          {product?.category || 'Products'}
        </a>
        {product?.brand && (
          <>
            <ChevronRight size={12} className="text-[#9ca3af] shrink-0" />
            <span className="text-[#62665d] uppercase shrink-0">{product.brand}</span>
          </>
        )}
        <ChevronRight size={12} className="text-[#9ca3af] shrink-0" />
        <span className="text-[#111344] font-bold truncate max-w-[150px] sm:max-w-[320px] shrink-0">
          {product?.title}
        </span>
      </nav>

      {/* Main 2-Column Reebelo Style Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Image Showcase */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-2xl sm:rounded-3xl bg-[#fafaf8] border border-[#e5e7eb] flex items-center justify-center p-6 sm:p-10 overflow-hidden group">
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 z-10 bg-[#DF5E00] text-white text-[11px] sm:text-[12px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                -{discountPercent}% OFF
              </span>
            )}

            <motion.img
              key={activeImage}
              src={activeImage || product?.image}
              alt={product?.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          </div>

          {/* Multi-Image Thumbnail Gallery (up to 3 images) */}
          {galleryImages.length > 1 && (
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
              {galleryImages.map((img, idx) => {
                const isActive = (activeImage || product?.image) === img;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`relative aspect-square rounded-[6px] border-2 p-2 bg-[#fafaf8] overflow-hidden transition-all cursor-pointer ${
                      isActive
                        ? 'border-[#DF5E00] shadow-sm ring-2 ring-[#DF5E00]/20'
                        : 'border-[#e5e7eb] hover:border-gray-400 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product?.title} angle ${idx + 1}`}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Details & Variant Selectors */}
        <div className="lg:col-span-6 space-y-6">
          {/* Brand & Title */}
          <div>
            <p className="text-[10px] sm:text-[11px] font-bold tracking-[1.6px] uppercase text-[#62665d] mb-1.5">
              {product?.brand || 'MOBY'}&nbsp;·&nbsp;{product?.category || 'GADGET'}
            </p>
            <h1 className="font-manrope text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-[#111344] tracking-tight leading-tight">
              {product?.title}
            </h1>
          </div>

          {/* Pricing & Stock Banner */}
          <div className="bg-[#fafaf8] border border-[#e5e7eb] rounded-2xl p-4 sm:p-5">
            <div className="flex items-baseline justify-between flex-wrap gap-2">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="font-manrope text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111344] tracking-tight">
                  ₦{Number(currentPrice).toLocaleString('en-NG')}
                </span>
                {originalPrice && (
                  <span className="text-base sm:text-lg font-semibold text-[#8b9185] line-through">
                    ₦{Number(originalPrice).toLocaleString('en-NG')}
                  </span>
                )}
                {savings > 0 && (
                  <span className="bg-[#DF5E00]/10 text-[#DF5E00] text-[11px] sm:text-[12px] font-bold px-2.5 py-0.5 rounded-md">
                    Save ₦{savings.toLocaleString('en-NG')}
                  </span>
                )}
              </div>

              <div>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    !isOutOfStock
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      !isOutOfStock ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  />
                  {!isOutOfStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
            <p className="text-[11px] font-medium text-[#62665d] mt-2">
              Inclusive of all taxes · Akure store pickup & nationwide delivery
            </p>
          </div>

          {/* Reebelo-Style Condition Selector */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[12px] sm:text-[13px] font-bold text-[#111344] uppercase tracking-wide">
                1. Select Condition
              </span>
              <span className="text-[11px] font-semibold text-[#DF5E00]">
                {selectedCondition}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {[
                {
                  id: 'Brand New',
                  label: 'Brand New',
                  desc: 'Factory sealed box',
                },
                {
                  id: 'Grade-A UK-Used',
                  label: 'Grade-A UK-Used',
                  desc: 'Pristine, 100% tested',
                },
              ].map((opt) => {
                const isSelected = selectedCondition === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedCondition(opt.id)}
                    className={`p-2.5 sm:p-3.5 rounded-[6px] border text-left transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-[#DF5E00] bg-[#DF5E00]/[0.04] shadow-sm'
                        : 'border-[#e5e7eb] bg-white hover:border-[#111344]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                      <span className="font-manrope text-[12px] sm:text-[14px] font-bold text-[#111344] leading-tight">
                        {opt.label}
                      </span>
                      {isSelected && (
                        <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#DF5E00] text-white flex items-center justify-center shrink-0 ml-1">
                          <Check size={9} strokeWidth={3} />
                        </span>
                      )}
                    </div>
                    <p className="text-[9.5px] sm:text-[11px] text-[#62665d] font-medium m-0 leading-tight">
                      {opt.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reebelo-Style Storage Selector */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[12px] sm:text-[13px] font-bold text-[#111344] uppercase tracking-wide">
                2. Select Storage
              </span>
              <span className="text-[11px] font-semibold text-[#62665d]">
                Capacity: {selectedStorage}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
              {STORAGE_OPTIONS.map((size) => {
                const isSelected = selectedStorage === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedStorage(size)}
                    className={`py-2 sm:py-2.5 px-1 sm:px-2 rounded-[6px] text-center font-manrope text-[12px] sm:text-[13px] font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'border-2 border-[#DF5E00] bg-[#DF5E00]/[0.05] text-[#DF5E00]'
                        : 'border border-[#e5e7eb] bg-white text-[#20231e] hover:border-[#111344]/30'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reebelo-Style Color Selector */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[12px] sm:text-[13px] font-bold text-[#111344] uppercase tracking-wide">
                3. Select Color
              </span>
              <span className="text-[11px] font-semibold text-[#62665d]">
                {selectedColor}
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2.5 flex-wrap">
              {COLOR_OPTIONS.map((col) => {
                const isSelected = selectedColor === col.name;
                return (
                  <button
                    key={col.name}
                    type="button"
                    onClick={() => setSelectedColor(col.name)}
                    className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-[6px] text-[11px] sm:text-[12px] font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#DF5E00] bg-[#DF5E00]/[0.05] text-[#DF5E00]'
                        : 'border-[#e5e7eb] bg-white text-[#20231e] hover:border-[#111344]/30'
                    }`}
                  >
                    <span
                      className="w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span>{col.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <Separator className="bg-[#e5e7eb]" />

          {/* Quantity Selector & CTAs */}
          <div className="space-y-2.5 sm:space-y-3 pt-1">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-[#e5e7eb] rounded-[6px] bg-[#fafaf8] p-0.5 sm:p-1 shrink-0 h-11 sm:h-12">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange('decrement')}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-[6px] hover:bg-white transition-all text-[#20231e]"
                >
                  <Minus size={13} />
                </Button>
                <span className="w-8 sm:w-10 text-center font-manrope font-bold text-[14px] sm:text-[15px] text-[#111344]">
                  {quantity}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange('increment')}
                  disabled={quantity >= (product?.totalStock || 1) || isOutOfStock}
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-[6px] hover:bg-white transition-all text-[#20231e]"
                >
                  <Plus size={13} />
                </Button>
              </div>

              {/* Main Add to Cart Button */}
              <Button
                type="button"
                onClick={handleAddToCartClick}
                disabled={isOutOfStock}
                className="flex-1 h-11 sm:h-12 rounded-[6px] bg-[#111344] hover:bg-[#0C1172] text-white font-manrope text-[12px] sm:text-[14px] md:text-[15px] font-bold shadow-md hover:shadow-lg transition-all px-2 sm:px-4"
              >
                {isOutOfStock ? (
                  'OUT OF STOCK'
                ) : (
                  <span className="flex items-center justify-center gap-1.5 truncate">
                    <span>ADD TO CART</span>
                    <span className="text-white/60">•</span>
                    <span>₦{totalPrice.toLocaleString('en-NG')}</span>
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Product Description */}
          {product?.description && (
            <div className="space-y-2 pt-2">
              <h3 className="font-manrope text-[13px] font-bold text-[#111344] uppercase tracking-wider">
                Product Description
              </h3>
              <p className="font-manrope text-[13px] sm:text-[14px] text-[#4b5563] leading-relaxed whitespace-pre-line font-medium">
                {product.description}
              </p>
            </div>
          )}

          {/* What's in the Box (Reebelo signature section) */}
          <div className="rounded-2xl border border-[#e5e7eb] p-4 sm:p-5 bg-white space-y-3">
            <h3 className="font-manrope text-[13px] font-bold text-[#111344] uppercase tracking-wider flex items-center gap-2">
              <Package size={15} className="text-[#DF5E00]" />
              What's In The Box
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px] sm:text-[13px] font-manrope font-medium text-[#4b5563]">
              <li className="flex items-center gap-2">
                <Check size={13} className="text-emerald-600 shrink-0" />
                <span>1× {product?.title || 'Device'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={13} className="text-emerald-600 shrink-0" />
                <span>1× Fast Charging Cable / Adapter</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={13} className="text-emerald-600 shrink-0" />
                <span>1× SIM Tray Ejector Pin</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={13} className="text-emerald-600 shrink-0" />
                <span>1× Mobiletrends Warranty & Receipt</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

