'use client';


// import { motion } from "framer-motion";
// import { DialogContent } from "../ui/dialog";
// import { Label } from "../ui/label";
// import { Separator } from "../ui/separator";
// import { Badge } from "../ui/badge";
// import { useSelector } from "react-redux";

// function ShoppingOrderDetailsView({ orderDetails }) {
//   const { user } = useSelector((state) => state.auth);

//   return (
//     <DialogContent className="sm:max-w-[600px]">
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
//               {/* <span>{user.userName}</span> */}
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
//       </motion.div>
//     </DialogContent>
//   );
// }

// export default ShoppingOrderDetailsView;

import { motion } from "framer-motion";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useSelector } from "react-redux";
import { Package, Calendar, DollarSign, Truck, MapPin, User, Phone, FileText, CreditCard } from "lucide-react";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
      case "in process":
      case "inProcess":
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

  return (
    <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="grid gap-6"
      >
        {/* Header */}
        <div className="text-center border-b border-gray-200 pb-4">
          <div className="w-12 h-12 bg-peach-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Package className="h-6 w-6 text-peach-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
          <p className="text-gray-600 mt-1">{formatOrderId(orderDetails?._id)}</p>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Order Date:</span>
              <span>{orderDetails?.orderDate ? new Date(orderDetails.orderDate).toLocaleDateString('en-NG') : 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Payment:</span>
              <span className="capitalize">{orderDetails?.paymentMethod}</span>
            </div>
          </div>
        </div>

        {/* Delivery Timeline Badge */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-peach-50/50 p-4 rounded-xl border border-peach-100 mb-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-peach-700">
            <Truck className="h-4 w-4" />
            <span>Same Day Delivery (Lagos)</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-peach-200" />
          <div className="flex items-center gap-2 text-sm font-semibold text-orange-700">
            <Package className="h-4 w-4" />
            <span>1-2 Days (Outside Lagos)</span>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Package className="h-5 w-5 text-peach-500" />
              Order Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Items Total:</span>
                <Label>₦{(orderDetails?.totalAmount - orderDetails?.deliveryPrice)?.toLocaleString("en-NG")}</Label>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center gap-1">
                  <Truck className="h-4 w-4" />
                  Delivery:
                </span>
                <Label>₦{orderDetails?.deliveryPrice?.toLocaleString("en-NG")}</Label>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Amount:</span>
                <Label className="text-peach-600">₦{orderDetails?.totalAmount?.toLocaleString("en-NG")}</Label>
              </div>
            </div>
          </div>

          {/* Order Status */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-peach-500" />
              Order Status
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order Status:</span>
                <Badge className={`py-2 px-3 ${getStatusColor(orderDetails?.orderStatus)}`}>
                  {orderDetails?.orderStatus}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Payment Status:</span>
                <Badge variant="outline" className="capitalize">
                  {orderDetails?.paymentStatus}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Package className="h-5 w-5 text-peach-500" />
            Order Items ({orderDetails?.cartItems?.length || 0})
          </h3>
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
                    className="w-16 h-16 rounded-lg object-cover border"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm line-clamp-2">{item.title}</p>
                    <p className="text-gray-600 text-xs">Qty: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₦{item.price?.toLocaleString("en-NG")}</p>
                  <p className="text-gray-600 text-xs">₦{(item.price * item.quantity)?.toLocaleString("en-NG")}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Shipping Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-peach-500" />
            Shipping Information
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{orderDetails?.addressInfo?.fullName}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>{orderDetails?.addressInfo?.address}, {orderDetails?.addressInfo?.lga}, {orderDetails?.addressInfo?.state}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span>{orderDetails?.addressInfo?.phone}</span>
            </div>
            {orderDetails?.addressInfo?.notes && (
              <div className="flex items-start gap-2 pt-2 border-t border-gray-200">
                <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                <div>
                  <span className="font-medium block mb-1">Delivery Notes:</span>
                  <span className="text-gray-600">{orderDetails?.addressInfo?.notes}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;