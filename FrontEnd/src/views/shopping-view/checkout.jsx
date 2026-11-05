'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { createNewOrder, resetApprovalURL } from "@/store/shop/order-slice";
import { fetchAllAddresses } from "@/store/shop/address-slice";
import {
  fetchDeliverySettings,
  getDeliveryPrice,
  getEstimatedDeliveryTime,
} from "../../services/delivery-service";
import {
  Truck,
  CreditCard,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Lock,
  ChevronRight,
  Plus,
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

  const { cartItems } = useSelector((state) => state.shopCart);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const { addressList = [] } = useSelector(
    (state) => state.shopAddress || state.address || {}
  );

  // Stepper: 'address' (Step 1) -> 'payment' (Step 2)
  const [currentStep, setCurrentStep] = useState("address");
  const [isPaymentStart, setIsPaymentStart] = useState(false);

  // Mode for authenticated users: toggle between selected address card and edit form
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Selected address for logged-in user
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);

  // Unified delivery address form (exact match with User Profile form in account.jsx)
  const [addressForm, setAddressForm] = useState({
    fullName: user?.userName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    state: "Lagos",
    lga: "",
    notes: "",
  });

  // Dynamic delivery settings from DB
  const [deliverySettings, setDeliverySettings] = useState({
    lagosFee: 10000,
    outsideLagosFee: 20000,
    freeDeliveryThreshold: 0,
    estimatedDaysLagos: "Same Day Delivery",
    estimatedDaysOutside: "1-2 Business Days",
  });

  const currentUserId = user?.id || user?.Id || user?._id;

  // Load cart items, addresses & delivery settings on mount
  useEffect(() => {
    dispatch(fetchCartItems());
    fetchDeliverySettings().then((settings) => {
      if (settings) setDeliverySettings(settings);
    });
    if (currentUserId) {
      dispatch(fetchAllAddresses(currentUserId));
    }
  }, [dispatch, currentUserId]);

  // Sync user profile data to address form when auth loads
  useEffect(() => {
    if (user) {
      setAddressForm((prev) => ({
        ...prev,
        fullName: prev.fullName || user?.userName || "",
        email: prev.email || user?.email || "",
        phone: prev.phone || user?.phone || "",
      }));
    }
  }, [user]);

  // Auto-select primary saved address for authenticated member
  useEffect(() => {
    if (addressList && addressList.length > 0 && !currentSelectedAddress) {
      const primary = addressList[0];
      setCurrentSelectedAddress(primary);
      setAddressForm((prev) => ({
        ...prev,
        address: primary.address || prev.address,
        lga: primary.lga || prev.lga,
        state: primary.state || prev.state,
        phone: primary.phone || prev.phone,
      }));
    }
  }, [addressList, currentSelectedAddress]);

  // Handle Paystack approval redirect
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

  // Active state for shipping rates
  const activeState =
    isAuthenticated && currentSelectedAddress && !isEditingAddress
      ? currentSelectedAddress.state
      : addressForm.state || "Lagos";

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

  // Active confirmed address object (used in Step 2 review card)
  const confirmedAddress =
    isAuthenticated && currentSelectedAddress && !isEditingAddress
      ? {
          fullName:
            currentSelectedAddress?.fullName || user?.userName || addressForm.fullName || "Member",
          address: currentSelectedAddress?.address || addressForm.address,
          lga: currentSelectedAddress?.lga || addressForm.lga,
          state: currentSelectedAddress?.state || addressForm.state,
          phone: currentSelectedAddress?.phone || addressForm.phone || user?.phone || "",
          email: user?.email || addressForm.email || "",
          notes: currentSelectedAddress?.notes || addressForm.notes || "",
        }
      : {
          fullName: addressForm.fullName,
          address: addressForm.address,
          lga: addressForm.lga,
          state: addressForm.state,
          phone: addressForm.phone,
          email: addressForm.email,
          notes: addressForm.notes,
        };

  // Step 1 validation: Continue to Step 2
  const handleProceedToPayment = () => {
    // If authenticated and has a selected address and not currently editing, proceed directly
    if (isAuthenticated && currentSelectedAddress && !isEditingAddress) {
      setCurrentStep("payment");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Validate form fields matching Profile requirements
    if (!addressForm.address.trim()) {
      toast({
        title: "House / Street address required",
        description: "Please enter your delivery street address.",
        variant: "destructive",
      });
      return;
    }
    if (!addressForm.lga.trim()) {
      toast({
        title: "City / LGA required",
        description: "Please enter your City or Local Government Area.",
        variant: "destructive",
      });
      return;
    }
    if (!addressForm.state.trim()) {
      toast({
        title: "State required",
        description: "Please select your delivery state.",
        variant: "destructive",
      });
      return;
    }
    if (!addressForm.fullName.trim()) {
      toast({
        title: "Recipient name required",
        description: "Please enter the recipient full name.",
        variant: "destructive",
      });
      return;
    }
    if (!addressForm.phone.trim()) {
      toast({
        title: "Delivery phone required",
        description: "Our dispatch rider needs your contact phone number.",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!addressForm.email.trim() || !emailRegex.test(addressForm.email.trim())) {
      toast({
        title: "Valid email required",
        description: "Please enter a valid email to receive your order receipt.",
        variant: "destructive",
      });
      return;
    }

    // If member edited address manually, sync to currentSelectedAddress
    if (isAuthenticated) {
      setCurrentSelectedAddress({
        _id: currentSelectedAddress?._id,
        ...addressForm,
      });
      setIsEditingAddress(false);
    }

    setCurrentStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Step 2: Final Payment via Paystack
  const handleInitiatePaystackPayment = async () => {
    if (!cartItems || cartItems.length === 0) {
      toast({
        title: "Your cart is empty",
        description: "Please add items to your cart before proceeding.",
        variant: "destructive",
      });
      return;
    }

    let finalUserId;
    let finalPayerId;
    let finalAddressInfo;

    if (isAuthenticated) {
      finalUserId = user?.id;
      finalPayerId = user?.email || addressForm.email;
      finalAddressInfo = {
        addressId: currentSelectedAddress?._id,
        fullName: confirmedAddress.fullName,
        address: confirmedAddress.address,
        lga: confirmedAddress.lga,
        state: confirmedAddress.state,
        phone: confirmedAddress.phone,
        country: "Nigeria",
        notes: confirmedAddress.notes,
        email: finalPayerId,
      };
    } else {
      finalUserId = getOrCreateSessionId();
      finalPayerId = addressForm.email.trim().toLowerCase();
      finalAddressInfo = {
        fullName: addressForm.fullName.trim(),
        email: finalPayerId,
        phone: addressForm.phone.trim(),
        address: addressForm.address.trim(),
        state: addressForm.state,
        lga: addressForm.lga.trim(),
        notes: addressForm.notes.trim(),
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

      if (!data?.success) {
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

  // If cart is completely empty, show empty state cleanly
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
                Checkout
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                {currentStep === "address"
                  ? "Step 1 of 2: Enter delivery address & contact details"
                  : "Step 2 of 2: Review order details and complete payment"}
              </p>
            </div>

            {/* Clean 2-Step Pill Bar */}
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
        {/* STEP 1: DELIVERY ADDRESS & CONTACT (IN ONE SINGLE CARD FRAME)             */}
        {/* ========================================================================= */}
        {currentStep === "address" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
            {/* Left 2 Columns: Single Card Frame matching User Profile (account.jsx) */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-[22px] border border-gray-200/80 p-5 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
                {/* Header Row */}
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-gray-100">
                  <h2 className="text-[18px] sm:text-[20px] font-bold text-[#0f172a]">
                    Delivery Address
                  </h2>

                  {/* Header Actions */}
                  {isAuthenticated && addressList && addressList.length > 0 && !isEditingAddress ? (
                    <button
                      type="button"
                      onClick={() => setIsEditingAddress(true)}
                      className="text-[#0f172a] hover:text-[#111344] font-bold text-[13.5px] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Update address</span>
                    </button>
                  ) : !isAuthenticated ? (
                    <button
                      type="button"
                      onClick={() => navigate("/auth/login")}
                      className="text-[#0f172a] hover:text-[#111344] font-bold text-[13px] hover:underline cursor-pointer transition-colors"
                    >
                      Have an account? Log in
                    </button>
                  ) : isEditingAddress ? (
                    <button
                      type="button"
                      onClick={() => setIsEditingAddress(false)}
                      className="text-[#64748b] hover:text-[#0f172a] font-bold text-[13px] cursor-pointer transition-colors"
                    >
                      Cancel edit
                    </button>
                  ) : null}
                </div>

                {/* Body Content */}
                {isAuthenticated && currentSelectedAddress && !isEditingAddress ? (
                  /* Saved Address Display (Zero nested card boxes, clean and minimal) */
                  <div className="space-y-3 pt-1">
                    <span className="block text-[12px] font-medium text-[#94a3b8]">
                      Primary Shipping Destination
                    </span>

                    <div className="space-y-1">
                      <p className="font-bold text-[15px] sm:text-[16px] text-[#0f172a] leading-snug">
                        {currentSelectedAddress.address}
                      </p>
                      <p className="text-[14px] text-[#64748b]">
                        {currentSelectedAddress.lga}, {currentSelectedAddress.state}, Nigeria
                      </p>
                      {currentSelectedAddress.phone && (
                        <p className="text-[12px] text-[#94a3b8] pt-0.5">
                          Contact:{" "}
                          <span className="font-semibold text-[#0f172a]">
                            {currentSelectedAddress.phone}
                          </span>
                        </p>
                      )}
                    </div>

                    {/* Quick switch between multiple saved addresses */}
                    {addressList.length > 1 && (
                      <div className="pt-3 border-t border-gray-100 flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] text-[#94a3b8] font-semibold">
                          Switch Destination:
                        </span>
                        {addressList.map((addr, idx) => {
                          const isActive = currentSelectedAddress?._id === addr._id;
                          return (
                            <button
                              key={addr._id || idx}
                              type="button"
                              onClick={() => {
                                setCurrentSelectedAddress(addr);
                                setAddressForm((prev) => ({
                                  ...prev,
                                  address: addr.address || prev.address,
                                  lga: addr.lga || prev.lga,
                                  state: addr.state || prev.state,
                                  phone: addr.phone || prev.phone,
                                }));
                              }}
                              className={`px-3 py-1 rounded-[6px] text-[12px] font-semibold border transition-all cursor-pointer ${
                                isActive
                                  ? "bg-[#111344] text-white border-[#111344]"
                                  : "bg-white text-[#64748b] border-[#e5e7eb] hover:border-[#111344] hover:text-[#111344]"
                              }`}
                            >
                              {addr.lga || `Address ${idx + 1}`}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Address Input Form (Exact match with user profile modal dialog) */
                  <div className="space-y-4 pt-1">
                    {/* House / Street Address */}
                    <div>
                      <label className="block text-[12.5px] font-semibold text-[#1e293b] mb-1.5">
                        House / Street Address
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.address}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, address: e.target.value })
                        }
                        placeholder="e.g. 2, Bolarinwa street, Ipaja"
                        className="w-full h-11 px-3.5 rounded-[12px] border border-gray-200 focus:border-[#3b82f6] focus:ring-4 focus:ring-[#3b82f6]/10 outline-none text-[14.5px] text-[#0f172a] transition-all bg-white"
                      />
                    </div>

                    {/* City / LGA & State (2 columns) */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-[12.5px] font-semibold text-[#1e293b] mb-1.5">
                          City / LGA
                        </label>
                        <input
                          type="text"
                          required
                          value={addressForm.lga}
                          onChange={(e) =>
                            setAddressForm({ ...addressForm, lga: e.target.value })
                          }
                          placeholder="e.g. Alimosho / Ipaja"
                          className="w-full h-11 px-3.5 rounded-[12px] border border-gray-200 focus:border-[#3b82f6] focus:ring-4 focus:ring-[#3b82f6]/10 outline-none text-[14.5px] text-[#0f172a] transition-all bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[12.5px] font-semibold text-[#1e293b] mb-1.5">
                          State
                        </label>
                        <select
                          value={addressForm.state}
                          onChange={(e) =>
                            setAddressForm({ ...addressForm, state: e.target.value })
                          }
                          className="w-full h-11 px-3.5 rounded-[12px] border border-gray-200 focus:border-[#3b82f6] focus:ring-4 focus:ring-[#3b82f6]/10 outline-none text-[14.5px] text-[#0f172a] transition-all bg-white"
                        >
                          {NIGERIAN_STATES.map((stateName) => (
                            <option key={stateName} value={stateName}>
                              {stateName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Recipient Full Name & Delivery Phone (2 columns) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-[12.5px] font-semibold text-[#1e293b] mb-1.5">
                          Recipient Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={addressForm.fullName}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              fullName: e.target.value,
                            })
                          }
                          placeholder="e.g. Chidi Obi"
                          className="w-full h-11 px-3.5 rounded-[12px] border border-gray-200 focus:border-[#3b82f6] focus:ring-4 focus:ring-[#3b82f6]/10 outline-none text-[14.5px] text-[#0f172a] transition-all bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[12.5px] font-semibold text-[#1e293b] mb-1.5">
                          Delivery Phone Number
                        </label>
                        <input
                          type="tel"
                          required
                          value={addressForm.phone}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              phone: e.target.value,
                            })
                          }
                          placeholder="e.g. 08012345678"
                          className="w-full h-11 px-3.5 rounded-[12px] border border-gray-200 focus:border-[#3b82f6] focus:ring-4 focus:ring-[#3b82f6]/10 outline-none text-[14.5px] text-[#0f172a] transition-all bg-white"
                        />
                      </div>
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block text-[12.5px] font-semibold text-[#1e293b] mb-1.5">
                        Email Address (Receipt & Tracking)
                      </label>
                      <input
                        type="email"
                        required
                        value={addressForm.email}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, email: e.target.value })
                        }
                        placeholder="e.g. chidi@gmail.com"
                        className="w-full h-11 px-3.5 rounded-[12px] border border-gray-200 focus:border-[#3b82f6] focus:ring-4 focus:ring-[#3b82f6]/10 outline-none text-[14.5px] text-[#0f172a] transition-all bg-white"
                      />
                    </div>

                    {/* Delivery Notes */}
                    <div>
                      <label className="block text-[12.5px] font-semibold text-[#1e293b] mb-1.5">
                        Delivery Notes / Instructions{" "}
                        <span className="text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={addressForm.notes}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, notes: e.target.value })
                        }
                        placeholder="e.g. Call before arrival, leave with security gate"
                        className="w-full h-11 px-3.5 rounded-[12px] border border-gray-200 focus:border-[#3b82f6] focus:ring-4 focus:ring-[#3b82f6]/10 outline-none text-[14.5px] text-[#0f172a] transition-all bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Order Preview & Proceed CTA */}
            <div className="space-y-4">
              <div className="bg-white rounded-[22px] border border-gray-200/80 p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
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
        {/* STEP 2: REVIEW & COMPLETE PAYMENT (IN ONE SINGLE CARD FRAME)              */}
        {/* ========================================================================= */}
        {currentStep === "payment" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
            {/* Left 2 Columns: Confirmed Shipping Card & Items Breakdown */}
            <div className="lg:col-span-2 space-y-5">
              {/* Confirmed Delivery Address Card (Single frame matching User Profile) */}
              <div className="bg-white rounded-[22px] border border-gray-200/80 p-5 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3">
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                    <h2 className="text-[18px] sm:text-[20px] font-bold text-[#0f172a]">
                      Delivery Address
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep("address")}
                    className="text-[#0f172a] hover:text-[#111344] font-bold text-[13.5px] cursor-pointer hover:underline transition-colors"
                  >
                    Update address
                  </button>
                </div>

                <div className="space-y-1 pt-1">
                  <p className="font-bold text-[15px] sm:text-[16px] text-[#0f172a] leading-snug">
                    {confirmedAddress.address || "Street Address Not Provided"}
                  </p>
                  <p className="text-[14px] text-[#64748b]">
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
                        Receipt:{" "}
                        <span className="font-semibold text-[#0f172a]">
                          {confirmedAddress.email}
                        </span>
                      </span>
                    )}
                  </div>
                  {confirmedAddress.notes && (
                    <p className="text-[12px] text-[#64748b] pt-1">
                      Note: {confirmedAddress.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Items Breakdown */}
              <div className="bg-white rounded-[22px] border border-gray-200/80 p-5 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
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
              <div className="bg-white rounded-[22px] border border-gray-200/80 p-5 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3">
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
              <div className="bg-white rounded-[22px] border border-gray-200/80 p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
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
