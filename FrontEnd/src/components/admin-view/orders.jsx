'use client';
// import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";
// import {
//   Table,
//   TableBody,
//   TableHead,
//   TableHeader,
//   TableRow,
//   TableCell,
// } from "../ui/table";
// import { Button } from "../ui/button";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
// import AdminOrderDetailsView from "./order-details";
// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getAllOrdersForAdmin,
//   getOrderDetailsForAdmin,
//   resetOrderDetails,
//   deleteOrder,
// } from "@/store/admin/order-slice";
// import { Badge } from "../ui/badge";
// import { motion } from "framer-motion";
// import { useToast } from "@/components/ui/use-toast";

// function AdminOrdersView() {
//   const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
//   const [selectedOrderId, setSelectedOrderId] = useState(null);
//   const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
//   const dispatch = useDispatch();
//   const { toast } = useToast();

//   function handleFetchOrderDetails(getId) {
//     dispatch(getOrderDetailsForAdmin(getId));
//   }

//   function handleConfirmDelete(id) {
//     setSelectedOrderId(id);
//     setOpenDeleteDialog(true);
//   }

//   function handleDeleteOrder() {
//     if (!selectedOrderId) return;
//     dispatch(deleteOrder(selectedOrderId))
//       .unwrap()
//       .then((res) => {
//         toast({ title: "Success", description: res.message });
//         dispatch(getAllOrdersForAdmin()); // Refresh orders list
//       })
//       .catch(() => {
//         toast({ title: "Error", description: "Failed to delete order!" });
//       });
//     setOpenDeleteDialog(false);
//     setSelectedOrderId(null);
//   }

//   useEffect(() => {
//     dispatch(getAllOrdersForAdmin());
//   }, [dispatch]);

//   useEffect(() => {
//     if (orderDetails !== null) setOpenDetailsDialog(true);
//   }, [orderDetails]);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -10 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//     >
//       <Card>
//         <CardHeader>
//           <CardTitle>All Orders</CardTitle>
//           <CardContent>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Order Id</TableHead>
//                   <TableHead>Order Date</TableHead>
//                   <TableHead>Order Status</TableHead>
//                   <TableHead>Order Price</TableHead>
//                   <TableHead>
//                     <span className="sr-only">Actions</span>
//                   </TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {orderList && orderList.length > 0
//                   ? orderList.map((orderItem) => (
//                       <motion.tr
//                         key={orderItem?._id}
//                         initial={{ opacity: 0, scale: 0.95 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         transition={{ duration: 0.2 }}
//                       >
//                         <TableCell>{orderItem?._id}</TableCell>
//                         <TableCell>
//                           {orderItem?.orderDate.split("T")[0]}
//                         </TableCell>
//                         <TableCell>
//                           <Badge
//                             className={`py-1 px-3 ${
//                               orderItem?.orderStatus === "confirmed"
//                                 ? "bg-green-500"
//                                 : orderItem?.orderStatus === "rejected"
//                                 ? "bg-red-600"
//                                 : "bg-black"
//                             }`}
//                           >
//                             {orderItem?.orderStatus}
//                           </Badge>
//                         </TableCell>
//                         <TableCell>₦{orderItem?.totalAmount}</TableCell>
//                         <TableCell>
//                           <Dialog
//                             open={openDetailsDialog}
//                             onOpenChange={() => {
//                               setOpenDetailsDialog(false);
//                               dispatch(resetOrderDetails());
//                             }}
//                           >
//                             <Button
//                               onClick={() =>
//                                 handleFetchOrderDetails(orderItem?._id)
//                               }
//                               className="px-2 py-1 text-sm font-medium"
//                             >
//                               View Details
//                             </Button>
//                             <AdminOrderDetailsView orderDetails={orderDetails} />
//                           </Dialog>
//                           <Button
//                             onClick={() => handleConfirmDelete(orderItem?._id)}
//                             className="px-2 py-1 text-sm font-medium bg-red-600 hover:bg-red-700 ml-2"
//                           >
//                             Delete
//                           </Button>
//                         </TableCell>
//                       </motion.tr>
//                     ))
//                   : null}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </CardHeader>
//       </Card>

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Confirm Deletion</DialogTitle>
//           </DialogHeader>
//           <p>Are you sure you want to delete this order? This action cannot be undone.</p>
//           <DialogFooter>
//             <Button variant="ghost" onClick={() => setOpenDeleteDialog(false)}>
//               Cancel
//             </Button>
//             <Button className="bg-red-600 hover:bg-red-700" onClick={handleDeleteOrder}>
//               Confirm Delete
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </motion.div>
//   );
// }

