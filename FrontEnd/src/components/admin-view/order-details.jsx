'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { updateOrderStatus, getOrderDetailsForAdmin, getAllOrdersForAdmin } from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";
import {
  Loader2,
  Package,
  Calendar,
  Truck,
  MapPin,
  User,
  Phone,
  FileText,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";

function formatFullNaira(num) {
  if (num === undefined || num === null || isNaN(num)) return "₦0.00";
  return `₦${Number(num).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatOrderId(id) {
  if (!id) return "ORD-00000000";
  const raw = id.toString().replace(/[^a-zA-Z0-9]/g, "");
  return `ORD-${raw.slice(-8).toUpperCase()}`;
}

function formatOrderDate(dateStr) {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "N/A";
  }
}

function getStatusBadgeStyle(status) {
  const s = (status || "confirmed").toLowerCase();
  if (s.includes("confirm") || s.includes("paid") || s === "success") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200/70";
  }
  if (s.includes("deliver")) {
    return "bg-indigo-50 text-indigo-700 border-indigo-200/70";
  }
  if (s.includes("ship")) {
    return "bg-purple-50 text-purple-700 border-purple-200/70";
  }
  if (s.includes("cancel") || s.includes("reject")) {
    return "bg-rose-50 text-rose-700 border-rose-200/70";
  }
  return "bg-emerald-50 text-emerald-700 border-emerald-200/70";
}

function normalizeStatusLabel(status) {
  const s = (status || "confirmed").toLowerCase();
  if (s.includes("deliver")) return "Delivered";
  if (s.includes("ship")) return "Shipped";
  if (s.includes("cancel") || s.includes("reject")) return "Cancelled";
  return "Confirmed";
}

function AdminOrderDetailsView({ orderDetails, onClose }) {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleUpdateStatus = (e) => {
    e.preventDefault();
    if (!selectedStatus) {
      toast({
        title: "Please select a status",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    dispatch(updateOrderStatus({ id: orderDetails?._id, orderStatus: selectedStatus }))
      .then((data) => {
        if (data?.payload?.success) {
          dispatch(getOrderDetailsForAdmin(orderDetails?._id));
          dispatch(getAllOrdersForAdmin());
          setSelectedStatus("");
          toast({
            title: "Status updated & email sent",
            description: "Order status has been updated and an automated notification was emailed to the customer.",
          });
        } else {
          toast({
            title: "Update failed",
            description: data?.payload?.message || "Could not update status",
            variant: "destructive",
          });
        }
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Something went wrong while updating the order status.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const totalItemsCount = orderDetails?.cartItems?.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0) || 0;
  const itemsSubtotal = orderDetails?.cartItems?.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  ) || 0;

  const currentStatusLabel = normalizeStatusLabel(orderDetails?.orderStatus);
  const currentStatusStyle = getStatusBadgeStyle(orderDetails?.orderStatus);

  return (
    <DialogContent className="sm:max-w-[760px] max-h-[92vh] overflow-y-auto p-4 sm:p-7 bg-white rounded-2xl border-none shadow-2xl font-manrope">
      <DialogHeader className="pb-3 border-b border-gray-100 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#111344]/5 text-[#111344] flex items-center justify-center shrink-0">
            <Package size={18} />
          </div>
          <div>
            <DialogTitle className="text-base sm:text-lg font-black text-[#111344] tracking-tight">
              Order {formatOrderId(orderDetails?._id)}
            </DialogTitle>
            <p className="text-xs text-gray-500 font-medium">
              Placed on {formatOrderDate(orderDetails?.orderDate || orderDetails?.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {orderDetails?.isGuest || orderDetails?.userId?.startsWith("guest_") ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
              GUEST
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              MEMBER
            </span>
          )}
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${currentStatusStyle}`}>
            {currentStatusLabel}
          </span>
        </div>
      </DialogHeader>

      <div className="space-y-6 pt-3">
        {/* Top 3 Metric Tiles */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Total Amount
            </span>
            <span className="text-sm sm:text-base font-black text-gray-900 font-mono mt-0.5 block">
              {formatFullNaira(orderDetails?.totalAmount)}
            </span>
          </div>

          <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Items
            </span>
            <span className="text-sm sm:text-base font-black text-gray-900 font-mono mt-0.5 block">
              {totalItemsCount} {totalItemsCount === 1 ? "unit" : "units"}
            </span>
          </div>

          <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Delivery
            </span>
            <span className="text-sm sm:text-base font-black text-gray-900 font-mono mt-0.5 block">
              {Number(orderDetails?.deliveryPrice) > 0 ? formatFullNaira(orderDetails.deliveryPrice) : "Free / Included"}
            </span>
          </div>
        </div>

        {/* Customer & Shipping Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Customer Profile */}
          <div className="rounded-xl border border-gray-100 bg-white p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
              <User size={14} className="text-[#111344]" />
              <span>Customer Details</span>
            </div>
            <div className="text-xs space-y-1 text-gray-600">
              <p className="font-bold text-gray-900 text-sm">
                {orderDetails?.addressInfo?.fullName || orderDetails?.userName || "Customer"}
              </p>
              {orderDetails?.addressInfo?.phone && (
                <p className="flex items-center gap-1.5 font-medium">
                  <Phone size={12} className="text-gray-400" />
                  <span>{orderDetails.addressInfo.phone}</span>
                </p>
              )}
              {(orderDetails?.payerId || orderDetails?.addressInfo?.email) && (
                <p className="text-gray-500 text-[11px] font-medium">
                  {orderDetails.payerId || orderDetails.addressInfo.email}
                </p>
              )}
              <div className="pt-1 text-[11px] text-gray-500 font-medium">
                Payment: <span className="font-bold text-gray-700 capitalize">{orderDetails?.paymentMethod || "Online Checkout"}</span> · Status: <span className="font-bold text-emerald-700 capitalize">{orderDetails?.paymentStatus || "Paid"}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="rounded-xl border border-gray-100 bg-white p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
              <MapPin size={14} className="text-[#111344]" />
              <span>Shipping Destination</span>
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <p className="font-medium text-gray-800">
                {orderDetails?.addressInfo?.address || "Address not provided"}
              </p>
              {(orderDetails?.addressInfo?.city || orderDetails?.addressInfo?.lga || orderDetails?.addressInfo?.state) && (
                <p className="font-medium text-gray-500 text-[11px]">
                  {[orderDetails?.addressInfo?.city, orderDetails?.addressInfo?.lga, orderDetails?.addressInfo?.state]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
              {orderDetails?.addressInfo?.notes && (
                <div className="mt-2 p-2 bg-amber-50/60 border border-amber-200/60 rounded-lg text-[11px] text-amber-800 font-medium">
                  <span className="font-bold block text-[10px] uppercase">Notes:</span>
                  {orderDetails.addressInfo.notes}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ordered Items List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Purchased Items ({orderDetails?.cartItems?.length || 0})
            </h4>
          </div>

          <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100">
            {orderDetails?.cartItems?.map((item, idx) => {
              const variantTags = [
                item.selectedCondition,
                item.selectedStorage,
                item.selectedRam ? `${item.selectedRam} RAM` : null,
                item.selectedColor,
              ].filter(Boolean);

              return (
                <div key={item._id || idx} className="p-3 sm:p-4 flex items-center justify-between gap-3 bg-white">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-100 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                        <Package size={20} />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs sm:text-sm text-gray-900 truncate">
                        {item.title}
                      </p>

                      {variantTags.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                          {variantTags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                        Qty: {item.quantity} × {formatFullNaira(item.price)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-black text-xs sm:text-sm text-gray-900 font-mono">
                      {formatFullNaira((Number(item.price) || 0) * (Number(item.quantity) || 1))}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Subtotal Breakdown */}
            <div className="p-3 sm:p-4 bg-gray-50/70 space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Items Subtotal</span>
                <span className="font-mono">{formatFullNaira(itemsSubtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Delivery & Logistics</span>
                <span className="font-mono">
                  {Number(orderDetails?.deliveryPrice) > 0 ? formatFullNaira(orderDetails.deliveryPrice) : "₦0.00"}
                </span>
              </div>
              <Separator className="my-1.5" />
              <div className="flex justify-between font-black text-sm text-[#111344]">
                <span>Total Amount Paid</span>
                <span className="font-mono">{formatFullNaira(orderDetails?.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Update Status Bar */}
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold text-gray-800">
              Update Order Status
            </Label>
            <span className="text-[11px] text-gray-500 font-medium">
              Customer automatically notified by email
            </span>
          </div>

          <form onSubmit={handleUpdateStatus} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#111344]"
            >
              <option value="">Select new status...</option>
              <option value="confirmed">Confirmed (Packaging & Testing)</option>
              <option value="shipping">Shipped (Dispatched to Courier / Rider)</option>
              <option value="delivered">Delivered (Handed over to Customer)</option>
              <option value="rejected">Cancelled (Voided / Refunded)</option>
            </select>

            <Button
              type="submit"
              disabled={isLoading || !selectedStatus}
              className="h-9 px-4 bg-[#111344] hover:bg-[#0C1172] text-white text-xs font-bold rounded-xl gap-2 cursor-pointer shadow-xs shrink-0 disabled:opacity-40"
            >
              {isLoading ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
              <span>Update & Send Email</span>
            </Button>
          </form>
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;
