'use client';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { createNewOrder, resetApprovalURL } from "@/store/shop/order-slice";
import Address from "@/components/shopping-view/address";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { getDeliveryPrice } from "../../services/delivery-service";
import { Truck, Package, CreditCard, CheckCircle, LogIn, AlertCircle, Mail, User, Phone, MapPin } from "lucide-react";
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
  const { cartItems, isLoading } = useSelector((state) => state.shopCart);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { approvalURL, orderId } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Guest checkout state
  const [guestFormData, setGuestFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    state: "Lagos",
    lga: "",
    notes: "",
  });

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  useEffect(() => {
    if (approvalURL && isPaymentStart) {
      console.log('Redirecting to Paystack:', approvalURL);
      dispatch(resetApprovalURL());
      window.location.href = approvalURL;
    }
  }, [approvalURL, isPaymentStart, dispatch]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <Package className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
            <h2 className="text-xl font-bold text-blue-800 mb-2">
              Loading Your Cart...
            </h2>
            <div className="text-[11px] sm:text-xs text-gray-500 font-medium bg-gray-50/80 p-3 rounded-xl border border-gray-100 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Truck className="h-3.5 w-3.5 text-[#111344]" />
                <span>Lagos: <span className="text-gray-900 font-bold">Same Day Delivery</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-3.5 w-3.5 text-[#111344]" />
                <span>Outside Lagos: <span className="text-gray-900 font-bold">1-2 Business Days</span></span>
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-yellow-800 mb-2">
              Your Cart is Empty
            </h2>
            <p className="text-yellow-700 mb-4">
              Please add some items to your cart before proceeding to checkout.
            </p>
            <Button
              onClick={() => navigate("/shop/listing")}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const totalCartAmount = cartItems.reduce(
    (sum, currentItem) =>
      sum +
      (currentItem?.salePrice > 0
        ? currentItem?.salePrice
        : currentItem?.price) *
      currentItem?.quantity,
    0
  );

  const activeState = isAuthenticated
    ? currentSelectedAddress?.state
    : guestFormData.state;

  const deliveryPrice = activeState ? getDeliveryPrice(activeState) : 0;
  const totalAmountWithDelivery = totalCartAmount + deliveryPrice;

  async function handleInitiatepaystackPayment() {
    if (!cartItems || cartItems.length === 0) {
      toast({
        title: "Your cart is empty, Please add items to proceed.",
        variant: "destructive",
      });
      return;
    }

    let finalUserId;
    let finalPayerId;
    let finalAddressInfo;

    if (isAuthenticated) {
      if (currentSelectedAddress === null) {
        toast({
          title: "Please select an address to proceed.",
          variant: "destructive",
        });
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
      // Guest validation
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
          description: "Please provide your street / house delivery address.",
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
    console.log('Generated cartId:', cartId);

    const orderData = {
      userId: finalUserId,
      isGuest: !isAuthenticated,
      cartId: cartId,
      cartItems: cartItems.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
        selectedStorage: singleCartItem?.selectedStorage || "",
        selectedRam: singleCartItem?.selectedRam || "",
        selectedColor: singleCartItem?.selectedColor || "",
        selectedCondition: singleCartItem?.selectedCondition || "",
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

    console.log('Order data being sent to backend:', orderData);

    try {
      setIsPaymentStart(true);
      const data = await dispatch(createNewOrder(orderData)).unwrap();

      if (data?.success) {
        console.log('Order created successfully, approval URL:', data.approvalURL);
        setCurrentStep(3);
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
        title: "Payment initialization failed",
        description: error?.message || "Please check your network and try again.",
        variant: "destructive",
      });
    }
  }

  const isFormValidForGuest =
    !isAuthenticated &&
    guestFormData.fullName.trim() &&
    guestFormData.email.trim() &&
    guestFormData.phone.trim() &&
    guestFormData.address.trim() &&
    guestFormData.lga.trim();

  const isPayButtonDisabled = isAuthenticated
    ? !currentSelectedAddress || isPaymentStart
    : !isFormValidForGuest || isPaymentStart;

  return (
    <div className="font-body container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8 relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
        <div
          className="absolute top-1/2 left-0 h-1 bg-[#111344] -z-10 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
        ></div>

        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex flex-col items-center bg-white px-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= step
              ? 'bg-[#111344] border-[#111344] text-white'
              : 'bg-white border-gray-300 text-gray-500'
              }`}>
              {step === 1 && <Package className="w-5 h-5" />}
              {step === 2 && <Truck className="w-5 h-5" />}
              {step === 3 && <CreditCard className="w-5 h-5" />}
              {step === 4 && <CheckCircle className="w-5 h-5" />}
            </div>
            <span className={`text-sm mt-2 font-medium ${currentStep >= step ? 'text-[#111344]' : 'text-gray-500'
              }`}>
              {step === 1 && 'Cart'}
              {step === 2 && 'Address'}
              {step === 3 && 'Payment'}
              {step === 4 && 'Confirm'}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {isAuthenticated ? (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#111344]" />
                Delivery Address
              </h2>
              <Address
                selectedId={currentSelectedAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Guest banner */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-xl p-4 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#111344] text-white flex items-center justify-center shrink-0">
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
                  className="text-xs font-semibold bg-white border-gray-300 text-[#111344] hover:bg-gray-100 shrink-0"
                >
                  Log in
                </Button>
              </div>

              {/* Guest shipping & contact form */}
              <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
                <div className="border-b pb-3">
                  <h2 className="text-lg font-bold text-[#0f172a] flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#111344]" />
                    Contact & Delivery Information
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Please provide your contact details for delivery updates and dispatch.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[12.5px] font-semibold text-[#0f172a] mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={guestFormData.fullName}
                        onChange={(e) =>
                          setGuestFormData({ ...guestFormData, fullName: e.target.value })
                        }
                        placeholder="e.g. Chidi Obi"
                        className="w-full h-11 pl-9 pr-3 rounded-[10px] border border-gray-300 text-sm focus:outline-none focus:border-[#111344] focus:ring-2 focus:ring-[#111344]/10 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[12.5px] font-semibold text-[#0f172a] mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={guestFormData.email}
                          onChange={(e) =>
                            setGuestFormData({ ...guestFormData, email: e.target.value })
                          }
                          placeholder="chidi@gmail.com"
                          className="w-full h-11 pl-9 pr-3 rounded-[10px] border border-gray-300 text-sm focus:outline-none focus:border-[#111344] focus:ring-2 focus:ring-[#111344]/10 transition-all"
                          required
                        />
                      </div>
                      <span className="text-[11px] text-gray-500 mt-0.5 block">
                        Receipt and tracking link sent here
                      </span>
                    </div>

                    <div>
                      <label className="block text-[12.5px] font-semibold text-[#0f172a] mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          value={guestFormData.phone}
                          onChange={(e) =>
                            setGuestFormData({ ...guestFormData, phone: e.target.value })
                          }
                          placeholder="08012345678"
                          className="w-full h-11 pl-9 pr-3 rounded-[10px] border border-gray-300 text-sm focus:outline-none focus:border-[#111344] focus:ring-2 focus:ring-[#111344]/10 transition-all"
                          required
                        />
                      </div>
                      <span className="text-[11px] text-gray-500 mt-0.5 block">
                        For dispatch rider calls
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12.5px] font-semibold text-[#0f172a] mb-1">
                      Street / House Delivery Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        value={guestFormData.address}
                        onChange={(e) =>
                          setGuestFormData({ ...guestFormData, address: e.target.value })
                        }
                        placeholder="e.g. 15 Admiralty Way, Lekki Phase 1"
                        className="w-full h-11 pl-9 pr-3 rounded-[10px] border border-gray-300 text-sm focus:outline-none focus:border-[#111344] focus:ring-2 focus:ring-[#111344]/10 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[12.5px] font-semibold text-[#0f172a] mb-1">
                        State <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={guestFormData.state}
                        onChange={(e) =>
                          setGuestFormData({ ...guestFormData, state: e.target.value })
                        }
                        className="w-full h-11 px-3 rounded-[10px] border border-gray-300 text-sm bg-white focus:outline-none focus:border-[#111344] focus:ring-2 focus:ring-[#111344]/10 transition-all"
                      >
                        {NIGERIAN_STATES.map((stateName) => (
                          <option key={stateName} value={stateName}>
                            {stateName}
                          </option>
                        ))}
                      </select>
                      <span className="text-[11px] text-gray-500 mt-0.5 block">
                        {guestFormData.state.toLowerCase() === "lagos"
                          ? "Same day delivery (₦10,000)"
                          : "1-2 days delivery (₦20,000)"}
                      </span>
                    </div>

                    <div>
                      <label className="block text-[12.5px] font-semibold text-[#0f172a] mb-1">
                        City / LGA <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={guestFormData.lga}
                        onChange={(e) =>
                          setGuestFormData({ ...guestFormData, lga: e.target.value })
                        }
                        placeholder="e.g. Ikeja, Eti-Osa, Port Harcourt"
                        className="w-full h-11 px-3.5 rounded-[10px] border border-gray-300 text-sm focus:outline-none focus:border-[#111344] focus:ring-2 focus:ring-[#111344]/10 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12.5px] font-semibold text-[#0f172a] mb-1">
                      Delivery Notes / Instructions <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={guestFormData.notes}
                      onChange={(e) =>
                        setGuestFormData({ ...guestFormData, notes: e.target.value })
                      }
                      placeholder="e.g. Leave with security, call when outside"
                      className="w-full h-11 px-3.5 rounded-[10px] border border-gray-300 text-sm focus:outline-none focus:border-[#111344] focus:ring-2 focus:ring-[#111344]/10 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-4">Order Items ({cartItems.length})</h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <UserCartItemsContent cartItem={item} key={item._id || item.productId} />
              ))}
            </div>
          </div>

          {/* Delivery Timeline Badge */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-50/80 p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#111344]">
              <Truck className="h-4 w-4" />
              <span>Same Day Delivery (Lagos)</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-300" />
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Package className="h-4 w-4" />
              <span>1-2 Days (Outside Lagos)</span>
            </div>
          </div>

          {/* Order Details Grid */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                <span className="font-bold text-[#111344]">₦{totalCartAmount.toLocaleString("en-NG")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 flex items-center gap-1">
                  <Truck className="w-4 h-4" />
                  Delivery Fee
                  {activeState && (
                    <span className="text-xs text-gray-400 ml-1">
                      ({activeState})
                    </span>
                  )}
                </span>
                <span className="font-bold text-[#111344]">₦{deliveryPrice.toLocaleString("en-NG")}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="font-bold text-[#111344]">₦{totalAmountWithDelivery.toLocaleString("en-NG")}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700">
              <div className="flex items-start gap-2">
                <Truck className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p>Lagos: <strong>Same Day Delivery</strong></p>
                  <p>Outside Lagos: <strong>1-2 Business Days</strong></p>
                  {activeState && (
                    <div className="text-xs mt-1">
                      Delivery to {activeState}: ₦{deliveryPrice.toLocaleString("en-NG")}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button
              onClick={handleInitiatepaystackPayment}
              disabled={isPayButtonDisabled}
              className="w-full mt-6 py-3 text-base font-semibold bg-[#111344] hover:bg-[#0C1172] text-white rounded-[6px]"
              size="lg"
            >
              {isPaymentStart
                ? "Processing Paystack Payment..."
                : `Pay ₦${totalAmountWithDelivery.toLocaleString("en-NG")} with Paystack`}
            </Button>

            {isAuthenticated && !currentSelectedAddress && (
              <div className="text-center text-sm text-[#111344] mt-2">
                Please select a delivery address to continue
              </div>
            )}
            {!isAuthenticated && !isFormValidForGuest && (
              <div className="text-center text-xs text-gray-500 mt-2">
                Fill in your name, email, phone, street address, and LGA to proceed to payment
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
