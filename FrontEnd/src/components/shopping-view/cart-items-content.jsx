'use client';

import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { motion } from "framer-motion";
import { useState } from "react";
import { getOrCreateSessionId } from "@/components/utils/session";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    const sessionId = getOrCreateSessionId();

    if (typeOfAction === "plus") {
      const currentItem = cartItems?.find((item) =>
        item._id && getCartItem?._id
          ? item._id === getCartItem._id
          : item.productId === getCartItem?.productId
      );
      const product = productList?.find(
        (product) => product._id === getCartItem?.productId
      );

      const maxStock = getCartItem?.totalStock ?? product?.totalStock;
      if (currentItem && maxStock != null) {
        if (currentItem.quantity + 1 > maxStock) {
          toast({
            title: `Stock Limit`,
            description: `Only ${maxStock} units available in stock.`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    dispatch(
      updateCartQuantity({
        productId: getCartItem?.productId,
        cartItemId: getCartItem?._id,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart updated",
          description: "Quantity updated successfully",
        });
      }
    });
  }

  function handleCartItemDelete(getCartItem) {
    setIsDeleting(true);
    dispatch(
      deleteCartItem({
        productId: getCartItem?.productId,
        cartItemId: getCartItem?._id,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Item removed",
          description: "Product removed from your cart",
        });
      }
      setIsDeleting(false);
    });
  }

  const currentPrice =
    cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price;
  const originalPrice = cartItem?.salePrice > 0 ? cartItem?.price : null;
  const itemTotal = currentPrice * cartItem?.quantity;

  const hasVariants = Boolean(
    cartItem?.selectedStorage ||
      cartItem?.selectedRam ||
      cartItem?.selectedColor ||
      cartItem?.selectedCondition
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-colors w-full min-w-0 overflow-hidden"
    >
      <div className="flex-shrink-0">
        <img
          src={cartItem?.image}
          alt={cartItem?.title}
          className="w-14 h-14 sm:w-18 sm:h-18 rounded-lg object-contain bg-gray-50 border border-gray-100 p-1 shrink-0"
        />
      </div>

      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-start justify-between gap-1.5">
          <h3 className="font-semibold text-xs sm:text-sm line-clamp-2 leading-tight flex-1 text-gray-900 break-words">
            {cartItem?.title}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0 text-gray-400 hover:text-red-500 hover:bg-red-50 -mt-0.5"
            onClick={() => handleCartItemDelete(cartItem)}
            disabled={isDeleting}
          >
            <Trash className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Selected Variant Attributes (Responsive badges on mobile) */}
        {hasVariants && (
          <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 pt-0.5">
            {cartItem?.selectedCondition && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold bg-gray-100 text-gray-700 whitespace-nowrap">
                {cartItem.selectedCondition}
              </span>
            )}
            {cartItem?.selectedStorage && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold bg-orange-50 text-[#DF5E00] border border-orange-100 whitespace-nowrap">
                {cartItem.selectedStorage}
              </span>
            )}
            {cartItem?.selectedRam && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100 whitespace-nowrap">
                {cartItem.selectedRam} RAM
              </span>
            )}
            {cartItem?.selectedColor && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-medium bg-gray-100 text-gray-700 capitalize max-w-[120px] truncate">
                {cartItem.selectedColor}
              </span>
            )}
          </div>
        )}

        {/* Quantity Controls & Dynamic Price (Compact single bottom row) */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button
              variant="outline"
              className="h-6 w-6 sm:h-7 sm:w-7 rounded-md border-gray-200 p-0"
              size="icon"
              disabled={cartItem?.quantity === 1}
              onClick={() => handleUpdateQuantity(cartItem, "minus")}
            >
              <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </Button>
            <span className="font-semibold text-xs sm:text-sm w-5 sm:w-6 text-center text-gray-800">
              {cartItem?.quantity}
            </span>
            <Button
              variant="outline"
              className="h-6 w-6 sm:h-7 sm:w-7 rounded-md border-gray-200 p-0"
              size="icon"
              onClick={() => handleUpdateQuantity(cartItem, "plus")}
            >
              <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </Button>
          </div>

          <div className="text-right flex flex-col items-end">
            <div className="font-bold text-xs sm:text-sm text-[#DF5E00] whitespace-nowrap">
              ₦{itemTotal?.toLocaleString("en-NG")}
            </div>
            {cartItem?.quantity > 1 && (
              <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                ₦{currentPrice?.toLocaleString("en-NG")} each
              </span>
            )}
            {originalPrice && originalPrice > currentPrice && (
              <span className="text-[10px] text-gray-400 line-through whitespace-nowrap">
                ₦{(originalPrice * cartItem.quantity)?.toLocaleString("en-NG")}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default UserCartItemsContent;
