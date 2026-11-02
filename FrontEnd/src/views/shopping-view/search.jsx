'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import { motion } from "framer-motion";
import { getOrCreateSessionId } from "@/components/utils/session";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const SHOWCASE_PRODUCTS = [
  {
    _id: "6ae4e19ff0d600da3345ef3e",
    title: "iPhone 18 Pro",
    category: "smartphones",
    brand: "apple",
    description: "Next-generation flagship smartphone with aerospace-grade titanium frame, A-series Bionic processor, and pro triple-lens camera system with 5x optical zoom.",
    image: "/products/iphone-18-pro.png",
    price: 1950000,
    salePrice: 1850000,
    totalStock: 12,
    condition: "Brand New",
  },
  {
    _id: "6ae4e1a0f0d600da3345ef41",
    title: "MacBook Pro M4",
    category: "laptops",
    brand: "apple",
    description: "Built for pro creators, developers, and power users. Features Apple M4 silicon, Liquid Retina XDR display, up to 22 hours of battery life, and pro studio mics.",
    image: "/products/macbook-pro.png",
    price: 2650000,
    salePrice: 2480000,
    totalStock: 8,
    condition: "Brand New",
  },
  {
    _id: "6ae4e1a0f0d600da3345ef44",
    title: "PlayStation 5 Pro",
    category: "gaming",
    brand: "sony",
    description: "Next-level gaming console with advanced ray tracing, PlayStation Spectral Super Resolution (PSSR), 2TB ultra-fast SSD, and ultra-smooth 4K 120Hz performance.",
    image: "/products/ps5-pro.jpg",
    price: 1250000,
    salePrice: 1180000,
    totalStock: 15,
    condition: "Brand New",
  },
  {
    _id: "6ae4e1a1f0d600da3345ef47",
    title: "Samsung Galaxy S26 Ultra",
    category: "smartphones",
    brand: "samsung",
    description: "Samsung's ultimate flagship with embedded S-Pen, 200MP quad-lens camera with 100x Space Zoom, Snapdragon 8 Elite processor, and Dynamic AMOLED 2X display.",
    image: "/products/galaxy-s26-ultra.jpg",
    price: 1890000,
    salePrice: 1760000,
    totalStock: 10,
    condition: "Brand New",
  },
  {
    _id: "6ae4e1a1f0d600da3345ef4a",
    title: "iPhone Duo Foldable",
    category: "smartphones",
    brand: "apple",
    description: "Apple's breakthrough foldable smartphone engineered with a creaseless dual OLED display, tactile magnetic hinge, and pro-level titanium durability.",
    image: "/products/iphone-duo.jpg",
    price: 2850000,
    salePrice: 0,
    totalStock: 6,
    condition: "Brand New",
  },
  {
    _id: "6ae4e1a2f0d600da3345ef4d",
    title: "Samsung Galaxy Z Fold8",
    category: "smartphones",
    brand: "samsung",
    description: "Redefining multi-tasking on mobile. Dual screen immersive productivity, Armor Aluminum frame, IPX8 water resistance, and desktop-class performance.",
    image: "/products/galaxy-z-fold8.jpg",
    price: 2450000,
    salePrice: 2290000,
    totalStock: 7,
    condition: "Brand New",
  },
  {
    _id: "6ae4e1a2f0d600da3345ef50",
    title: "Sony WH-1000XM6 Wireless Noise-Cancelling",
    category: "accessories",
    brand: "sony",
    description: "Industry-leading active noise cancelling headphones with dual processors, custom 30mm carbon drivers, 40-hour battery life, and crystal-clear hands-free calls.",
    image: "/products/sony-wh1000xm6.png",
    price: 620000,
    salePrice: 580000,
    totalStock: 14,
    condition: "Brand New",
  },
  {
    _id: "6ae4e1a3f0d600da3345ef53",
    title: "ASUS ROG Zephyrus G16",
    category: "laptops",
    brand: "asus",
    description: "Extreme portable gaming powerhouse. Equipped with Intel Core Ultra 9, NVIDIA GeForce RTX 4080 GPU, OLED ROG Nebula display, and whisper-quiet liquid metal cooling.",
    image: "/products/rog-zephyrus-g16.png",
    price: 2950000,
    salePrice: 2790000,
    totalStock: 5,
    condition: "Brand New",
  },
  {
    _id: "6ae4e1a3f0d600da3345ef56",
    title: "Apple Studio Display 27-inch 5K",
    category: "accessories",
    brand: "apple",
    description: "Expansive 27-inch 5K Retina display with 600 nits brightness, 12MP Ultra Wide camera with Center Stage, and high-fidelity six-speaker sound system with Spatial Audio.",
    image: "/products/studio-display.jpg",
    price: 2350000,
    salePrice: 0,
    totalStock: 4,
    condition: "Brand New",
  },
  {
    _id: "6ae4e1a4f0d600da3345ef59",
    title: "Samsung Portable SSD T9 2TB",
    category: "accessories",
    brand: "samsung",
    description: "Blazing fast rugged portable storage with USB 3.2 Gen 2x2 interface, reaching transfer speeds up to 2,000 MB/s. Shock-resistant and drop-tested up to 3 meters.",
    image: "/products/t9-product.png",
    price: 340000,
    salePrice: 310000,
    totalStock: 25,
    condition: "Brand New",
  },
  {
    _id: "6ae4e1a4f0d600da3345ef5c",
    title: "AirPods 5 with Active Noise Cancellation",
    category: "accessories",
    brand: "apple",
    description: "Iconic design reimagined with adaptive audio, personalized spatial audio with dynamic head tracking, voice isolation, and Qi/MagSafe charging case with speaker.",
    image: "/products/airpods-5.jpg",
    price: 385000,
    salePrice: 350000,
    totalStock: 18,
    condition: "Brand New",
  },
  {
    _id: "6ae4e1a5f0d600da3345ef5f",
    title: "Nintendo Switch 2 OLED",
    category: "gaming",
    brand: "nintendo",
    description: "The next evolution of hybrid gaming with enhanced 1080p OLED handheld display, 4K DLSS docked performance, magnetic Joy-Cons, and backwards compatibility.",
    image: "/products/switch-2.png",
    price: 780000,
    salePrice: 720000,
    totalStock: 9,
    condition: "Brand New",
  },
];

