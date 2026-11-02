'use client';


// import { useState } from "react";
// import { motion } from "framer-motion";
// import CommonForm from "../common/form";
// import { DialogContent, DialogTitle } from "../ui/dialog";
// import { Label } from "../ui/label";
// import { Separator } from "../ui/separator";
// import { Badge } from "../ui/badge";
// import { useDispatch, useSelector } from "react-redux";
// import { updateOrderStatus, getOrderDetailsForAdmin, getAllOrdersForAdmin } from "@/store/admin/order-slice";
// import { useToast } from "../ui/use-toast";
// import { Loader2 } from "lucide-react"; // Correct icon for loading

// const initialFormData = {
//   status: "",
// };

// function AdminOrderDetailsView({ orderDetails }) {
//   const [formData, setFormData] = useState(initialFormData);
//   const [isLoading, setIsLoading] = useState(false); // For loading state
//   const { user } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   const { toast } = useToast();

//   // Handle the order status update
//   function handleUpdateStatus(event) {
//     event.preventDefault();
//     const { status } = formData;
//     setIsLoading(true); // Show loader

//     dispatch(updateOrderStatus({ id: orderDetails?._id, orderStatus: status }))
//       .then((data) => {
//         if (data?.payload?.success) {
//           dispatch(getOrderDetailsForAdmin(orderDetails?._id));
//           dispatch(getAllOrdersForAdmin());
//           setFormData(initialFormData);
//           toast({
//             title: data?.payload?.message,
//           });
//         }
//       })
//       .finally(() => {
//         setIsLoading(false); // Hide loader
//       });
//   }

//   return (
//     <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
//       <DialogTitle>Order Details</DialogTitle>
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         exit={{ opacity: 0, scale: 0.95 }}
//         transition={{ duration: 0.3 }}
//         className="grid gap-6"
//       >
//         {/* Order Details Section */}
//         <div className="grid gap-1">
//           <div className="flex mt-6 items-center justify-between">
//             <p className="font-medium">Order ID</p>
//             <Label>{orderDetails?._id}</Label>
//           </div>
//           <div className="flex mt-2 items-center justify-between">
//             <p className="font-medium">Order Date</p>
//             <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
//           </div>
//           <div className="flex mt-2 items-center justify-between">
//             <p className="font-medium">Order Price</p>
//             <Label>₦{orderDetails?.totalAmount - orderDetails?.deliveryPrice}</Label>
//           </div>
//           <div className="flex mt-2 items-center justify-between">
//             <p className="font-medium">Delivery Price</p>
//             <Label>₦{orderDetails?.deliveryPrice}</Label>
//           </div>
//           <div className="flex mt-2 items-center justify-between">
//             <p className="font-medium">Total Amount with Delivery</p>
//             <Label>₦{orderDetails?.totalAmount}</Label>
//           </div>
//           <div className="flex mt-2 items-center justify-between">
//             <p className="font-medium">Payment method</p>
//             <Label>{orderDetails?.paymentMethod}</Label>
//           </div>
//           <div className="flex mt-2 items-center justify-between">
//             <p className="font-medium">Payment Status</p>
//             <Label>{orderDetails?.paymentStatus}</Label>
//           </div>
//           <div className="flex mt-2 items-center justify-between">
//             <p className="font-medium">Order Status</p>
//             <Label>
//               <Badge
//                 className={`py-1 px-3 ${
//                   orderDetails?.orderStatus === "confirmed"
//                     ? "bg-green-500"
//                     : orderDetails?.orderStatus === "rejected"
//                     ? "bg-red-600"
//                     : "bg-black"
//                 }`}
//                 as={motion.div}
//                 animate={{ opacity: 1 }}
//                 initial={{ opacity: 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 {orderDetails?.orderStatus}
//               </Badge>
//             </Label>
//           </div>
//         </div>
//         <Separator />

