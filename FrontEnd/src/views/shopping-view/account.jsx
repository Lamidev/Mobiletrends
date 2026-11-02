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
  LayoutDashboard,
  Trash2,
  ShoppingCart,
  Plus,
  Loader2,
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
import { directLogout, logoutUser, updateUserProfile, changeUserPassword } from "@/store/auth-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  fetchAllAddresses,
  addNewAddress,
  editAddress,
  deleteAddress,
} from "@/store/shop/address-slice";

function ShoppingAccount() {
  const { user } = useSelector((state) => state.auth);
  const { addressList = [], isLoading: addressLoading = false } = useSelector(
    (state) => state.shopAddress || state.address || {}
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  const tabParam = searchParams.get("tab");
  const [activeView, setActiveView] = useState(
    ["profile", "orders", "wishlist"].includes(tabParam) ? tabParam : "main"
  );

  // Dialog States
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddressToEdit, setSelectedAddressToEdit] = useState(null);

  // Form States
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [addressForm, setAddressForm] = useState({
    address: "",
    lga: "",
    state: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Wishlist State
  const [wishlistItems, setWishlistItems] = useState([]);

  const currentUserId = user?.id || user?.Id || user?._id;

  // Sync state if URL query param changes
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (["profile", "orders", "wishlist"].includes(tab)) {
      setActiveView(tab);
    } else if (!tab) {
      setActiveView("main");
    }
  }, [searchParams]);

  // Fetch addresses on mount
  useEffect(() => {
    if (currentUserId) {
      dispatch(fetchAllAddresses(currentUserId));
    }
  }, [dispatch, currentUserId]);

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

  // Profile Edit Handlers
  const openNameModal = () => {
    setNameInput(user?.userName || "");
    setIsNameModalOpen(true);
  };

  const openEmailModal = () => {
    setEmailInput(user?.email || "");
    setIsEmailModalOpen(true);
  };

  const openPasswordModal = () => {
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsPasswordModalOpen(true);
  };

  const handleSaveName = async (e) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      toast({ title: "Name cannot be empty", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await dispatch(updateUserProfile({ userName: nameInput.trim() })).unwrap();
      if (result?.success) {
        toast({ title: "Name updated successfully!" });
        setIsNameModalOpen(false);
      } else {
        toast({ title: result?.message || "Failed to update name", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: typeof err === "string" ? err : "Failed to update name", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEmail = async (e) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      toast({ title: "Email cannot be empty", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await dispatch(updateUserProfile({ email: emailInput.trim() })).unwrap();
      if (result?.success) {
        toast({ title: "Email updated successfully!" });
        setIsEmailModalOpen(false);
      } else {
        toast({ title: result?.message || "Failed to update email", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: typeof err === "string" ? err : "Failed to update email", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast({ title: "Please fill all password fields", variant: "destructive" });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({ title: "New passwords do not match", variant: "destructive" });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await dispatch(
        changeUserPassword({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        })
      ).unwrap();
      if (result?.success) {
        toast({ title: "Password changed successfully!" });
        setIsPasswordModalOpen(false);
      } else {
        toast({ title: result?.message || "Failed to change password", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: typeof err === "string" ? err : "Failed to change password", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Address Handlers
  const openAddAddressModal = () => {
    setSelectedAddressToEdit(null);
    setAddressForm({
      address: "",
      lga: "",
      state: "",
      phone: user?.phone || "",
    });
    setIsAddressModalOpen(true);
  };

  const openEditAddressModal = (addr) => {
    setSelectedAddressToEdit(addr);
    setAddressForm({
      address: addr.address || "",
      lga: addr.lga || "",
      state: addr.state || "",
      phone: addr.phone || user?.phone || "",
    });
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!addressForm.address.trim() || !addressForm.lga.trim() || !addressForm.state.trim()) {
      toast({ title: "Please fill in address, city/LGA, and state", variant: "destructive" });
      return;
    }

    if (!currentUserId) {
      toast({ title: "User session not found. Please re-login.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const payload = {
      userId: currentUserId,
      fullName: user?.userName || "Customer",
      address: addressForm.address.trim(),
      lga: addressForm.lga.trim(),
      state: addressForm.state.trim(),
      phone: addressForm.phone?.trim() || user?.phone || "08000000000",
      country: "Nigeria",
    };

    try {
      if (selectedAddressToEdit?._id) {
        await dispatch(
          editAddress({
            userId: currentUserId,
            addressId: selectedAddressToEdit._id,
            formData: payload,
          })
        ).unwrap();
        toast({ title: "Delivery address updated!" });
      } else {
        await dispatch(addNewAddress(payload)).unwrap();
        toast({ title: "Delivery address added!" });
      }
      dispatch(fetchAllAddresses(currentUserId));
      setIsAddressModalOpen(false);
    } catch (err) {
      toast({ title: "Failed to save address. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this delivery address?")) return;
    try {
      await dispatch(deleteAddress({ userId: currentUserId, addressId })).unwrap();
      toast({ title: "Address deleted" });
      dispatch(fetchAllAddresses(currentUserId));
    } catch {
      toast({ title: "Failed to delete address", variant: "destructive" });
    }
  };

  // Wishlist Handlers
  const handleRemoveFromWishlist = (productId) => {
    try {
      const updated = wishlistItems.filter((item) => (item._id || item.id) !== productId);
      setWishlistItems(updated);
      localStorage.setItem("mobiletrends_wishlist", JSON.stringify(updated));
      toast({ title: "Item removed from wishlist" });
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddWishlistToCart = (product) => {
    const productId = product._id || product.id;
    if (!currentUserId) {
      toast({ title: "Please log in to add items to cart", variant: "destructive" });
      return;
    }

    dispatch(
      addToCart({
        userId: currentUserId,
        productId,
        quantity: 1,
      })
    ).then((res) => {
      if (res?.payload?.success) {
        dispatch(fetchCartItems(currentUserId));
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

  // Formatted join date (e.g. October 2026)
  const formattedJoinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "October 2026";

  // Active tab on desktop (defaults to profile if activeView is main)
  const currentDesktopTab = activeView === "main" ? "profile" : activeView;

  // ========================================================
  // REUSABLE TAB CONTENT RENDERERS (USED BY DESKTOP & MOBILE)
  // ========================================================

  const renderProfileContent = (isDesktop = false) => (
    <div className="space-y-5">
      {/* Return Button (Mobile only) */}
      {!isDesktop && (
        <button
          type="button"
          onClick={() => handleSelectView("main")}
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#111344] hover:text-[#0C1172] transition-colors cursor-pointer group py-1"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Account Settings</span>
        </button>
      )}

      {/* Welcome Message Header requested by user */}
      <div className="pb-1">
        <h1 className="text-[21px] sm:text-[25px] font-bold text-[#0f172a] tracking-tight leading-snug">
          Hi {user?.userName || "there"}, welcome to Mobiletrends
        </h1>
        <p className="text-[13px] text-[#64748b] mt-1 font-medium">
          Joined {formattedJoinDate}
        </p>
      </div>

      {/* Card 1: My Profile (Image 1 replica) */}
      <div className="bg-white rounded-[22px] border border-gray-200/80 p-5 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
        <h2 className="text-[20px] font-bold text-[#0f172a]">
          My Profile
        </h2>

        {/* Name Row */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="block text-[13px] font-medium text-[#64748b]">
              Name
            </span>
            <span className="block text-[15px] sm:text-[16px] font-semibold text-[#0f172a] mt-0.5">
              {user?.userName || "Not set"}
            </span>
          </div>
          <button
            type="button"
            onClick={openNameModal}
            className="text-black hover:text-black/70 font-bold text-[14px] cursor-pointer hover:underline transition-colors shrink-0 pt-0.5"
          >
            Edit
          </button>
        </div>

        {/* Email Row */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <span className="block text-[13px] font-medium text-[#64748b]">
              Email
            </span>
            <span className="block text-[15px] sm:text-[16px] font-semibold text-[#0f172a] mt-0.5 underline decoration-gray-300 truncate">
              {user?.email || "Not set"}
            </span>
          </div>
          <button
            type="button"
            onClick={openEmailModal}
            className="text-black hover:text-black/70 font-bold text-[14px] cursor-pointer hover:underline transition-colors shrink-0 pt-0.5"
          >
            Edit
          </button>
        </div>

        {/* Password Row */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="block text-[13px] font-medium text-[#64748b]">
              Password
            </span>
            <span className="block text-[15px] font-semibold text-[#0f172a] mt-0.5 tracking-[3px]">
              ••••••••••••••••
            </span>
          </div>
          <button
            type="button"
            onClick={openPasswordModal}
            className="text-black hover:text-black/70 font-bold text-[14px] cursor-pointer hover:underline transition-colors shrink-0 pt-0.5"
          >
            Edit
          </button>
        </div>
      </div>

      {/* Card 2: Delivery Address (Image 1 replica) */}
      <div className="bg-white rounded-[22px] border border-gray-200/80 p-5 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
        {/* Header Row */}
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[20px] font-bold text-[#0f172a]">
            Delivery Address
          </h2>
          <button
            type="button"
            onClick={openAddAddressModal}
            className="text-[#0f172a] hover:text-[#111344] font-bold text-[13.5px] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{addressList && addressList.length > 0 ? "Update address" : "Add address"}</span>
          </button>
        </div>

        {/* Address Listing */}
        {addressLoading ? (
          <div className="py-6 flex items-center justify-center text-sm text-[#64748b]">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            <span>Loading addresses...</span>
          </div>
        ) : addressList && addressList.length > 0 ? (
          <div className="space-y-4 pt-1">
            {addressList.map((addr, idx) => (
              <div
                key={addr._id || idx}
                className="pt-3 border-t border-gray-100 first:border-t-0 first:pt-0"
              >
                <span className="block text-[12px] font-medium text-[#94a3b8] mb-1">
                  {idx === 0 ? "Primary Shipping Destination" : `Destination ${idx + 1}`}
                </span>

                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="font-bold text-[15px] sm:text-[16px] text-[#0f172a] leading-snug">
                      {addr.address}
                    </p>
                    <p className="text-[14px] text-[#64748b]">
                      {addr.lga}, {addr.state}, Nigeria
                    </p>
                    {addr.phone && (
                      <p className="text-[12px] text-[#94a3b8]">
                        Contact: {addr.phone}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => openEditAddressModal(addr)}
                      className="text-black hover:text-black/70 font-bold text-[14px] cursor-pointer hover:underline transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAddress(addr._id)}
                      className="text-gray-300 hover:text-red-600 transition-colors cursor-pointer p-1"
                      title="Delete address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="pt-2 text-left">
            <p className="text-[12px] font-medium text-[#94a3b8] mb-1">
              Primary Shipping Destination
            </p>
            <p className="text-[14px] text-[#64748b] mb-3">
              No delivery address saved yet.
            </p>
            <Button
              onClick={openAddAddressModal}
              variant="outline"
              className="rounded-[6px] text-xs h-8 font-semibold border-gray-200"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Address
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const renderOrdersContent = (isDesktop = false) => (
    <div className="space-y-4">
      {/* Return Button (Mobile only) */}
      {!isDesktop && (
        <button
          type="button"
          onClick={() => handleSelectView("main")}
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#111344] hover:text-[#0C1172] transition-colors cursor-pointer group py-1"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Account Settings</span>
        </button>
      )}

      <div className="pb-1">
        <h1 className="text-[22px] sm:text-[26px] font-bold text-[#0f172a] tracking-tight">
          My Orders
        </h1>
        <p className="text-[13px] text-[#64748b] mt-0.5">
          Track delivery status, review previous gadget purchases, and download receipts
        </p>
      </div>

      <div className="w-full">
        <ShoppingOrders />
      </div>
    </div>
  );

  const renderWishlistContent = (isDesktop = false) => (
    <div className="space-y-4">
      {/* Return Button (Mobile only) */}
      {!isDesktop && (
        <button
          type="button"
          onClick={() => handleSelectView("main")}
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#111344] hover:text-[#0C1172] transition-colors cursor-pointer group py-1"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Account Settings</span>
        </button>
      )}

      <div className="flex items-center justify-between flex-wrap gap-2 pb-1">
        <div>
          <h1 className="text-[22px] sm:text-[26px] font-bold text-[#0f172a] tracking-tight">
            Wishlist
          </h1>
          <p className="text-[13px] text-[#64748b] mt-0.5">
            Saved devices and accessories you want to buy
          </p>
        </div>
        {wishlistItems.length > 0 && (
          <span className="text-[11px] font-semibold text-[#64748b] bg-white border border-[#e5e7eb] px-3 py-1 rounded-[6px]">
            {wishlistItems.length} {wishlistItems.length === 1 ? "gadget" : "gadgets"}
          </span>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <div className="bg-white rounded-[20px] border border-[#e5e7eb] p-8 sm:p-12 text-center shadow-sm max-w-md mx-auto">
          <div className="w-14 h-14 rounded-full bg-[#f8fafc] border border-[#e5e7eb] flex items-center justify-center mx-auto mb-3 text-[#94a3b8]">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#0f172a] mb-1">
            Your wishlist is empty
          </h3>
          <p className="text-xs text-[#64748b] max-w-xs mx-auto mb-5">
            Tap the heart icon on any gadget while browsing to save it to your wishlist.
          </p>
          <Button
            onClick={() => navigate("/shop/listing")}
            className="bg-[#111344] hover:bg-[#0C1172] text-white px-5 h-10 rounded-[6px] font-semibold text-xs transition-all"
          >
            Browse Gadgets
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {wishlistItems.map((item) => {
            const itemId = item._id || item.id;
            return (
              <div
                key={itemId}
                className="bg-white rounded-[16px] border border-[#e5e7eb] p-3.5 flex flex-col justify-between hover:shadow-md transition-shadow group relative"
              >
                <div>
                  <div
                    onClick={() => navigate(`/shop/product/${itemId}`)}
                    className="aspect-square w-full rounded-[10px] bg-[#fafaf8] border border-[#f1f5f9] flex items-center justify-center p-3 mb-2.5 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#111344]">
                      {item.brand || item.category || "Gadget"}
                    </span>
                    <h4
                      onClick={() => navigate(`/shop/product/${itemId}`)}
                      className="font-bold text-[13.5px] text-[#0f172a] line-clamp-2 hover:text-[#0C1172] cursor-pointer"
                    >
                      {item.title}
                    </h4>
                    <div className="flex items-baseline gap-2 pt-0.5">
                      <span className="text-[14.5px] font-extrabold text-[#111344]">
                        ₦{Number(item.price || item.salePrice || 0).toLocaleString("en-NG")}
                      </span>
                      {item.salePrice && item.salePrice < item.price && (
                        <span className="text-[11.5px] text-[#94a3b8] line-through">
                          ₦{Number(item.price).toLocaleString("en-NG")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 mt-2 border-t border-gray-100">
                  <Button
                    onClick={() => handleAddWishlistToCart(item)}
                    className="flex-1 bg-[#111344] hover:bg-[#0C1172] text-white rounded-[6px] h-8 text-xs font-semibold gap-1.5"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleRemoveFromWishlist(itemId)}
                    className="h-8 w-8 p-0 rounded-[6px] text-[#94a3b8] hover:text-red-600 hover:border-red-200"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="font-manrope min-h-screen bg-[#fafaf8] py-4 sm:py-10 px-2.5 sm:px-6 lg:px-8">
      {/* ======================================================== */}
      {/* DESKTOP LAYOUT (lg: and above) -> 2 COLUMN SIDEBAR VIEW  */}
      {/* ======================================================== */}
      <div className="hidden lg:grid lg:grid-cols-[290px_1fr] lg:gap-8 items-start mx-auto max-w-6xl">
        {/* Left End: Account Settings Menu */}
        <aside className="lg:sticky lg:top-24">
          <h2 className="text-[24px] font-bold text-[#0f172a] tracking-tight mb-4">
            Account Settings
          </h2>

          <div className="bg-white rounded-[22px] border border-[#e5e7eb] shadow-[0_2px_14px_rgba(0,0,0,0.03)] p-3 space-y-1">
            {/* 1. My Profile */}
            <button
              type="button"
              onClick={() => handleSelectView("profile")}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-[14px] text-left transition-all cursor-pointer ${
                currentDesktopTab === "profile"
                  ? "bg-[#111344] text-white shadow-sm"
                  : "text-[#0f172a] hover:bg-[#fafaf8]"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <User
                  className={`w-[19px] h-[19px] stroke-[1.8] shrink-0 ${
                    currentDesktopTab === "profile" ? "text-white" : "text-[#0f172a]"
                  }`}
                />
                <span className="text-[15px] font-semibold">
                  My Profile
                </span>
              </div>
              <ChevronRight
                className={`w-4 h-4 ${
                  currentDesktopTab === "profile" ? "text-white/70" : "text-[#94a3b8]"
                }`}
              />
            </button>

            {/* 2. My Orders */}
            <button
              type="button"
              onClick={() => handleSelectView("orders")}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-[14px] text-left transition-all cursor-pointer ${
                currentDesktopTab === "orders"
                  ? "bg-[#111344] text-white shadow-sm"
                  : "text-[#0f172a] hover:bg-[#fafaf8]"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <ShoppingBag
                  className={`w-[19px] h-[19px] stroke-[1.8] shrink-0 ${
                    currentDesktopTab === "orders" ? "text-white" : "text-[#0f172a]"
                  }`}
                />
                <span className="text-[15px] font-semibold">
                  My Orders
                </span>
              </div>
              <ChevronRight
                className={`w-4 h-4 ${
                  currentDesktopTab === "orders" ? "text-white/70" : "text-[#94a3b8]"
                }`}
              />
            </button>

            {/* 3. Wishlist */}
            <button
              type="button"
              onClick={() => handleSelectView("wishlist")}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-[14px] text-left transition-all cursor-pointer ${
                currentDesktopTab === "wishlist"
                  ? "bg-[#111344] text-white shadow-sm"
                  : "text-[#0f172a] hover:bg-[#fafaf8]"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Heart
                  className={`w-[19px] h-[19px] stroke-[1.8] shrink-0 ${
                    currentDesktopTab === "wishlist" ? "text-white" : "text-[#0f172a]"
                  }`}
                />
                <span className="text-[15px] font-semibold">
                  Wishlist
                </span>
              </div>
              <div className="flex items-center gap-2">
                {wishlistItems.length > 0 && (
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      currentDesktopTab === "wishlist"
                        ? "bg-white/20 text-white"
                        : "bg-[#111344]/10 text-[#111344]"
                    }`}
                  >
                    {wishlistItems.length}
                  </span>
                )}
                <ChevronRight
                  className={`w-4 h-4 ${
                    currentDesktopTab === "wishlist" ? "text-white/70" : "text-[#94a3b8]"
                  }`}
                />
              </div>
            </button>

            {/* Admin Dashboard */}
            {user?.role === "admin" && (
              <button
                type="button"
                onClick={() => navigate("/admin/dashboard")}
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-[14px] text-left text-[#0f172a] hover:bg-[#fafaf8] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <LayoutDashboard className="w-[19px] h-[19px] text-[#111344] stroke-[1.8] shrink-0" />
                  <span className="text-[15px] font-semibold">
                    Admin Dashboard
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#111344]/10 text-[#111344] px-2 py-0.5 rounded-[4px]">
                  Admin
                </span>
              </button>
            )}

            {/* Divider */}
            <div className="my-2 border-t border-gray-100" />

            {/* 4. Logout */}
            <button
              type="button"
              onClick={() => setIsLogoutDialogOpen(true)}
              className="w-full flex items-center gap-3.5 px-4 py-3 rounded-[14px] text-left text-[#e11d48] hover:bg-red-50/70 transition-all cursor-pointer font-semibold text-[14.5px]"
            >
              <LogOut className="w-[19px] h-[19px] stroke-[1.8] shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Right Side: Active Option Content */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentDesktopTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {currentDesktopTab === "profile" && renderProfileContent(true)}
              {currentDesktopTab === "orders" && renderOrdersContent(true)}
              {currentDesktopTab === "wishlist" && renderWishlistContent(true)}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ======================================================== */}
      {/* MOBILE LAYOUT (< lg) -> KEPT EXACTLY AS IT IS             */}
      {/* ======================================================== */}
      <div className="block lg:hidden mx-auto max-w-2xl">
        <AnimatePresence mode="wait">
          {/* VIEW 1: MAIN ACCOUNT SETTINGS MENU */}
          {activeView === "main" && (
            <motion.div
              key="main"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-[480px] mx-auto pt-2 sm:pt-6"
            >
              <h1 className="text-[25px] sm:text-[30px] font-bold text-[#0f172a] tracking-tight mb-5 sm:mb-7">
                Account Settings
              </h1>

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
                      <LayoutDashboard className="w-[21px] h-[21px] text-[#111344] stroke-[1.8] shrink-0" />
                      <span className="text-[16px] sm:text-[17px] font-semibold text-[#0f172a] group-hover:text-[#0C1172] transition-colors">
                        Admin Dashboard
                      </span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#111344]/10 text-[#111344] px-2 py-0.5 rounded-[4px]">
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
            </motion.div>
          )}

          {/* VIEW 2: MY PROFILE */}
          {activeView === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {renderProfileContent(false)}
            </motion.div>
          )}

          {/* VIEW 3: MY ORDERS */}
          {activeView === "orders" && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {renderOrdersContent(false)}
            </motion.div>
          )}

          {/* VIEW 4: WISHLIST */}
          {activeView === "wishlist" && (
            <motion.div
              key="wishlist"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {renderWishlistContent(false)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ======================================================== */}
      {/* POP-UP MODAL 1: EDIT NAME                                */}
      {/* ======================================================== */}
      <Dialog open={isNameModalOpen} onOpenChange={setIsNameModalOpen}>
        <DialogContent className="rounded-[24px] max-w-[92vw] sm:max-w-[420px] p-6 font-manrope">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl font-bold text-[#0f172a]">
              Edit Name
            </DialogTitle>
            <p className="text-xs text-[#64748b]">
              Update the name displayed on your Mobiletrends account.
            </p>
          </DialogHeader>

          <form onSubmit={handleSaveName} className="space-y-4 pt-3">
            <div>
              <label className="block text-[12.5px] font-semibold text-[#1e293b] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g. Akinyemi Oluwaseun"
                className="w-full h-11 px-3.5 rounded-[10px] border border-gray-200 focus:border-[#111344] focus:ring-2 focus:ring-[#111344]/10 outline-none text-[14px] text-[#0f172a]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsNameModalOpen(false)}
                className="rounded-[6px] h-10 px-4 text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-[6px] h-10 px-5 text-xs font-semibold bg-[#111344] hover:bg-[#0C1172] text-white"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Name"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ======================================================== */}
      {/* POP-UP MODAL 2: EDIT EMAIL                               */}
      {/* ======================================================== */}
      <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
        <DialogContent className="rounded-[24px] max-w-[92vw] sm:max-w-[420px] p-6 font-manrope">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl font-bold text-[#0f172a]">
              Edit Email Address
            </DialogTitle>
            <p className="text-xs text-[#64748b]">
              Update your primary email for order updates and receipts.
            </p>
          </DialogHeader>

          <form onSubmit={handleSaveEmail} className="space-y-4 pt-3">
            <div>
              <label className="block text-[12.5px] font-semibold text-[#1e293b] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="e.g. name@example.com"
                className="w-full h-11 px-3.5 rounded-[10px] border border-gray-200 focus:border-[#111344] focus:ring-2 focus:ring-[#111344]/10 outline-none text-[14px] text-[#0f172a]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEmailModalOpen(false)}
                className="rounded-[6px] h-10 px-4 text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-[6px] h-10 px-5 text-xs font-semibold bg-[#111344] hover:bg-[#0C1172] text-white"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Email"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ======================================================== */}
      {/* POP-UP MODAL 3: CHANGE PASSWORD                          */}
      {/* ======================================================== */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="rounded-[24px] max-w-[92vw] sm:max-w-[420px] p-6 font-manrope">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl font-bold text-[#0f172a]">
              Change Password
            </DialogTitle>
            <p className="text-xs text-[#64748b]">
              Enter your current password and choose a new secure password.
            </p>
          </DialogHeader>

          <form onSubmit={handleSavePassword} className="space-y-3.5 pt-3">
            <div>
              <label className="block text-[12.5px] font-semibold text-[#1e293b] mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                placeholder="••••••••••••"
                className="w-full h-10 px-3.5 rounded-[10px] border border-gray-200 focus:border-[#111344] focus:ring-2 focus:ring-[#111344]/10 outline-none text-[14px] text-[#0f172a]"
              />
            </div>

            <div>
              <label className="block text-[12.5px] font-semibold text-[#1e293b] mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="At least 6 characters"
                className="w-full h-10 px-3.5 rounded-[10px] border border-gray-200 focus:border-[#111344] focus:ring-2 focus:ring-[#111344]/10 outline-none text-[14px] text-[#0f172a]"
              />
            </div>

            <div>
              <label className="block text-[12.5px] font-semibold text-[#1e293b] mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="Re-enter new password"
                className="w-full h-10 px-3.5 rounded-[10px] border border-gray-200 focus:border-[#111344] focus:ring-2 focus:ring-[#111344]/10 outline-none text-[14px] text-[#0f172a]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPasswordModalOpen(false)}
                className="rounded-[6px] h-10 px-4 text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-[6px] h-10 px-5 text-xs font-semibold bg-[#111344] hover:bg-[#0C1172] text-white"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Password"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ======================================================== */}
      {/* POP-UP MODAL 4: EDIT DELIVERY ADDRESS                    */}
      {/* ======================================================== */}
      <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
        <DialogContent className="rounded-[24px] max-w-[92vw] sm:max-w-[460px] p-6 sm:p-7 font-manrope">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-xl sm:text-2xl font-bold text-[#0f172a]">
              {selectedAddressToEdit ? "Edit Delivery Address" : "Add Delivery Address"}
            </DialogTitle>
            <p className="text-xs sm:text-[13px] text-[#64748b] leading-relaxed pt-0.5">
              Used for door-to-door delivery, POD dispatch, and trade-in device pickup.
            </p>
          </DialogHeader>

          <form onSubmit={handleSaveAddress} className="space-y-4 pt-3">
            <div>
              <label className="block text-[12.5px] font-semibold text-[#1e293b] mb-1.5">
                House / Street Address
              </label>
              <input
                type="text"
                required
                value={addressForm.address}
                onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                placeholder="e.g. 2, Bolarinwa street, Ipaja"
                className="w-full h-11 px-3.5 rounded-[12px] border border-gray-200 focus:border-[#3b82f6] focus:ring-4 focus:ring-[#3b82f6]/10 outline-none text-[14.5px] text-[#0f172a] transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-[12.5px] font-semibold text-[#1e293b] mb-1.5">
                  City / LGA
                </label>
                <input
                  type="text"
                  required
                  value={addressForm.lga}
                  onChange={(e) => setAddressForm({ ...addressForm, lga: e.target.value })}
                  placeholder="e.g. Alimosho / Ipaja"
                  className="w-full h-11 px-3.5 rounded-[12px] border border-gray-200 focus:border-[#3b82f6] focus:ring-4 focus:ring-[#3b82f6]/10 outline-none text-[14.5px] text-[#0f172a] transition-all"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-[#1e293b] mb-1.5">
                  State
                </label>
                <input
                  type="text"
                  required
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                  placeholder="e.g. Lagos"
                  className="w-full h-11 px-3.5 rounded-[12px] border border-gray-200 focus:border-[#3b82f6] focus:ring-4 focus:ring-[#3b82f6]/10 outline-none text-[14.5px] text-[#0f172a] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12.5px] font-semibold text-[#1e293b] mb-1.5">
                Delivery Phone Number
              </label>
              <input
                type="tel"
                value={addressForm.phone}
                onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                placeholder="e.g. 08012345678"
                className="w-full h-11 px-3.5 rounded-[12px] border border-gray-200 focus:border-[#3b82f6] focus:ring-4 focus:ring-[#3b82f6]/10 outline-none text-[14.5px] text-[#0f172a] transition-all"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsAddressModalOpen(false)}
                className="rounded-[20px] h-10 px-4 text-xs sm:text-sm font-semibold text-[#64748b] hover:text-[#0f172a]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-[20px] h-10 px-6 text-xs sm:text-sm font-bold bg-[#111344] hover:bg-[#0C1172] text-white transition-all shadow-sm"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Save Address"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ======================================================== */}
      {/* LOGOUT CONFIRMATION DIALOG                               */}
      {/* ======================================================== */}
      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent className="rounded-[20px] max-w-[90vw] sm:max-w-[400px] p-6 font-manrope">
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
