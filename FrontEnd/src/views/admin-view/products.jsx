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
import { addProductFormElements, filterOptions } from "@/config";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewProduct,
  editProduct,
  fetchAllProducts,
  deleteProduct,
} from "@/store/admin/products-slice";
import ProductVariantsManager from "@/components/admin-view/product-variants-manager";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Minus,
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
import { Checkbox } from "@/components/ui/checkbox";

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
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter state matching userfront (all sections closed by default)
  const [filters, setFilters] = useState({
    category: [],
    brand: [],
    condition: [],
  });
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [openSections, setOpenSections] = useState({
    price: false,
    condition: false,
    category: false,
    brand: false,
  });

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

  const toggleSection = (sectionKey) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const handleFilterToggle = (section, optionId, checked) => {
    setFilters((prev) => {
      const list = prev[section] || [];
      const updated = checked
        ? [...list, optionId]
        : list.filter((id) => id !== optionId);
      return { ...prev, [section]: updated };
    });
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({ category: [], brand: [], condition: [] });
    setMinPrice(0);
    setMaxPrice(5000000);
    setCurrentPage(1);
  };

  const activeFiltersCount =
    filters.category.length +
    filters.brand.length +
    filters.condition.length +
    (minPrice > 0 || maxPrice < 5000000 ? 1 : 0);

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

    // Category filter (multi-select)
    if (filters.category.length > 0) {
      list = list.filter((p) =>
        filters.category.includes((p.category || "").toLowerCase())
      );
    }

    // Brand filter (multi-select)
    if (filters.brand.length > 0) {
      list = list.filter((p) =>
        filters.brand.includes((p.brand || "").toLowerCase())
      );
    }

    // Condition filter (multi-select)
    if (filters.condition.length > 0) {
      list = list.filter((p) =>
        filters.condition.some((c) =>
          (p.condition || "").toLowerCase().includes(c.toLowerCase())
        )
      );
    }

    // Price range filter
    if (minPrice > 0 || maxPrice < 5000000) {
      list = list.filter((p) => {
        const effPrice =
          Number(p.salePrice) > 0 ? Number(p.salePrice) : Number(p.price) || 0;
        return effPrice >= minPrice && effPrice <= maxPrice;
      });
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
  }, [productList, searchQuery, filters, minPrice, maxPrice, sortBy]);

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
          toast({
            title: "Product updated successfully",
          });
        }
      });
    } else {
      dispatch(
        addNewProduct({
          ...submitData,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setOpenCreateProductsDialog(false);
          setImageFile(null);
          setFormData(initialFormData);
          toast({
            title: "Product added successfully",
          });
        }
      });
    }
  }

  function handleDelete(getCurrentProductId) {
    setIsDeleting(true);
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast({
          title: "Product deleted successfully",
        });
      }
      setIsDeleting(false);
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .filter((currentKey) =>
        ![
          "averageReview",
          "salePrice",
          "colors",
          "storageVariants",
          "laptopVariants",
          "image",
          "condition",
        ].includes(currentKey)
      )
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  return (
    <div className="font-manrope space-y-5 p-2 sm:p-6 lg:p-8 max-w-7xl mx-auto bg-[#FBFBFC] min-h-screen">
      {/* Top Header: Products Title & Compact Add Button */}
      <div className="flex items-center justify-between gap-3 pb-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111344] tracking-tight">
            Products
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
            Manage your hardware inventory, pricing tiers, and hardware variants
          </p>
        </div>

        <Button
          type="button"
          onClick={() => {
            setCurrentEditedId(null);
            setFormData(initialFormData);
            setOpenCreateProductsDialog(true);
          }}
          className="h-8 sm:h-9 px-3 sm:px-4 bg-[#111344] hover:bg-[#0C1172] text-white font-bold text-xs rounded-xl gap-1.5 shadow-sm cursor-pointer shrink-0"
        >
          <Plus size={15} />
          <span>New product</span>
        </Button>
      </div>

      {/* Toolbar:
          Row 1: All (count) on left, Filter & Sort on right opposite All
          Row 2: Search products bar underneath
      */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 sm:border-gray-200/80 p-3 sm:p-4 shadow-xs space-y-3">
        {/* Row 1 */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Left: All (count) */}
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xs sm:text-sm text-[#111344] bg-gray-100/80 px-3 py-1.5 rounded-lg">
              All ({productList?.length || 0})
            </span>
          </div>

          {/* Right: Filter & Sort */}
          <div className="flex items-center gap-2">
            {/* Filter Button */}
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpenFilterSheet(true)}
              className={`h-9 px-3 text-xs font-semibold rounded-xl gap-1.5 border-gray-200 hover:bg-gray-100 cursor-pointer ${
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
            className="absolute left-3 top-3 text-gray-400 pointer-events-none"
          />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search products..."
            className="h-10 pl-9 text-base sm:text-xs bg-[#FAFBFD] border-gray-200 rounded-xl w-full"
          />
        </div>
      </div>

      {/* Slide-in Filter Drawer (Left) - Same structure as userfront, closed by default, clean header */}
      <Sheet open={openFilterSheet} onOpenChange={setOpenFilterSheet}>
        <SheetContent side="left" hideClose={true} className="w-72 sm:w-80 p-0 flex flex-col h-full bg-white font-manrope">
          {/* Header with Title and Reset/Close side-by-side with no overlap */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
            <h2 className="text-base sm:text-lg font-extrabold text-[#111344] flex items-center gap-2">
              <Filter size={16} />
              <span>Filter</span>
            </h2>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="text-xs font-semibold text-gray-500 hover:text-red-600 transition-colors h-8 px-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Reset
              </Button>
              <button
                type="button"
                onClick={() => setOpenFilterSheet(false)}
                className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
                title="Close filter"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Filter Sections (Ordered: 1. Price, 2. Condition, 3. Category, 4. Brand) - All Closed by default */}
          <div className="flex-1 overflow-y-auto px-4 py-2 divide-y divide-gray-200">
            {/* 1. PRICE RANGE */}
            <div className="py-2">
              <button
                type="button"
                onClick={() => toggleSection("price")}
                className="w-full flex items-center justify-between py-3 text-left text-xs font-bold text-[#141619] tracking-wider uppercase hover:text-[#0C1172] cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span>PRICE RANGE</span>
                  {(minPrice > 0 || maxPrice < 5000000) && (
                    <span className="h-2 w-2 rounded-full bg-[#111344]" />
                  )}
                </span>
                <span className="flex items-center justify-center w-5 h-5 text-gray-700">
                  {openSections.price ? <Minus size={14} /> : <Plus size={14} />}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {openSections.price && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden pb-3 pt-1 space-y-3"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <span className="text-[10px] text-gray-500 font-bold uppercase">
                          Min (₦)
                        </span>
                        <Input
                          type="number"
                          placeholder="0"
                          value={minPrice === 0 ? "" : minPrice}
                          onChange={(e) =>
                            setMinPrice(e.target.value === "" ? 0 : parseInt(e.target.value))
                          }
                          className="h-8 text-xs border-gray-200"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-gray-500 font-bold uppercase">
                          Max (₦)
                        </span>
                        <Input
                          type="number"
                          placeholder="5,000,000"
                          value={maxPrice === 5000000 || maxPrice === 0 ? "" : maxPrice}
                          onChange={(e) =>
                            setMaxPrice(e.target.value === "" ? 5000000 : parseInt(e.target.value))
                          }
                          className="h-8 text-xs border-gray-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <input
                        type="range"
                        min="0"
                        max="5000000"
                        step="50000"
                        value={maxPrice || 5000000}
                        onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#111344]"
                      />
                      <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                        <span>₦0</span>
                        <span>₦5,000,000+</span>
                      </div>
                      <div className="text-center text-[11px] font-bold text-[#111344] bg-gray-100/70 py-1 rounded">
                        ₦{(minPrice || 0).toLocaleString("en-NG")} — ₦{(maxPrice || 5000000).toLocaleString("en-NG")}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. CONDITION */}
            <div className="py-2">
              <button
                type="button"
                onClick={() => toggleSection("condition")}
                className="w-full flex items-center justify-between py-3 text-left text-xs font-bold text-[#141619] tracking-wider uppercase hover:text-[#0C1172] cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span>CONDITION</span>
                  {filters.condition.length > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#111344] text-white leading-none">
                      {filters.condition.length}
                    </span>
                  )}
                </span>
                <span className="flex items-center justify-center w-5 h-5 text-gray-700">
                  {openSections.condition ? <Minus size={14} /> : <Plus size={14} />}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {openSections.condition && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden pb-3 pt-0.5 space-y-1"
                  >
                    {(filterOptions.condition || []).map((opt) => (
                      <label
                        key={opt.id}
                        className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <Checkbox
                          checked={filters.condition.includes(opt.id)}
                          onCheckedChange={(checked) =>
                            handleFilterToggle("condition", opt.id, checked)
                          }
                          className="data-[state=checked]:bg-[#111344] data-[state=checked]:border-[#111344] border-gray-300 rounded-sm"
                        />
                        <span className="text-xs font-medium text-gray-700">
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 3. CATEGORY */}
            <div className="py-2">
              <button
                type="button"
                onClick={() => toggleSection("category")}
                className="w-full flex items-center justify-between py-3 text-left text-xs font-bold text-[#141619] tracking-wider uppercase hover:text-[#0C1172] cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span>CATEGORY</span>
                  {filters.category.length > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#111344] text-white leading-none">
                      {filters.category.length}
                    </span>
                  )}
                </span>
                <span className="flex items-center justify-center w-5 h-5 text-gray-700">
                  {openSections.category ? <Minus size={14} /> : <Plus size={14} />}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {openSections.category && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden pb-3 pt-0.5 space-y-1"
                  >
                    {(filterOptions.category || []).map((opt) => (
                      <label
                        key={opt.id}
                        className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <Checkbox
                          checked={filters.category.includes(opt.id)}
                          onCheckedChange={(checked) =>
                            handleFilterToggle("category", opt.id, checked)
                          }
                          className="data-[state=checked]:bg-[#111344] data-[state=checked]:border-[#111344] border-gray-300 rounded-sm"
                        />
                        <span className="text-xs font-medium text-gray-700">
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 4. BRAND */}
            <div className="py-2">
              <button
                type="button"
                onClick={() => toggleSection("brand")}
                className="w-full flex items-center justify-between py-3 text-left text-xs font-bold text-[#141619] tracking-wider uppercase hover:text-[#0C1172] cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span>BRAND</span>
                  {filters.brand.length > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#111344] text-white leading-none">
                      {filters.brand.length}
                    </span>
                  )}
                </span>
                <span className="flex items-center justify-center w-5 h-5 text-gray-700">
                  {openSections.brand ? <Minus size={14} /> : <Plus size={14} />}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {openSections.brand && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden pb-3 pt-0.5 space-y-1 max-h-60 overflow-y-auto"
                  >
                    {(filterOptions.brand || []).map((opt) => (
                      <label
                        key={opt.id}
                        className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <Checkbox
                          checked={filters.brand.includes(opt.id)}
                          onCheckedChange={(checked) =>
                            handleFilterToggle("brand", opt.id, checked)
                          }
                          className="data-[state=checked]:bg-[#111344] data-[state=checked]:border-[#111344] border-gray-300 rounded-sm"
                        />
                        <span className="text-xs font-medium text-gray-700">
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200">
            <Button
              type="button"
              onClick={() => setOpenFilterSheet(false)}
              className="w-full h-9 bg-[#111344] hover:bg-[#0C1172] text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Apply & Close
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
                <th className="py-3 px-2 sm:px-4 font-bold min-w-[200px]">Product</th>
                <th className="py-3 px-2 sm:px-4 font-bold">Status</th>
                <th className="py-3 px-2 sm:px-4 font-bold">Price</th>
                <th className="py-3 px-2 sm:px-4 font-bold">Inventory</th>
                <th className="py-3 px-2 sm:px-4 font-bold">Category</th>
                <th className="py-3 px-3 sm:px-4 text-right font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
              {currentProducts && currentProducts.length > 0 ? (
                currentProducts.map((productItem) => {
                  const hasDiscount =
                    Number(productItem?.salePrice) > 0 &&
                    Number(productItem?.salePrice) < Number(productItem?.price);

                  const discountPct = hasDiscount
                    ? Math.round(
                        ((Number(productItem.price) - Number(productItem.salePrice)) /
                          Number(productItem.price)) *
                          100
                      )
                    : 0;

                  const isOutOfStock = Number(productItem?.totalStock || 0) <= 0;

                  return (
                    <tr
                      key={productItem?._id}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      <td className="py-3 px-3 sm:px-4">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-[#111344] focus:ring-0"
                        />
                      </td>

                      <td className="py-3 px-2 sm:px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 shrink-0">
                            {productItem?.image ? (
                              <img
                                src={productItem.image}
                                alt={productItem.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px]">
                                No img
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 max-w-[220px] sm:max-w-xs">
                            <p className="font-semibold text-gray-900 truncate text-xs sm:text-[13px]">
                              {productItem?.title}
                            </p>
                            <p className="text-[11px] text-gray-400 capitalize">
                              {productItem?.brand || "Brand"} · {productItem?.condition || "Brand New"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-2 sm:px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active
                        </span>
                      </td>

                      <td className="py-3 px-2 sm:px-4 whitespace-nowrap">
                        {hasDiscount ? (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-rose-600 text-xs sm:text-[13px]">
                                ₦{Number(productItem.salePrice).toLocaleString("en-NG")}
                              </span>
                              <span className="text-[10px] font-bold bg-rose-50 text-rose-600 px-1 py-0.2 rounded">
                                -{discountPct}%
                              </span>
                            </div>
                            <span className="line-through text-gray-400 text-[11px] block">
                              ₦{Number(productItem.price).toLocaleString("en-NG")}
                            </span>
                          </div>
                        ) : (
                          <span className="font-bold text-gray-900 text-xs sm:text-[13px]">
                            ₦{Number(productItem?.price || 0).toLocaleString("en-NG")}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-2 sm:px-4 whitespace-nowrap">
                        <span
                          className={`text-xs font-semibold ${
                            isOutOfStock ? "text-rose-600 font-bold" : "text-gray-700"
                          }`}
                        >
                          {productItem?.totalStock || 0} in stock
                        </span>
                      </td>

                      <td className="py-3 px-2 sm:px-4 capitalize whitespace-nowrap text-gray-600">
                        {productItem?.category || "—"}
                      </td>

                      <td className="py-3 px-3 sm:px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1 sm:gap-1.5 justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentEditedId(productItem?._id);
                              setFormData({
                                ...productItem,
                                price: productItem?.price !== undefined ? String(productItem.price) : "",
                                salePrice: productItem?.salePrice !== undefined ? String(productItem.salePrice) : "",
                                totalStock: productItem?.totalStock !== undefined ? String(productItem.totalStock) : "",
                                colors: productItem?.colors || [],
                                storageVariants: productItem?.storageVariants || [],
                                laptopVariants: productItem?.laptopVariants || [],
                              });
                              setUploadedImages(productItem?.images || (productItem?.image ? [productItem.image] : []));
                              setUploadedImageUrl(productItem?.image || "");
                              setOpenCreateProductsDialog(true);
                            }}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 size={13} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(productItem?._id)}
                            disabled={isDeleting}
                            className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400 font-medium">
                    No products found matching your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer (Responsive on mobile with 1 / 2 on a single line) */}
        {totalItems > 0 && (
          <div className="p-3 sm:p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 font-medium">
            <span className="text-[11px] sm:text-xs text-center sm:text-left whitespace-nowrap">
              Showing {startIndex + 1}–{Math.min(endIndex, totalItems)} of {totalItems} products
            </span>

            <div className="flex items-center justify-center gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-8 px-2.5 text-xs font-semibold rounded-lg shrink-0 cursor-pointer disabled:opacity-40"
              >
                <ChevronLeft size={14} className="mr-1" /> Prev
              </Button>

              <span className="px-2.5 text-xs font-bold text-gray-700 whitespace-nowrap shrink-0 select-none">
                {currentPage}&nbsp;/&nbsp;{totalPages}
              </span>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-8 px-2.5 text-xs font-semibold rounded-lg shrink-0 cursor-pointer disabled:opacity-40"
              >
                Next <ChevronRight size={14} className="ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Slide-out Sheet for Add / Edit Product (Single clean X close button, no duplicate) */}
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={(open) => {
          setOpenCreateProductsDialog(open);
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
          {/* Header with single built-in SheetContent close button */}
          <SheetHeader className="sticky top-0 bg-background z-20 pb-3 border-b border-gray-100 pr-10 text-left">
            <SheetTitle className="font-manrope text-lg sm:text-xl font-bold tracking-tight text-[#111344]">
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
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
