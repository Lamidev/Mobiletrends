'use client';

import { ShoppingCart } from "lucide-react";
import { categoryOptionsMap } from "@/config";

const SWOT_MEDIA_BY_IMAGE = {
  "/products/iphone-duo.jpg": "editorial-photo",
  "/products/galaxy-z-fold8.jpg": "editorial-photo",
  "/products/macbook-pro.png": "cutout",
  "/products/iphone-18-pro.png": "cutout phone",
  "/products/ps5-pro.jpg": "dark-photo",
  "/products/sony-wh1000xm6.png": "wide-photo",
  "/products/rog-zephyrus-g16.png": "cutout rog",
  "/products/galaxy-s26-ultra.jpg": "dark-photo galaxy",
  "/products/studio-display.jpg": "studio-photo",
  "/products/t9-product.png": "studio-photo",
  "/products/airpods-5.jpg": "cutout",
  "/products/switch-2.png": "cutout",
};

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddToCart,
}) {
  const discountPercentage =
    product?.salePrice > 0 && product?.price > product?.salePrice
      ? Math.round(
          ((product?.price - product?.salePrice) / product?.price) * 100
        )
      : 0;

  const hasValidDiscount = discountPercentage > 0;

  const mediaClass =
    product?.media || SWOT_MEDIA_BY_IMAGE[product?.image] || "cutout";

  const categoryLabel =
    categoryOptionsMap?.[product?.category] ||
    product?.category ||
    "Gadget";

  const badgeText =
    product?.totalStock === 0
      ? "OUT OF STOCK"
      : product?.swotLabel ||
        (product?.brand && product?.condition
          ? `${product.brand} · ${product.condition}`
          : product?.condition || "VERIFIED GEAR");

  const handleCardClick = () => {
    if (product?._id && handleGetProductDetails) {
      handleGetProductDetails(product._id);
    }
  };

  return (
    <article className="swot-product-card w-full group font-body">
      {/* SWOT Image Container */}
      <div
        onClick={handleCardClick}
        className={`swot-product-image ${mediaClass} ${
          product?._id ? "cursor-pointer" : "cursor-default"
        }`}
      >
        <img
          src={product?.image}
          alt={product?.title || product?.name || "Gadget"}
          loading="lazy"
        />

        {/* Discount tag in top-left if applicable */}
        {hasValidDiscount && (
          <div className="absolute top-2.5 left-2.5 bg-[#DF5E00] text-white text-[8px] font-semibold tracking-[0.8px] uppercase px-2 py-[2px] rounded-[2px]">
            -{discountPercentage}%
          </div>
        )}

        {/* Quick Add-to-Cart button in top-right (when inventory item is in stock) */}
        {product?._id &&
          product?.totalStock > 0 &&
          handleAddToCart && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(product._id, product.totalStock);
              }}
              aria-label="Add to cart"
              className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-[#202020df] backdrop-blur-[5px] text-white flex items-center justify-center transition-all duration-200 hover:bg-[#DF5E00] md:opacity-0 md:group-hover:opacity-100 cursor-pointer"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
            </button>
          )}

        {/* SWOT Bottom-Left Frosted Condition / Spec Pill */}
        <span className="absolute bottom-[10px] left-[11px] max-w-[calc(100%-22px)] truncate bg-[#202020df] backdrop-blur-[5px] text-white px-[8px] py-[3px] text-[7px] sm:text-[8px] tracking-[0.4px] sm:tracking-[1px] uppercase rounded-[2px] font-medium">
          {badgeText}
        </span>
      </div>

      {/* SWOT Category Eyebrow */}
      <p className="text-[#62665d] text-[9px] tracking-[1.3px] uppercase mt-[18px] mb-0 font-medium">
        {categoryLabel}
      </p>

      {/* SWOT Product Title */}
      <h3
        onClick={handleCardClick}
        className="font-manrope text-[13px] sm:text-[15px] font-semibold text-[#20231e] mt-[4px] mb-0 tracking-[-0.3px] line-clamp-1 group-hover:text-[#DF5E00] transition-colors"
      >
        {product?.title || product?.name}
      </h3>

      {/* Price Display (No Check Availability Link) */}
      <div className="mt-1.5 flex items-baseline gap-2 flex-wrap">
        {product?.salePrice > 0 && hasValidDiscount ? (
          <>
            <span className="font-manrope text-[13px] sm:text-[14.5px] font-bold text-[#20231e]">
              ₦{Number(product.salePrice).toLocaleString("en-NG")}
            </span>
            <span className="text-[11px] text-[#62665d] line-through">
              ₦{Number(product.price).toLocaleString("en-NG")}
            </span>
          </>
        ) : (
          <span className="font-manrope text-[13px] sm:text-[14.5px] font-bold text-[#20231e]">
            ₦{Number(product?.price || 0).toLocaleString("en-NG")}
          </span>
        )}
      </div>
    </article>
  );
}

export default ShoppingProductTile;