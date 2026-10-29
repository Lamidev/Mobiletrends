'use client';


// import { Minus, Plus, Trash } from "lucide-react";
// import { Button } from "../ui/button";
// import { useDispatch, useSelector } from "react-redux";
// import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
// import { useToast } from "../ui/use-toast";
// import { motion } from "framer-motion";
// import { useState } from "react";
// import { getOrCreateSessionId } from "@/components/utils/session";

// function UserCartItemsContent({ cartItem }) {
//   const { user } = useSelector((state) => state.auth);
//   const { cartItems } = useSelector((state) => state.shopCart);
//   const { productList } = useSelector((state) => state.shopProducts);
//   const dispatch = useDispatch();
//   const { toast } = useToast();
//   const [isDeleting, setIsDeleting] = useState(false);

//   function handleUpdateQuantity(getCartItem, typeOfAction) {
//     const sessionId = getOrCreateSessionId();

//     if (typeOfAction === "plus") {
//       const currentItem = cartItems.find(
//         (item) => item.productId === getCartItem?.productId
//       );
//       const product = productList.find(
//         (product) => product._id === getCartItem?.productId
//       );

//       if (currentItem && product) {
//         if (currentItem.quantity + 1 > product.totalStock) {
//           toast({
//             title: `Stock Limit`,
//             description: `Only ${product.totalStock} units available in stock.`,
//             variant: "destructive",
//           });
//           return;
//         }
//       }
//     }

//     dispatch(
//       updateCartQuantity({
//         productId: getCartItem?.productId,
//         quantity:
//           typeOfAction === "plus"
//             ? getCartItem?.quantity + 1
//             : getCartItem?.quantity - 1,
//       })
//     ).then((data) => {
//       if (data?.payload?.success) {
//         toast({
//           title: "Cart updated",
//           description: "Quantity updated successfully",
//         });
//       }
//     });
//   }

//   function handleCartItemDelete(getCartItem) {
//     setIsDeleting(true);
//     dispatch(
//       deleteCartItem({ productId: getCartItem?.productId })
//     ).then((data) => {
//       if (data?.payload?.success) {
//         toast({
//           title: "Item removed",
//           description: "Product removed from your cart",
//         });
//       }
//       setIsDeleting(false);
//     });
//   }

//   const currentPrice = cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price;
//   const originalPrice = cartItem?.salePrice > 0 ? cartItem?.price : null;
//   const itemTotal = currentPrice * cartItem?.quantity;

//   return (
//     <motion.div
//       initial={{ opacity: 0, x: -20 }}
//       animate={{ opacity: 1, x: 0 }}
//       exit={{ opacity: 0, x: 20 }}
//       transition={{ duration: 0.2 }}
//       className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
//     >
//       <div className="flex-shrink-0">
//         <img
//           src={cartItem?.image}
//           alt={cartItem?.title}
//           className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover border"
//         />
//       </div>

//       <div className="flex-1 min-w-0 space-y-2">
//         <div className="flex items-start justify-between gap-2">
//           <h3 className="font-semibold text-sm line-clamp-2 leading-tight flex-1">
//             {cartItem?.title}
//           </h3>
//           <Button
//             variant="ghost"
//             size="icon"
//             className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
//             onClick={() => handleCartItemDelete(cartItem)}
//             disabled={isDeleting}
//           >
//             <Trash className="h-3 w-3 sm:h-4 sm:w-4" />
//           </Button>
//         </div>

//         <div className="flex items-center gap-2">
//           <span className="font-bold text-primary text-sm">
//             ₦{currentPrice.toLocaleString("en-NG")}
//           </span>
//           {originalPrice && originalPrice > currentPrice && (
//             <span className="text-xs text-gray-500 line-through">
//               ₦{originalPrice.toLocaleString("en-NG")}
//             </span>
//           )}
//         </div>

//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Button
//               variant="outline"
//               className="h-6 w-6 sm:h-7 sm:w-7 rounded-md"
//               size="icon"
//               disabled={cartItem?.quantity === 1}
//               onClick={() => handleUpdateQuantity(cartItem, "minus")}
//             >
//               <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
//             </Button>
//             <span className="font-medium text-sm w-6 sm:w-8 text-center">
//               {cartItem?.quantity}
//             </span>
//             <Button
//               variant="outline"
//               className="h-6 w-6 sm:h-7 sm:w-7 rounded-md"
//               size="icon"
//               onClick={() => handleUpdateQuantity(cartItem, "plus")}
//             >
//               <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
//             </Button>
//           </div>

//           <div className="text-right">
//             <div className="font-bold text-sm">
//               ₦{itemTotal.toLocaleString("en-NG")}
//             </div>
//             <div className="text-xs text-gray-500 hidden xs:block">
//               {cartItem?.quantity} × ₦{currentPrice.toLocaleString("en-NG")}
//             </div>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// export default UserCartItemsContent;

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
      const currentItem = cartItems.find(
        (item) => item.productId === getCartItem?.productId
      );
      const product = productList.find(
        (product) => product._id === getCartItem?.productId
      );

      if (currentItem && product) {
        if (currentItem.quantity + 1 > product.totalStock) {
          toast({
            title: `Stock Limit`,
            description: `Only ${product.totalStock} units available in stock.`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    dispatch(
      updateCartQuantity({
        productId: getCartItem?.productId,
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
      deleteCartItem({ productId: getCartItem?.productId })
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

  const currentPrice = cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price;
  const originalPrice = cartItem?.salePrice > 0 ? cartItem?.price : null;
  const itemTotal = currentPrice * cartItem?.quantity;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
    >
      <div className="flex-shrink-0">
        <img
          src={cartItem?.image}
          alt={cartItem?.title}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover border"
        />
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm line-clamp-2 leading-tight flex-1">
            {cartItem?.title}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
            onClick={() => handleCartItemDelete(cartItem)}
            disabled={isDeleting}
          >
            <Trash className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>

        {/* Updated Price Display - Slash price first, then actual price in orange */}
        <div className="flex items-center gap-2">
          {originalPrice && (
            <span className="text-xs text-gray-500 line-through">
              ₦{originalPrice.toLocaleString("en-NG")}
            </span>
          )}
          <span className={`font-bold text-sm ${originalPrice ? 'text-orange-500' : 'text-primary'
            }`}>
            ₦{currentPrice.toLocaleString("en-NG")}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="h-6 w-6 sm:h-7 sm:w-7 rounded-md"
              size="icon"
              disabled={cartItem?.quantity === 1}
              onClick={() => handleUpdateQuantity(cartItem, "minus")}
            >
              <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </Button>
            <span className="font-medium text-sm w-6 sm:w-8 text-center">
              {cartItem?.quantity}
            </span>
            <Button
              variant="outline"
              className="h-6 w-6 sm:h-7 sm:w-7 rounded-md"
              size="icon"
              onClick={() => handleUpdateQuantity(cartItem, "plus")}
            >
              <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </Button>
          </div>

          <div className="text-right">
            <div className="font-bold text-sm text-orange-500">
              ₦{itemTotal.toLocaleString("en-NG")}
            </div>
            <div className="text-xs text-gray-500 hidden xs:block">
              {cartItem?.quantity} × ₦{currentPrice.toLocaleString("en-NG")}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default UserCartItemsContent;