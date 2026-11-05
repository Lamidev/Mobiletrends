'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Truck,
  Package,
  Clock,
  DollarSign,
  Save,
  Loader2,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8050/api";

function AdminFeatures() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [deliverySettings, setDeliverySettings] = useState({
    lagosFee: 10000,
    outsideLagosFee: 20000,
    freeDeliveryThreshold: 0,
    estimatedDaysLagos: "Same Day Delivery",
    estimatedDaysOutside: "1-2 Business Days",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/common/delivery-settings`);
      if (response?.data?.success && response.data.data) {
        setDeliverySettings(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching delivery settings:", error);
      toast({
        title: "Could not load delivery settings",
        description: "Using current default logistics rates.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setSavedSuccess(false);

      const response = await axios.put(
        `${API_BASE_URL}/common/delivery-settings`,
        deliverySettings
      );

      if (response?.data?.success) {
        setSavedSuccess(true);
        toast({
          title: "Delivery rates updated!",
          description: "Changes are now live across the storefront and checkout.",
        });
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        toast({
          title: "Failed to update settings",
          description: response?.data?.message || "Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      toast({
        title: "Failed to update settings",
        description: error?.response?.data?.message || error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="font-manrope min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#111344] mb-3" />
        <p className="text-sm font-semibold text-gray-600">
          Loading logistics & delivery configuration...
        </p>
      </div>
    );
  }

  return (
    <div className="font-manrope p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-[12px] bg-[#111344]/5 text-[#111344] flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#111344] tracking-tight">
              Logistics & Delivery Pricing
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Control dynamic delivery fees and delivery timeframes visible to customers at checkout.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Form (2 cols) */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSave}
            className="bg-white border border-[#e5e7eb] rounded-[16px] p-5 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="text-base font-bold text-[#0f172a] flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#DF5E00]" />
                Delivery Rates Configuration
              </h2>
              <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200/60">
                Live Dynamic Sync
              </span>
            </div>

            {/* Lagos Pricing Card */}
            <div className="p-4 rounded-[12px] bg-gray-50/70 border border-gray-200/80 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <h3 className="text-sm font-bold text-gray-900">
                  Lagos Deliveries
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Lagos Delivery Fee (₦)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">
                      ₦
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="500"
                      value={deliverySettings.lagosFee}
                      onChange={(e) =>
                        setDeliverySettings({
                          ...deliverySettings,
                          lagosFee: Number(e.target.value),
                        })
                      }
                      className="w-full h-11 pl-8 pr-3 rounded-[10px] border border-gray-300 text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#111344] focus:ring-2 focus:ring-[#111344]/10 transition-all bg-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Estimated Timeframe
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={deliverySettings.estimatedDaysLagos}
                      onChange={(e) =>
                        setDeliverySettings({
                          ...deliverySettings,
                          estimatedDaysLagos: e.target.value,
                        })
                      }
                      placeholder="e.g. Same Day Delivery"
                      className="w-full h-11 pl-9 pr-3 rounded-[10px] border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-[#111344] focus:ring-2 focus:ring-[#111344]/10 transition-all bg-white"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Outside Lagos Pricing Card */}
            <div className="p-4 rounded-[12px] bg-gray-50/70 border border-gray-200/80 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                <h3 className="text-sm font-bold text-gray-900">
                  Outside Lagos / Nationwide
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Outside Lagos Fee (₦)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">
                      ₦
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="500"
                      value={deliverySettings.outsideLagosFee}
                      onChange={(e) =>
                        setDeliverySettings({
                          ...deliverySettings,
                          outsideLagosFee: Number(e.target.value),
                        })
                      }
                      className="w-full h-11 pl-8 pr-3 rounded-[10px] border border-gray-300 text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#111344] focus:ring-2 focus:ring-[#111344]/10 transition-all bg-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Estimated Timeframe
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={deliverySettings.estimatedDaysOutside}
                      onChange={(e) =>
                        setDeliverySettings({
                          ...deliverySettings,
                          estimatedDaysOutside: e.target.value,
                        })
                      }
                      placeholder="e.g. 1-2 Business Days"
                      className="w-full h-11 pl-9 pr-3 rounded-[10px] border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-[#111344] focus:ring-2 focus:ring-[#111344]/10 transition-all bg-white"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Free Delivery Threshold */}
            <div className="p-4 rounded-[12px] bg-gray-50/70 border border-gray-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-700">
                  Free Delivery Threshold (Optional)
                </label>
                <span className="text-[11px] text-gray-400">
                  Set to 0 to disable
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">
                  ₦
                </span>
                <input
                  type="number"
                  min="0"
                  step="5000"
                  value={deliverySettings.freeDeliveryThreshold}
                  onChange={(e) =>
                    setDeliverySettings({
                      ...deliverySettings,
                      freeDeliveryThreshold: Number(e.target.value),
                    })
                  }
                  placeholder="0 (disabled)"
                  className="w-full h-11 pl-8 pr-3 rounded-[10px] border border-gray-300 text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#111344] focus:ring-2 focus:ring-[#111344]/10 transition-all bg-white"
                />
              </div>
              <p className="text-[11px] text-gray-500">
                If order subtotal meets or exceeds this amount, delivery becomes free at checkout.
              </p>
            </div>

            {/* Submit CTA */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-[#111344] hover:bg-[#0C1172] text-white rounded-[8px] px-6 h-11 font-semibold text-sm transition-all shadow-sm flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Rates...</span>
                  </>
                ) : savedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Saved Successfully</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Delivery Settings</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Live Customer Preview (1 col) */}
        <div className="space-y-4">
          <div className="bg-white border border-[#e5e7eb] rounded-[16px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
              <Sparkles className="w-3.5 h-3.5 text-[#DF5E00]" />
              Live Checkout Preview
            </div>

            <p className="text-xs text-gray-600">
              This is how your rates and delivery timeframes appear to customers at checkout:
            </p>

            <div className="space-y-2.5">
              <div className="p-3 rounded-[10px] border border-blue-200/80 bg-blue-50/50 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-blue-900">Lagos State</p>
                  <p className="text-[11px] text-blue-700">
                    {deliverySettings.estimatedDaysLagos || "Same Day Delivery"}
                  </p>
                </div>
                <span className="text-sm font-black text-blue-900">
                  ₦{Number(deliverySettings.lagosFee || 0).toLocaleString("en-NG")}
                </span>
              </div>

              <div className="p-3 rounded-[10px] border border-purple-200/80 bg-purple-50/50 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-purple-900">Outside Lagos (35 States)</p>
                  <p className="text-[11px] text-purple-700">
                    {deliverySettings.estimatedDaysOutside || "1-2 Business Days"}
                  </p>
                </div>
                <span className="text-sm font-black text-purple-900">
                  ₦{Number(deliverySettings.outsideLagosFee || 0).toLocaleString("en-NG")}
                </span>
              </div>

              {deliverySettings.freeDeliveryThreshold > 0 && (
                <div className="p-2.5 rounded-[10px] border border-emerald-200 bg-emerald-50 text-[11px] text-emerald-800 font-medium">
                  Free delivery applies on orders above ₦{Number(deliverySettings.freeDeliveryThreshold).toLocaleString("en-NG")}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center gap-2 text-[11px] text-gray-400">
              <ShieldAlert className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              <span>All order totals are verified server-side with these rates.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminFeatures;
