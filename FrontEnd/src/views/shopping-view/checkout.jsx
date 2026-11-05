'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { createNewOrder, resetApprovalURL } from "@/store/shop/order-slice";
import Address from "@/components/shopping-view/address";
import {
  fetchDeliverySettings,
  getDeliveryPrice,
  getEstimatedDeliveryTime,
} from "../../services/delivery-service";
import {
  Truck,
  Package,
  CreditCard,
  CheckCircle,
  LogIn,
  AlertCircle,
  Mail,
  User,
  Phone,
  MapPin,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Lock,
  ChevronRight,
  Building,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { getOrCreateSessionId } from "@/components/utils/session";

const NIGERIAN_STATES = [
  "Lagos",
  "Abuja (FCT)",
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

function ShoppingCheckout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { cartItems, isLoading } = useSelector((state) => state.shopCart);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);

  // Stepper: 'address' (Step 1) -> 'payment' (Step 2)
  const [currentStep, setCurrentStep] = useState("address");
  const [isPaymentStart, setIsPaymentStart] = useState(false);

  // Authenticated user selected address
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);

  // Dynamic delivery settings from DB
  const [deliverySettings, setDeliverySettings] = useState({
    lagosFee: 10000,
    outsideLagosFee: 20000,
    freeDeliveryThreshold: 0,
    estimatedDaysLagos: "Same Day Delivery",
    estimatedDaysOutside: "1-2 Business Days",
  });

  // Guest checkout form data
  const [guestFormData, setGuestFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    state: "Lagos",
    lga: "",
    notes: "",
  });

  // Load cart items & dynamic delivery settings on mount
  useEffect(() => {
    dispatch(fetchCartItems());
    fetchDeliverySettings().then((settings) => {
      if (settings) setDeliverySettings(settings);
    });
  }, [dispatch]);

  // Handle Paystack approval URL redirect
  useEffect(() => {
    if (approvalURL && isPaymentStart) {
      dispatch(resetApprovalURL());
      window.location.href = approvalURL;
    }
  }, [approvalURL, isPaymentStart, dispatch]);

  // Cart total calculations
  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, item) =>
            sum +
            (item?.salePrice > 0 ? item?.salePrice : item?.price) *
              item?.quantity,
          0
        )
      : 0;

  // Active state for delivery rate
  const activeState = isAuthenticated
    ? currentSelectedAddress?.state || "Lagos"
    : guestFormData.state || "Lagos";

  const deliveryPrice = getDeliveryPrice(
    activeState,
    deliverySettings,
    totalCartAmount
  );
  const estimatedDeliveryTime = getEstimatedDeliveryTime(
    activeState,
    deliverySettings
  );
  const totalAmountWithDelivery = totalCartAmount + deliveryPrice;

  // Active confirmed address object (for Step 2 summary card)
  const confirmedAddress = isAuthenticated
    ? {
        fullName: currentSelectedAddress?.fullName || user?.userName || "Member",
        address: currentSelectedAddress?.address || "",
        lga: currentSelectedAddress?.lga || "",
        state: currentSelectedAddress?.state || "Lagos",
        phone: currentSelectedAddress?.phone || "",
        email: user?.email || "",
        notes: currentSelectedAddress?.notes || "",
      }
    : {
        fullName: guestFormData.fullName,
        address: guestFormData.address,
        lga: guestFormData.lga,
        state: guestFormData.state,
        phone: guestFormData.phone,
        email: guestFormData.email,
        notes: guestFormData.notes,
      };

  // Step 1 validation: Proceed to Step 2
  const handleProceedToPayment = () => {
    if (isAuthenticated) {
      if (!currentSelectedAddress) {
        toast({
          title: "Select delivery address",
          description: "Please select or add a delivery address to proceed.",
          variant: "destructive",
        });
        return;
      }
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!guestFormData.fullName.trim()) {
        toast({
          title: "Full Name is required",
          description: "Please enter your full name for delivery.",
          variant: "destructive",
        });
        return;
      }
      if (!guestFormData.email.trim() || !emailRegex.test(guestFormData.email.trim())) {
        toast({
          title: "Valid email required",
          description: "Please provide a valid email to receive your order receipt.",
          variant: "destructive",
        });
        return;
      }
      if (!guestFormData.phone.trim()) {
        toast({
          title: "Phone number required",
          description: "Our dispatch rider needs your contact phone number.",
          variant: "destructive",
        });
        return;
      }
      if (!guestFormData.address.trim()) {
        toast({
          title: "Delivery address required",
          description: "Please provide your street or house delivery address.",
          variant: "destructive",
        });
        return;
      }
      if (!guestFormData.lga.trim()) {
        toast({
          title: "City / LGA required",
          description: "Please provide your city or local government area.",
          variant: "destructive",
        });
        return;
      }
    }

    setCurrentStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Step 2: Final Payment Initiation via Paystack
  const handleInitiatePaystackPayment = async () => {
    if (!cartItems || cartItems.length === 0) {
      toast({
        title: "Your cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      });
      return;
    }

    let finalUserId;
    let finalPayerId;
    let finalAddressInfo;

    if (isAuthenticated) {
      if (!currentSelectedAddress) {
        toast({
          title: "Missing address",
          description: "Please select an address to proceed.",
          variant: "destructive",
        });
        setCurrentStep("address");
        return;
      }
      finalUserId = user?.id;
      finalPayerId = user?.email;
      finalAddressInfo = {
        addressId: currentSelectedAddress?._id,
        fullName: currentSelectedAddress?.fullName || user?.userName,
        address: currentSelectedAddress?.address,
        lga: currentSelectedAddress?.lga,
        state: currentSelectedAddress?.state,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        country: currentSelectedAddress?.country || "Nigeria",
        notes: currentSelectedAddress?.notes,
        email: user?.email,
      };
    } else {
      finalUserId = getOrCreateSessionId();
      finalPayerId = guestFormData.email.trim().toLowerCase();
      finalAddressInfo = {
        fullName: guestFormData.fullName.trim(),
        email: finalPayerId,
        phone: guestFormData.phone.trim(),
        address: guestFormData.address.trim(),
        state: guestFormData.state,
        lga: guestFormData.lga.trim(),
        notes: guestFormData.notes.trim(),
        country: "Nigeria",
      };
    }

    const cartId = `cart_${finalUserId}_${Date.now()}`;

    const orderData = {
      userId: finalUserId,
      isGuest: !isAuthenticated,
      cartId,
      cartItems: cartItems.map((item) => ({
        productId: item?.productId,
        title: item?.title,
        image: item?.image,
        price: item?.salePrice > 0 ? item?.salePrice : item?.price,
        quantity: item?.quantity,
        selectedStorage: item?.selectedStorage || "",
        selectedRam: item?.selectedRam || "",
        selectedColor: item?.selectedColor || "",
        selectedCondition: item?.selectedCondition || "",
      })),
      addressInfo: finalAddressInfo,
      orderStatus: "pending",
      paymentMethod: "paystack",
      paymentStatus: "pending",
      totalAmount: totalAmountWithDelivery,
      deliveryPrice,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: finalPayerId,
    };

    try {
      setIsPaymentStart(true);
      const data = await dispatch(createNewOrder(orderData)).unwrap();

      if (data?.success) {
        // Redirection handled by approvalURL useEffect
      } else {
        setIsPaymentStart(false);
        toast({
          title: "Payment initialization failed",
          description: data?.message || "Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Order creation error:", error);
      setIsPaymentStart(false);
      toast({
        title: "Payment error",
        description: error?.message || "Please check your network and try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="font-manrope min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="w-12 h-12 rounded-full bg-[#111344]/5 flex items-center justify-center text-[#111344] mb-3 animate-pulse">
          <Package className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-gray-900">Loading Checkout...</h2>
        <p className="text-xs text-gray-500 mt-1">Preparing your order summary</p>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="font-manrope min-h-[60vh] flex flex-col items-center justify-center px-4 text-center max-w-md mx-auto">
        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-extrabold text-[#111344]">Your Cart is Empty</h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 mb-6">
          Add items from our premium collection of smartphones, laptops, and gadgets to proceed.
        </p>
        <Button
          onClick={() => navigate("/shop/listing")}
          className="rounded-[8px] bg-[#111344] hover:bg-[#0C1172] text-white px-6 h-11 text-sm font-semibold shadow-sm"
        >
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="font-manrope bg-[#f8fafc]/60 min-h-screen py-6 sm:py-10">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* Page Title & Navigation Stepper */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#111344] tracking-tight">
                Secure Checkout
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                {currentStep === "address"
                  ? "Step 1 of 2: Enter delivery address & contact details"
                  : "Step 2 of 2: Review order details and complete payment"}
              </p>
            </div>

            {/* Modern 2-Step Pill Bar */}
            <div className="inline-flex items-center p-1 bg-white border border-gray-200 rounded-full shadow-2xs self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setCurrentStep("address")}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  currentStep === "address"
                    ? "bg-[#111344] text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                    currentStep === "address"
                      ? "bg-white text-[#111344]"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  1
                </span>
                <span>Delivery Address</span>
              </button>

              <ChevronRight className="w-3.5 h-3.5 text-gray-300 mx-0.5" />

              <button
                type="button"
                onClick={handleProceedToPayment}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  currentStep === "payment"
                    ? "bg-[#111344] text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                    currentStep === "payment"
                      ? "bg-white text-[#111344]"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  2
                </span>
                <span>Review & Pay</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP 1: DELIVERY ADDRESS & CONTACT INFORMATION                             */}
        {/* ========================================================================= */}
        {currentStep === "address" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
            {/* Left 2 Columns: Address Input / Selection */}
            <div className="lg:col-span-2 space-y-4">
              {isAuthenticated ? (
                /* Authenticated User: Saved Address Selector */
                <div className="bg-white rounded-[16px] border border-[#e5e7eb] p-5 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
                  <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-[#0f172a] flex items-center gap-2">
                        <Truck className="w-5 h-5 text-[#111344]" />
                        Select Delivery Address
                      </h2>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Choose where you want your order delivered.
                      </p>
                    </div>
                  </div>

                  <Address
                    selectedId={currentSelectedAddress}
                    setCurrentSelectedAddress={setCurrentSelectedAddress}
                  />
                </div>
              ) : (
                /* Guest User: Direct Contact & Shipping Form */
                <div className="space-y-4">
                  {/* Subtle Log-in Banner */}
                  <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/60 border border-blue-200/70 rounded-[14px] p-4 flex items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#111344] text-white flex items-center justify-center shrink-0">
                        <LogIn className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-gray-900">
                          Checking out as a Guest
                        </p>
                        <p className="text-[11px] sm:text-xs text-gray-600">
                          Already have an account? Log in to use your saved addresses.
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("/auth/login")}
                      className="text-xs font-semibold bg-white border-gray-300 text-[#111344] hover:bg-gray-100 rounded-[8px] shrink-0"
                    >
                      Log in
                    </Button>
                  </div>

                  {/* Guest Address Form */}
                  <div className="bg-white rounded-[16px] border border-[#e5e7eb] p-5 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-5">
                    <div className="border-b border-gray-100 pb-3">
                      <h2 className="text-base sm:text-lg font-bold text-[#0f172a] flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-[#111344]" />
                        Delivery Details
                      </h2>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Please provide your contact information for dispatch and tracking updates.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Full Name */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={guestFormData.fullName}
                            onChange={(e) =>
                              setGuestFormData({
                                ...guestFormData,
                                fullName: e.target.value,
                              })
                            }
                            placeholder="e.g. Chidi Obi"
                            className="w-full h-11 pl-10 pr-3 rounded-[10px] border border-gray-300 text-sm font-medium text-gray-900 focus:outline-none focus:border-[#111344] focus:ring-2 focus:ring-[#111344]/10 transition-all bg-white"
                            required
                          />
                        </div>
                      </div>

                      {/* Email & Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="email"
                              value={guestFormData.email}
                              onChange={(e) =>
                                setGuestFormData({
                                  ...guestFormData,
                                  email: e.target.value,
                                })
                              }
                              placeholder="chidi@gmail.com"
                              className="w-full h-11 pl-10 pr-3 rounded-[10px] border border-gray-300 text-sm font-medium text-gray-900 focus:outline-none focus:border-[#111344] focus:ring-2 focus:ring-[#111344]/10 transition-all bg-white"
                              required
                            />
                          </div>
                          <span className="text-[11px] text-gray-500 mt-1 block">
                            Receipt and delivery tracking link sent here
                          </span>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                            Phone Number <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="tel"
                              value={guestFormData.phone}
                              onChange={(e) =>
                                setGuestFormData({
                                  ...guestFormData,
                                  phone: e.target.value,
                                })
                              }
                              placeholder="08012345678"
                              className="w-full h-11 pl-10 pr-3 rounded-[10px] border border-gray-300 text-sm font-medium text-gray-900 focus:outline-none focus:border-[#111344] focus:ring-2 focus:ring-[#111344]/10 transition-all bg-white"
                              required
                            />
                          </div>
                          <span className="text-[11px] text-gray-500 mt-1 block">
                            For dispatch rider contact
                          </span>
                        </div>
                      </div>

                      {/* Street Address */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                          Delivery Street Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                          <input
                            type="text"
                            value={guestFormData.address}
                            onChange={(e) =>
                              setGuestFormData({
                                ...guestFormData,
                                address: e.target.value,
                              })
                            }
                            placeholder="e.g. 15 Admiralty Way, Lekki Phase 1"
                            className="w-full h-11 pl-10 pr-3 rounded-[10px] border border-gray-300 text-sm font-medium text-gray-900 focus:outline-none focus:border-[#111344] focus:ring-2 focus:ring-[#111344]/10 transition-all bg-white"
                            required
                          />
                        </div>
                      </div>

                      {/* State & City/LGA */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                            State <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={guestFormData.state}
                            onChange={(e) =>
                              setGuestFormData({
                                ...guestFormData,
                                state: e.target.value,
                              })
                            }
                            className="w-full h-11 px-3.5 rounded-[10px] border border-gray-300 text-sm font-medium text-gray-900 bg-white focus:outline-none focus:border-[#111344] focus:ring-2 focus:ring-[#111344]/10 transition-all"
                          >
                            {NIGERIAN_STATES.map((stateName) => (
                              <option key={stateName} value={stateName}>
                                {stateName}
                              </option>
                            ))}
                          </select>
                          <span className="text-[11px] text-gray-500 mt-1 block font-medium">
                            {estimatedDeliveryTime} · ₦{deliveryPrice.toLocaleString("en-NG")}
                          </span>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                            City / LGA <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Building className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={guestFormData.lga}
                              onChange={(e) =>
                                setGuestFormData({
                                  ...guestFormData,
                                  lga: e.target.value,
                                })
                              }
                              placeholder="e.g. Ikeja, Eti-Osa, Port Harcourt"
                              className="w-full h-11 pl-10 pr-3 rounded-[10px] border border-gray-300 text-sm font-medium text-gray-900 focus:outline-none focus:border-[#111344] focus:ring-2 focus:ring-[#111344]/10 transition-all bg-white"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Delivery Notes */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                          Delivery Notes / Instructions{" "}
                          <span className="text-gray-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={guestFormData.notes}
                          onChange={(e) =>
                            setGuestFormData({
                              ...guestFormData,
                              notes: e.target.value,
                            })
                          }
                          placeholder="e.g. Call before arrival, leave with security gate"
                          className="w-full h-11 px-3.5 rounded-[10px] border border-gray-300 text-sm font-medium text-gray-900 focus:outline-none focus:border-[#111344] focus:ring-2 focus:ring-[#111344]/10 transition-all bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Order Preview & Proceed CTA */}
            <div className="space-y-4">
              <div className="bg-white rounded-[16px] border border-[#e5e7eb] p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
                <h3 className="text-base font-bold text-[#111344]">
                  Order Overview
                </h3>

                <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div
                      key={item._id || item.productId}
                      className="py-2.5 flex items-center gap-3"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-11 h-11 rounded-[8px] object-cover bg-gray-50 border border-gray-100 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-gray-900 truncate">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          Qty: {item.quantity} · ₦
                          {(item.salePrice > 0
                            ? item.salePrice
                            : item.price
                          ).toLocaleString("en-NG")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-gray-100 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Items Subtotal</span>
                    <span className="font-bold text-gray-900">
                      ₦{totalCartAmount.toLocaleString("en-NG")}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Estimated Shipping ({activeState})</span>
                    <span className="font-bold text-gray-900">
                      ₦{deliveryPrice.toLocaleString("en-NG")}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-100 flex justify-between text-sm font-bold">
                    <span className="text-[#111344]">Estimated Total</span>
                    <span className="text-[#111344]">
                      ₦{totalAmountWithDelivery.toLocaleString("en-NG")}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleProceedToPayment}
                  className="w-full h-12 bg-[#111344] hover:bg-[#0C1172] text-white rounded-[8px] font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all mt-2"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Security Pill */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Genuine Devices · Insured Waybill</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: REVIEW ORDER & COMPLETE PAYMENT                                   */}
        {/* ========================================================================= */}
        {currentStep === "payment" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
            {/* Left 2 Columns: Confirmed Shipping Card & Items Breakdown */}
            <div className="lg:col-span-2 space-y-5">
              {/* Confirmed Shipping Destination Card (matching Homepage / Profile specification) */}
              <div className="border border-[#e5e7eb] rounded-[16px] p-5 sm:p-6 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                    <span className="text-[11px] sm:text-[12px] font-bold text-[#64748b] uppercase tracking-wider">
                      Shipping Destination
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep("address")}
                    className="text-[#111344] hover:text-[#0C1172] font-bold text-[13px] cursor-pointer hover:underline transition-colors flex items-center gap-1"
                  >
                    Update address
                  </button>
                </div>

                <div className="space-y-1 pt-1">
                  <p className="font-bold text-[15px] sm:text-[16px] text-[#0f172a] leading-snug">
                    {confirmedAddress.address || "Street Address Not Provided"}
                  </p>
                  <p className="text-[13.5px] sm:text-[14px] text-[#64748b]">
                    {confirmedAddress.lga ? `${confirmedAddress.lga}, ` : ""}
                    {confirmedAddress.state}, Nigeria
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[#94a3b8] pt-1">
                    <span>
                      Recipient:{" "}
                      <span className="font-semibold text-[#0f172a]">
                        {confirmedAddress.fullName}
                      </span>
                    </span>
                    <span>
                      Contact:{" "}
                      <span className="font-semibold text-[#0f172a]">
                        {confirmedAddress.phone}
                      </span>
                    </span>
                    {confirmedAddress.email && (
                      <span>
                        Receipt to:{" "}
                        <span className="font-semibold text-[#0f172a]">
                          {confirmedAddress.email}
                        </span>
                      </span>
                    )}
                  </div>
                  {confirmedAddress.notes && (
                    <p className="text-[12px] text-amber-700 bg-amber-50/70 p-2 rounded-[8px] mt-2 border border-amber-200/50">
                      Note: {confirmedAddress.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Items Breakdown */}
              <div className="bg-white rounded-[16px] border border-[#e5e7eb] p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="text-base font-bold text-[#111344]">
                    Items in Your Order ({cartItems.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => navigate("/shop/listing")}
                    className="text-xs font-semibold text-gray-500 hover:text-[#111344] transition-colors"
                  >
                    + Add more items
                  </button>
                </div>

                <div className="divide-y divide-gray-100 space-y-1">
                  {cartItems.map((item) => (
                    <div
                      key={item._id || item.productId}
                      className="py-3 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-14 h-14 rounded-[10px] object-cover bg-gray-50 border border-gray-100 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {item.title}
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-gray-500 mt-0.5">
                            {item.selectedStorage && (
                              <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-700 font-medium">
                                {item.selectedStorage}
                              </span>
                            )}
                            {item.selectedRam && (
                              <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-700 font-medium">
                                {item.selectedRam} RAM
                              </span>
                            )}
                            {item.selectedColor && (
                              <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-700 font-medium">
                                {item.selectedColor}
                              </span>
                            )}
                            {item.selectedCondition && (
                              <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-700 font-medium capitalize">
                                {item.selectedCondition}
                              </span>
                            )}
                            <span>· Qty: {item.quantity}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-[#111344]">
                          ₦
                          {(
                            (item.salePrice > 0 ? item.salePrice : item.price) *
                            item.quantity
                          ).toLocaleString("en-NG")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method Card */}
              <div className="bg-white rounded-[16px] border border-[#e5e7eb] p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#111344]" />
                    <h3 className="text-base font-bold text-gray-900">
                      Payment Method
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Paystack Verified
                  </span>
                </div>

                <div className="p-4 rounded-[12px] border-2 border-[#111344] bg-[#111344]/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#111344] text-white flex items-center justify-center font-bold text-xs">
                      ₦
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        Pay with Paystack
                      </p>
                      <p className="text-xs text-gray-600">
                        Debit / Credit Cards · Bank Transfer · USSD · Apple Pay
                      </p>
                    </div>
                  </div>
                  <Lock className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
            </div>

            {/* Right Column: Final Order Summary & Pay CTA */}
            <div className="space-y-4">
              <div className="bg-white rounded-[16px] border border-[#e5e7eb] p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
                <h3 className="text-base font-bold text-[#111344]">
                  Payment Summary
                </h3>

                <div className="space-y-2.5 text-xs sm:text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span className="font-bold text-gray-900">
                      ₦{totalCartAmount.toLocaleString("en-NG")}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-gray-500" />
                      Delivery ({confirmedAddress.state})
                    </span>
                    <span className="font-bold text-gray-900">
                      ₦{deliveryPrice.toLocaleString("en-NG")}
                    </span>
                  </div>

                  <div className="text-[11px] text-gray-500 pt-0.5">
                    Estimated Time:{" "}
                    <span className="font-semibold text-gray-800">
                      {estimatedDeliveryTime}
                    </span>
                  </div>

                  <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-[#111344]">
                      Total Payable
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-[#DF5E00]">
                      ₦{totalAmountWithDelivery.toLocaleString("en-NG")}
                    </span>
                  </div>
                </div>

                {/* Primary Pay CTA */}
                <Button
                  onClick={handleInitiatePaystackPayment}
                  disabled={isPaymentStart}
                  className="w-full h-13 py-3.5 text-sm sm:text-base font-bold bg-[#111344] hover:bg-[#0C1172] text-white rounded-[8px] shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isPaymentStart ? (
                    <span>Connecting to Paystack...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-emerald-400" />
                      <span>
                        Pay ₦{totalAmountWithDelivery.toLocaleString("en-NG")} with Paystack
                      </span>
                    </>
                  )}
                </Button>

                <button
                  type="button"
                  onClick={() => setCurrentStep("address")}
                  className="w-full text-center text-xs font-semibold text-gray-500 hover:text-[#111344] transition-colors py-1 flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Back to Delivery Details</span>
                </button>
              </div>

              {/* Trust & Guarantee Box */}
              <div className="p-4 rounded-[14px] bg-white border border-gray-200/80 space-y-2 text-[11px] text-gray-500">
                <div className="flex items-center gap-2 text-gray-800 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Mobiletrends Buyer Protection</span>
                </div>
                <p>
                  Orders are dispatched within 24 hours. Full transit insurance coverage applies until delivery.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShoppingCheckout;
