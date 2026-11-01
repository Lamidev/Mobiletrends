'use client';

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  ShoppingBag,
  Heart,
  LogOut,
  ArrowLeft,
  ChevronRight,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  LayoutDashboard,
  Trash2,
  Package,
  MapPin,
  ExternalLink,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import ShoppingOrders from "@/components/shopping-view/orders";
import Address from "@/components/shopping-view/address";
import { directLogout, logoutUser } from "@/store/auth-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";

function ShoppingAccount() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  const tabParam = searchParams.get("tab");
  const [activeView, setActiveView] = useState(
    ["profile", "orders", "wishlist"].includes(tabParam) ? tabParam : "main"
  );
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);

  // Sync state if URL query param changes
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (["profile", "orders", "wishlist"].includes(tab)) {
      setActiveView(tab);
    } else if (!tab) {
      setActiveView("main");
    }
  }, [searchParams]);

  // Load wishlist from localStorage
  const loadWishlist = () => {
    try {
      const saved = localStorage.getItem("mobiletrends_wishlist");
      if (saved) {
        setWishlistItems(JSON.parse(saved));
      } else {
        setWishlistItems([]);
      }
    } catch {
      setWishlistItems([]);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleSelectView = (viewKey) => {
    setActiveView(viewKey);
    if (viewKey === "main") {
      setSearchParams({}, { replace: true });
    } else {
      setSearchParams({ tab: viewKey }, { replace: true });
    }
  };

  const handleRemoveFromWishlist = (productId) => {
    try {
      const updated = wishlistItems.filter(
        (item) => (item._id || item.id) !== productId
      );
      setWishlistItems(updated);
      localStorage.setItem("mobiletrends_wishlist", JSON.stringify(updated));
      toast({
        title: "Item removed from wishlist",
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddWishlistToCart = (product) => {
    const productId = product._id || product.id;
    const userId = user?.id || user?.Id || user?._id;
    if (!userId) {
      toast({
        title: "Please log in",
        description: "Sign in to add items to your cart",
        variant: "destructive",
      });
      return;
    }

    dispatch(
      addToCart({
        userId,
        productId,
        quantity: 1,
      })
    ).then((res) => {
      if (res?.payload?.success) {
        dispatch(fetchCartItems(userId));
        toast({
          title: "Added to Cart",
          description: `${product.title} has been moved to your bag.`,
        });
      }
    });
  };

  const handleLogout = () => {
    dispatch(directLogout());
    setIsLogoutDialogOpen(false);
    navigate("/shop/home");
    dispatch(logoutUser()).catch((err) => {
      console.error("Logout background error:", err);
    });
  };

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Member";

  return (
    <div className="font-manrope min-h-screen bg-[#fafaf8] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <AnimatePresence mode="wait">
          {/* ======================================================== */}
          {/* VIEW 1: MAIN ACCOUNT SETTINGS CARD (MATCHES ATTACHED IMAGE) */}
          {/* ======================================================== */}
          {activeView === "main" && (
            <motion.div
              key="main"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-[480px] mx-auto pt-4 sm:pt-8"
            >
              {/* Heading exactly matching screenshot */}
              <h1 className="text-[26px] sm:text-[30px] font-bold text-[#0f172a] tracking-[-0.6px] mb-6 sm:mb-8">
                Account Settings
              </h1>

              {/* White Card Container */}
              <div className="bg-white rounded-[24px] border border-[#e5e7eb] shadow-[0_2px_16px_rgba(0,0,0,0.03)] p-6 sm:p-8 space-y-6 sm:space-y-7">
                {/* 1. My Profile */}
                <button
                  type="button"
                  onClick={() => handleSelectView("profile")}
                  className="w-full flex items-center justify-between text-left group transition-all cursor-pointer py-1"
                >
                  <div className="flex items-center gap-4 sm:gap-4.5">
                    <User className="w-[21px] h-[21px] text-[#0f172a] stroke-[1.8] shrink-0" />
                    <span className="text-[16px] sm:text-[17px] font-semibold text-[#0f172a] group-hover:text-[#0C1172] transition-colors">
                      My Profile
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#94a3b8] group-hover:translate-x-0.5 group-hover:text-[#0C1172] transition-all" />
                </button>

                {/* 2. My Orders */}
                <button
                  type="button"
                  onClick={() => handleSelectView("orders")}
                  className="w-full flex items-center justify-between text-left group transition-all cursor-pointer py-1"
                >
                  <div className="flex items-center gap-4 sm:gap-4.5">
                    <ShoppingBag className="w-[21px] h-[21px] text-[#0f172a] stroke-[1.8] shrink-0" />
                    <span className="text-[16px] sm:text-[17px] font-semibold text-[#0f172a] group-hover:text-[#0C1172] transition-colors">
                      My Orders
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#94a3b8] group-hover:translate-x-0.5 group-hover:text-[#0C1172] transition-all" />
                </button>

                {/* 3. Wishlist */}
                <button
                  type="button"
                  onClick={() => handleSelectView("wishlist")}
                  className="w-full flex items-center justify-between text-left group transition-all cursor-pointer py-1"
                >
                  <div className="flex items-center gap-4 sm:gap-4.5">
                    <Heart className="w-[21px] h-[21px] text-[#0f172a] stroke-[1.8] shrink-0" />
                    <span className="text-[16px] sm:text-[17px] font-semibold text-[#0f172a] group-hover:text-[#0C1172] transition-colors">
                      Wishlist
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {wishlistItems.length > 0 && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#111344]/10 text-[#111344]">
                        {wishlistItems.length}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-[#94a3b8] group-hover:translate-x-0.5 group-hover:text-[#0C1172] transition-all" />
                  </div>
                </button>

                {/* Admin Dashboard (if admin user) */}
                {user?.role === "admin" && (
                  <button
                    type="button"
                    onClick={() => navigate("/admin/dashboard")}
                    className="w-full flex items-center justify-between text-left group transition-all cursor-pointer py-1"
                  >
                    <div className="flex items-center gap-4 sm:gap-4.5">
                      <LayoutDashboard className="w-[21px] h-[21px] text-[#DF5E00] stroke-[1.8] shrink-0" />
                      <span className="text-[16px] sm:text-[17px] font-semibold text-[#0f172a] group-hover:text-[#DF5E00] transition-colors">
                        Admin Dashboard
                      </span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#DF5E00]/10 text-[#DF5E00] px-2 py-0.5 rounded-[4px]">
                      Admin
                    </span>
                  </button>
                )}

                {/* 4. Logout */}
                <button
                  type="button"
                  onClick={() => setIsLogoutDialogOpen(true)}
                  className="w-full flex items-center justify-between text-left group transition-all cursor-pointer py-1"
                >
                  <div className="flex items-center gap-4 sm:gap-4.5 text-[#e11d48]">
                    <LogOut className="w-[21px] h-[21px] stroke-[1.8] shrink-0" />
                    <span className="text-[16px] sm:text-[17px] font-semibold">
                      Logout
                    </span>
                  </div>
                </button>
              </div>

              {/* Logged in indicator */}
              <p className="text-center text-[12px] text-[#64748b] mt-6">
                Signed in as <span className="font-semibold text-[#0f172a]">{user?.userName}</span> ({user?.email})
              </p>
            </motion.div>
          )}

          {/* ======================================================== */}
          {/* VIEW 2: MY PROFILE */}
          {/* ======================================================== */}
          {activeView === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Return Button */}
              <button
                type="button"
                onClick={() => handleSelectView("main")}
                className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#111344] hover:text-[#DF5E00] transition-colors cursor-pointer group py-1"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Account Settings</span>
              </button>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#0f172a] tracking-tight">
                  My Profile
                </h1>
                <p className="text-sm text-[#64748b] mt-1">
                  Manage your personal account details and saved delivery addresses
                </p>
              </div>

              {/* Profile Card */}
              <div className="bg-white rounded-[20px] border border-[#e5e7eb] p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-[#f1f5f9]">
                  <div className="w-16 h-16 rounded-full bg-[#111344] text-white flex items-center justify-center font-bold text-2xl shadow-sm">
                    {user?.userName ? user.userName.slice(0, 2).toUpperCase() : "MT"}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#0f172a]">
                      {user?.userName}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-[#64748b]">{user?.email}</span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-6">
                  <div className="flex items-center gap-3 p-3.5 rounded-[12px] bg-[#f8fafc] border border-[#f1f5f9]">
                    <Mail className="w-4 h-4 text-[#64748b] shrink-0" />
                    <div>
                      <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#94a3b8]">
                        Email Address
                      </span>
                      <span className="text-sm font-semibold text-[#0f172a]">
                        {user?.email || "—"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-[12px] bg-[#f8fafc] border border-[#f1f5f9]">
                    <Phone className="w-4 h-4 text-[#64748b] shrink-0" />
                    <div>
                      <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#94a3b8]">
                        Phone Number
                      </span>
                      <span className="text-sm font-semibold text-[#0f172a]">
                        {user?.phone || "Not set"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-[12px] bg-[#f8fafc] border border-[#f1f5f9]">
                    <User className="w-4 h-4 text-[#64748b] shrink-0" />
                    <div>
                      <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#94a3b8]">
                        Account Type
                      </span>
                      <span className="text-sm font-semibold text-[#0f172a] capitalize">
                        {user?.role === "admin" ? "Store Administrator" : "Customer"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-[12px] bg-[#f8fafc] border border-[#f1f5f9]">
                    <Calendar className="w-4 h-4 text-[#64748b] shrink-0" />
                    <div>
                      <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#94a3b8]">
                        Member Since
                      </span>
                      <span className="text-sm font-semibold text-[#0f172a]">
                        {formattedDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Addresses Section */}
              <div className="bg-white rounded-[20px] border border-[#e5e7eb] p-6 sm:p-8 shadow-sm space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-[#f1f5f9]">
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-5 h-5 text-[#111344]" />
                    <div>
                      <h2 className="text-lg font-bold text-[#0f172a]">
                        Delivery Addresses
                      </h2>
                      <p className="text-xs text-[#64748b]">
                        Manage shipping locations for faster checkout
                      </p>
                    </div>
                  </div>
                </div>

                <Address />
              </div>
            </motion.div>
          )}

          {/* ======================================================== */}
          {/* VIEW 3: MY ORDERS */}
          {/* ======================================================== */}
          {activeView === "orders" && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Return Button */}
              <button
                type="button"
                onClick={() => handleSelectView("main")}
                className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#111344] hover:text-[#DF5E00] transition-colors cursor-pointer group py-1"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Account Settings</span>
              </button>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#0f172a] tracking-tight">
                  My Orders
                </h1>
                <p className="text-sm text-[#64748b] mt-1">
                  Track deliveries, view past gadget orders, and download receipts
                </p>
              </div>

              {/* Render Orders List */}
              <div className="bg-white rounded-[20px] border border-[#e5e7eb] p-4 sm:p-7 shadow-sm">
                <ShoppingOrders />
              </div>
            </motion.div>
          )}

          {/* ======================================================== */}
          {/* VIEW 4: WISHLIST */}
          {/* ======================================================== */}
          {activeView === "wishlist" && (
            <motion.div
              key="wishlist"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Return Button */}
              <button
                type="button"
                onClick={() => handleSelectView("main")}
                className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#111344] hover:text-[#DF5E00] transition-colors cursor-pointer group py-1"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Account Settings</span>
              </button>

              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#0f172a] tracking-tight">
                    Wishlist
                  </h1>
                  <p className="text-sm text-[#64748b] mt-1">
                    Devices and accessories you&apos;ve saved for later
                  </p>
                </div>
                {wishlistItems.length > 0 && (
                  <span className="text-xs font-semibold text-[#64748b] bg-white border border-[#e5e7eb] px-3 py-1.5 rounded-[6px]">
                    {wishlistItems.length} {wishlistItems.length === 1 ? "gadget" : "gadgets"} saved
                  </span>
                )}
              </div>

              {wishlistItems.length === 0 ? (
                /* Empty Wishlist Card */
                <div className="bg-white rounded-[20px] border border-[#e5e7eb] p-10 sm:p-14 text-center shadow-sm max-w-lg mx-auto">
                  <div className="w-16 h-16 rounded-full bg-[#f8fafc] border border-[#e5e7eb] flex items-center justify-center mx-auto mb-4 text-[#94a3b8]">
                    <Heart className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0f172a] mb-1.5">
                    Your wishlist is empty
                  </h3>
                  <p className="text-sm text-[#64748b] max-w-xs mx-auto mb-6">
                    Tap the heart icon on any gadget while browsing to save it to your wishlist.
                  </p>
                  <Button
                    onClick={() => navigate("/shop/listing")}
                    className="bg-[#111344] hover:bg-[#0C1172] text-white px-6 h-11 rounded-[6px] font-semibold text-sm transition-all"
                  >
                    Browse Gadgets
                  </Button>
                </div>
              ) : (
                /* Wishlist Items Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {wishlistItems.map((item) => {
                    const itemId = item._id || item.id;
                    return (
                      <div
                        key={itemId}
                        className="bg-white rounded-[16px] border border-[#e5e7eb] p-4 flex flex-col justify-between hover:shadow-md transition-shadow group relative"
                      >
                        <div>
                          <div
                            onClick={() => navigate(`/shop/product/${itemId}`)}
                            className="aspect-square w-full rounded-[12px] bg-[#fafaf8] border border-[#f1f5f9] flex items-center justify-center p-4 mb-3.5 overflow-hidden cursor-pointer"
                          >
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#DF5E00]">
                              {item.brand || item.category || "Gadget"}
                            </span>
                            <h4
                              onClick={() => navigate(`/shop/product/${itemId}`)}
                              className="font-bold text-[14px] text-[#0f172a] line-clamp-2 hover:text-[#0C1172] cursor-pointer"
                            >
                              {item.title}
                            </h4>
                            <div className="flex items-baseline gap-2 pt-1">
                              <span className="text-[15px] font-extrabold text-[#111344]">
                                ₦{Number(item.price || item.salePrice || 0).toLocaleString("en-NG")}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-4 mt-3 border-t border-[#f1f5f9]">
                          <Button
                            onClick={() => handleAddWishlistToCart(item)}
                            className="flex-1 h-9 rounded-[6px] bg-[#111344] hover:bg-[#0C1172] text-white text-xs font-semibold gap-1.5"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Add to Cart</span>
                          </Button>

                          <Button
                            variant="outline"
                            onClick={() => handleRemoveFromWishlist(itemId)}
                            className="h-9 w-9 p-0 rounded-[6px] text-[#94a3b8] hover:text-red-600 hover:border-red-200"
                            title="Remove from wishlist"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent className="rounded-[16px] max-w-[90vw] sm:max-w-[400px] p-6 font-manrope">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center text-[#0f172a]">
              Confirm Logout
            </DialogTitle>
          </DialogHeader>
          <p className="text-center text-sm text-[#64748b] py-3">
            Are you sure you want to log out of your Mobiletrends account?
          </p>
          <DialogFooter className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <Button
              variant="outline"
              className="rounded-[6px] font-semibold order-2 sm:order-1 h-10"
              onClick={() => setIsLogoutDialogOpen(false)}
            >
              Stay Logged In
            </Button>
            <Button
              variant="destructive"
              className="rounded-[6px] font-semibold bg-red-600 hover:bg-red-700 order-1 sm:order-2 h-10"
              onClick={handleLogout}
            >
              Yes, Sign Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ShoppingAccount;
