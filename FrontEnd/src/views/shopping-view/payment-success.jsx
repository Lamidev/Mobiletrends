'use client';


import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { CheckCircle, Package, ShoppingBag, Home } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useWindowSize } from "react-use";

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { width, height } = useWindowSize();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    toast({
      title: "Payment Successful!",
      description: "Your payment has been successfully processed.",
    });

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/shop/account");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, toast]);

  return (
    <div className="font-body min-h-screen flex items-center justify-center bg-gradient-to-br from-peach-50 to-orange-100 p-4">
      <Confetti width={width} height={height} numberOfPieces={200} gravity={0.2} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg"
      >
        <Card className="p-8 shadow-2xl border-0 bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden relative">
          {/* Decorative Background Element */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-peach-100 rounded-full blur-3xl opacity-50" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-orange-100 rounded-full blur-3xl opacity-50" />

          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
            className="text-center space-y-6 relative z-10"
          >
            {/* Success Icon */}
            <div className="relative">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle size={56} className="text-green-600" />
              </div>
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="absolute -top-2 -right-2 w-10 h-10 bg-peach-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
              >
                <Package className="h-5 w-5 text-white" />
              </motion.div>
            </div>

            {/* Success Message */}
            <CardHeader className="p-0 space-y-3">
              <CardTitle className="text-4xl font-black text-gray-900 tracking-tight">
                Payment Received!
              </CardTitle>
              <p className="text-gray-600 text-lg font-medium">
                Your order has been placed successfully.
              </p>
            </CardHeader>

            {/* Order Status Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-peach-50/80 rounded-2xl p-4 border border-peach-100 backdrop-blur-sm"
            >
              <div className="flex items-center justify-center space-x-6 text-sm font-semibold text-peach-700">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Confirmed</span>
                </div>
                <div className="w-px h-4 bg-peach-200" />
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="h-4 w-4" />
                  <span>Receipt Emailed</span>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.3 }}
              className="space-y-4"
            >
              <Button
                className="w-full bg-gradient-to-r from-peach-500 to-peach-600 hover:from-peach-600 hover:to-peach-700 text-white shadow-xl shadow-peach-200 py-7 text-lg font-bold rounded-[6px] transition-all hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => navigate("/shop/account")}
              >
                <Package className="h-5 w-5 mr-2" />
                Track My Order
              </Button>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1 py-6 border-2 hover:bg-peach-50 hover:text-peach-600 hover:border-peach-200 rounded-[6px] transition-all"
                  onClick={() => navigate("/shop/listing")}
                >
                  <ShoppingBag className="h-4 w-4 mr-2 text-peach-500" />
                  Continue
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 py-6 border-2 hover:bg-peach-50 hover:text-peach-600 hover:border-peach-200 rounded-[6px] transition-all"
                  onClick={() => navigate("/")}
                >
                  <Home className="h-4 w-4 mr-2 text-peach-500" />
                  Home
                </Button>
              </div>
            </motion.div>

            {/* Countdown */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.3 }}
              className="pt-4"
            >
              <div className="inline-flex items-center px-4 py-2 bg-gray-50 rounded-full text-xs font-bold text-gray-500 border border-gray-100">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-peach-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-peach-500"></span>
                </span>
                Redirecting to orders in {countdown}s
              </div>
            </motion.div>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}

export default PaymentSuccessPage;