'use client';

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment, clearOrderStorage } from "@/store/shop/order-slice";
import { clearCart } from "@/store/shop/cart-slice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, AlertCircle, ArrowLeft, Home, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import safeLocalStorage from "@/lib/safe-storage";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8050/api";

function PaystackReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const reference = params.get("reference");
  const trxref = params.get("trxref");

  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);
  const [isSuccessful, setIsSuccessful] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const paymentReference = reference || trxref;

    if (paymentReference) {
      const orderId = safeLocalStorage.getItem("currentOrderId");
      const storedReference = safeLocalStorage.getItem("currentOrderReference");

      const cleanOrderId = orderId ? orderId.replace(/"/g, '') : null;

      if (cleanOrderId) {
        processPaymentWithOrderId(paymentReference, cleanOrderId);
      } else {
        processPaymentWithReference(paymentReference);
      }
    } else {
      setIsProcessing(false);
      setIsSuccessful(false);
      setErrorMessage("No payment reference found in the return URL.");
      toast({
        title: "Invalid Payment Return",
        description: "No payment reference found. Please contact support.",
        variant: "destructive",
      });
    }
  }, [reference, trxref, dispatch, navigate, toast]);

  const processPaymentWithOrderId = (paymentReference, orderId) => {
    dispatch(capturePayment({ reference: paymentReference, orderId }))
      .then((data) => {
        setIsProcessing(false);

        if (data?.payload?.success) {
          setIsSuccessful(true);
          dispatch(clearOrderStorage());
          dispatch(clearCart());
          toast({
            title: "Payment Successful!",
            description: "Your payment has been successfully processed.",
          });
          setTimeout(() => navigate("/shop/payment-success"), 2000);
        } else {
          setIsSuccessful(false);
          const errorMsg = data?.payload?.message || "There was an error processing your payment.";
          setErrorMessage(errorMsg);
          toast({
            title: "Payment Failed",
            description: errorMsg,
            variant: "destructive",
          });
        }
      })
      .catch((error) => {
        setIsProcessing(false);
        setIsSuccessful(false);
        const errorMsg = error.response?.data?.message || "An unexpected error occurred.";
        setErrorMessage(errorMsg);
        toast({
          title: "Payment Error",
          description: errorMsg,
          variant: "destructive",
        });
      });
  };

  const processPaymentWithReference = async (paymentReference) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/shop/order/find-by-reference/${paymentReference}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.order) {
          processPaymentWithOrderId(paymentReference, data.order._id);
        } else {
          throw new Error("Order not found for reference");
        }
      } else {
        throw new Error("Failed to find order");
      }
    } catch (error) {
      setIsProcessing(false);
      setIsSuccessful(false);
      const errorMsg = "Could not find your order. Please contact support with your payment reference.";
      setErrorMessage(errorMsg);
      toast({
        title: "Order Not Found",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="font-body min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-slate-100 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="w-full max-w-md"
      >
        <Card className="p-8 shadow-2xl border-0 bg-white/90 backdrop-blur-md rounded-3xl relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-peach-100 rounded-full blur-3xl -mr-16 -mt-16 opacity-60" />

          <CardHeader className="flex items-center justify-center p-0 space-y-6 relative z-10">
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-6 w-full"
              >
                <div className="relative mx-auto w-24 h-24">
                  <motion.div
                    className="absolute inset-0 border-4 border-peach-100 rounded-full"
                    initial={{ opacity: 1 }}
                  />
                  <motion.div
                    className="absolute inset-0 border-4 border-t-peach-500 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CreditCard className="h-8 w-8 text-peach-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <CardTitle className="text-2xl font-black text-gray-800 tracking-tight">
                    Securing Payment
                  </CardTitle>
                  <p className="text-gray-500 font-medium">Please do not refresh this page</p>
                </div>

                <div className="space-y-1">
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden border border-gray-50">
                    <motion.div
                      className="bg-gradient-to-r from-peach-400 to-peach-600 h-full"
                      initial={{ x: "-100%" }}
                      animate={{ x: "0%" }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Processing Transaction</p>
                </div>
              </motion.div>
            )}

            {!isProcessing && isSuccessful && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center space-y-6"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle size={48} className="text-green-600" />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-2xl font-black text-green-600">
                    Verified!
                  </CardTitle>
                  <p className="text-gray-600 font-medium">Transaction completed successfully</p>
                </div>
                <div className="flex items-center justify-center space-x-2 text-xs font-bold text-gray-400 bg-gray-50 py-2 px-4 rounded-full border border-gray-100">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span>PREPARING YOUR RECEIPT</span>
                </div>
              </motion.div>
            )}

            {!isProcessing && isSuccessful === false && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center space-y-6 w-full"
              >
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <AlertCircle size={48} className="text-red-600" />
                </div>
                <div className="space-y-3">
                  <CardTitle className="text-2xl font-black text-red-600">
                    Verification Failed
                  </CardTitle>
                  <p className="text-gray-600 font-medium px-4">
                    {errorMessage || "We couldn't verify your payment tracking. Please check your bank."}
                  </p>
                  {reference && (
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 mx-4">
                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Payment Reference</p>
                      <p className="text-xs text-gray-700 font-mono break-all leading-relaxed">
                        {reference}
                      </p>
                    </div>
                  )}
                </div>
                <div className="space-y-3 px-4">
                  <Button
                    className="w-full bg-[#111344] hover:bg-[#0C1172] text-white shadow-md py-6 rounded-[6px] font-bold transition-all hover:scale-[1.02]"
                    onClick={() => navigate("/shop/checkout")}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Try Another Method
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-[6px] border-gray-200 hover:bg-gray-50 font-semibold"
                      onClick={() => navigate("/shop/account")}
                    >
                      <Home className="h-4 w-4 mr-2 text-peach-500" />
                      Orders
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 rounded-[6px] border-gray-200 hover:bg-gray-50 font-semibold"
                      onClick={() => navigate("/")}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2 text-peach-500" />
                      Home
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </CardHeader>
        </Card>
      </motion.div>
    </div>
  );
}

export default PaystackReturnPage;
