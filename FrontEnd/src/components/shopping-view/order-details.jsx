'use client';

import { motion } from "framer-motion";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import {
  ShoppingBag,
  Calendar,
  Truck,
  MapPin,
  User,
  Phone,
  FileText,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

function ShoppingOrderDetailsView({ orderDetails }) {
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "delivered":
        return <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />;
      case "pending":
      case "inprocess":
      case "in process":
      case "inshipping":
      case "shipping":
        return <Clock className="h-3.5 w-3.5 text-amber-600" />;
      case "rejected":
        return <XCircle className="h-3.5 w-3.5 text-rose-600" />;
      default:
        return <ShoppingBag className="h-3.5 w-3.5 text-[#111344]" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pending":
      case "inprocess":
      case "in process":
      case "inshipping":
      case "shipping":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "rejected":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const formatOrderId = (id) => {
    if (!id) return "N/A";
    return `ORD${id.slice(-8).toUpperCase()}`;
  };

  if (!orderDetails) return null;

  return (
    <DialogContent className="font-manrope sm:max-w-[650px] max-h-[90vh] overflow-y-auto rounded-[24px] p-6 sm:p-7 border border-[#e5e7eb] shadow-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.2 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="text-center border-b border-gray-100 pb-5">
          <div className="w-13 h-13 rounded-full bg-[#fafaf8] border border-[#e5e7eb] flex items-center justify-center mx-auto mb-3 text-[#111344]">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0f172a]">Order Details</h2>
          <p className="text-xs sm:text-[13px] font-semibold text-[#64748b] mt-1">
            {formatOrderId(orderDetails?._id)}
          </p>
        </div>

        {/* Order Meta Summary */}
        <div className="bg-[#fafaf8] rounded-[14px] p-4 border border-[#e5e7eb]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-[13px]">
            <div className="flex items-center gap-2 text-[#0f172a]">
              <Calendar className="h-4 w-4 text-[#94a3b8]" />
              <span className="text-[#64748b]">Order Date:</span>
              <span className="font-semibold">
                {orderDetails?.orderDate
                  ? new Date(orderDetails.orderDate).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#0f172a]">
              <CreditCard className="h-4 w-4 text-[#94a3b8]" />
              <span className="text-[#64748b]">Payment:</span>
              <span className="font-semibold uppercase tracking-wider">
                {orderDetails?.paymentMethod || "Paystack"}
              </span>
            </div>
          </div>
        </div>

        {/* Order Info & Status Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Order Financials */}
          <div className="border border-[#e5e7eb] rounded-[14px] p-4 bg-white space-y-3">
            <h3 className="font-bold text-[14px] text-[#0f172a] flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-[#111344]" />
              Payment Summary
            </h3>
            <div className="space-y-2 text-xs sm:text-[13px]">
              <div className="flex justify-between items-center text-[#64748b]">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-[#0f172a]">
                  ₦{(orderDetails?.totalAmount - (orderDetails?.deliveryPrice || 0))?.toLocaleString("en-NG")}
                </span>
              </div>
              <div className="flex justify-between items-center text-[#64748b]">
                <span className="flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5" />
                  Delivery Fee:
                </span>
                <span className="font-semibold text-[#0f172a]">
                  ₦{(orderDetails?.deliveryPrice || 0)?.toLocaleString("en-NG")}
                </span>
              </div>
              <Separator className="bg-gray-100 my-1" />
              <div className="flex justify-between items-center text-sm font-bold pt-0.5">
                <span className="text-[#0f172a]">Total Paid:</span>
                <span className="text-base font-extrabold text-[#111344]">
                  ₦{orderDetails?.totalAmount?.toLocaleString("en-NG")}
                </span>
              </div>
            </div>
          </div>

          {/* Status Details */}
          <div className="border border-[#e5e7eb] rounded-[14px] p-4 bg-white space-y-3">
            <h3 className="font-bold text-[14px] text-[#0f172a] flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#111344]" />
              Order Status
            </h3>
            <div className="space-y-2.5 text-xs sm:text-[13px]">
              <div className="flex justify-between items-center">
                <span className="text-[#64748b]">Delivery Status:</span>
                <Badge
                  variant="outline"
                  className={`py-1 px-2.5 rounded-[6px] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-none ${getStatusColor(
                    orderDetails?.orderStatus
                  )}`}
                >
                  {getStatusIcon(orderDetails?.orderStatus)}
                  <span>{orderDetails?.orderStatus || "Pending"}</span>
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748b]">Payment Status:</span>
                <Badge
                  variant="outline"
                  className="rounded-[6px] px-2 py-0.5 text-[11px] font-bold uppercase bg-emerald-50 text-emerald-700 border-emerald-200"
                >
                  {orderDetails?.paymentStatus || "Paid"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Purchased Items List */}
        <div className="space-y-3">
          <h3 className="font-bold text-[14px] text-[#0f172a] flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-[#111344]" />
            Ordered Items ({orderDetails?.cartItems?.length || 0})
          </h3>
          <div className="border border-[#e5e7eb] rounded-[14px] overflow-hidden divide-y divide-gray-100">
            {orderDetails?.cartItems?.map((item, index) => (
              <div
                key={item._id || item.productId || index}
                className="flex items-center justify-between p-3.5 bg-white hover:bg-gray-50/50 transition-colors gap-3"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-12 h-12 rounded-[8px] bg-[#fafaf8] border border-[#e5e7eb] flex items-center justify-center p-1 overflow-hidden shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[13px] text-[#0f172a] line-clamp-1">
                      {item.title}
                    </p>
                    {(item.selectedStorage || item.selectedRam || item.selectedColor || item.selectedCondition) && (
                      <p className="text-[11px] text-[#DF5E00] font-medium">
                        {[item.selectedCondition, item.selectedStorage, item.selectedRam ? `${item.selectedRam} RAM` : null, item.selectedColor].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    <p className="text-[#94a3b8] text-[11px]">
                      Quantity: <span className="font-bold text-[#64748b]">{item.quantity}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-[13.5px] text-[#111344]">
                    ₦{(item.price * item.quantity)?.toLocaleString("en-NG")}
                  </p>
                  {item.quantity > 1 && (
                    <p className="text-[10.5px] text-[#94a3b8]">
                      ₦{item.price?.toLocaleString("en-NG")} each
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Information */}
        <div className="space-y-3">
          <h3 className="font-bold text-[14px] text-[#0f172a] flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#111344]" />
            Shipping Destination
          </h3>
          <div className="bg-[#fafaf8] rounded-[14px] p-4 border border-[#e5e7eb] space-y-2 text-xs sm:text-[13px]">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-[#94a3b8]" />
              <span className="font-semibold text-[#0f172a]">
                {orderDetails?.addressInfo?.fullName || "Recipient"}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-[#94a3b8] mt-0.5 shrink-0" />
              <span className="text-[#64748b]">
                {orderDetails?.addressInfo?.address}, {orderDetails?.addressInfo?.lga},{" "}
                {orderDetails?.addressInfo?.state}, Nigeria
              </span>
            </div>
            {orderDetails?.addressInfo?.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#94a3b8]" />
                <span className="text-[#64748b]">
                  Contact: <span className="font-semibold text-[#0f172a]">{orderDetails?.addressInfo?.phone}</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;
