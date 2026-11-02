'use client';

import ProductImageUpload from "@/components/admin-view/image-upload";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { addProductFormElements } from "@/config";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewProduct,
  editProduct,
  fetchAllProducts,
  deleteProduct,
} from "@/store/admin/products-slice";
import ProductVariantsManager from "@/components/admin-view/product-variants-manager";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  RotateCcw,
} from "lucide-react";

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
  colors: [],
  storageVariants: [],
  laptopVariants: [],
};

const CATEGORY_FILTER_OPTIONS = [
  { id: "all", label: "All Categories" },
  { id: "smartphones", label: "Smartphones" },
  { id: "laptops", label: "Laptops" },
  { id: "tablets", label: "Tablets" },
  { id: "accessories", label: "Accessories" },
  { id: "speaker", label: "Speakers" },
];

const CONDITION_FILTER_OPTIONS = [
  { id: "all", label: "All Conditions" },
  { id: "Brand New", label: "Brand New" },
  { id: "UK-Used", label: "UK-Used" },
];

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [openFilterSheet, setOpenFilterSheet] = useState(false);

  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Search, Filter, Sort & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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
      setUploadedImages([]);
      setCurrentEditedId(null);
    }
  }, [openCreateProductsDialog]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    if (!productList) return [];
    let list = [...productList];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      list = list.filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Condition filter
    if (selectedCondition !== "all") {
      list = list.filter((p) => p.condition === selectedCondition);
    }

    // Sorting
    if (sortBy === "price-low") {
      list.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortBy === "price-high") {
      list.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (sortBy === "title-az") {
      list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else {
      // Newest
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return list;
  }, [productList, searchQuery, selectedCategory, selectedCondition, sortBy]);

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  function onSubmit(event) {
    event.preventDefault();

    const cleanedStorageVariants = (formData.storageVariants || [])
      .filter((v) => v.size && v.size.trim() !== "")
      .map((v) => ({
        size: v.size.trim(),
        price: v.price === "" || v.price === undefined || v.price === null ? 0 : Number(v.price) || 0,
        isBase: Boolean(v.isBase),
      }));

    const cleanedLaptopVariants = (formData.laptopVariants || [])
      .filter((v) => v.ram && v.storage)
      .map((v) => ({
        ram: v.ram.trim(),
        storage: v.storage.trim(),
        price: v.price === "" || v.price === undefined || v.price === null ? 0 : Number(v.price) || 0,
        isBase: Boolean(v.isBase),
      }));

    const cleanedColors = (formData.colors || []).filter((c) => c.name && c.hex);

    const submitData = {
      ...formData,
      image: (uploadedImages && uploadedImages[0]) || uploadedImageUrl || formData.image,
      images: uploadedImages,
      colors: cleanedColors,
      storageVariants: cleanedStorageVariants,
      laptopVariants: cleanedLaptopVariants,
      condition: formData.condition || "Brand New",
    };

    if (currentEditedId !== null) {
      dispatch(
        editProduct({
          id: currentEditedId,
          formData: submitData,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setFormData(initialFormData);
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          toast({ title: "Product updated successfully" });
        }
      });
    } else {
      dispatch(addNewProduct(submitData)).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setFormData(initialFormData);
          setOpenCreateProductsDialog(false);
          toast({ title: "Product added successfully" });
        }
      });
    }
  }

  function handleDelete(productId) {
    setIsDeleting(true);
    dispatch(deleteProduct(productId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast({ title: "Product deleted successfully" });
      }
      setIsDeleting(false);
    });
  }

  function handleEditProduct(product) {
    setOpenCreateProductsDialog(true);
    setCurrentEditedId(product?._id);
    const existingImages =
      Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : product.image
        ? [product.image]
        : [];

    setFormData({
      ...product,
      image: product.image || "",
      images: existingImages,
      colors: Array.isArray(product.colors) ? product.colors : [],
      storageVariants: Array.isArray(product.storageVariants) ? product.storageVariants : [],
      laptopVariants: Array.isArray(product.laptopVariants) ? product.laptopVariants : [],
      condition:
        product.condition === "Premium Used"
          ? "UK-Used"
          : product.condition || "Brand New",
    });
    setUploadedImages(existingImages);
    setUploadedImageUrl(existingImages[0] || "");
    setImageFile(null);
  }

  function isFormValid() {
    const hasValidImage =
      uploadedImages.length > 0 ||
      (currentEditedId !== null ? formData.image || uploadedImageUrl : uploadedImageUrl);

    const requiredFields = {
      title: formData.title?.trim(),
      description: formData.description?.trim(),
      category: formData.category?.trim(),
      brand: formData.brand?.trim(),
      price: formData.price?.toString().trim(),
      totalStock: formData.totalStock?.toString().trim(),
    };

    const hasRequiredFields = Object.values(requiredFields).every(
      (value) => value !== "" && value !== undefined && value !== null
    );

    return hasValidImage && hasRequiredFields;
  }

  const activeFiltersCount = (selectedCategory !== "all" ? 1 : 0) + (selectedCondition !== "all" ? 1 : 0);

  return (
    <div className="font-manrope space-y-5 px-1.5 py-3 sm:p-6 lg:p-8 max-w-7xl mx-auto bg-[#FBFBFC] min-h-screen">
      {/* Top Header: Title with compact New Product button opposite */}
      <div className="flex items-center justify-between gap-3 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#111344] tracking-tight">
            Products
          </h1>
          <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
            Manage device inventory, variants, specifications, and pricing.
          </p>
        </div>

        {/* Compact New Product button */}
        <Button
          type="button"
          onClick={() => {
            setCurrentEditedId(null);
            setFormData(initialFormData);
            setOpenCreateProductsDialog(true);
          }}
          className="h-8 px-3 bg-[#111344] hover:bg-[#0C1172] text-white text-xs font-semibold rounded-lg gap-1.5 shadow-xs cursor-pointer shrink-0"
        >
          <Plus size={14} />
          <span>New product</span>
        </Button>
      </div>

      {/* Toolbar (Redesigned):
          Row 1: All on the left; Filter & Sort opposite on the right.
          Row 2: Full-width Search bar underneath.
      */}
      <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-100 sm:border-gray-200/80 shadow-xs space-y-3">
        {/* Row 1: Left = All count badge; Right = Filter + Sort buttons */}
        <div className="flex items-center justify-between gap-2">
          {/* Left: All count badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#111344] text-white shadow-xs">
              All ({productList?.length || 0})
            </span>
          </div>

          {/* Right: Filter & Sort */}
          <div className="flex items-center gap-2">
            {/* Filter Button (Opens slide-in drawer from the left) */}
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpenFilterSheet(true)}
              className={`h-9 px-3 text-xs font-semibold rounded-xl gap-1.5 border-gray-200 hover:bg-gray-100 ${
                activeFiltersCount > 0 ? "border-[#111344] text-[#111344] bg-blue-50/50" : "text-gray-700"
              }`}
            >
              <Filter size={13} className="text-gray-500" />
              <span>Filter</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#111344] text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>

            {/* Sort Dropdown */}
            <div className="w-36 sm:w-40">
              <Select
                value={sortBy}
                onValueChange={(val) => {
                  setSortBy(val);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-9 text-xs bg-[#FAFBFD] border-gray-200 rounded-xl font-semibold">
                  <ArrowUpDown size={13} className="mr-1 text-gray-500" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">New Arrivals</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="title-az">Alphabetical (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Row 2: Search input underneath */}
        <div className="relative w-full">
          <Search
            size={14}
            className="absolute left-3 top-2.5 text-gray-400 pointer-events-none"
          />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search products..."
            className="h-9 pl-9 text-xs bg-[#FAFBFD] border-gray-200 rounded-xl w-full"
          />
        </div>
      </div>

      {/* Slide-in Filter Drawer (Left) */}
      <Sheet open={openFilterSheet} onOpenChange={setOpenFilterSheet}>
        <SheetContent side="left" className="w-72 sm:w-80 p-5 overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <h3 className="font-manrope text-base font-bold text-[#111344] flex items-center gap-2">
              <Filter size={16} />
              <span>Filter Catalog</span>
            </h3>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setSelectedCondition("all");
              }}
              className="text-[11px] font-semibold text-gray-400 hover:text-gray-700 flex items-center gap-1"
            >
              <RotateCcw size={12} />
              Reset
            </button>
          </div>

          <div className="py-4 space-y-5">
            {/* Category Section */}
            <div>
              <label className="text-xs font-bold text-gray-900 uppercase tracking-wider block mb-2">
                Category
              </label>
              <div className="space-y-1">
                {CATEGORY_FILTER_OPTIONS.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      selectedCategory === cat.id
                        ? "bg-[#111344] text-white font-bold"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Condition Section */}
            <div>
              <label className="text-xs font-bold text-gray-900 uppercase tracking-wider block mb-2">
                Condition
              </label>
              <div className="space-y-1">
                {CONDITION_FILTER_OPTIONS.map((cond) => (
                  <button
                    key={cond.id}
                    type="button"
                    onClick={() => {
                      setSelectedCondition(cond.id);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      selectedCondition === cond.id
                        ? "bg-[#111344] text-white font-bold"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {cond.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <Button
              type="button"
              onClick={() => setOpenFilterSheet(false)}
              className="w-full h-9 bg-[#111344] hover:bg-[#0C1172] text-white font-bold text-xs rounded-xl"
            >
              Apply Filters
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Products Table (Extended to the ends on mobile) */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 sm:border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFBFD] text-gray-500 uppercase font-bold text-[10px] sm:text-[10.5px] tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-3 px-3 sm:px-4 w-9">
                  <input type="checkbox" className="rounded border-gray-300 text-[#111344] focus:ring-0" />
                </th>
                <th className="py-3 px-3 sm:px-4 font-bold min-w-[240px]">Product</th>
                <th className="py-3 px-3 sm:px-4 font-bold">Status</th>
                <th className="py-3 px-3 sm:px-4 font-bold">Price</th>
                <th className="py-3 px-3 sm:px-4 font-bold">Inventory</th>
                <th className="py-3 px-3 sm:px-4 font-bold">Category</th>
                <th className="py-3 px-3 sm:px-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => {
                  const stockNum = Number(product.totalStock) || 0;
                  const inStock = stockNum > 0;

                  // Price calculations
                  const basePrice = Number(product.price) || 0;
                  const salePrice = Number(product.salePrice) || 0;
                  const hasDiscount = salePrice > 0 && salePrice < basePrice;
                  const discountPct = hasDiscount
                    ? Math.round(((basePrice - salePrice) / basePrice) * 100)
                    : 0;

                  const imageCount = Array.isArray(product.images) ? product.images.length : (product.image ? 1 : 0);
                  const displayImage = (product.images && product.images[0]) || product.image || "/placeholder.png";

                  return (
                    <tr key={product._id} className="hover:bg-gray-50/70 transition-colors">
                      {/* Checkbox */}
                      <td className="py-3 px-3 sm:px-4">
                        <input type="checkbox" className="rounded border-gray-300 text-[#111344] focus:ring-0" />
                      </td>

                      {/* Product Thumbnail + Title */}
                      <td className="py-3 px-3 sm:px-4">
                        <div className="flex items-center gap-2.5 sm:gap-3">
                          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-gray-50 border border-gray-200 shrink-0 overflow-hidden flex items-center justify-center">
                            <img
                              src={displayImage}
                              alt={product.title}
                              className="w-full h-full object-contain p-1"
                              onError={(e) => {
                                e.target.src = "/placeholder.png";
                              }}
                            />
                            {imageCount > 1 && (
                              <span className="absolute bottom-0.5 right-0.5 bg-black/75 text-white text-[9px] font-bold px-1 rounded">
                                +{imageCount}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-900 line-clamp-1 text-xs sm:text-[13px]">
                              {product.title}
                            </p>
                            <p className="text-[10.5px] sm:text-[11px] text-gray-400 capitalize">
                              {product.brand} • {product.condition || "Brand New"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-3 sm:px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] sm:text-[10.5px] font-bold ${
                            inStock
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-600"
                          }`}
                        >
                          {inStock ? "Active" : "Out of Stock"}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                        {hasDiscount ? (
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-black text-rose-600 text-xs sm:text-[13px]">
                                ₦{salePrice.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                              </span>
                              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-rose-50 text-rose-600 rounded">
                                -{discountPct}%
                              </span>
                            </div>
                            <span className="text-[10.5px] sm:text-[11px] text-gray-400 line-through">
                              ₦{basePrice.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        ) : (
                          <span className="font-black text-gray-900 text-xs sm:text-[13px]">
                            ₦{basePrice.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                          </span>
                        )}
                      </td>

                      {/* Inventory */}
                      <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                        <span className={`font-semibold ${inStock ? "text-gray-700" : "text-rose-600 font-bold"}`}>
                          {stockNum} in stock
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3 sm:px-4 capitalize font-semibold text-gray-600 whitespace-nowrap">
                        {product.category || "Gadget"}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3 sm:px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1 justify-end">
                          <button
                            type="button"
                            onClick={() => handleEditProduct(product)}
                            className="p-1.5 text-gray-500 hover:text-[#111344] hover:bg-gray-100 rounded-md transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(product._id)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400 font-medium">
                    No products found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Toolbar */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 bg-[#FAFBFD]">
            <span className="text-xs text-gray-500 font-medium">
              Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} products
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="h-8 px-2.5 text-xs font-semibold rounded-lg"
              >
                <ChevronLeft size={14} className="mr-1" /> Prev
              </Button>
              <span className="text-xs font-bold text-gray-700 px-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="h-8 px-2.5 text-xs font-semibold rounded-lg"
              >
                Next <ChevronRight size={14} className="ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Slide-out Sheet for Add / Edit Product (Full mobile width & responsive with visible Close and Cancel buttons) */}
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
        }}
      >
        <SheetContent
          side="right"
          className="w-full sm:max-w-md lg:max-w-lg p-4 sm:p-6 overflow-y-auto overflow-x-hidden max-w-full"
          as={motion.div}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
        >
          {/* Header with explicit close icon button */}
          <SheetHeader className="sticky top-0 bg-background z-20 pb-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <SheetTitle className="font-manrope text-lg sm:text-xl font-bold tracking-tight text-[#111344]">
                {currentEditedId !== null ? "Edit Product" : "Add New Product"}
              </SheetTitle>
              <button
                type="button"
                onClick={() => setOpenCreateProductsDialog(false)}
                className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>
          </SheetHeader>

          <div className="space-y-6 pt-4 pb-8">
            <ProductImageUpload
              uploadedImages={uploadedImages}
              setUploadedImages={setUploadedImages}
              uploadedImageUrl={uploadedImageUrl}
              setUploadedImageUrl={setUploadedImageUrl}
              imageLoadingState={imageLoadingState}
              setImageLoadingState={setImageLoadingState}
              isEditMode={currentEditedId !== null}
            />

            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Update Product" : "Save Product"}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid() || imageLoadingState}
              onCancel={() => setOpenCreateProductsDialog(false)}
            >
              <ProductVariantsManager
                formData={formData}
                setFormData={setFormData}
              />
            </CommonForm>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default AdminProducts;
