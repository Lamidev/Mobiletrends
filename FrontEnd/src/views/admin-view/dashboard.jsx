'use client';

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllOrdersForAdmin } from "@/store/admin/order-slice";
import { fetchVerifiedUserCount } from "@/store/admin/verified-users-slice";
import { fetchAllProducts } from "@/store/admin/products-slice";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  RotateCcw,
  Search,
  Package,
  ShoppingBag,
  Users,
  ChevronDown,
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
  return `₦${num.toLocaleString("en-NG")}`;
}

function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { verifiedUserCount } = useSelector((state) => state.verifiedUsers);
  const { orderList } = useSelector((state) => state.adminOrder);
  const { productList } = useSelector((state) => state.adminProducts);

  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleRefresh = () => {
    dispatch(fetchVerifiedUserCount());
    dispatch(getAllOrdersForAdmin());
    dispatch(fetchAllProducts());
  };

  useEffect(() => {
    handleRefresh();
  }, [dispatch]);

  // Derived statistics
  const totalOrders = orderList?.length || 0;
  const totalRevenue = useMemo(() => {
    if (!orderList || orderList.length === 0) return 0;
    return orderList.reduce((sum, order) => {
      const amount = Number(order?.totalAmount) || 0;
      return sum + amount;
    }, 0);
  }, [orderList]);

  const totalProducts = productList?.length || 0;
  const totalCustomers = verifiedUserCount || 0;

  // Filter orders by Status and Search (no Buy Now/Swap/POD)
  const filteredOrders = useMemo(() => {
    if (!orderList || orderList.length === 0) return [];
    return orderList.filter((order) => {
      const status = (order?.orderStatus || "pending").toLowerCase();
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "confirmed" && (status.includes("confirm") || status.includes("paid"))) ||
        (statusFilter === "pending" && status.includes("pending")) ||
        (statusFilter === "cancelled" && (status.includes("cancel") || status.includes("reject")));

      const q = searchQuery.toLowerCase().trim();
      const customerName = (order?.addressInfo?.fullName || order?.userName || "").toLowerCase();
      const orderId = (order?._id || "").toLowerCase();
      const matchesSearch = !q || customerName.includes(q) || orderId.includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [orderList, statusFilter, searchQuery]);

  return (
    <div className="font-manrope space-y-7 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto bg-[#FBFBFC] min-h-screen">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111344] tracking-tight">
          Dashboard
        </h1>

        <Button
          type="button"
          variant="outline"
          onClick={handleRefresh}
          className="h-9 px-3.5 border-gray-200 hover:bg-white text-xs font-semibold rounded-xl gap-2 shadow-xs cursor-pointer"
        >
          <RotateCcw size={14} className="text-gray-600" />
          <span>Refresh</span>
        </Button>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Revenue */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <Card className="rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] bg-white p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Total Revenue
              </span>
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                ₦
              </div>
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">
                {formatCompactNaira(totalRevenue)}
              </h3>
              <p className="text-[11.5px] font-medium text-gray-400 mt-1">
                Direct cash collected & reconciled
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Total Products */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.05 }}>
          <Card className="rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] bg-white p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Total Products
              </span>
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <Package size={16} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                {totalProducts}
              </h3>
              <p className="text-[11.5px] font-medium text-gray-400 mt-1">
                Active & catalogued devices
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Total Orders */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.1 }}>
          <Card className="rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] bg-white p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Total Orders
              </span>
              <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                <ShoppingBag size={16} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                {totalOrders}
              </h3>
              <p className="text-[11.5px] font-medium text-gray-400 mt-1">
                All lifetime orders recorded
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Total Customers */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.15 }}>
          <Card className="rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] bg-white p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Total Customers
              </span>
              <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                <Users size={16} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                {totalCustomers}
              </h3>
              <p className="text-[11.5px] font-medium text-gray-400 mt-1">
                Registered client accounts
              </p>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recent Orders Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-[#111344] tracking-tight">
            Recent Orders
          </h2>
          <button
            type="button"
            onClick={() => navigate("/admin/orders")}
            className="text-xs font-bold text-gray-500 hover:text-[#111344] transition-colors cursor-pointer"
          >
            see all
          </button>
        </div>

        {/* Filter Toolbar & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Status Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-[#111344] text-white shadow-xs">
              All Orders ({totalOrders})
            </span>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search
              size={14}
              className="absolute left-3 top-2.5 text-gray-400 pointer-events-none"
            />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product or customer"
              className="h-9 pl-9 text-xs bg-white border-gray-200 rounded-xl"
            />
          </div>
        </div>

        {/* Orders Table (Without Buy Now / Swap / POD) */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFBFD] text-gray-500 uppercase font-bold text-[10.5px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Order ID</th>
                  <th className="py-3.5 px-4 font-bold">Date</th>
                  <th className="py-3.5 px-4 font-bold">Customer</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold">Fulfilment</th>
                  <th className="py-3.5 px-4 font-bold text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {filteredOrders.length > 0 ? (
                  filteredOrders.slice(0, 10).map((order) => {
                    const rawDate = order?.orderDate ? new Date(order.orderDate) : new Date();
                    const formattedDate =
                      rawDate.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }) +
                      `, ${rawDate.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}`;

                    // Status badge
                    const status = (order?.orderStatus || "Pending").toLowerCase();
                    let statusLabel = order?.orderStatus || "Pending";
                    let statusClass = "bg-amber-50 text-amber-700";
                    if (status.includes("cancel") || status.includes("reject")) {
                      statusLabel = "Cancelled";
                      statusClass = "bg-rose-50 text-rose-600";
                    } else if (status.includes("confirm") || status.includes("paid")) {
                      statusLabel = "Confirmed";
                      statusClass = "bg-emerald-50 text-emerald-700";
                    } else if (status.includes("pending")) {
                      statusLabel = "Pending Payment";
                      statusClass = "bg-gray-100 text-gray-700";
                    }

                    // Fulfilment status
                    let fulfilment = "Placed";
                    if (status.includes("deliver")) fulfilment = "Delivered";
                    else if (status.includes("cancel")) fulfilment = "Cancelled";
                    else if (status.includes("process") || status.includes("confirm")) fulfilment = "In Process";

                    return (
                      <tr
                        key={order?._id}
                        onClick={() => navigate("/admin/orders")}
                        className="hover:bg-gray-50/70 transition-colors cursor-pointer"
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-gray-900 tracking-tight">
                          ORD-{order?._id ? order._id.slice(-8).toUpperCase() : "N/A"}
                        </td>
                        <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                          {formattedDate}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-gray-900">
                          {order?.addressInfo?.fullName || order?.userName || "Customer"}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${statusClass}`}>
                            {statusLabel}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-50 border border-gray-200 text-gray-700 text-[11px] font-semibold">
                            <span>{fulfilment}</span>
                            <ChevronDown size={11} className="text-gray-400" />
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right font-black text-gray-900 whitespace-nowrap">
                          ₦{Number(order?.totalAmount || 0).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-gray-400 font-medium">
                      No matching orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