//         {/* Order Items */}
//         <div className="grid gap-4">
//           <div className="grid gap-2">
//             <div className="font-medium">Order Details</div>
//             <ul className="grid gap-3">
//               {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
//                 ? orderDetails?.cartItems.map((item) => (
//                     <motion.li
//                       key={item._id}
//                       className="flex items-center justify-between"
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       exit={{ opacity: 0 }}
//                       transition={{ duration: 0.3 }}
//                     >
//                       <span>Title: {item.title}</span>
//                       <span>Quantity: {item.quantity}</span>
//                       <span>Price: ₦{item.price}</span>
//                     </motion.li>
//                   ))
//                 : null}
//             </ul>
//           </div>
//         </div>

//         {/* Shipping Info */}
//         <div className="grid gap-4">
//           <div className="grid gap-2">
//             <div className="font-medium">Shipping Info</div>
//             <div className="grid gap-0.5 text-muted-foreground">
//               <span>{orderDetails?.addressInfo?.fullName}</span>
//               <span>{orderDetails?.addressInfo?.address}</span>
//               <span>{orderDetails?.addressInfo?.lga}</span>
//               <span>{orderDetails?.addressInfo?.state}</span>
//               {/* <span>{orderDetails?.addressInfo?.pincode}</span> */}
//               <span>{orderDetails?.addressInfo?.phone}</span>
//               <span>{orderDetails?.addressInfo?.notes}</span>
//             </div>
//           </div>
//         </div>

//         {/* Order Status Update Form */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.3 }}
//         >
//           <CommonForm
//             formControls={[
//               {
//                 label: "Order Status",
//                 name: "status",
//                 componentType: "select",
//                 options: [
//                   { id: "pending", label: "pending" },
//                   { id: "in process", label: "in process" },
//                   { id: "inShipping", label: "inShipping" },
//                   { id: "rejected", label: "rejected" },
//                   { id: "delivered", label: "delivered" },
//                 ],
//               },
//             ]}
//             formData={formData}
//             setFormData={setFormData}
//             buttonText={"Update Order Status"}
//             onSubmit={handleUpdateStatus}
//           />
//         </motion.div>

//         {/* Loading Indicator */}
//         {isLoading && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.3 }}
//             className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
//           >
//             <Loader2 className="animate-spin text-white" size={48} />
//           </motion.div>
//         )}
//       </motion.div>
//     </DialogContent>
//   );
// }

// export default AdminOrderDetailsView;

