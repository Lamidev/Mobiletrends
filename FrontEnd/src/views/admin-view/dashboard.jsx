'use client';

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllOrdersForAdmin } from "@/store/admin/order-slice";
import { fetchVerifiedUserCount } from "@/store/admin/verified-users-slice";
import { fetchAllProducts } from "@/store/admin/products-slice";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  ShoppingCart,
  TrendingUp,
  Package,
  PlusCircle,
  Eye,
  ArrowRight,
  ShieldCheck,
  Store,
} from "lucide-react";
import { motion } from "framer-motion";

function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { verifiedUserCount, isLoading: isUsersLoading } = useSelector(
    (state) => state.verifiedUsers
  );
  const { orderList, isLoading: isOrdersLoading } = useSelector(
    (state) => state.adminOrder
  );
  const { productList } = useSelector(
    (state) => state.adminProducts
  );

  useEffect(() => {
    dispatch(fetchVerifiedUserCount());
    dispatch(getAllOrdersForAdmin());
    dispatch(fetchAllProducts());
  }, [dispatch]);

  // Derived statistics
  const totalOrders = orderList?.length || 0;
  const totalRevenue = useMemo(() => {
    if (!orderList || orderList.length === 0) return 0;
    return orderList.reduce((sum, order) => {
      // count confirmed or paid orders
      const amount = Number(order?.totalAmount) || 0;
      return sum + amount;
    }, 0);
  }, [orderList]);

  const totalProducts = productList?.length || 0;
  const recentOrders = useMemo(() => {
    if (!orderList || orderList.length === 0) return [];
    return [...orderList].slice(0, 5);
  }, [orderList]);

  const kpis = [
    {
      title: "Total Revenue",
      value: `₦${totalRevenue.toLocaleString("en-NG")}`,
      subtitle: "Gross sales across orders",
      icon: <TrendingUp className="w-5 h-5 text-[#111344]" />,
      bg: "bg-blue-50/80 border-blue-100",
    },
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      subtitle: `${orderList?.filter(o => o.orderStatus === 'confirmed').length || 0} confirmed`,
      icon: <ShoppingCart className="w-5 h-5 text-[#DF5E00]" />,
      bg: "bg-orange-50/80 border-orange-100",
    },
    {
      title: "Products in Catalog",
      value: totalProducts.toString(),
      subtitle: "Active stock inventory",
      icon: <Package className="w-5 h-5 text-indigo-700]" />,
      bg: "bg-indigo-50/80 border-indigo-100",
    },
    {
      title: "Registered Customers",
      value: (verifiedUserCount || 0).toString(),
      subtitle: "Verified user accounts",
      icon: <Users className="w-5 h-5 text-emerald-700" />,
      bg: "bg-emerald-50/80 border-emerald-100",
    },
  ];

  return (
    <div className="font-manrope space-y-7 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111344] tracking-tight">
            Mobiletrends Operations Hub
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
            Live overview of sales, active inventory, and customer activities.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="h-9 sm:h-10 px-4 bg-[#111344] hover:bg-[#0C1172] text-white text-xs sm:text-sm font-bold rounded-xl gap-2 shadow-sm"
          >
            <PlusCircle size={15} />
            <span>Add Product</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/shop/home")}
            className="h-9 sm:h-10 px-3.5 border-gray-200 hover:bg-gray-100 text-xs sm:text-sm font-semibold rounded-xl gap-1.5"
          >
            <Store size={15} className="text-gray-500" />
            <span className="hidden sm:inline">Storefront</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {kpis.map((kpi, idx) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          >
            <Card className="rounded-2xl border border-gray-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)] bg-white overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {kpi.title}
                  </span>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${kpi.bg}`}>
                    {kpi.icon}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                    {kpi.value}
                  </h3>
                  <p className="text-[11px] font-medium text-gray-400 mt-0.5">
                    {kpi.subtitle}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => navigate("/admin/products")}
          className="p-5 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-[#111344]/30 cursor-pointer shadow-sm hover:shadow transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#111344] text-white flex items-center justify-center mb-3">
            <Package size={20} />
          </div>
          <h4 className="font-bold text-base text-gray-900 group-hover:text-[#111344] flex items-center justify-between">
            <span>Manage Products</span>
            <ArrowRight size={16} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
          </h4>
          <p className="text-xs text-gray-500 mt-1 font-medium">
            Add new devices, configure pricing variants, and update stock.
          </p>
        </div>

        <div
          onClick={() => navigate("/admin/orders")}
          className="p-5 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-[#DF5E00]/30 cursor-pointer shadow-sm hover:shadow transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#DF5E00] text-white flex items-center justify-center mb-3">
            <ShoppingCart size={20} />
          </div>
          <h4 className="font-bold text-base text-gray-900 group-hover:text-[#DF5E00] flex items-center justify-between">
            <span>Customer Orders</span>
            <ArrowRight size={16} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
          </h4>
          <p className="text-xs text-gray-500 mt-1 font-medium">
            Review incoming orders, process shipments, and inspect receipts.
          </p>
        </div>

        <div
          onClick={() => navigate("/admin/customers")}
          className="p-5 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-emerald-500/30 cursor-pointer shadow-sm hover:shadow transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3">
            <Users size={20} />
          </div>
          <h4 className="font-bold text-base text-gray-900 group-hover:text-emerald-700 flex items-center justify-between">
            <span>Customers Directory</span>
            <ArrowRight size={16} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
          </h4>
          <p className="text-xs text-gray-500 mt-1 font-medium">
            View registered user profiles, account verifications, and histories.
          </p>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Recent Customer Orders</h3>
            <p className="text-xs text-gray-500 font-medium">Latest purchase transactions</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/orders")}
            className="text-xs font-bold text-[#111344] hover:text-[#0C1172] gap-1"
          >
            <span>View All</span>
            <ArrowRight size={13} />
          </Button>
        </div>

        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase font-bold text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3 px-3">Order ID</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Total</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {recentOrders.map((order) => {
                  const statusColors = {
                    pending: "bg-amber-50 text-amber-700 border-amber-200",
                    confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    delivered: "bg-blue-50 text-blue-700 border-blue-200",
                    rejected: "bg-rose-50 text-rose-700 border-rose-200",
                  };
                  const color = statusColors[order?.orderStatus] || "bg-gray-100 text-gray-700 border-gray-200";

                  return (
                    <tr key={order?._id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-gray-900">
                        #{order?._id?.slice(-6)?.toUpperCase()}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-gray-900 block">
                          {order?.addressInfo?.fullName || "Guest Customer"}
                        </span>
                        <span className="text-[10.5px] text-gray-400">
                          {order?.payerId || order?.addressInfo?.phone || ""}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-gray-500">
                        {order?.orderDate ? new Date(order.orderDate).toLocaleDateString() : "—"}
                      </td>
                      <td className="py-3 px-3 font-bold text-[#111344]">
                        ₦{Number(order?.totalAmount || 0).toLocaleString("en-NG")}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${color}`}>
                          {order?.orderStatus || "Pending"}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate("/admin/orders")}
                          className="h-7 px-2 text-[11px] font-bold text-[#111344] hover:bg-gray-100 rounded-md"
                        >
                          <Eye size={12} className="mr-1" />
                          Details
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-400 text-xs font-medium">
            No orders placed yet.
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
