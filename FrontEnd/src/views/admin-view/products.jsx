'use client';
import ProductImageUpload from "@/components/admin-view/image-upload";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { addProductFormElements } from "@/config";
import { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewProduct,
  editProduct,
  fetchAllProducts,
  deleteProduct,
} from "@/store/admin/products-slice";
import AdminProductTile from "@/components/admin-view/product-tile";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Package, ListFilter } from "lucide-react";

const initialFormData = {
  image: "",
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
  condition: "Brand New",
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  useEffect(() => {
    if (!openCreateProductsDialog) {
      setFormData(initialFormData);
      setImageFile(null);
      setUploadedImageUrl("");
      setCurrentEditedId(null);
    }
  }, [openCreateProductsDialog]);

  const totalItems = productList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = productList.slice(startIndex, endIndex);

  function onSubmit(event) {
    event.preventDefault();

    const submitData = {
      ...formData,
      image: uploadedImageUrl || formData.image
    };

    console.log("Submitting data:", submitData);
    console.log("Uploaded Image URL:", uploadedImageUrl);
    console.log("Form Data Image:", formData.image);

    currentEditedId !== null
      ? dispatch(
        editProduct({
          id: currentEditedId,
          formData: submitData,
        })
      ).then((data) => {
        console.log(data, "edit");

        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          toast({
            title: "Product updated successfully",
          });
        }
      })
      : dispatch(
        addNewProduct(submitData)
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setOpenCreateProductsDialog(false);
          toast({
            title: "Product added successfully",
          });
        }
      });
  }

  function handleDelete(productId) {
    setIsDeleting(true);
    dispatch(deleteProduct(productId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast({
          title: "Product deleted successfully",
        });
      }
      setIsDeleting(false);
    });
  }

  function handleEditProduct(product) {
    setOpenCreateProductsDialog(true);
    setCurrentEditedId(product?._id);
    console.log("Editing product data:", product);
    setFormData({
      ...product,
      image: product.image || ""
    });
    setUploadedImageUrl("");
    setImageFile(null);
  }

  function isFormValid() {
    // For mobile, ensure all required fields are properly filled
    const hasValidImage = currentEditedId !== null
      ? (formData.image || uploadedImageUrl)
      : uploadedImageUrl;

    const requiredFields = {
      title: formData.title?.trim(),
      description: formData.description?.trim(),
      category: formData.category?.trim(),
      brand: formData.brand?.trim(),
      price: formData.price?.toString().trim(),
      totalStock: formData.totalStock?.toString().trim(),
      condition: formData.condition?.trim(),
    };

    const allRequiredFieldsFilled = Object.values(requiredFields).every(
      value => value && value !== "" && value !== "0"
    );

    // Additional validation for numeric fields
    const priceValid = !isNaN(parseFloat(formData.price)) && parseFloat(formData.price) > 0;
    const stockValid = !isNaN(parseInt(formData.totalStock)) && parseInt(formData.totalStock) >= 0;

    console.log("Form validation:", {
      hasValidImage,
      allRequiredFieldsFilled,
      uploadedImageUrl,
      formDataImage: formData.image,
      requiredFields,
      priceValid,
      stockValid
    });

    return hasValidImage && allRequiredFieldsFilled && priceValid && stockValid;
  }

  function handlePageChange(page) {
    setCurrentPage(page);
  }

  function handleItemsPerPageChange(value) {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  }

  function getPageNumbers() {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  return (
    <Fragment>
      <motion.div
        className="mb-5 flex justify-end w-full"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Button
          onClick={() => setOpenCreateProductsDialog(true)}
          className="w-full sm:w-auto"
        >
          Add New Product
        </Button>
      </motion.div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Show</span>
          <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="8">8</SelectItem>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="16">16</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">products per page</span>
        </div>

        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} products
        </div>
      </div>

      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
        }}
      >
        <AnimatePresence>
          {currentProducts.length > 0 &&
            currentProducts.map((productItem) => (
              <motion.div
                key={productItem.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <AdminProductTile
                  product={productItem}
                  handleDelete={handleDelete}
                  handleEditProduct={handleEditProduct}
                  isDeleting={isDeleting}
                />
              </motion.div>
            ))}
        </AnimatePresence>
      </motion.div>

      {currentProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No products found.</p>
          <Button
            onClick={() => setOpenCreateProductsDialog(true)}
            className="mt-4 w-full sm:w-auto"
          >
            Add Your First Product
          </Button>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pb-4 border-t pt-6">
          <div className="text-sm text-muted-foreground font-medium order-2 sm:order-1">
            Showing <span className="text-foreground font-bold">{startIndex + 1}</span> to <span className="text-foreground font-bold">{Math.min(endIndex, totalItems)}</span> of <span className="text-foreground font-bold">{totalItems}</span> products
          </div>

          <div className="flex items-center gap-2 order-1 sm:order-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 h-9 px-3 border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 disabled:opacity-50 transition-all font-bold"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
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
                            ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-sm"
                            : "border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
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
              className="flex items-center gap-1 h-9 px-3 border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 disabled:opacity-50 transition-all font-bold"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
        }}
      >
        <SheetContent
          side="right"
          className="overflow-auto w-full sm:max-w-md lg:max-w-lg"
          as={motion.div}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
        >
          <SheetHeader className="sticky top-0 bg-background z-10 pb-4">
            <SheetTitle>
              <h2 className="text-xl font-bold">{currentEditedId !== null ? "Edit Product" : "Add New Product"}</h2>
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-6 pb-6">
            <ProductImageUpload
              imageFile={imageFile}
              setImageFile={setImageFile}
              uploadedImageUrl={uploadedImageUrl}
              setUploadedImageUrl={setUploadedImageUrl}
              setImageLoadingState={setImageLoadingState}
              imageLoadingState={imageLoadingState}
              isEditMode={currentEditedId !== null}
              existingImageUrl={currentEditedId !== null ? formData.image : ""}
            />

            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Update Product" : "Add Product"}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid() || imageLoadingState}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;