function SearchProducts() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialUrlKeyword = searchParams.get("keyword") || "";
  const [keyword, setKeyword] = useState(initialUrlKeyword);

  const dispatch = useDispatch();
  const { searchResults, isLoading } = useSelector((state) => state.shopSearch);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { toast } = useToast();

  const debounceTimerRef = useRef(null);
  const inputRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Sync when URL ?keyword= changes externally (e.g., from the Header search bar)
  const urlKeyword = searchParams.get("keyword") || "";
  useEffect(() => {
    if (urlKeyword !== keyword) {
      setKeyword(urlKeyword);
    }
    if (urlKeyword.trim()) {
      dispatch(getSearchResults(urlKeyword.trim()));
    } else {
      dispatch(resetSearchResults());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlKeyword, dispatch]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Combine backend DB search results with matching showcase products (deduplicated by title)
  const combinedResults = useMemo(() => {
    const trimmed = keyword.trim().toLowerCase();
    if (!trimmed) return [];

    const dbList = Array.isArray(searchResults) ? searchResults : [];
    const seenTitles = new Set(
      dbList.map((p) => (p.title || "").toLowerCase().trim())
    );

    const matchingShowcase = SHOWCASE_PRODUCTS.filter((item) => {
      if (seenTitles.has(item.title.toLowerCase().trim())) return false;
      return (
        item.title.toLowerCase().includes(trimmed) ||
        item.category.toLowerCase().includes(trimmed) ||
        item.brand.toLowerCase().includes(trimmed) ||
        item.description.toLowerCase().includes(trimmed)
      );
    });

    return [...dbList, ...matchingShowcase];
  }, [searchResults, keyword]);

  const totalItems = combinedResults.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentResults = combinedResults.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchInputChange = (event) => {
    const value = event.target.value;
    setKeyword(value);
    setCurrentPage(1);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const trimmed = value.trim();
    if (!trimmed) {
      setSearchParams({});
      dispatch(resetSearchResults());
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      setSearchParams({ keyword: trimmed });
      dispatch(getSearchResults(trimmed));
    }, 250);
  };

  // Immediately clear search input, URL params, pending timers, and results
  const handleClearSearch = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    setKeyword("");
    setCurrentPage(1);
    setSearchParams({});
    dispatch(resetSearchResults());
    inputRef.current?.focus();
  };

  async function handleAddToCart(getCurrentProductId, getTotalStock) {
    try {
      const userId = user?.id;
      const sessionId = userId ? null : getOrCreateSessionId();

      if (!userId && !sessionId) {
        toast({
          title: "Session information missing",
          description: "Please log in or enable cookies.",
          variant: "destructive",
        });
        return;
      }

      const currentCartItems = Array.isArray(cartItems) ? cartItems : [];
      const existingItem = currentCartItems.find(
        (item) => item.productId === getCurrentProductId
      );

      if (existingItem && existingItem.quantity >= getTotalStock) {
        toast({
          title: "Stock Limit reached",
          variant: "destructive",
        });
        return;
      }

      const response = await dispatch(
        addToCart({
          productId: getCurrentProductId,
          quantity: 1,
        })
      ).unwrap();

      if (response.success) {
        await dispatch(fetchCartItems()).unwrap();
        toast({
          title: "Product added to cart!",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to add product to cart",
        variant: "destructive",
      });
    }
  }

  function handleGetProductDetails(getCurrentProductId) {
    navigate(`/shop/product/${getCurrentProductId}`);
  }

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  return (
    <div className="font-body container mx-auto md:px-6 px-4 py-8 min-h-screen">
      {/* Search Header */}
      <div className="flex flex-col items-center mb-10 text-center">
        <h1 className="font-manrope text-3xl md:text-4xl font-extrabold tracking-tight mb-3 text-[#111344]">
          Explore Gadgets
        </h1>
        <p className="text-[#62665d] max-w-lg mb-7 text-sm sm:text-base">
          Search for your favorite phones, laptops, consoles, and accessories across Mobiletrends.
        </p>

        <div className="w-full max-w-2xl relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#62665d] group-focus-within:text-[#111344] transition-colors pointer-events-none">
            <Search className="w-5 h-5" />
          </div>
          <Input
            ref={inputRef}
            value={keyword}
            name="keyword"
            onChange={handleSearchInputChange}
            className="py-6 sm:py-7 pl-12 pr-24 text-[16px] sm:text-lg rounded-2xl border-[#daddd4] bg-white focus:border-[#111344] focus:ring-2 focus:ring-[#111344]/10 transition-all shadow-sm"
            placeholder="Search iPhone, Samsung, MacBook, PS5..."
          />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {isLoading && (
              <Loader2 className="w-5 h-5 animate-spin text-[#111344]" />
            )}
            {keyword.length > 0 && (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Clear search"
                title="Clear search"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[6px] bg-[#f3f4f6] hover:bg-[#e5e7eb] text-[#1e293b] text-xs font-semibold transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        {combinedResults.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between border-b border-[#daddd4] pb-4 gap-4">
            <div className="flex items-center gap-3">
              <h2 className="font-manrope text-xl font-bold text-[#20231e]">
                Search Results
              </h2>
              <Badge
                variant="secondary"
                className="bg-[#111344]/10 text-[#111344] border-[#111344]/20"
              >
                {totalItems}
              </Badge>
              <button
                type="button"
                onClick={handleClearSearch}
                className="text-xs font-semibold text-[#111344] hover:text-[#0C1172] underline underline-offset-2 ml-2 cursor-pointer"
              >
                Clear results
              </button>
            </div>

            <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-100">
              <span className="text-[10px] font-black text-gray-400 px-2 uppercase tracking-widest">
                Per Page:
              </span>
              {[12, 24, 48].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    setItemsPerPage(num);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    itemsPerPage === num
                      ? "bg-white text-[#111344] shadow-sm"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}

        {!combinedResults.length && keyword.trim().length > 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="font-manrope text-2xl font-bold text-[#20231e]">
              No results found for &ldquo;{keyword}&rdquo;
            </h3>
            <p className="text-[#62665d] mt-1 mb-5">
              Try adjusting your search or clear the filter to start fresh.
            </p>
            <Button onClick={handleClearSearch} className="rounded-[6px] px-6">
              Clear Search
            </Button>
          </motion.div>
        )}

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          layout
        >
          {currentResults.map((item) => (
            <motion.div
              layout
              key={item._id || item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <ShoppingProductTile
                handleAddToCart={handleAddToCart}
                product={item}
                handleGetProductDetails={handleGetProductDetails}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination Section */}
        {totalItems > itemsPerPage && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-8 bg-white border border-gray-100 rounded-3xl shadow-sm gap-6">
            <div className="text-sm text-muted-foreground font-medium order-2 sm:order-1">
              Showing{" "}
              <span className="text-foreground font-bold">
                {indexOfFirstItem + 1}
              </span>{" "}
              to{" "}
              <span className="text-foreground font-bold">
                {Math.min(indexOfLastItem, totalItems)}
              </span>{" "}
              of <span className="text-foreground font-bold">{totalItems}</span>{" "}
              results
            </div>

            <div className="flex items-center gap-2 order-1 sm:order-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-9 px-3 border-gray-200 disabled:opacity-50 transition-all font-bold"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Previous</span>
              </Button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    if (totalPages <= 5) return true;
                    return (
                      Math.abs(page - currentPage) <= 1 ||
                      page === 1 ||
                      page === totalPages
                    );
                  })
                  .map((page, index, array) => {
                    const showEllipsis =
                      index > 0 && page - array[index - 1] > 1;
                    return (
                      <div key={page} className="flex items-center gap-1">
                        {showEllipsis && (
                          <span className="text-gray-400 px-1 font-bold">
                            ...
                          </span>
                        )}
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="h-9 w-9 p-0 font-bold transition-all"
                        >
                          {page}
                        </Button>
                      </div>
                    );
                  })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-9 px-3 border-gray-200 disabled:opacity-50 transition-all font-bold"
              >
                <span className="hidden sm:inline mr-1">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchProducts;
