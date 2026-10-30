'use client';


// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import Address from "@/components/shopping-view/address";
// import ShoppingOrders from "@/components/shopping-view/orders";
// import { Button } from "@/components/ui/button";

// function ShoppingAccount() {
//   return (
//     <motion.div
//       className="flex flex-col"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       {/* Header with Peach Theme */}
//       <div className="relative w-full h-[370px] bg-gradient-to-r from-[#FF9F80] to-[#FFCBA4] flex justify-center items-center text-white">
//         <h2 className="text-3xl font-bold">My Shopping Account</h2>
//       </div>

//       <div className="container mx-auto grid grid-cols-1 gap-8 py-8">
//         <motion.div
//           className="flex flex-col rounded-lg border bg-background p-6 shadow-sm"
//           initial={{ scale: 0.95 }}
//           animate={{ scale: 1 }}
//           transition={{ duration: 0.3 }}
//         >
//           <Tabs defaultValue="orders">
//             <TabsList>
//               <TabsTrigger value="orders">Orders</TabsTrigger>
//               <TabsTrigger value="address">Address</TabsTrigger>
//             </TabsList>

//             {/* Orders Tab */}
//             <TabsContent value="orders">
//               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
//                 <ShoppingOrders />
//                 {/* Return to Shop Button */}
//                 <div className="mt-6 flex justify-center">
//                   <Button asChild className="bg-peach-500 hover:bg-peach-300 text-white font-semibold">
//                     <Link to="/shop/home">← Return to Shop</Link>
//                   </Button>
//                 </div>
//               </motion.div>
//             </TabsContent>

//             {/* Address Tab */}
//             <TabsContent value="address">
//               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
//                 <Address />
//               </motion.div>
//             </TabsContent>
//           </Tabs>
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// }

// export default ShoppingAccount;

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";
import { Button } from "@/components/ui/button";
import { Package, MapPin, Home, ShoppingBag } from "lucide-react";

function ShoppingAccount() {
  return (
    <motion.div
      className="font-body flex flex-col min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Enhanced Header */}
      <div className="relative w-full h-64 bg-gradient-to-r from-[#FF9F80] via-[#FFB896] to-[#FFCBA4] flex flex-col justify-center items-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <motion.div 
          className="relative z-10 text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <ShoppingBag className="h-8 w-8" />
            </div>
          </div>
          <h1 className="font-manrope text-4xl font-bold tracking-tight mb-2">My Account</h1>
          <p className="text-white/90 text-lg">Manage your orders and addresses</p>
        </motion.div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-50 rounded-t-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 -mt-8 relative z-10 max-w-6xl">
        <motion.div
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Tabs defaultValue="orders" className="w-full">
            <div className="border-b border-gray-200">
              <TabsList className="h-16 bg-transparent px-6">
                <TabsTrigger 
                  value="orders" 
                  className="flex items-center gap-3 px-6 py-3 data-[state=active]:bg-peach-50 data-[state=active]:text-peach-600 data-[state=active]:border-b-2 data-[state=active]:border-peach-500"
                >
                  <Package className="h-5 w-5" />
                  <span className="font-semibold">My Orders</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="address" 
                  className="flex items-center gap-3 px-6 py-3 data-[state=active]:bg-peach-50 data-[state=active]:text-peach-600 data-[state=active]:border-b-2 data-[state=active]:border-peach-500"
                >
                  <MapPin className="h-5 w-5" />
                  <span className="font-semibold">My Addresses</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Orders Tab */}
            <TabsContent value="orders" className="m-0 p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
                    <p className="text-gray-600 mt-1">Track and manage your purchases</p>
                  </div>
                </div>
                
                <ShoppingOrders />
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t border-gray-200">
                  <Button 
                    asChild 
                    variant="outline" 
                    className="flex items-center gap-2 border-peach-200 text-peach-600 hover:bg-peach-50"
                  >
                    <Link to="/shop/home">
                      <Home className="h-4 w-4" />
                      Return to Shop
                    </Link>
                  </Button>
                  
                  <Button 
                    asChild 
                    className="bg-peach-500 hover:bg-peach-600 text-white font-semibold shadow-lg shadow-peach-200"
                  >
                    <Link to="/shop/listing">
                      <ShoppingBag className="h-4 w-4" />
                      Continue Shopping
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </TabsContent>

            {/* Address Tab */}
            <TabsContent value="address" className="m-0 p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">My Addresses</h2>
                  <p className="text-gray-600 mt-1">Manage your delivery addresses</p>
                </div>
                <Address />
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default ShoppingAccount;