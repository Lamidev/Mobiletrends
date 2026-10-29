'use client';

import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { ShoppingBag, ArrowRight, ShoppingCart, Truck, Package } from "lucide-react";
import { Badge } from "../ui/badge";
import { useSelector } from "react-redux";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

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

  const totalItems = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      sessionStorage.setItem('redirectAfterLogin', '/shop/checkout');
      navigate("/auth/login");
    } else {
      navigate("/shop/checkout");
    }
    setOpenCartSheet(false);
  };

  return (
    <SheetContent className="sm:max-w-lg flex flex-col p-4 sm:p-6">
      <SheetHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                  {totalItems}
                </Badge>
              )}
            </div>
            <SheetTitle className="text-lg sm:text-xl">Shopping Cart</SheetTitle>
          </div>
          {cartItems && cartItems.length > 0 && (
            <Badge variant="secondary" className="text-xs sm:text-sm">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </Badge>
          )}
        </div>
      </SheetHeader>

      <ScrollArea className="flex-1 pr-2 sm:pr-4">
        <div className="space-y-3 sm:space-y-4">
          {cartItems && cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <div key={`${item.productId}-${index}`}>
                <UserCartItemsContent cartItem={item} />
                {index < cartItems.length - 1 && <Separator className="my-3 sm:my-4" />}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12 px-4 text-center">
              <ShoppingBag className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base max-w-sm">
                Looks like you haven't added any items to your cart yet. Start shopping to discover amazing products!
              </p>
              <Button
                onClick={() => {
                  navigate("/shop/listing");
                  setOpenCartSheet(false);
                }}
                className="w-full max-w-xs gap-2 text-sm sm:text-base"
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
        <div className="border-t pt-4 space-y-4 bg-background">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-orange-500">₦{totalCartAmount.toLocaleString("en-NG")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 flex items-center gap-1">
                <Truck className="h-3 w-3" />
                Delivery
              </span>
              <span className="font-medium text-gray-500">Calculated at checkout</span>
            </div>
            <Separator />
            <div className="flex justify-between text-base sm:text-lg font-bold">
              <span>Total</span>
              <span className="text-orange-500">₦{totalCartAmount.toLocaleString("en-NG")}</span>
            </div>
          </div>

          <div className="text-[11px] sm:text-xs text-gray-500 font-medium bg-gray-50/80 p-3 rounded-xl border border-gray-100 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Truck className="h-3.5 w-3.5 text-peach-500" />
              <span>Lagos: <span className="text-gray-900 font-bold">Same Day Delivery</span></span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-3.5 w-3.5 text-orange-400" />
              <span>Outside Lagos: <span className="text-gray-900 font-bold">1-2 Business Days</span></span>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleCheckout}
              className="w-full py-2 sm:py-3 text-sm sm:text-base font-semibold"
              size="lg"
            >
              {isAuthenticated ? "Proceed to Checkout" : "Login to Checkout"}
            </Button>
            <Button
              onClick={() => {
                navigate("/shop/listing");
                setOpenCartSheet(false);
              }}
              variant="outline"
              className="w-full text-sm sm:text-base"
            >
              Continue Shopping
            </Button>
          </div>
          {!isAuthenticated && (
            <div className="text-xs text-center text-blue-600 px-2">
              Your cart will be saved and merged when you login
            </div>
          )}
        </div>
      )}
    </SheetContent>
  );
}

export default UserCartWrapper;