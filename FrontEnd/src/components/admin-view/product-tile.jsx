'use client';

import { Button } from "../ui/button";
import { Edit, Trash2, AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

function AdminProductTile({
  product,
  handleDelete,
  handleEditProduct,
  isDeleting,
}) {
  // Calculate discount percentage
  const calculateDiscount = () => {
    if (product?.salePrice > 0 && product?.price > 0) {
      const discount = ((product.price - product.salePrice) / product.price) * 100;
      return Math.round(discount);
    }
    return 0;
  };

  const discountPercentage = calculateDiscount();

  return (
    <div className="font-body w-full rounded-lg overflow-hidden group transition duration-300 hover:shadow-lg p-3 bg-white border border-gray-100">

      {/* Product Image Standalone */}
      <div className="cursor-pointer mb-3 relative bg-transparent">
        <img
          src={product?.image}
          alt={product?.title}
          className="w-full h-64 object-contain rounded-md"
        />

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            -{discountPercentage}%
          </div>
        )}

        {/* Stock Status Badge */}
        <div className="absolute top-2 left-2">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${product?.totalStock > 10
            ? "bg-green-100 text-green-800"
            : product?.totalStock > 0
              ? "bg-orange-100 text-orange-800"
              : "bg-red-100 text-red-800"
            }`}>
            Stock: {product?.totalStock || 0}
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        {/* Title */}
        <h2 className="font-manrope text-sm font-bold line-clamp-2 text-gray-800 min-h-[2.5rem]">
          {product?.title}
        </h2>

        {/* Pricing */}
        <div className="flex items-center gap-2">
          {product?.salePrice > 0 ? (
            <>
              <span className="text-xs text-gray-500 line-through">
                ₦{product?.price?.toLocaleString("en-NG")}
              </span>
              <span className="font-manrope text-base font-semibold text-peach-600">
                ₦{product?.salePrice?.toLocaleString("en-NG")}
              </span>
            </>
          ) : (
            <span className="font-manrope text-base font-semibold text-peach-600">
              ₦{product?.price?.toLocaleString("en-NG")}
            </span>
          )}
        </div>

        {/* Condition */}
        <p className="text-xs font-medium text-gray-600">
          Condition: {product?.condition}
        </p>
      </div>

      {/* Buttons with Icons */}
      <div className="flex justify-between items-center mt-4">
        <TooltipProvider>
          {/* Edit Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => handleEditProduct(product)}
                size="sm"
                className="flex items-center gap-1 px-3"
              >
                <Edit className="h-4 w-4" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit product</p>
            </TooltipContent>
          </Tooltip>

          {/* Delete Button with Confirmation */}
          <AlertDialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex items-center gap-1 px-3"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        <span className="hidden sm:inline">Deleting...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Delete</span>
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete product</p>
              </TooltipContent>
            </Tooltip>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  Confirm Deletion
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "<strong>{product?.title}</strong>"?
                  This action cannot be undone and will permanently remove the product from your store.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDelete(product?._id)}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Yes, Delete Product
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TooltipProvider>
      </div>
    </div>
  );
}

export default AdminProductTile;