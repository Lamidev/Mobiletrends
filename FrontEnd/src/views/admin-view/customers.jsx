'use client';

import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Phone,
  Mail,
  Calendar,
  ExternalLink,
  CheckCircle2,
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

function AdminCustomersView() {
  const dispatch = useDispatch();
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Selected customer for View Dialog
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const { orderList } = useSelector((state) => state.adminOrder);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_BASE_URL}/admin/verified-users/all`);
      if (res.data?.success) {
        const raw = res.data.data || [];
        // Strictly show users tagged as 'user' (never admins)
        const cleanCustomers = raw.filter((c) => c?.role === "user");
        setCustomers(cleanCustomers);
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
      const email = (order?.addressInfo?.email || order?.userEmail || order?.email || order?.payerId || "").toLowerCase().trim();
      const userId = order?.userId;
      const amt = Number(order?.totalAmount) || 0;

      const keys = [userId, email].filter(Boolean);
      keys.forEach((k) => {
        if (!map[k]) {
          map[k] = {
            count: 0,
            total: 0,
            city: order?.addressInfo?.city,
            state: order?.addressInfo?.state,
            address: order?.addressInfo?.address,
            phone: order?.addressInfo?.phone,
          };
        }
        map[k].count += 1;
        map[k].total += amt;
        if (order?.addressInfo?.city) map[k].city = order.addressInfo.city;
        if (order?.addressInfo?.state) map[k].state = order.addressInfo.state;
        if (order?.addressInfo?.address) map[k].address = order.addressInfo.address;
        if (order?.addressInfo?.phone) map[k].phone = order.addressInfo.phone;
      });
    });
    return map;
  }, [orderList]);

  // Orders specific to selected customer
  const selectedCustomerOrders = useMemo(() => {
    if (!selectedCustomer || !orderList) return [];
    const custId = selectedCustomer._id;
    const custEmail = (selectedCustomer.email || "").toLowerCase().trim();

    return orderList.filter((ord) => {
      const ordUser = ord.userId;
      const ordEmail = (ord.payerId || ord.addressInfo?.email || "").toLowerCase().trim();
      return ordUser === custId || ordEmail === custEmail;
    });
  }, [selectedCustomer, orderList]);

  // Derived KPI metrics
  const totalCustomers = customers.length; // Registered store accounts (role === 'user')

  // Group all orders by distinct buyer (email or userId) — registered or guest
  const buyerSummary = useMemo(() => {
    const map = {};
    (orderList || []).forEach((order) => {
      const email = (
        order?.addressInfo?.email ||
        order?.userEmail ||
        order?.email ||
        order?.payerId ||
        ""
      ).toLowerCase().trim();
      const userId = order?.userId;
      const key = email || (userId ? `uid-${userId}` : `ord-${order?._id}`);
      if (!key) return;

      if (!map[key]) {
        map[key] = { count: 0, total: 0 };
      }
      map[key].count += 1;
      map[key].total += Number(order?.totalAmount) || 0;
    });
    return map;
  }, [orderList]);

  // Active buyers: purchased at least once (registered or guest)
  const activeBuyersCount = Object.values(buyerSummary).filter((b) => b.count >= 1).length;

  // Repeat buyers: bought more than once (2+ orders, registered or guest)
  const repeatBuyersCount = Object.values(buyerSummary).filter((b) => b.count >= 2).length;

  // Total LTV recorded from all orders
  const totalLtvAmount = (orderList || []).reduce(
    (sum, ord) => sum + (Number(ord?.totalAmount) || 0),
    0
  );

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

  const handleOpenView = (customer) => {
    setSelectedCustomer(customer);
    setIsViewOpen(true);
  };

  return (
    <div className="font-manrope space-y-7 p-2 sm:p-6 lg:p-8 max-w-7xl mx-auto bg-[#FBFBFC] min-h-screen">
      {/* Header: Refresh button strictly opposite Customers text on the right end */}
      <div className="flex items-center justify-between pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111344] tracking-tight">
            Customers
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            CRM profile intelligence, verified order history, and client management
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={fetchCustomers}
          className="h-9 px-3.5 border-gray-200 hover:bg-white text-xs font-semibold rounded-xl gap-2 shadow-xs cursor-pointer shrink-0"
        >
          <RotateCcw size={14} className={`text-gray-600 ${isLoading ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>

      {/* 4 Top KPI Cards (Stacked in Twos on Mobile) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {/* Total Customers */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <Card className="rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] bg-white p-3.5 sm:p-5 space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider truncate">
                Total Customers
              </span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Users size={15} />
              </div>
            </div>
            <div>
              <h3 className="text-lg sm:text-2xl lg:text-3xl font-black text-gray-900 tracking-tight truncate">
                {totalCustomers}
              </h3>
              <p className="text-[10px] sm:text-[11.5px] font-medium text-gray-400 mt-0.5 line-clamp-1">
                Registered store accounts
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Active Buyers */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.05 }}>
          <Card className="rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] bg-white p-3.5 sm:p-5 space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider truncate">
                Active Buyers
              </span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShoppingBag size={15} />
              </div>
            </div>
            <div>
              <h3 className="text-lg sm:text-2xl lg:text-3xl font-black text-emerald-600 tracking-tight truncate">
                {activeBuyersCount}
              </h3>
              <p className="text-[10px] sm:text-[11.5px] font-medium text-gray-400 mt-0.5 line-clamp-1">
                Registered or guest (1+ orders)
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Total Customer LTV */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.1 }}>
          <Card className="rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] bg-white p-3.5 sm:p-5 space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider truncate">
                Total Customer LTV
              </span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <TrendingUp size={15} />
              </div>
            </div>
            <div>
              <h3 className="text-lg sm:text-2xl lg:text-3xl font-black text-gray-900 tracking-tight truncate">
                {formatCompactNaira(totalLtvAmount)}
              </h3>
              <p className="text-[10px] sm:text-[11.5px] font-medium text-gray-400 mt-0.5 line-clamp-1">
                Total order revenue
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Repeat Buyers */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.15 }}>
          <Card className="rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] bg-white p-3.5 sm:p-5 space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider truncate">
                Repeat Buyers
              </span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Award size={15} />
              </div>
            </div>
            <div>
              <h3 className="text-lg sm:text-2xl lg:text-3xl font-black text-gray-900 tracking-tight truncate">
                {repeatBuyersCount}
              </h3>
              <p className="text-[10px] sm:text-[11.5px] font-medium text-gray-400 mt-0.5 line-clamp-1">
                Purchased more than once (2+ orders)
              </p>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search
          size={15}
          className="absolute left-3.5 top-3 text-gray-400 pointer-events-none"
        />
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, email, phone, customer code, location..."
          className="h-10 pl-10 text-base sm:text-xs placeholder:text-[11px] sm:placeholder:text-xs placeholder:text-gray-400 placeholder:font-normal bg-white border-gray-200 rounded-xl shadow-xs"
        />
      </div>

      {/* Customer Directory Section */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden space-y-2 p-3.5 sm:p-6">
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
                      : "Nigeria";

                  const joinedDate = customer.createdAt
                    ? `Since ${new Date(customer.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`
                    : "Active Member";

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
                        {formatFullNaira(stats.total)}
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
                            onClick={() => handleOpenView(customer)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#111344] hover:bg-[#0C1172] text-white text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            <Eye size={12} />
                            <span>View</span>
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

      {/* Customer Full Profile View Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-4 sm:p-7 bg-white rounded-2xl border-none shadow-2xl font-manrope">
          {selectedCustomer && (() => {
            const initial = (selectedCustomer.userName || selectedCustomer.email || "C")[0].toUpperCase();
            const custCode = `CUST-${(selectedCustomer._id || "").slice(-6).toUpperCase()}`;
            const emailKey = (selectedCustomer.email || "").toLowerCase().trim();
            const stats = customerOrderMetrics[selectedCustomer._id] || customerOrderMetrics[emailKey] || {
              count: 0,
              total: 0,
              city: "",
              state: "",
              address: "",
              phone: "",
            };
            const phoneVal = selectedCustomer.phone || stats.phone || "";

            return (
              <>
                <DialogHeader className="pb-4 border-b border-gray-100 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#111344] text-white font-extrabold flex items-center justify-center text-lg shadow-sm shrink-0">
                      {initial}
                    </div>
                    <div>
                      <DialogTitle className="text-lg font-black text-[#111344] tracking-tight">
                        {selectedCustomer.userName || selectedCustomer.fullName || "Customer Profile"}
                      </DialogTitle>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">
                        {custCode} · {selectedCustomer.createdAt ? `Joined ${new Date(selectedCustomer.createdAt).toLocaleDateString("en-GB")}` : "Active Account"}
                      </p>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-6 pt-4">
                  {/* KPI Tiles for this Customer */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-100">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        Lifetime Spend
                      </span>
                      <span className="text-sm sm:text-base font-black text-gray-900 font-mono mt-0.5 block">
                        {formatFullNaira(stats.total)}
                      </span>
                    </div>

                    <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-100">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        Total Orders
                      </span>
                      <span className="text-sm sm:text-base font-black text-gray-900 font-mono mt-0.5 block">
                        {stats.count} {stats.count === 1 ? "order" : "orders"}
                      </span>
                    </div>

                    <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-100">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        Average Order
                      </span>
                      <span className="text-sm sm:text-base font-black text-gray-900 font-mono mt-0.5 block">
                        {formatFullNaira(stats.count > 0 ? stats.total / stats.count : 0)}
                      </span>
                    </div>
                  </div>

                  {/* Customer Information Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Contact & Communication */}
                    <div className="rounded-xl border border-gray-100 bg-white p-3.5 space-y-2.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                        <Phone size={14} className="text-[#111344]" />
                        <span>Contact Info</span>
                      </div>
                      <div className="text-xs space-y-1.5 text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Mail size={13} className="text-gray-400 shrink-0" />
                          <a href={`mailto:${selectedCustomer.email}`} className="text-blue-600 hover:underline font-medium truncate">
                            {selectedCustomer.email}
                          </a>
                        </div>
                        {phoneVal && (
                          <div className="flex items-center gap-1.5">
                            <Phone size={13} className="text-gray-400 shrink-0" />
                            <a href={`tel:${phoneVal}`} className="text-gray-800 font-bold hover:underline">
                              {phoneVal}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="rounded-xl border border-gray-100 bg-white p-3.5 space-y-2.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                        <MapPin size={14} className="text-[#111344]" />
                        <span>Delivery Location</span>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <p className="font-medium text-gray-800">
                          {stats.address || "No primary street address registered"}
                        </p>
                        <p className="text-gray-500 font-medium text-[11px]">
                          {[stats.city, stats.state, "Nigeria"].filter(Boolean).join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order History Table */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        Order History ({selectedCustomerOrders.length})
                      </h4>
                    </div>

                    {selectedCustomerOrders.length > 0 ? (
                      <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100">
                        {selectedCustomerOrders.map((ord) => (
                          <div key={ord._id} className="p-3.5 flex items-center justify-between gap-3 bg-white hover:bg-gray-50/60 transition-colors">
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-black text-xs text-[#111344]">
                                  {formatOrderId(ord._id)}
                                </span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  {ord.orderStatus || "Confirmed"}
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-400">
                                {ord.orderDate ? new Date(ord.orderDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "N/A"} · {ord.cartItems?.length || 0} items
                              </p>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="font-black text-xs sm:text-sm text-gray-900 font-mono">
                                {formatFullNaira(ord.totalAmount)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200 text-xs text-gray-400">
                        No orders recorded yet for this customer account.
                      </div>
                    )}
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminCustomersView;
