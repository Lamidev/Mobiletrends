'use client';
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Plus, Minus, Truck, ShieldCheck, RefreshCcw, Package, CreditCard, ChevronRight, Share2, MessageCircle } from "lucide-react";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { toast } = useToast();

  const currentPrice =
    productDetails?.salePrice > 0
      ? productDetails?.salePrice
      : productDetails?.price;
  const originalPrice =
    productDetails?.salePrice > 0 ? productDetails?.price : null;
  const totalPrice = currentPrice * quantity;

  function handleQuantityChange(type) {
    if (type === "increment") {
      if (quantity < productDetails?.totalStock) {
        setQuantity(quantity + 1);
      } else {
        toast({
          title: `Only ${productDetails?.totalStock} units available`,
          variant: "destructive",
        });
      }
    } else if (type === "decrement" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  }

  async function handleAddToCart() {
    try {
      if (productDetails?.totalStock === 0) return;

      const response = await dispatch(
        addToCart({
          productId: productDetails?._id,
          quantity,
        })
      ).unwrap();

      if (response.success) {
        await dispatch(fetchCartItems()).unwrap();
        toast({
          title: "Added to Cart!",
          description: `${quantity} × ${productDetails?.title} successfully added.`,
        });
        setOpen(false); // Optional: close dialog after adding
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add to cart. Please try again.",
        variant: "destructive",
      });
    }
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setQuantity(1);
  }

  function handleWhatsAppOrder() {
    const phoneNumber = "2349135924262";

    // Construct the backend share URL which generates Open Graph meta tags for the image preview
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    // Using the user-provided Render production URL for API base
    const apiBase = isLocal ? "http://localhost:8050" : "https://api.mobiletrends.com.ng";

    const shareUrl = `${apiBase}/api/share/${productDetails?._id}`;

    const message = `Hello, I would like to order this product:
*${productDetails?.title}*
Price: ₦${currentPrice?.toLocaleString("en-NG")}
Qty: ${quantity}
Link: ${shareUrl}`;

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }

  async function handleShareProduct() {
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const apiBase = isLocal ? "http://localhost:8050" : "https://api.mobiletrends.com.ng";
    const shareUrl = `${apiBase}/api/share/${productDetails?._id}`;

    const shareData = {
      title: productDetails?.title,
      text: `Check out ${productDetails?.title} on Mobiletrends!`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link Copied!",
          description: "Product link copied to clipboard.",
        });
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  }

  useEffect(() => {
    if (productDetails) {
      setQuantity(1);
    }
  }, [productDetails]);

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="font-body p-0 max-w-[95vw] md:max-w-[85vw] lg:max-w-[1000px] max-h-[90dvh] overflow-hidden rounded-3xl border-none shadow-2xl bg-white">
        <div className="flex flex-col lg:flex-row h-full max-h-[90dvh]">
          {/* Left Side: Image Gallery Style */}
          <div className="hidden lg:block lg:w-1/2 bg-gray-50/50 p-6 flex items-center justify-center relative group">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative w-full aspect-square max-h-[300px] sm:max-h-[400px] lg:max-h-full"
            >
              <img
                src={productDetails?.image}
                alt={productDetails?.title}
                className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
              />
            </motion.div>

            {/* Discount Badge */}
            {originalPrice && (
              <div className="absolute top-6 left-6 bg-peach-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                -{Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}% OFF
              </div>
            )}
          </div>

          {/* Right Side: Product Info */}
          <div className="w-full lg:w-1/2 flex flex-col h-full bg-white relative">
            <div className="flex-1 overflow-y-auto p-5 lg:p-8 space-y-6 lg:space-y-8 pb-48 lg:pb-8">
              {/* Mobile Image */}
              <div className="block lg:hidden w-full aspect-square relative bg-gray-50 rounded-2xl mb-6 overflow-hidden">
                <img
                  src={productDetails?.image}
                  alt={productDetails?.title}
                  className="w-full h-full object-contain mix-blend-multiply"
                />
                {/* Discount Badge Mobile */}
                {originalPrice && (
                  <div className="absolute top-4 left-4 bg-peach-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    -{Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}% OFF
                  </div>
                )}
              </div>
              {/* Breadcrumb & Brand */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <span>{productDetails?.category}</span>
                  <ChevronRight size={10} />
                  <span>{productDetails?.brand}</span>
                </div>
                <h1 className="font-manrope text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 leading-tight">
                  {productDetails?.title}
                </h1>
              </div>

              {/* Pricing & Stock */}
              <div className="flex items-end justify-between flex-wrap gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-manrope text-3xl sm:text-4xl font-extrabold tracking-tight text-peach-600">
                      ₦{currentPrice?.toLocaleString("en-NG")}
                    </span>
                    {originalPrice && (
                      <span className="text-lg sm:text-xl font-bold text-gray-300 line-through decoration-peach-300">
                        ₦{originalPrice?.toLocaleString("en-NG")}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
                    Price inclusive of all taxes
                  </p>
                </div>

                <div className="text-right">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${productDetails?.totalStock > 0
                    ? "bg-green-50 text-green-600 border-green-100"
                    : "bg-red-50 text-red-600 border-red-100"
                    }`}>
                    {productDetails?.totalStock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>

              <Separator className="bg-gray-100" />

              {/* Description */}
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Description</h3>
                <p className="text-gray-600 leading-relaxed font-medium">
                  {productDetails?.description}
                </p>
              </div>

              {/* Delivery info box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                    <Truck className="h-5 w-5 text-peach-500" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-gray-900 uppercase">Express Delivery</h4>
                    <p className="text-[11px] text-gray-500 font-bold mt-0.5">Lagos: Same Day | Outside: 1-2 Days</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-gray-900 uppercase">Warranty</h4>
                    <p className="text-[11px] text-gray-500 font-bold mt-0.5">100% Authentic Product Guarantee</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Section - Fixed at Bottom */}
            <div className="absolute lg:relative bottom-0 left-0 right-0 bg-white p-3 lg:p-0 border-t lg:border-none border-gray-100 flex flex-col gap-2 z-10 w-full shadow-[0_-5px_20px_rgba(0,0,0,0.05)] lg:shadow-none bg-white/95 backdrop-blur-sm lg:bg-transparent">

              <div className="flex gap-2 w-full">
                {/* Quantity Selector */}
                <div className="flex items-center bg-gray-100 rounded-xl p-1 shrink-0 h-10 sm:h-11">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange("decrement")}
                    disabled={quantity <= 1 || productDetails?.totalStock === 0}
                    className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg hover:bg-white hover:shadow-sm transition-all"
                  >
                    <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <span className="w-8 sm:w-10 text-center font-black text-sm sm:text-base">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange("increment")}
                    disabled={quantity >= productDetails?.totalStock || productDetails?.totalStock === 0}
                    className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg hover:bg-white hover:shadow-sm transition-all"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>

                <Button
                  onClick={handleAddToCart}
                  disabled={productDetails?.totalStock === 0}
                  className="flex-1 h-10 sm:h-11 bg-peach-500 hover:bg-peach-600 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-peach-100 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
                >
                  {productDetails?.totalStock === 0
                    ? "OUT OF STOCK"
                    : `ADD • ₦${totalPrice.toLocaleString("en-NG")}`}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={handleWhatsAppOrder}
                  className="h-10 sm:h-11 rounded-xl border-green-200 text-green-700 bg-green-50 hover:bg-green-100 hover:text-green-800 gap-1.5 font-bold text-xs sm:text-sm whitespace-nowrap px-1"
                >
                  <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                  <span className="truncate">WhatsApp Order</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleShareProduct}
                  className="h-10 sm:h-11 rounded-xl border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 hover:text-blue-800 gap-1.5 font-bold text-xs sm:text-sm whitespace-nowrap px-1"
                >
                  <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                  <span className="truncate">Share Link</span>
                </Button>
              </div>

            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
