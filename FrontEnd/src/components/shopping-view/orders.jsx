'use client';

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Calendar,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import ShoppingOrderDetailsView from "./order-details";
import { getAllOrdersByUserId, getOrderDetails, resetOrderDetails } from "@/store/shop/order-slice";

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { orderList = [], orderDetails, isLoading } = useSelector(
    (state) => state.shopOrder
  );

  const currentUserId = user?.id || user?.Id || user?._id;

  useEffect(() => {
    if (currentUserId) {
      dispatch(getAllOrdersByUserId(currentUserId));
    }
  }, [dispatch, currentUserId]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
  }

  const totalItems = orderList?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = orderList?.slice(startIndex, endIndex) || [];

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "delivered":
        return <CheckCircle className="h-3 w-3 text-emerald-600" />;
      case "pending":
      case "inprocess":
      case "in process":
      case "inshipping":
      case "shipping":
        return <Clock className="h-3 w-3 text-amber-600" />;
      case "rejected":
        return <XCircle className="h-3 w-3 text-rose-600" />;
      default:
        return <ShoppingBag className="h-3 w-3 text-[#111344]" />;
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 font-manrope">
        <div className="w-12 h-12 rounded-full border-2 border-gray-200 border-t-[#111344] animate-spin mb-3"></div>
        <p className="text-xs font-semibold text-[#64748b]">Loading your orders...</p>
      </div>
    );
  }

  if (!orderList || orderList.length === 0) {
    return (
      /* Empty State matching Wishlist card exactly */
      <div className="font-manrope bg-white rounded-[20px] border border-[#e5e7eb] p-8 sm:p-12 text-center shadow-sm max-w-md mx-auto">
        <div className="w-14 h-14 rounded-full bg-[#f8fafc] border border-[#e5e7eb] flex items-center justify-center mx-auto mb-3 text-[#94a3b8]">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-[#0f172a] mb-1">
          No orders yet
        </h3>
        <p className="text-xs text-[#64748b] max-w-xs mx-auto mb-5">
          Select from our wide range of gadgets and place your first order today.
        </p>
        <Button
          onClick={() => navigate("/shop/listing")}
          className="bg-[#111344] hover:bg-[#0C1172] text-white px-5 h-10 rounded-[6px] font-semibold text-xs transition-all"
        >
          Browse Gadgets
        </Button>
      </div>
    );
  }

  return (
    <div className="font-manrope space-y-4">
      {/* Header Info & Count */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-1">
        <span className="text-[12px] font-medium text-[#64748b]">
          Showing {startIndex + 1}–{Math.min(endIndex, totalItems)} of {totalItems} orders
        </span>
        <span className="text-[11px] font-semibold text-[#64748b] bg-white border border-[#e5e7eb] px-3 py-1 rounded-[6px]">
          {totalItems} {totalItems === 1 ? "order" : "orders"}
        </span>
      </div>

      {/* Grid of Order Cards (Uniform 2-column layout matching Wishlist) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {currentOrders.map((orderItem) => {
          const itemCount = orderItem?.cartItems?.length || 0;
          const firstItem = orderItem?.cartItems?.[0];

          return (
            <div
              key={orderItem._id}
              className="bg-white rounded-[16px] border border-[#e5e7eb] p-4 flex flex-col justify-between hover:shadow-sm transition-all group relative space-y-3.5"
            >
              {/* Card Header: Order ID & Status Badge */}
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider block">
                    Order ID
                  </span>
                  <span className="text-[13.5px] font-bold text-[#0f172a] tracking-tight">
                    {formatOrderId(orderItem?._id)}
                  </span>
                </div>

                <Badge
                  variant="outline"
                  className={`py-1 px-2.5 rounded-[6px] text-[10.5px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-none ${getStatusColor(
                    orderItem?.orderStatus
                  )}`}
                >
                  {getStatusIcon(orderItem?.orderStatus)}
                  <span>{orderItem?.orderStatus || "Pending"}</span>
                </Badge>
              </div>

              {/* Order Date & Item Summary */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-[12px] text-[#64748b]">
                  <Calendar className="w-3.5 h-3.5 text-[#94a3b8]" />
                  <span>
                    {orderItem?.orderDate
                      ? new Date(orderItem.orderDate).toLocaleDateString("en-NG", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "Recent order"}
                  </span>
                </div>

                {/* Thumbnails preview */}
                {orderItem?.cartItems && orderItem.cartItems.length > 0 && (
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex items-center -space-x-1.5 overflow-hidden">
                      {orderItem.cartItems.slice(0, 3).map((item, i) => (
                        <div
                          key={item._id || item.productId || i}
                          className="w-10 h-10 rounded-[8px] bg-[#fafaf8] border border-[#e5e7eb] flex items-center justify-center p-1 overflow-hidden shrink-0"
                          title={item.title}
                        >
                          <img
                            src={item.image}
                            alt={item.title || "Gadget"}
                            className="w-full h-full object-contain mix-blend-multiply"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="min-w-0 flex-1 pl-1">
                      <p className="text-[12.5px] font-semibold text-[#0f172a] truncate">
                        {firstItem?.title || "Purchased gadgets"}
                      </p>
                      <p className="text-[11px] text-[#94a3b8]">
                        {itemCount} {itemCount === 1 ? "item" : "items"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer: Total Amount & View Details Action */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100">
                <div>
                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#94a3b8] block">
                    Total Amount
                  </span>
                  <span className="text-[15px] sm:text-[16px] font-extrabold text-[#111344]">
                    ₦{orderItem?.totalAmount?.toLocaleString("en-NG")}
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFetchOrderDetails(orderItem?._id)}
                  className="rounded-[6px] h-8 px-3 border-[#e5e7eb] hover:bg-[#fafaf8] hover:text-[#111344] text-[12px] font-semibold gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Details</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8 px-2.5 rounded-[6px] border-[#e5e7eb] hover:bg-gray-50 text-xs font-semibold"
          >
            <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Prev
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(page)}
              className={`h-8 w-8 p-0 rounded-[6px] text-xs font-bold transition-all ${
                currentPage === page
                  ? "bg-[#111344] text-white border-[#111344]"
                  : "border-[#e5e7eb] hover:bg-gray-50 text-[#0f172a]"
              }`}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-8 px-2.5 rounded-[6px] border-[#e5e7eb] hover:bg-gray-50 text-xs font-semibold"
          >
            Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      )}

      {/* Order Details Modal Dialog */}
      <Dialog
        open={openDetailsDialog}
        onOpenChange={() => {
          setOpenDetailsDialog(false);
          dispatch(resetOrderDetails());
        }}
      >
        <ShoppingOrderDetailsView orderDetails={orderDetails} />
      </Dialog>
    </div>
  );
}

export default ShoppingOrders;
