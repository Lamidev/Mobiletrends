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
  Heart,
} from 'lucide-react';
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice';
import { useToast } from '../ui/use-toast';
import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';

const FALLBACK_STORAGE_OPTIONS = ['128GB', '256GB', '512GB', '1TB'];

const FALLBACK_COLOR_OPTIONS = [
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

  // Consistent condition naming: "Brand New" or "UK-Used"
  const displayCondition = useMemo(() => {
    const raw = product?.condition?.trim() || 'Brand New';
    if (raw.toLowerCase().includes('used')) return 'UK-Used';
    return 'Brand New';
  }, [product?.condition]);

  // ========================================================
  // DYNAMIC VARIANTS RESOLUTION
  // ========================================================
  const isLaptop = product?.category === 'laptops';
  const isPhoneOrTablet =
    product?.category === 'smartphones' || product?.category === 'tablets';

  // 1. Storage Variants (Phones / Tablets)
  const availableStorageVariants = useMemo(() => {
    if (Array.isArray(product?.storageVariants) && product.storageVariants.length > 0) {
      return product.storageVariants;
    }
    return [];
  }, [product?.storageVariants]);

  // Initial fallback storage from title if variants not yet in database
  const initialStorage = useMemo(() => {
    if (availableStorageVariants.length > 0) return availableStorageVariants[0].size;
    if (!product?.title) return '128GB';
    const found = FALLBACK_STORAGE_OPTIONS.find((s) =>
      new RegExp(`\\b${s}\\b`, 'i').test(product.title)
    );
    return found || '128GB';
  }, [product?.title, availableStorageVariants]);

  const [selectedStorage, setSelectedStorage] = useState(initialStorage);

  // 2. Laptop Variants (RAM + SSD)
  const availableLaptopVariants = useMemo(() => {
    if (Array.isArray(product?.laptopVariants) && product.laptopVariants.length > 0) {
      return product.laptopVariants;
    }
    return [];
  }, [product?.laptopVariants]);

  const laptopRamOptions = useMemo(() => {
    if (availableLaptopVariants.length === 0) return ['16GB', '32GB'];
    return [...new Set(availableLaptopVariants.map((v) => v.ram))];
  }, [availableLaptopVariants]);

  const laptopStorageOptions = useMemo(() => {
    if (availableLaptopVariants.length === 0) return ['512GB SSD', '1TB SSD'];
    return [...new Set(availableLaptopVariants.map((v) => v.storage))];
  }, [availableLaptopVariants]);

  const [selectedRam, setSelectedRam] = useState(laptopRamOptions[0] || '16GB');
  const [selectedLaptopStorage, setSelectedLaptopStorage] = useState(
    laptopStorageOptions[0] || '512GB SSD'
  );

  // 3. Dynamic Colors
  const availableColors = useMemo(() => {
    if (Array.isArray(product?.colors) && product.colors.length > 0) {
      return product.colors;
    }
    return FALLBACK_COLOR_OPTIONS;
  }, [product?.colors]);

  const [selectedColor, setSelectedColor] = useState(
    availableColors[0]?.name || 'Default'
  );

  // Sync state if product changes
  React.useEffect(() => {
    if (availableStorageVariants.length > 0) {
      setSelectedStorage(availableStorageVariants[0].size);
    } else {
      setSelectedStorage(initialStorage);
    }
    if (laptopRamOptions.length > 0) setSelectedRam(laptopRamOptions[0]);
    if (laptopStorageOptions.length > 0) setSelectedLaptopStorage(laptopStorageOptions[0]);
    if (availableColors.length > 0) setSelectedColor(availableColors[0].name);
  }, [product, availableStorageVariants, laptopRamOptions, laptopStorageOptions, availableColors, initialStorage]);

  // Gallery
  const galleryImages = useMemo(() => {
    if (Array.isArray(product?.images) && product.images.length > 0) {
      return product.images.slice(0, 3);
    }
    return product?.image ? [product.image] : [];
  }, [product]);

  const [activeImage, setActiveImage] = useState(
    (Array.isArray(product?.images) && product.images[0]) || product?.image
  );

  React.useEffect(() => {
    const primary = (Array.isArray(product?.images) && product.images[0]) || product?.image;
    if (primary) setActiveImage(primary);
  }, [product]);

  // ========================================================
  // DYNAMIC PRICE & STOCK COMPUTATION
  // ========================================================
  const { currentPrice, originalPrice, currentStock } = useMemo(() => {
    if (isPhoneOrTablet && availableStorageVariants.length > 0) {
      const match =
        availableStorageVariants.find((v) => v.size === selectedStorage) ||
        availableStorageVariants[0];
      const p = match?.salePrice > 0 ? match.salePrice : match?.price || product?.price || 0;
      const orig =
        match?.salePrice > 0 && match?.price > match?.salePrice ? match.price : null;
      return {
        currentPrice: p,
        originalPrice: orig,
        currentStock: match?.stock ?? product?.totalStock ?? 0,
      };
    }

    if (isLaptop && availableLaptopVariants.length > 0) {
      const match =
        availableLaptopVariants.find(
          (v) => v.ram === selectedRam && v.storage === selectedLaptopStorage
        ) ||
        availableLaptopVariants.find((v) => v.ram === selectedRam) ||
        availableLaptopVariants[0];
      const p = match?.salePrice > 0 ? match.salePrice : match?.price || product?.price || 0;
      const orig =
        match?.salePrice > 0 && match?.price > match?.salePrice ? match.price : null;
      return {
        currentPrice: p,
        originalPrice: orig,
        currentStock: match?.stock ?? product?.totalStock ?? 0,
      };
    }

    const p = product?.salePrice > 0 ? product.salePrice : product?.price || 0;
    const orig =
      product?.salePrice > 0 && product?.price > product?.salePrice ? product.price : null;
    return {
      currentPrice: p,
      originalPrice: orig,
      currentStock: product?.totalStock ?? 0,
    };
  }, [
    product,
    isPhoneOrTablet,
    isLaptop,
    availableStorageVariants,
    availableLaptopVariants,
    selectedStorage,
    selectedRam,
    selectedLaptopStorage,
  ]);

  const isOutOfStock = currentStock <= 0;
  const totalPrice = currentPrice * quantity;
  const savings = originalPrice ? originalPrice - currentPrice : 0;

  // Wishlist
  const [isInWishlist, setIsInWishlist] = useState(false);

  React.useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('mobiletrends_wishlist') || '[]');
      const pid = product?._id || product?.id;
      setIsInWishlist(saved.some((item) => (item._id || item.id) === pid));
    } catch {
      setIsInWishlist(false);
    }
  }, [product]);

  const handleToggleWishlist = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('mobiletrends_wishlist') || '[]');
      const pid = product?._id || product?.id;
      if (isInWishlist) {
        const updated = saved.filter((item) => (item._id || item.id) !== pid);
        localStorage.setItem('mobiletrends_wishlist', JSON.stringify(updated));
        setIsInWishlist(false);
        toast({ title: 'Removed from wishlist' });
      } else {
        const itemToSave = {
          id: pid,
          _id: pid,
          title: product.title,
          image: activeImage || product.image,
          price: currentPrice,
          salePrice: product.salePrice,
          brand: product.brand,
          category: product.category,
          condition: displayCondition,
          totalStock: currentStock,
        };
        const updated = [itemToSave, ...saved.filter((item) => (item._id || item.id) !== pid)];
        localStorage.setItem('mobiletrends_wishlist', JSON.stringify(updated));
        setIsInWishlist(true);
        toast({ title: 'Saved to wishlist', description: `${product.title} was added to your wishlist.` });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleQuantityChange = (action) => {
    if (action === 'increment') {
      if (quantity < currentStock) setQuantity((prev) => prev + 1);
    } else if (action === 'decrement' && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  async function handleAddToCartClick() {
    if (isOutOfStock) return;
    try {
      const chosenConfig = isLaptop
        ? `${selectedRam}, ${selectedLaptopStorage}`
        : selectedStorage;

      const response = await dispatch(
        addToCart({
          productId: product?._id,
          quantity,
          selectedStorage: isLaptop ? selectedLaptopStorage : selectedStorage,
          selectedRam: isLaptop ? selectedRam : undefined,
          selectedColor,
          selectedCondition: displayCondition,
          price: currentPrice,
        })
      ).unwrap();

      if (response?.success) {
        await dispatch(fetchCartItems()).unwrap();
        toast({
          title: 'Added to cart!',
          description: `${quantity} × ${product?.title} (${displayCondition}, ${chosenConfig}, ${selectedColor}) added to your cart.`,
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
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-[11px] sm:text-[12px] font-semibold text-[#62665d] mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap [scrollbar-width:none] pr-8 sm:pr-0">
        <a href="/" className="hover:text-[#111344] transition-colors shrink-0">
          Home
        </a>
        <ChevronRight size={12} className="text-[#9ca3af] shrink-0" />
        <a
          href="/shop/listing"
          className="hover:text-[#111344] transition-colors capitalize shrink-0"
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

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Image Showcase */}
        <div className="lg:col-span-6 space-y-3 sm:space-y-4">
          <div className="relative w-full h-[250px] sm:h-[320px] md:h-[380px] lg:h-auto lg:aspect-square rounded-2xl sm:rounded-3xl bg-white border border-[#e5e7eb] flex items-center justify-center p-0 sm:p-6 lg:p-8 overflow-hidden group shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            {/* Top-Left: Stock Badge */}
            <span
              className={`absolute top-3 left-3 sm:top-4 sm:left-4 z-10 text-[10.5px] sm:text-[12px] font-bold px-3 py-1 rounded-full tracking-wide shadow-sm flex items-center gap-1.5 ${
                !isOutOfStock
                  ? 'bg-emerald-600 text-white'
                  : 'bg-rose-600 text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {!isOutOfStock
                ? currentStock <= 3
                  ? `Only ${currentStock} left`
                  : `● In Stock (${currentStock})`
                : 'Out of Stock'}
            </span>

            {/* Top-Right: Condition Badge */}
            <span className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 bg-[#111344] text-white text-[10.5px] sm:text-[12px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm border border-white/20">
              {displayCondition}
            </span>

            <motion.img
              key={activeImage}
              src={activeImage || product?.image}
              alt={product?.title}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full object-cover sm:object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          </div>

          {/* Multi-Image Thumbnail Gallery */}
          {galleryImages.length > 1 && (
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto py-0.5 [scrollbar-width:none]">
              {galleryImages.map((img, idx) => {
                const isActive = (activeImage || product?.image) === img;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 shrink-0 rounded-xl border-2 p-0.5 bg-white overflow-hidden transition-all cursor-pointer ${
                      isActive
                        ? 'border-[#111344] shadow-sm ring-2 ring-[#111344]/20'
                        : 'border-[#e5e7eb] hover:border-gray-400 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product?.title} angle ${idx + 1}`}
                      className="w-full h-full object-cover rounded-lg"
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

          {/* Pricing Banner (Clean: No duplicate stock text) */}
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
            </div>
            <p className="text-[11px] font-medium text-[#62665d] mt-2">
              Inclusive of all taxes · Akure store pickup & nationwide delivery
            </p>
          </div>

          {/* DYNAMIC VARIANT SELECTORS (CATEGORY-AWARE) */}

          {/* 1. If LAPTOP: RAM Selector */}
          {isLaptop && laptopRamOptions.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] sm:text-[13px] font-bold text-[#111344] uppercase tracking-wide">
                  Memory (RAM)
                </span>
                <span className="text-[11px] font-semibold text-[#62665d]">
                  Selected: {selectedRam}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {laptopRamOptions.map((ram) => {
                  const isSelected = selectedRam === ram;
                  return (
                    <button
                      key={ram}
                      type="button"
                      onClick={() => setSelectedRam(ram)}
                      className={`py-2 px-3 sm:px-4 rounded-[6px] text-center font-manrope text-[12px] sm:text-[13px] font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'border-2 border-[#111344] bg-[#111344]/[0.05] text-[#111344] shadow-sm'
                          : 'border border-[#e5e7eb] bg-white text-[#20231e] hover:border-[#111344]/30'
                      }`}
                    >
                      {ram}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. If LAPTOP: SSD Storage Selector */}
          {isLaptop && laptopStorageOptions.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] sm:text-[13px] font-bold text-[#111344] uppercase tracking-wide">
                  Internal Storage (SSD)
                </span>
                <span className="text-[11px] font-semibold text-[#62665d]">
                  Selected: {selectedLaptopStorage}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {laptopStorageOptions.map((ssd) => {
                  const isSelected = selectedLaptopStorage === ssd;
                  return (
                    <button
                      key={ssd}
                      type="button"
                      onClick={() => setSelectedLaptopStorage(ssd)}
                      className={`py-2 px-3 sm:px-4 rounded-[6px] text-center font-manrope text-[12px] sm:text-[13px] font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'border-2 border-[#111344] bg-[#111344]/[0.05] text-[#111344] shadow-sm'
                          : 'border border-[#e5e7eb] bg-white text-[#20231e] hover:border-[#111344]/30'
                      }`}
                    >
                      {ssd}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. If SMARTPHONES / TABLETS: Storage Selector */}
          {isPhoneOrTablet && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] sm:text-[13px] font-bold text-[#111344] uppercase tracking-wide">
                  Storage Capacity
                </span>
                <span className="text-[11px] font-semibold text-[#62665d]">
                  Selected: {selectedStorage}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                {(availableStorageVariants.length > 0
                  ? availableStorageVariants.map((v) => v.size)
                  : FALLBACK_STORAGE_OPTIONS
                ).map((size) => {
                  const isSelected = selectedStorage === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedStorage(size)}
                      className={`py-2 sm:py-2.5 px-1 sm:px-2 rounded-[6px] text-center font-manrope text-[12px] sm:text-[13px] font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'border-2 border-[#111344] bg-[#111344]/[0.05] text-[#111344] shadow-sm'
                          : 'border border-[#e5e7eb] bg-white text-[#20231e] hover:border-[#111344]/30'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Color Selector (Dynamic from product.colors) */}
          {availableColors.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] sm:text-[13px] font-bold text-[#111344] uppercase tracking-wide">
                  Color Finish
                </span>
                <span className="text-[11px] font-semibold text-[#62665d] capitalize">
                  {selectedColor}
                </span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2.5 flex-wrap">
                {availableColors.map((col) => {
                  const isSelected = selectedColor === col.name;
                  return (
                    <button
                      key={col.name}
                      type="button"
                      onClick={() => setSelectedColor(col.name)}
                      className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-[6px] text-[11px] sm:text-[12px] font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#111344] bg-[#111344]/[0.05] text-[#111344] shadow-sm ring-1 ring-[#111344]'
                          : 'border-[#e5e7eb] bg-white text-[#20231e] hover:border-[#111344]/30'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-inner shrink-0"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span className="capitalize">{col.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

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
                  disabled={quantity >= currentStock || isOutOfStock}
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

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={handleToggleWishlist}
                title={isInWishlist ? 'Remove from Wishlist' : 'Save to Wishlist'}
                className={`h-11 sm:h-12 w-11 sm:w-12 rounded-[6px] border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                  isInWishlist
                    ? 'border-red-200 bg-red-50 text-red-600 shadow-sm'
                    : 'border-[#e5e7eb] bg-[#fafaf8] text-[#20231e] hover:border-[#111344] hover:text-[#111344]'
                }`}
              >
                <Heart size={18} className={isInWishlist ? 'fill-red-600 text-red-600' : ''} />
              </button>
            </div>

            {/* WhatsApp Instant Order / Inquire Button (Hero CTA) */}
            <a
              href={`https://wa.me/2348034378180?text=${encodeURIComponent(
                `Hi Mobiletrends, I would like to order / confirm availability for:\n\n*${product?.title}*\n• Condition: ${displayCondition}\n• Specs: ${
                  isLaptop
                    ? `${selectedRam}, ${selectedLaptopStorage}`
                    : selectedStorage
                }\n• Color: ${selectedColor}\n• Price: ₦${totalPrice.toLocaleString('en-NG')}\n\nIs this device available for delivery or pickup?`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-11 sm:h-12 rounded-[6px] border border-emerald-500/30 bg-[#F0FDF4] hover:bg-[#DCFCE7] text-[#166534] font-manrope text-[12px] sm:text-[14px] font-bold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow cursor-pointer"
            >
              <FaWhatsapp className="w-4 h-4 text-[#16a34a]" />
              <span>Order / Inquire via WhatsApp</span>
            </a>
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
        </div>
      </div>

      {/* Sticky Mobile Bottom Bar (Slightly larger, dynamic price sync, NO WhatsApp) */}
      {!isDialog && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#e5e7eb] px-4 py-3.5 sm:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={activeImage || product?.image}
              alt={product?.title}
              className="w-11 h-11 rounded-lg object-cover border border-[#e5e7eb] shrink-0"
            />
            <div className="min-w-0">
              <p className="font-manrope text-[12px] font-bold text-[#111344] truncate">
                {product?.title}
              </p>
              <p className="font-manrope text-[14px] font-extrabold text-[#111344]">
                ₦{totalPrice.toLocaleString('en-NG')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              type="button"
              onClick={handleAddToCartClick}
              disabled={isOutOfStock}
              className="h-11 px-5 rounded-[6px] bg-[#111344] text-white font-manrope text-[13px] font-bold shadow-sm"
            >
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