import { useState } from "react";
import { motion } from "framer-motion";
import CommonForm from "../common/form";
import { DialogContent, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { updateOrderStatus, getOrderDetailsForAdmin, getAllOrdersForAdmin } from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";
import { Loader2, Package, Calendar, Truck, MapPin, User, Phone, FileText, CreditCard, ShoppingCart } from "lucide-react";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;
    if (!status) {
      toast({
        title: "Error",
        description: "Please select a status",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    dispatch(updateOrderStatus({ id: orderDetails?._id, orderStatus: status }))
      .then((data) => {
        if (data?.payload?.success) {
          dispatch(getOrderDetailsForAdmin(orderDetails?._id));
          dispatch(getAllOrdersForAdmin());
          setFormData(initialFormData);
          toast({
            title: "Status Updated",
            description: data?.payload?.message,
            variant: "default",
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

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

  const formatOrderId = (id) => {
    if (!id) return "N/A";
    return `ORD${id.slice(-8).toUpperCase()}`;
  };

  // Calculate total items and subtotal
  const totalItems = orderDetails?.cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const itemsSubtotal = orderDetails?.cartItems?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;

  return (
    <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
      <DialogTitle className="flex items-center gap-2">
        <Package className="h-5 w-5 text-blue-600" />
        Order Details - {formatOrderId(orderDetails?._id)}
      </DialogTitle>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="grid gap-6 relative"
      >
        {/* Loading Overlay */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 rounded-lg z-10"
          >
            <div className="bg-white rounded-lg p-4 flex items-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="font-medium">Updating Status...</span>
            </div>
          </motion.div>
        )}

        {/* Order Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-semibold text-blue-800">₦</span>
              <span className="font-semibold text-blue-800">Order Total</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">
              ₦{orderDetails?.totalAmount?.toLocaleString("en-NG")}
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingCart className="h-4 w-4 text-green-600" />
              <span className="font-semibold text-green-800">Items</span>
            </div>
            <p className="text-2xl font-bold text-green-900">
              {totalItems}
            </p>
            <p className="text-sm text-green-700 mt-1">
              {orderDetails?.cartItems?.length || 0} products
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="h-4 w-4 text-purple-600" />
              <span className="font-semibold text-purple-800">Delivery</span>
            </div>
            <p className="text-2xl font-bold text-purple-900">
              ₦{orderDetails?.deliveryPrice?.toLocaleString("en-NG")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-600" />
              Order Information
            </h3>
            <div className="space-y-3 bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order Date:</span>
                <Label className="font-medium">
                  {orderDetails?.orderDate ? new Date(orderDetails.orderDate).toLocaleDateString('en-NG') : 'N/A'}
                </Label>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Payment Method:</span>
                <Label className="font-medium capitalize">{orderDetails?.paymentMethod}</Label>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Payment Status:</span>
                <Badge variant="outline" className="capitalize">
                  {orderDetails?.paymentStatus}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Current Status:</span>
                <Badge className={`py-2 px-3 ${getStatusColor(orderDetails?.orderStatus)}`}>
                  {orderDetails?.orderStatus}
                </Badge>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-gray-600" />
              Customer Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{orderDetails?.addressInfo?.fullName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{orderDetails?.addressInfo?.phone}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                <div>
                  <p>{orderDetails?.addressInfo?.address}</p>
                  <p className="text-sm text-gray-600">
                    {orderDetails?.addressInfo?.lga}, {orderDetails?.addressInfo?.state}
                  </p>
                </div>
              </div>
              {orderDetails?.addressInfo?.notes && (
                <div className="flex items-start gap-2 pt-2 border-t border-gray-200">
                  <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <span className="font-medium block mb-1 text-sm">Delivery Notes:</span>
                    <span className="text-gray-600 text-sm">{orderDetails?.addressInfo?.notes}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Package className="h-5 w-5 text-gray-600" />
              Order Items ({orderDetails?.cartItems?.length || 0})
            </h3>
          </div>
          <div className="border rounded-lg overflow-hidden">
            {orderDetails?.cartItems?.map((item, index) => (
              <motion.div
                key={item._id || index}
                className={`flex items-center justify-between p-4 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center gap-3 flex-1">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-12 h-12 rounded-lg object-cover border"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm line-clamp-2">{item.title}</p>
                    {(item.selectedStorage || item.selectedRam || item.selectedColor || item.selectedCondition) && (
                      <p className="text-xs text-orange-600 font-medium">
                        {[item.selectedCondition, item.selectedStorage, item.selectedRam ? `${item.selectedRam} RAM` : null, item.selectedColor].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    <p className="text-gray-600 text-xs">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₦{item.price?.toLocaleString("en-NG")}</p>
                  <p className="text-gray-600 text-xs">
                    Total: ₦{(item.price * item.quantity)?.toLocaleString("en-NG")}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Order Summary */}
            <div className="bg-gray-100 border-t border-gray-200 p-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Items Subtotal:</span>
                <span className="font-semibold">₦{itemsSubtotal?.toLocaleString("en-NG")}</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-1">
                <span className="text-gray-600">Delivery Fee:</span>
                <span className="font-semibold">₦{orderDetails?.deliveryPrice?.toLocaleString("en-NG")}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Amount:</span>
                <span className="text-orange-600">₦{orderDetails?.totalAmount?.toLocaleString("en-NG")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Status Update Form */}
        <div className="space-y-4 border-t pt-6">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-600" />
            Update Order Status
          </h3>
          <CommonForm
            formControls={[
              {
                label: "New Order Status",
                name: "status",
                componentType: "select",
                placeholder: "Select status...",
                options: [
                  { id: "pending", label: "⏳ Pending" },
                  { id: "confirmed", label: "✅ Confirmed" },
                  { id: "inProcess", label: "🔧 In Process" },
                  { id: "shipping", label: "🚚 In Shipping" },
                  { id: "delivered", label: "📦 Delivered" },
                  { id: "rejected", label: "❌ Rejected" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText={isLoading ? "Updating..." : "Update Status"}
            onSubmit={handleUpdateStatus}
            isBtnDisabled={isLoading || !formData.status}
            className="bg-gray-50 rounded-lg p-4"
          />
        </div>
      </motion.div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;