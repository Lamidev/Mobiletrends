'use client';

import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import AdminOrderDetailsView from "./order-details";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
  deleteOrder,
} from "@/store/admin/order-slice";
import { useToast } from "@/components/ui/use-toast";
import {
  RotateCcw,
  Search,
  ShoppingBag,
  CheckCircle2,
  Truck,
  PackageCheck,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  Phone,
} from "lucide-react";
import { motion } from "framer-motion";

function formatCompactNaira(num) {
  if (!num || isNaN(num)) return "₦0";
  if (num >= 1000000) {
    return `₦${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `₦${(num / 1000).toFixed(1)}K`;
  }
  return `₦${Number(num).toLocaleString("en-NG")}`;
}

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

// Clean soft badge styles matching the uploaded UI/UX screenshot
function getStatusBadgeStyle(status) {
  const s = (status || "confirmed").toLowerCase();
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

function AdminOrdersView() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { orderList, orderDetails, isLoading } = useSelector((state) => state.adminOrder);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  const handleRefresh = () => {
    dispatch(getAllOrdersForAdmin());
    setCurrentPage(1);
    toast({
      title: "Orders refreshed",
      description: "Latest order data has been synchronized.",
    });
  };

  const handleFetchOrderDetails = (id) => {
    dispatch(getOrderDetailsForAdmin(id));
  };

  const handleConfirmDelete = (id) => {
    setSelectedOrderId(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteOrder = () => {
    if (!selectedOrderId) return;
    dispatch(deleteOrder(selectedOrderId))
      .unwrap()
      .then((res) => {
        toast({
          title: "Order deleted",
          description: res?.message || "Order removed successfully",
        });
        dispatch(getAllOrdersForAdmin());
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to delete order. Please try again.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setOpenDeleteDialog(false);
        setSelectedOrderId(null);
      });
  };

  // KPI Calculations
  const metrics = useMemo(() => {
    const list = orderList || [];
    let revenue = 0;
    let confirmedCount = 0;
    let deliveredCount = 0;

    list.forEach((ord) => {
      const amt = Number(ord?.totalAmount) || 0;
      revenue += amt;
      const s = (ord?.orderStatus || "").toLowerCase();
      if (s.includes("deliver")) {
        deliveredCount++;
      } else if (!s.includes("cancel") && !s.includes("reject")) {
        confirmedCount++;
      }
    });

    return {
      totalOrders: list.length,
      revenue,
      confirmedCount,
      deliveredCount,
    };
  }, [orderList]);

  // Tab counts
  const tabCounts = useMemo(() => {
    const counts = {
      all: 0,
      confirmed: 0,
      shipping: 0,
      delivered: 0,
      cancelled: 0,
    };

    (orderList || []).forEach((ord) => {
      counts.all++;
      const s = (ord?.orderStatus || "").toLowerCase();
      if (s.includes("deliver")) counts.delivered++;
      else if (s.includes("ship")) counts.shipping++;
      else if (s.includes("cancel") || s.includes("reject")) counts.cancelled++;
      else counts.confirmed++;
    });

    return counts;
  }, [orderList]);

  // Filter & Search
  const filteredOrders = useMemo(() => {
    if (!orderList || orderList.length === 0) return [];
    return orderList.filter((ord) => {
      const s = (ord?.orderStatus || "confirmed").toLowerCase();
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "confirmed" && !s.includes("deliver") && !s.includes("ship") && !s.includes("cancel") && !s.includes("reject")) ||
        (statusFilter === "shipping" && s.includes("ship")) ||
        (statusFilter === "delivered" && s.includes("deliver")) ||
        (statusFilter === "cancelled" && (s.includes("cancel") || s.includes("reject")));

      const q = searchTerm.toLowerCase().trim();
      const customer = (ord?.addressInfo?.fullName || ord?.userName || "").toLowerCase();
      const phone = (ord?.addressInfo?.phone || "").toLowerCase();
      const orderId = (ord?._id || "").toLowerCase();
      const matchesSearch = !q || customer.includes(q) || phone.includes(q) || orderId.includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [orderList, statusFilter, searchTerm]);

  // Pagination
  const totalItems = filteredOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchTerm, itemsPerPage]);

  return (
    <div className="font-manrope space-y-7 p-2 sm:p-6 lg:p-8 max-w-7xl mx-auto bg-[#FBFBFC] min-h-screen">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111344] tracking-tight">
            Orders
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
            Track, reconcile, and fulfill direct customer device purchases
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleRefresh}
          className="h-9 px-3.5 border-gray-200 hover:bg-white text-xs font-semibold rounded-xl gap-2 shadow-xs cursor-pointer"
          disabled={isLoading}
        >
          <RotateCcw size={14} className={`text-gray-600 ${isLoading ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>

      {/* 4 KPI Cards (Stacked in Twos on Mobile) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {/* Total Revenue */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <Card className="rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] bg-white p-3.5 sm:p-5 space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider truncate">
                Total Revenue
              </span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">
                ₦
              </div>
            </div>
            <div>
              <h3 className="text-lg sm:text-2xl lg:text-3xl font-black text-emerald-600 tracking-tight truncate">
                {formatCompactNaira(metrics.revenue)}
              </h3>
              <p className="text-[10px] sm:text-[11.5px] font-medium text-gray-400 mt-0.5 line-clamp-1">
                Direct cash collected
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Total Orders */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.05 }}>
          <Card className="rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] bg-white p-3.5 sm:p-5 space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider truncate">
                Total Orders
              </span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <ShoppingBag size={15} />
              </div>
            </div>
            <div>
              <h3 className="text-lg sm:text-2xl lg:text-3xl font-black text-gray-900 tracking-tight truncate">
                {metrics.totalOrders}
              </h3>
              <p className="text-[10px] sm:text-[11.5px] font-medium text-gray-400 mt-0.5 line-clamp-1">
                All lifetime orders
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Confirmed Orders */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.1 }}>
          <Card className="rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] bg-white p-3.5 sm:p-5 space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider truncate">
                Confirmed
              </span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 size={15} />
              </div>
            </div>
            <div>
              <h3 className="text-lg sm:text-2xl lg:text-3xl font-black text-gray-900 tracking-tight truncate">
                {metrics.confirmedCount}
              </h3>
              <p className="text-[10px] sm:text-[11.5px] font-medium text-gray-400 mt-0.5 line-clamp-1">
                Paid & being prepared
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Delivered Orders */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.15 }}>
          <Card className="rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] bg-white p-3.5 sm:p-5 space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider truncate">
                Delivered
              </span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Truck size={15} />
              </div>
            </div>
            <div>
              <h3 className="text-lg sm:text-2xl lg:text-3xl font-black text-gray-900 tracking-tight truncate">
                {metrics.deliveredCount}
              </h3>
              <p className="text-[10px] sm:text-[11.5px] font-medium text-gray-400 mt-0.5 line-clamp-1">
                Fulfilled & completed
              </p>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Orders Directory Card */}
      <Card className="rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] bg-white overflow-hidden p-3.5 sm:p-6 space-y-5">
        {/* Toolbar: Status Filter Pills (Horizontal scrollable) & Search */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            {/* 4 Clean Status Pills */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 cursor-pointer ${
                  statusFilter === "all"
                    ? "bg-[#111344] text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All ({tabCounts.all})
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter("confirmed")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 cursor-pointer ${
                  statusFilter === "confirmed"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Confirmed ({tabCounts.confirmed})
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter("shipping")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 cursor-pointer ${
                  statusFilter === "shipping"
                    ? "bg-purple-600 text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Shipped ({tabCounts.shipping})
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter("delivered")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 cursor-pointer ${
                  statusFilter === "delivered"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Delivered ({tabCounts.delivered})
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter("cancelled")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 cursor-pointer ${
                  statusFilter === "cancelled"
                    ? "bg-rose-600 text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Cancelled ({tabCounts.cancelled})
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <Input
              type="text"
              placeholder="Search by order ID, customer name, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 bg-gray-50/70 border-gray-200 rounded-xl text-base sm:text-xs font-medium placeholder:text-[11px] sm:placeholder:text-xs placeholder:text-gray-400 placeholder:font-normal focus:bg-white transition-all w-full"
            />
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto border border-gray-100 rounded-xl">
          <Table>
            <TableHeader className="bg-gray-50/80">
              <TableRow className="border-b border-gray-100">
                <TableHead className="text-[11px] font-bold text-gray-500 uppercase tracking-wider py-3.5 pl-4">
                  Order ID
                </TableHead>
                <TableHead className="text-[11px] font-bold text-gray-500 uppercase tracking-wider py-3.5">
                  Date
                </TableHead>
                <TableHead className="text-[11px] font-bold text-gray-500 uppercase tracking-wider py-3.5">
                  Customer
                </TableHead>
                <TableHead className="text-[11px] font-bold text-gray-500 uppercase tracking-wider py-3.5">
                  Status
                </TableHead>
                <TableHead className="text-[11px] font-bold text-gray-500 uppercase tracking-wider py-3.5 text-right">
                  Total
                </TableHead>
                <TableHead className="text-[11px] font-bold text-gray-500 uppercase tracking-wider py-3.5 pr-4 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentOrders.length > 0 ? (
                currentOrders.map((ord) => {
                  const statusLabel = normalizeStatusLabel(ord?.orderStatus);
                  const statusStyle = getStatusBadgeStyle(ord?.orderStatus);

                  return (
                    <TableRow key={ord?._id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                      {/* Order ID */}
                      <TableCell className="font-extrabold text-[#111344] text-xs py-4 pl-4 font-mono tracking-tight">
                        {formatOrderId(ord?._id)}
                      </TableCell>

                      {/* Date */}
                      <TableCell className="text-xs text-gray-600 font-medium py-4 whitespace-nowrap">
                        {formatOrderDate(ord?.orderDate || ord?.createdAt)}
                      </TableCell>

                      {/* Customer */}
                      <TableCell className="py-4">
                        <div className="font-bold text-xs text-gray-900">
                          {ord?.addressInfo?.fullName || ord?.userName || "Customer"}
                        </div>
                        {ord?.addressInfo?.phone && (
                          <div className="text-[11px] text-gray-500 font-medium mt-0.5">
                            {ord.addressInfo.phone}
                          </div>
                        )}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusStyle}`}>
                          {statusLabel}
                        </span>
                      </TableCell>

                      {/* Total */}
                      <TableCell className="text-xs font-black text-gray-900 py-4 text-right font-mono">
                        {formatFullNaira(ord?.totalAmount)}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="py-4 pr-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleFetchOrderDetails(ord?._id)}
                            className="h-8 px-3 bg-[#111344] hover:bg-[#0C1172] text-white text-xs font-bold rounded-lg gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Eye size={13} />
                            <span>View</span>
                          </Button>

                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => handleConfirmDelete(ord?._id)}
                            className="h-8 w-8 p-0 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-gray-400">
                    <PackageCheck size={36} className="mx-auto mb-2 text-gray-300" />
                    <p className="text-sm font-semibold text-gray-600">No orders found</p>
                    <p className="text-xs text-gray-400 mt-0.5">Try adjusting your filters or search terms</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards View */}
        <div className="lg:hidden space-y-3">
          {currentOrders.length > 0 ? (
            currentOrders.map((ord) => {
              const statusLabel = normalizeStatusLabel(ord?.orderStatus);
              const statusStyle = getStatusBadgeStyle(ord?.orderStatus);

              return (
                <div
                  key={ord?._id}
                  className="rounded-xl border border-gray-100 bg-white p-3.5 shadow-xs space-y-3"
                >
                  {/* Top row: Order ID + Status */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-xs font-mono text-[#111344]">
                        {formatOrderId(ord?._id)}
                      </span>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusStyle}`}>
                      {statusLabel}
                    </span>
                  </div>

                  {/* Customer & Date */}
                  <div className="text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-gray-800 font-bold">
                      <User size={13} className="text-gray-400 shrink-0" />
                      <span className="truncate">{ord?.addressInfo?.fullName || ord?.userName || "Customer"}</span>
                    </div>

                    {ord?.addressInfo?.phone && (
                      <div className="flex items-center gap-1.5 text-gray-500 font-medium text-[11px]">
                        <Phone size={12} className="text-gray-400 shrink-0" />
                        <span>{ord.addressInfo.phone}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 text-gray-400 font-medium text-[11px]">
                      <Calendar size={12} className="text-gray-400 shrink-0" />
                      <span>{formatOrderDate(ord?.orderDate || ord?.createdAt)}</span>
                    </div>
                  </div>

                  {/* Bottom Row: Total & Action */}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        Total
                      </span>
                      <span className="text-sm font-black text-gray-900 font-mono">
                        {formatFullNaira(ord?.totalAmount)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleFetchOrderDetails(ord?._id)}
                        className="h-7 px-3 bg-[#111344] hover:bg-[#0C1172] text-white text-xs font-bold rounded-lg gap-1 cursor-pointer"
                      >
                        <Eye size={12} />
                        <span>View</span>
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleConfirmDelete(ord?._id)}
                        className="h-7 w-7 p-0 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 text-gray-400 bg-gray-50/50 rounded-xl">
              <PackageCheck size={32} className="mx-auto mb-2 text-gray-300" />
              <p className="text-xs font-bold text-gray-600">No orders found</p>
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        {totalItems > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-gray-100 text-xs text-gray-500 font-medium">
            <span className="text-[11px] sm:text-xs text-center sm:text-left whitespace-nowrap">
              Showing {startIndex + 1}–{Math.min(endIndex, totalItems)} of {totalItems} orders
            </span>

            <div className="flex items-center justify-center gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-8 px-2.5 text-xs font-semibold rounded-lg shrink-0 cursor-pointer disabled:opacity-40"
              >
                <ChevronLeft size={13} className="mr-1" /> Prev
              </Button>

              <span className="px-2.5 text-xs font-bold text-gray-700 whitespace-nowrap shrink-0 select-none">
                {currentPage}&nbsp;/&nbsp;{totalPages}
              </span>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-8 px-2.5 text-xs font-semibold rounded-lg shrink-0 cursor-pointer disabled:opacity-40"
              >
                Next <ChevronRight size={13} className="ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Order Details Dialog */}
      <Dialog
        open={openDetailsDialog}
        onOpenChange={(open) => {
          setOpenDetailsDialog(open);
          if (!open) dispatch(resetOrderDetails());
        }}
      >
        <AdminOrderDetailsView orderDetails={orderDetails} onClose={() => setOpenDetailsDialog(false)} />
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-gray-900">
              Confirm Order Deletion
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs sm:text-sm text-gray-600">
            <p>
              Are you sure you want to permanently delete this order? This action cannot be reversed.
            </p>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 font-mono text-xs font-bold text-[#111344]">
              {formatOrderId(selectedOrderId)}
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpenDeleteDialog(false)}
              className="text-xs font-bold rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDeleteOrder}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl"
            >
              Delete Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminOrdersView;
