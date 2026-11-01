'use client';
import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "../ui/table";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import ShoppingOrderDetailsView from "./order-details";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersByUserId, getOrderDetails, resetOrderDetails } from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";
import { motion } from 'framer-motion';
import { Package, Calendar, Eye, Truck, CheckCircle, Clock, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails, isLoading } = useSelector((state) => state.shopOrder);

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
  }

  useEffect(() => {
    if (user?.id) {
      dispatch(getAllOrdersByUserId(user.id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  const totalItems = orderList?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = orderList?.slice(startIndex, endIndex) || [];

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
      case "inProcess":
      case "in process":
      case "inShipping":
      case "shipping":
        return <Clock className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
      case "inProcess":
      case "in process":
      case "inShipping":
      case "shipping":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatOrderId = (id) => {
    if (!id) return "N/A";
    return `ORD${id.slice(-8).toUpperCase()}`;
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const PaginationControls = () => (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pb-4">
      <div className="text-sm text-gray-500 font-medium">
        Showing <span className="text-gray-900 font-bold">{startIndex + 1}</span> to <span className="text-gray-900 font-bold">{Math.min(endIndex, totalItems)}</span> of <span className="text-gray-900 font-bold">{totalItems}</span> orders
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-9 px-3 border-gray-200 hover:bg-peach-50 hover:text-peach-600 hover:border-peach-200 disabled:opacity-50 font-bold transition-all"
        >
          Previous
        </Button>

        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(page => {
              if (totalPages <= 5) return true;
              return Math.abs(page - currentPage) <= 1 || page === 1 || page === totalPages;
            })
            .map((page, index, array) => {
              const showEllipsis = index > 0 && page - array[index - 1] > 1;
              return (
                <div key={page} className="flex items-center gap-1">
                  {showEllipsis && <span className="text-gray-400 px-1 font-bold">...</span>}
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className={`h-9 w-9 p-0 font-bold transition-all ${currentPage === page
                      ? "bg-peach-500 hover:bg-peach-600 text-white border-peach-500 shadow-sm"
                      : "border-gray-200 hover:bg-peach-50 hover:text-peach-600 hover:border-peach-200"
                      }`}
                  >
                    {page}
                  </Button>
                </div>
              );
            })
          }
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-9 px-3 border-gray-200 hover:bg-peach-50 hover:text-peach-600 hover:border-peach-200 disabled:opacity-50 font-bold transition-all"
        >
          Next
        </Button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-peach-100 border-t-peach-500 animate-spin"></div>
          <Package className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-peach-500" />
        </div>
        <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-xs">Loading your orders...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {orderList && orderList.length > 0 ? (
        <Card className="shadow-sm border-0 bg-transparent">
          <CardHeader className="pb-4 border-b border-gray-100 px-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2 text-gray-900">
                <Package className="h-6 w-6 text-peach-500" />
                My Orders
                <Badge variant="secondary" className="bg-peach-50 text-peach-600 border-peach-100 ml-2">
                  {totalItems} Total
                </Badge>
              </CardTitle>

              <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-100 shadow-sm">
                <span className="text-[10px] font-black text-gray-400 px-2 uppercase tracking-widest">Show:</span>
                {[5, 10, 20].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      setItemsPerPage(num);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${itemsPerPage === num
                      ? "bg-peach-500 text-white shadow-sm"
                      : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-6">
            {/* Desktop View Table */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                    <TableHead className="font-bold text-gray-400 uppercase text-[10px] tracking-widest pl-6">Order ID</TableHead>
                    <TableHead className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Date
                      </div>
                    </TableHead>
                    <TableHead className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">Status</TableHead>
                    <TableHead className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px]">₦</span>
                        Amount
                      </div>
                    </TableHead>
                    <TableHead className="font-bold text-gray-400 uppercase text-[10px] tracking-widest text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentOrders.map((orderItem, index) => (
                    <motion.tr
                      key={orderItem._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-gray-50/30 transition-all border-b border-gray-50 last:border-b-0"
                    >
                      <TableCell className="font-bold text-gray-900 pl-6">
                        {formatOrderId(orderItem?._id)}
                      </TableCell>
                      <TableCell className="text-gray-600 font-medium">
                        {orderItem?.orderDate ? new Date(orderItem.orderDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`py-1.5 px-3 rounded-full border shadow-sm ${getStatusColor(orderItem?.orderStatus)}`}
                          variant="outline"
                        >
                          <div className="flex items-center gap-1.5">
                            {getStatusIcon(orderItem?.orderStatus)}
                            <span className="text-[11px] font-bold uppercase tracking-wider">
                              {orderItem?.orderStatus}
                            </span>
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell className="font-black text-gray-900">
                        ₦{orderItem?.totalAmount?.toLocaleString("en-NG")}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Dialog
                          open={openDetailsDialog}
                          onOpenChange={() => {
                            setOpenDetailsDialog(false);
                            dispatch(resetOrderDetails());
                          }}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFetchOrderDetails(orderItem?._id)}
                            className="h-9 px-4 rounded-xl border-gray-200 hover:bg-peach-50 hover:text-peach-600 hover:border-peach-200 transition-all font-bold text-xs"
                          >
                            <Eye className="h-3.5 w-3.5 mr-2" />
                            View Details
                          </Button>
                          <ShoppingOrderDetailsView orderDetails={orderDetails} />
                        </Dialog>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile View Cards */}
            <div className="md:hidden space-y-4">
              {currentOrders.map((orderItem, index) => (
                <motion.div
                  key={orderItem?._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4 hover:border-peach-200 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest pl-0.5">Order ID</p>
                      <p className="font-black text-gray-900 tracking-tight">{formatOrderId(orderItem?._id)}</p>
                    </div>
                    <Badge
                      className={`py-1.5 px-3 rounded-full border shadow-sm ${getStatusColor(orderItem?.orderStatus)}`}
                      variant="outline"
                    >
                      <div className="flex items-center gap-1.5">
                        {getStatusIcon(orderItem?.orderStatus)}
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          {orderItem?.orderStatus}
                        </span>
                      </div>
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Date</p>
                      <p className="text-xs font-bold text-gray-700">
                        {orderItem?.orderDate ? new Date(orderItem.orderDate).toLocaleDateString('en-NG') : 'N/A'}
                      </p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Amount</p>
                      <p className="text-sm font-black text-peach-600">
                        ₦{orderItem?.totalAmount?.toLocaleString("en-NG")}
                      </p>
                    </div>
                  </div>

                  <div className="pt-1">
                    <Dialog
                      open={openDetailsDialog}
                      onOpenChange={() => {
                        setOpenDetailsDialog(false);
                        dispatch(resetOrderDetails());
                      }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFetchOrderDetails(orderItem?._id)}
                        className="w-full h-12 flex items-center justify-center gap-2 rounded-xl border-gray-200 hover:bg-peach-50 hover:text-peach-600 hover:border-peach-200 transition-all font-bold text-sm shadow-sm"
                      >
                        <Eye className="h-4 w-4" />
                        Order Details
                      </Button>
                      <ShoppingOrderDetailsView orderDetails={orderDetails} />
                    </Dialog>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && <PaginationControls />}
          </CardContent>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-20"
        >
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-12 max-w-md mx-auto relative overflow-hidden">
            {/* Decorative Background Element */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-peach-50 rounded-full blur-2xl opacity-60" />

            <div className="w-20 h-20 bg-peach-50 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
              <Package className="h-10 w-10 text-peach-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2 relative z-10">No Orders Yet</h3>
            <p className="text-gray-500 mb-8 relative z-10">Select from our wide range of gadgets and place your first order today!</p>
            <Button asChild className="bg-peach-500 hover:bg-peach-600 text-white px-8 py-6 rounded-[6px] font-bold shadow-lg shadow-peach-100 transition-all hover:scale-105 active:scale-95">
              <Link to="/shop/listing">Start Shopping Now</Link>
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default ShoppingOrders;