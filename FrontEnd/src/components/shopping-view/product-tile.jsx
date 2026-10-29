'use client';


import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { ShoppingCart } from "lucide-react";

function ShoppingProductTile({ product, handleGetProductDetails, handleAddToCart }) {
  const discountPercentage =
    product?.salePrice > 0 && product?.price > product?.salePrice
      ? Math.round(((product?.price - product?.salePrice) / product?.price) * 100)
      : 0;

  const hasValidDiscount = discountPercentage > 0;

  return (
    <div className="w-full group">
      {/* Image Container */}
      <div className="relative cursor-pointer mb-3">
        <img
          src={product?.image}
          alt={product?.title}
          className="w-full h-64 sm:h-72 md:h-80 object-contain rounded-lg"
          onClick={() => handleGetProductDetails(product?._id)}
        />

        {/* Badges - Top Left */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1">
          {product?.totalStock === 0 ? (
            <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
              <Badge className="text-[9px] bg-red-500 hover:bg-red-600 px-1.5 py-0.5 h-5">
                Out Of Stock
              </Badge>
            </motion.div>
          ) : product?.totalStock < 10 ? (
            <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
              <Badge className="text-[9px] bg-red-500 hover:bg-red-600 px-1.5 py-0.5 h-5">{`Only ${product?.totalStock} left`}</Badge>
            </motion.div>
          ) : null}
        </div>

        {/* Condition + Discount - Top Right */}
        {product?.condition && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="absolute top-2 right-2 flex flex-col space-y-1"
          >
            <Badge
              className={`text-[9px] px-1.5 py-0.5 h-5 ${product?.condition === "Brand New"
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-yellow-500 hover:bg-yellow-600"
                }`}
            >
              {product?.condition}
            </Badge>

            {/* Only show discount badge if there's a valid discount */}
            {hasValidDiscount && (
              <Badge className="text-[10px] px-1.5 py-0 h-5 bg-blue-500 hover:bg-blue-600 flex items-center justify-center min-w-[0]">
                {discountPercentage}%
              </Badge>
            )}
          </motion.div>
        )}

        {/* Cart Icon - static on mobile, hover on desktop */}
        {product?.totalStock > 0 && (
          <motion.button
            onClick={() => handleAddToCart(product?._id, product?.totalStock)}
            className="
              absolute bottom-3 left-1/2 -translate-x-1/2
              bg-peach-500 text-white rounded-full shadow-lg
              transition duration-300 ease-in-out
              p-1.5 md:p-2
              md:opacity-0 md:group-hover:opacity-100
            "
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingCart className="h-4 w-4" />
          </motion.button>
        )}
      </div>

      {/* Product details */}
      <div className="space-y-2">
        {/* Title */}
        <h2
          onClick={() => handleGetProductDetails(product?._id)}
          className="text-xs sm:text-sm font-bold line-clamp-2 cursor-pointer hover:text-peach-600 transition-colors"
        >
          {product?.title}
        </h2>

        {/* Pricing */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 gap-1">
          {product?.salePrice > 0 && hasValidDiscount ? (
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="text-[11px] sm:text-xs text-gray-500 line-through">
                ₦{product?.price?.toLocaleString("en-NG")}
              </span>

              <span className="text-sm sm:text-base font-semibold text-peach-600">
                ₦{product?.salePrice?.toLocaleString("en-NG")}
              </span>
            </div>
          ) : (
            <span className="text-sm sm:text-base font-semibold text-peach-600">
              ₦{product?.price?.toLocaleString("en-NG")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShoppingProductTile;