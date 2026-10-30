'use client';


// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getTotalNumberOfOrders } from "@/store/admin/order-slice";
// import { fetchVerifiedUserCount } from "@/store/admin/verified-users-slice";
// import {
//   getFeatureImages,
//   addFeatureImage,
//   deleteFeatureImage,
// } from "@/store/common-slice";
// import ProductImageUpload from "@/components/admin-view/image-upload";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Users, ShoppingCart } from "lucide-react";
// import { motion } from "framer-motion";


// function AdminDashboard() {
//   const dispatch = useDispatch();
//   const { verifiedUserCount, isLoading } = useSelector(
//     (state) => state.verifiedUsers
//   );
//   const { featureImageList } = useSelector((state) => state.commonFeature);
//   const { totalOrders, isLoading: isOrdersLoading } = useSelector(
//     (state) => state.adminOrder
//   );
//   const [imageFile, setImageFile] = useState(null);
//   const [uploadedImageUrl, setUploadedImageUrl] = useState("");
//   const [imageLoadingState, setImageLoadingState] = useState(false);

//   // State for confirming delete
//   const [showConfirmDelete, setShowConfirmDelete] = useState(false);
//   const [imageToDelete, setImageToDelete] = useState(null);

//   useEffect(() => {
//     dispatch(fetchVerifiedUserCount()); // Fetch verified users count on load
//     dispatch(getFeatureImages()); // Fetch feature images
//     dispatch(getTotalNumberOfOrders());
//   }, [dispatch]);

//   function handleUploadFeatureImage() {
//     dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
//       if (data?.payload?.success) {
//         dispatch(getFeatureImages());
//         setImageFile(null);
//         setUploadedImageUrl("");
//       }
//     });
//   }

//   // Function to handle image deletion
//   function handleDeleteFeatureImage(id) {
//     dispatch(deleteFeatureImage(id)); // Dispatch the delete action
//     setShowConfirmDelete(false); // Close the confirmation modal
//     setImageToDelete(null); // Clear the image to delete
//   }

//   // Function to show the confirmation modal
//   function confirmDelete(id) {
//     setImageToDelete(id);
//     setShowConfirmDelete(true);
//   }

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex flex-col md:flex-row gap-6 justify-center">
//         {/* Verified Users Card */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="w-full md:w-1/2"
//         >
//           <Card className="shadow-xl border border-gray-200 bg-white p-4 rounded-lg">
//             <CardHeader className="flex items-center gap-3">
//               <Users className="text-blue-500 w-8 h-8" />
//               <CardTitle>Verified Users</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {isLoading ? (
//                 <p className="text-gray-500">Loading...</p>
//               ) : (
//                 <p className="text-2xl font-bold text-gray-800">
//                   {verifiedUserCount}
//                 </p>
//               )}
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Total Orders Card */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="w-full md:w-1/2"
//         >
//           <Card className="shadow-xl border border-gray-200 bg-white p-4 rounded-lg">
//             <CardHeader className="flex items-center gap-3">
//               <ShoppingCart className="text-green-500 w-8 h-8" />
//               <CardTitle>Total Orders</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {isOrdersLoading ? (
//                 <p className="text-gray-500">Loading...</p>
//               ) : (
//                 <p className="text-2xl font-bold text-gray-800">
//                   {totalOrders}
//                 </p>
//               )}
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>

//       {/* Image Upload Section */}
//       <div>
//         <ProductImageUpload
//           imageFile={imageFile}
//           setImageFile={setImageFile}
//           uploadedImageUrl={uploadedImageUrl}
//           setUploadedImageUrl={setUploadedImageUrl}
//           setImageLoadingState={setImageLoadingState}
//           imageLoadingState={imageLoadingState}
//           isCustomStyling={true}
//         />
//         <Button onClick={handleUploadFeatureImage} className="mt-5 w-full">
//           Upload
//         </Button>
//       </div>

//       {/* Feature Images Section */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {featureImageList &&
//           featureImageList.length > 0 &&
//           featureImageList.map((featureImgItem, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.5 }}
//               className="relative"
//             >
//               <img
//                 src={featureImgItem.image}
//                 className="w-full h-[250px] object-cover rounded-lg shadow-lg"
//                 alt="Feature"
//               />
//               {/* Delete button */}
//               <Button
//                 onClick={() => confirmDelete(featureImgItem._id)}
//                 className="absolute top-2 right-2 bg-red-500 text-white"
//               >
//                 Delete
//               </Button>
//             </motion.div>
//           ))}
//       </div>

      

//       {/* Confirmation Modal */}
//       {showConfirmDelete && (
//         <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
//             <h2 className="text-xl font-semibold text-center mb-4">
//               Confirm Deletion
//             </h2>
//             <p className="text-center mb-6">
//               Are you sure you want to delete this feature image?
//             </p>
//             <div className="flex justify-around">
//               <Button
//                 onClick={() => handleDeleteFeatureImage(imageToDelete)}
//                 className="bg-red-500 text-white"
//               >
//                 Yes, Delete
//               </Button>
//               <Button
//                 onClick={() => setShowConfirmDelete(false)}
//                 className="bg-gray-300 text-black"
//               >
//                 Cancel
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

      
//     </div>
//   );
// }

// export default AdminDashboard;


import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTotalNumberOfOrders } from "@/store/admin/order-slice";
import { fetchVerifiedUserCount } from "@/store/admin/verified-users-slice";
import {
  getFeatureImages,
  addFeatureImage,
  deleteFeatureImage,
} from "@/store/common-slice";
import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShoppingCart, Image, TrendingUp, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

function AdminDashboard() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { verifiedUserCount, isLoading } = useSelector(
    (state) => state.verifiedUsers
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { totalOrders, isLoading: isOrdersLoading } = useSelector(
    (state) => state.adminOrder
  );
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchVerifiedUserCount());
    dispatch(getFeatureImages());
    dispatch(getTotalNumberOfOrders());
  }, [dispatch]);

  function handleUploadFeatureImage() {
    if (!uploadedImageUrl) {
      toast({
        title: "No image to upload",
        description: "Please select and upload an image first",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    dispatch(addFeatureImage(uploadedImageUrl))
      .then((data) => {
        if (data?.payload?.success) {
          dispatch(getFeatureImages());
          setImageFile(null);
          setUploadedImageUrl("");
          setImageLoadingState(false);
          
          toast({
            title: "Success!",
            description: "Feature image uploaded successfully",
            variant: "default",
          });
        } else {
          throw new Error("Upload failed");
        }
      })
      .catch((error) => {
        console.error("Upload error:", error);
        toast({
          title: "Upload failed",
          description: "Failed to upload feature image",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsUploading(false);
      });
  }

  function handleDeleteFeatureImage(id) {
    dispatch(deleteFeatureImage(id))
      .then((data) => {
        if (data?.payload?.success) {
          dispatch(getFeatureImages());
          toast({
            title: "Success!",
            description: "Feature image deleted successfully",
            variant: "default",
          });
        }
      })
      .catch((error) => {
        console.error("Delete error:", error);
        toast({
          title: "Delete failed",
          description: "Failed to delete feature image",
          variant: "destructive",
        });
      });
    
    setShowConfirmDelete(false);
    setImageToDelete(null);
  }

  function confirmDelete(id) {
    setImageToDelete(id);
    setShowConfirmDelete(true);
  }

  function handleResetUpload() {
    setImageFile(null);
    setUploadedImageUrl("");
    setImageLoadingState(false);
  }

  return (
    <div className="font-body p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="font-manrope text-3xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your store and content</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Verified Users</p>
                  <p className="font-manrope text-3xl font-bold mt-2">
                    {isLoading ? (
                      <div className="h-8 bg-blue-400 rounded animate-pulse"></div>
                    ) : (
                      verifiedUserCount
                    )}
                  </p>
                </div>
                <div className="p-3 bg-blue-400 rounded-full">
                  <Users className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-lg border-0 bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Orders</p>
                  <p className="font-manrope text-3xl font-bold mt-2">
                    {isOrdersLoading ? (
                      <div className="h-8 bg-green-400 rounded animate-pulse"></div>
                    ) : (
                      totalOrders
                    )}
                  </p>
                </div>
                <div className="p-3 bg-green-400 rounded-full">
                  <ShoppingCart className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Feature Images</p>
                  <p className="font-manrope text-3xl font-bold mt-2">
                    {featureImageList?.length || 0}
                  </p>
                </div>
                <div className="p-3 bg-purple-400 rounded-full">
                  <Image className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Store Growth</p>
                  <p className="font-manrope text-3xl font-bold mt-2">+12%</p>
                </div>
                <div className="p-3 bg-orange-400 rounded-full">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Image className="w-5 h-5" />
              Upload Feature Image
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ProductImageUpload
              imageFile={imageFile}
              setImageFile={setImageFile}
              uploadedImageUrl={uploadedImageUrl}
              setUploadedImageUrl={setUploadedImageUrl}
              setImageLoadingState={setImageLoadingState}
              imageLoadingState={imageLoadingState}
              isCustomStyling={true}
            />
            
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button 
                onClick={handleUploadFeatureImage}
                disabled={!uploadedImageUrl || isUploading || imageLoadingState}
                className="flex-1 bg-[#111344] hover:bg-[#0C1172] text-white"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  "Upload Feature Image"
                )}
              </Button>
              
              {(imageFile || uploadedImageUrl) && (
                <Button 
                  onClick={handleResetUpload}
                  variant="outline"
                  disabled={isUploading || imageLoadingState}
                  className="flex-1 sm:flex-none"
                >
                  Reset
                </Button>
              )}
            </div>

            {imageLoadingState && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 text-blue-700">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
                  <span className="text-sm">Processing image upload...</span>
                </div>
              </div>
            )}

            {!uploadedImageUrl && !imageLoadingState && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-700">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">Select and upload an image first</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Image className="w-5 h-5" />
              Feature Images ({featureImageList?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {featureImageList && featureImageList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {featureImageList.map((featureImgItem, index) => (
                  <motion.div
                    key={featureImgItem._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="relative group"
                  >
                    <img
                      src={featureImgItem.image}
                      className="w-full h-32 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300"
                      alt={`Feature ${index + 1}`}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center">
                      <Button
                        onClick={() => confirmDelete(featureImgItem._id)}
                        variant="destructive"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                      >
                        Delete
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No feature images yet</p>
                <p className="text-gray-400 text-sm mt-2">
                  Upload your first feature image using the form
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {showConfirmDelete && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4"
          >
            <div className="text-center mb-4">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <h2 className="text-xl font-semibold text-gray-900">
                Confirm Deletion
              </h2>
            </div>
            <p className="text-center text-gray-600 mb-6">
              Are you sure you want to delete this feature image? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowConfirmDelete(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleDeleteFeatureImage(imageToDelete)}
                variant="destructive"
                className="flex-1"
              >
                Delete
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;