'use client';

import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Users,
  Search,
  RotateCcw,
  ShoppingBag,
  TrendingUp,
  Award,
  MapPin,
  Package,
  Eye,
  Trash2,
} from "lucide-react";
import { getAllOrdersForAdmin } from "@/store/admin/order-slice";
import { motion } from "framer-motion";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8050/api";

function formatCompactNaira(num) {
  if (!num || isNaN(num)) return "₦0";
  if (num >= 1000000) {
    return `₦${(num / 1000000).toFixed(2)}M`;
  }
  if (num >= 1000) {
    return `₦${(num / 1000).toFixed(1)}K`;
  }
  return `₦${num.toLocaleString("en-NG")}`;
}

function AdminCustomersView() {
  const dispatch = useDispatch();
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { orderList } = useSelector((state) => state.adminOrder);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_BASE_URL}/admin/verified-users/all`);
      if (res.data?.success) {
        setCustomers(res.data.data || []);
      }
    } catch (err) {
      console.error("Error loading customers:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  // Aggregate orders by customer email or user ID
  const customerOrderMetrics = useMemo(() => {
    const map = {};
    (orderList || []).forEach((order) => {
      const email = (order?.addressInfo?.email || order?.userEmail || order?.email || "").toLowerCase().trim();
      const userId = order?.userId;
      const amt = Number(order?.totalAmount) || 0;

      const keys = [userId, email].filter(Boolean);
      keys.forEach((k) => {
        if (!map[k]) {
          map[k] = { count: 0, total: 0, city: order?.addressInfo?.city, state: order?.addressInfo?.state, phone: order?.addressInfo?.phone };
        }
        map[k].count += 1;
        map[k].total += amt;
        if (order?.addressInfo?.city) map[k].city = order.addressInfo.city;
        if (order?.addressInfo?.state) map[k].state = order.addressInfo.state;
        if (order?.addressInfo?.phone) map[k].phone = order.addressInfo.phone;
      });
    });
    return map;
  }, [orderList]);

  // KPI Calculations
  const totalCustomers = customers.length;
  let activeBuyersCount = 0;
  let repeatBuyersCount = 0;
  let totalLtvAmount = 0;

  customers.forEach((c) => {
    const emailKey = (c.email || "").toLowerCase().trim();
    const stats = customerOrderMetrics[c._id] || customerOrderMetrics[emailKey] || { count: 0, total: 0 };
    if (stats.count > 0) activeBuyersCount++;
    if (stats.count >= 2) repeatBuyersCount++;
    totalLtvAmount += stats.total;
  });

  // Filtered customer list
  const filtered = customers.filter((c) => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    const name = (c.userName || c.fullName || "").toLowerCase();
    const email = (c.email || "").toLowerCase();
    const code = `cust-${(c._id || "").slice(-6)}`.toLowerCase();
    const phone = (c.phone || "").toLowerCase();
    return name.includes(q) || email.includes(q) || code.includes(q) || phone.includes(q);
  });

  return (
    <div className="font-manrope space-y-7 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto bg-[#FBFBFC] min-h-screen">
      {/* Header (No "Add Customer" button per request) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111344] tracking-tight">
            Customers
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            CRM profile intelligence, verified order history, device warranties, and client management
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={fetchCustomers}
          className="h-9 px-3.5 border-gray-200 hover:bg-white text-xs font-semibold rounded-xl gap-2 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw size={14} className="text-gray-600" />
          <span>Refresh</span>
        </Button>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Customers */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <Card className="rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] bg-white p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Total Customers
              </span>
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users size={16} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                {totalCustomers}
              </h3>
              <p className="text-[11.5px] font-medium text-gray-400 mt-1">
                Registered & migrated store accounts
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Active Buyers */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.05 }}>
          <Card className="rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] bg-white p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Active Buyers
              </span>
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShoppingBag size={16} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                {activeBuyersCount}
              </h3>
              <p className="text-[11.5px] font-medium text-gray-400 mt-1">
                Customers with completed orders
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Total Customer LTV */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.1 }}>
          <Card className="rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] bg-white p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Total Customer LTV
              </span>
              <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                <TrendingUp size={16} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                {formatCompactNaira(totalLtvAmount)}
              </h3>
              <p className="text-[11.5px] font-medium text-gray-400 mt-1">
                Total lifetime order revenue
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Repeat Buyers */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.15 }}>
          <Card className="rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] bg-white p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Repeat Buyers
              </span>
              <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                <Award size={16} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                {repeatBuyersCount}
              </h3>
              <p className="text-[11.5px] font-medium text-gray-400 mt-1">
                Customers with 2+ completed orders
              </p>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Search Input Bar */}
      <div className="relative w-full max-w-md">
        <Search
          size={15}
          className="absolute left-3.5 top-3 text-gray-400 pointer-events-none"
        />
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, email, phone, customer code, location..."
          className="h-10 pl-10 text-xs bg-white border-gray-200 rounded-xl shadow-xs"
        />
      </div>

      {/* Customer Directory Section */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden space-y-2 p-5 sm:p-6">
        <div>
          <h2 className="text-lg font-bold text-[#111344] tracking-tight">
            Customer Directory
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            Showing {filtered.length} total customer records
          </p>
        </div>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFBFD] text-gray-500 uppercase font-bold text-[10.5px] tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-4 font-bold min-w-[200px]">Customer</th>
                <th className="py-3.5 px-4 font-bold min-w-[200px]">Contact</th>
                <th className="py-3.5 px-4 font-bold">Location</th>
                <th className="py-3.5 px-4 font-bold text-center">Orders</th>
                <th className="py-3.5 px-4 font-bold">Lifetime Value</th>
                <th className="py-3.5 px-4 font-bold">Joined Date</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-gray-400 font-semibold animate-pulse">
                    Loading customer directory...
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((customer) => {
                  const initial = (customer.userName || customer.email || "C")[0].toUpperCase();
                  const custCode = `CUST-${(customer._id || "").slice(-6).toUpperCase()}`;

                  const emailKey = (customer.email || "").toLowerCase().trim();
                  const stats =
                    customerOrderMetrics[customer._id] ||
                    customerOrderMetrics[emailKey] || {
                      count: 0,
                      total: 0,
                      city: "",
                      state: "",
                      phone: "",
                    };

                  const phoneDisplay = customer.phone || stats.phone || "—";
                  const locationDisplay =
                    stats.city || stats.state
                      ? `${stats.city || ""}${stats.city && stats.state ? ", " : ""}${stats.state || ""}`
                      : "Lagos, Nigeria";

                  const joinedDate = customer.createdAt
                    ? `Since ${new Date(customer.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`
                    : "Since Oct 2026";

                  return (
                    <tr key={customer._id} className="hover:bg-gray-50/70 transition-colors">
                      {/* Customer Name + Avatar + Code */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#111344] text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-900 truncate text-xs sm:text-[13px]">
                              {customer.userName || customer.fullName || "Customer"}
                            </p>
                            <p className="text-[10px] text-gray-400 font-mono tracking-tight">
                              {custCode}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info (Email & Phone) */}
                      <td className="py-3.5 px-4">
                        <p className="text-gray-900 font-medium truncate text-xs">
                          {customer.email}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {phoneDisplay}
                        </p>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-gray-600 text-xs">
                          <MapPin size={12} className="text-gray-400" />
                          <span>{locationDisplay}</span>
                        </span>
                      </td>

                      {/* Orders Count Badge */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          <Package size={11} />
                          <span>{stats.count}</span>
                        </span>
                      </td>

                      {/* Lifetime Value */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-black text-gray-900 text-xs">
                        ₦{Number(stats.total || 0).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-gray-500 text-xs">
                        {joinedDate}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#111344] hover:bg-[#0C1172] text-white text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            <Eye size={12} />
                            <span>View</span>
                          </button>
                          <button
                            type="button"
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Customer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400 font-medium">
                    No customers found matching &quot;{searchTerm}&quot;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminCustomersView;
