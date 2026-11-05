'use client';

import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { ShoppingBag, ArrowRight, ShoppingCart, ShieldCheck } from "lucide-react";
import { useSelector } from "react-redux";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
        (sum, currentItem) =>
          sum +
          (currentItem?.salePrice > 0
            ? currentItem?.salePrice
            : currentItem?.price) *
          currentItem?.quantity,
        0
      )
      : 0;

  const handleCheckout = () => {
    setOpenCartSheet(false);
    navigate("/shop/checkout");
  };

  return (
    <SheetContent className="sm:max-w-lg flex flex-col p-4 sm:p-6 bg-white">
      <SheetHeader className="pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#111344]/5 flex items-center justify-center text-[#111344]">
            <ShoppingCart className="h-5 w-5" />
          </div>
          <div>
            <SheetTitle className="text-lg font-bold text-[#111344] tracking-tight">Shopping Cart</SheetTitle>
            <p className="text-xs text-gray-500 font-medium">Review your items before checkout</p>
          </div>
        </div>
      </SheetHeader>

      <ScrollArea className="flex-1 pr-2 sm:pr-4">
        <div className="space-y-3 sm:space-y-4 pt-3">
          {cartItems && cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <div key={`${item.productId}-${index}`}>
                <UserCartItemsContent cartItem={item} />
                {index < cartItems.length - 1 && <Separator className="my-3 sm:my-4" />}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 text-gray-300">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                Your cart is empty
              </h3>
              <p className="text-gray-500 mb-6 text-sm max-w-xs">
                Explore our premium collection of smartphones, laptops, and flagship gadgets.
              </p>
              <Button
                onClick={() => {
                  navigate("/shop/listing");
                  setOpenCartSheet(false);
                }}
                className="w-full max-w-xs gap-2 text-sm bg-[#111344] hover:bg-[#0C1172] text-white"
                size="lg"
              >
                Start Shopping
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>

      {cartItems && cartItems.length > 0 && (
        <div className="border-t border-gray-100 pt-3 sm:pt-4 space-y-3 sm:space-y-4 bg-white">
          <div className="flex items-center justify-between text-base sm:text-lg font-bold">
            <span className="text-[#111344]">Total</span>
            <span className="text-[#DF5E00]">₦{totalCartAmount.toLocaleString("en-NG")}</span>
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleCheckout}
              className="w-full py-3 text-sm sm:text-base font-semibold bg-[#111344] hover:bg-[#0C1172] text-white rounded-[6px] shadow-sm transition-all"
              size="lg"
            >
              Proceed to Checkout
            </Button>
            <Button
              onClick={() => {
                navigate("/shop/listing");
                setOpenCartSheet(false);
              }}
              variant="outline"
              className="w-full text-sm font-medium rounded-[6px] border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Continue Shopping
            </Button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Genuine Devices · Nationwide Insured Waybill</span>
          </div>
        </div>
      )}
    </SheetContent>
  );
}

export default UserCartWrapper;