// export default AdminOrdersView;


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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import AdminOrderDetailsView from "./order-details";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
  deleteOrder,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Package, Calendar, Eye, Trash2, Users, Search, RefreshCw, Phone, MapPin, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Input } from "../ui/input";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { orderList, orderDetails, isLoading } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  function handleConfirmDelete(id) {
    setSelectedOrderId(id);
    setOpenDeleteDialog(true);
  }

  function handleDeleteOrder() {
    if (!selectedOrderId) return;
    dispatch(deleteOrder(selectedOrderId))
      .unwrap()
      .then((res) => {
        toast({
          title: "Success",
          description: res.message,
          variant: "default"
        });
        dispatch(getAllOrdersForAdmin());
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to delete order!",
          variant: "destructive"
        });
      });
    setOpenDeleteDialog(false);
    setSelectedOrderId(null);
  }

  function handleRefreshOrders() {
    dispatch(getAllOrdersForAdmin());
    setCurrentPage(1); // Reset to first page on refresh
    toast({
      title: "Refreshed",
      description: "Order list updated successfully",
    });
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  const formatOrderId = (id) => {
    if (!id) return "N/A";
    return `ORD${id.slice(-8).toUpperCase()}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "in process":
      case "inProcess":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "inShipping":
      case "shipping":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return "✅";
      case "delivered":
        return "📦";
      case "pending":
        return "⏳";
      case "rejected":
        return "❌";
      case "in process":
      case "inProcess":
        return "🔧";
      case "inShipping":
      case "shipping":
        return "🚚";
      default:
        return "📋";
    }
  };

  const filteredOrders = orderList?.filter(order => {
    const matchesSearch = order?._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order?.addressInfo?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order?.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const statusCounts = orderList?.reduce((acc, order) => {
    acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
    acc.total = (acc.total || 0) + 1;
    return acc;
  }, {});

  // Pagination calculations
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const PaginationControls = () => (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
      {/* Page info */}
      <div className="text-sm text-gray-600">
        Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} orders
      </div>

      {/* Pagination buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 h-8"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        {/* Page numbers */}
        <div className="flex gap-1 mx-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(page => {
              if (totalPages <= 5) return true;
              return Math.abs(page - currentPage) <= 1 || page === 1 || page === totalPages;
            })
            .map((page, index, array) => {
              const showEllipsis = index > 0 && page - array[index - 1] > 1;
              return (
                <div key={page} className="flex items-center gap-1">
                  {showEllipsis && <span className="text-gray-400 px-1">...</span>}
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className={`h-8 w-8 p-0 text-xs ${currentPage === page ? "bg-[#111344] hover:bg-[#0C1172] text-white" : ""}`}
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
          className="flex items-center gap-1 px-3 h-8"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="font-body space-y-6"
    >
      {/* Header Stats - Improved mobile layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs sm:text-sm font-medium">Total Orders</p>
                <p className="text-xl sm:text-2xl font-bold">{statusCounts?.total || 0}</p>
              </div>
              <Package className="h-6 w-6 sm:h-8 sm:w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs sm:text-sm font-medium">Confirmed</p>
                <p className="text-xl sm:text-2xl font-bold">{statusCounts?.confirmed || 0}</p>
              </div>
              <Users className="h-6 w-6 sm:h-8 sm:w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-xs sm:text-sm font-medium">Delivered</p>
                <p className="text-xl sm:text-2xl font-bold">{statusCounts?.delivered || 0}</p>
              </div>
              <Package className="h-6 w-6 sm:h-8 sm:w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                  <Package className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  Order Management
                </CardTitle>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage and track all customer orders</p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  onClick={handleRefreshOrders}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 flex-1 sm:flex-none"
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm sm:text-base"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="inProcess">In Process</option>
              <option value="shipping">In Shipping</option>
              <option value="delivered">Delivered</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Items Per Page Selector - MOVED TO TOP */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="5">5 orders</option>
                <option value="10">10 orders</option>
                <option value="20">20 orders</option>
                <option value="50">50 orders</option>
              </select>
              <span className="text-xs text-gray-500 hidden sm:inline">
                per page
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Total: <span className="font-semibold">{totalItems}</span> orders
              {searchTerm && (
                <span className="text-xs text-blue-600 ml-2">
                  (filtered)
                </span>
              )}
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="font-semibold">Order ID</TableHead>
                  <TableHead className="font-semibold">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Date
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">Customer</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">
                    <div className="flex items-center gap-1">
                      <span className="text-sm">₦</span>
                      Amount
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentOrders.length > 0 ? (
                  currentOrders.map((orderItem, index) => (
                    <motion.tr
                      key={orderItem?._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-all border-b border-gray-100 last:border-b-0"
                    >
                      <TableCell className="font-manrope text-sm font-semibold">
                        {formatOrderId(orderItem?._id)}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {orderItem?.orderDate ? new Date(orderItem.orderDate).toLocaleDateString('en-NG') : 'N/A'}
                      </TableCell>
                      <TableCell className="font-medium">
                        {orderItem?.addressInfo?.fullName || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`py-2 px-3 rounded-full border ${getStatusColor(orderItem?.orderStatus)}`}
                          variant="outline"
                        >
                          <div className="flex items-center gap-1.5">
                            <span>{getStatusIcon(orderItem?.orderStatus)}</span>
                            <span className="font-medium capitalize">
                              {orderItem?.orderStatus}
                            </span>
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        ₦{orderItem?.totalAmount?.toLocaleString("en-NG")}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Dialog
                            open={openDetailsDialog}
                            onOpenChange={() => {
                              setOpenDetailsDialog(false);
                              dispatch(resetOrderDetails());
                            }}
                          >
                            <Button
                              onClick={() => handleFetchOrderDetails(orderItem?._id)}
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                            <AdminOrderDetailsView orderDetails={orderDetails} />
                          </Dialog>
                          <Button
                            onClick={() => handleConfirmDelete(orderItem?._id)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 border-red-200 text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Package className="h-12 w-12 mb-4 text-gray-300" />
                        <p className="text-lg font-semibold mb-2">No orders found</p>
                        <p className="text-sm">
                          {searchTerm || statusFilter !== "all"
                            ? "Try adjusting your search or filters"
                            : "No orders have been placed yet"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {currentOrders.length > 0 ? (
              currentOrders.map((orderItem, index) => (
                <motion.div
                  key={orderItem?._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-manrope text-sm font-semibold text-blue-600">
                          {formatOrderId(orderItem?._id)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {orderItem?.orderDate ? new Date(orderItem.orderDate).toLocaleDateString('en-NG') : 'N/A'}
                        </p>
                      </div>
                      <Badge
                        className={`py-1 px-2 rounded-full border text-xs ${getStatusColor(orderItem?.orderStatus)}`}
                        variant="outline"
                      >
                        <div className="flex items-center gap-1">
                          <span className="text-xs">{getStatusIcon(orderItem?.orderStatus)}</span>
                          <span className="font-medium capitalize">
                            {orderItem?.orderStatus}
                          </span>
                        </div>
                      </Badge>
                    </div>

                    {/* Customer Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-sm">
                          {orderItem?.addressInfo?.fullName || 'N/A'}
                        </span>
                      </div>
                      {orderItem?.addressInfo?.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {orderItem.addressInfo.phone}
                          </span>
                        </div>
                      )}
                      {orderItem?.addressInfo?.state && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {orderItem.addressInfo.state}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Amount and Actions */}
                    <div className="flex justify-between items-center pt-2 border-t">
                      <div>
                        <p className="text-xs text-gray-500">Total Amount</p>
                        <p className="font-semibold text-lg">
                          ₦{orderItem?.totalAmount?.toLocaleString("en-NG")}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Dialog
                          open={openDetailsDialog}
                          onOpenChange={() => {
                            setOpenDetailsDialog(false);
                            dispatch(resetOrderDetails());
                          }}
                        >
                          <Button
                            onClick={() => handleFetchOrderDetails(orderItem?._id)}
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <AdminOrderDetailsView orderDetails={orderDetails} />
                        </Dialog>
                        <Button
                          onClick={() => handleConfirmDelete(orderItem?._id)}
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 border-red-200 text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 border rounded-lg">
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <Package className="h-12 w-12 mb-4 text-gray-300" />
                  <p className="text-lg font-semibold mb-2">No orders found</p>
                  <p className="text-sm">
                    {searchTerm || statusFilter !== "all"
                      ? "Try adjusting your search or filters"
                      : "No orders have been placed yet"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalItems > 0 && <PaginationControls />}

          {/* Summary */}
          {currentOrders.length > 0 && (
            <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
              <span className="text-xs sm:text-sm">
                Page {currentPage} of {totalPages}
              </span>
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm("")}
                  className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm"
                >
                  Clear search
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600 text-lg sm:text-xl">
              <Trash2 className="h-5 w-5" />
              Confirm Order Deletion
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600 text-sm sm:text-base">
              Are you sure you want to delete this order? This action cannot be undone and will permanently remove the order from the system.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800 font-medium">
                Order: {formatOrderId(selectedOrderId)}
              </p>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setOpenDeleteDialog(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
              onClick={handleDeleteOrder}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

export default AdminOrdersView;