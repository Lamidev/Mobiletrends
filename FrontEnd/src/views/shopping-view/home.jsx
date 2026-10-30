'use client';

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Airplay,
  Apple,
  Camera,
  ChevronRightIcon,
  CloudLightning,
  Laptop,
  LaptopMinimal,
  ShoppingBag,
  Smartphone,
  Tablet,
  TabletSmartphone,
  Tv,
  Watch,
  Truck,
  ShieldCheck,
  Headphones,
  Award,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import { getFeatureImages } from "@/store/common-slice";
import { getOrCreateSessionId } from "@/components/utils/session";
import ReelmarkHero from "@/components/shopping-view/reelmark-hero";
import BrandMarquee from "@/components/shopping-view/brand-marquee";
import GadgetCatalogue from "@/components/shopping-view/gadget-catalogue";
import BuyingProcessAndReviews from "@/components/shopping-view/buying-process-and-reviews";
import FaqSection from "@/components/shopping-view/faq-section";

const categoriesWithIcon = [
  { id: "smartphones", label: "Smartphones", icon: Smartphone },
  { id: "laptops", label: "Laptops", icon: Laptop },
  { id: "tablets", label: "Tablets", icon: Tablet },
  { id: "smartwatches", label: "Smartwatches", icon: Watch },
  { id: "accessories", label: "Accessories", icon: CloudLightning },
  { id: "products", label: "All Products", icon: ShoppingBag },
];

const brandsWithIcon = [
  { id: "apple", label: "Apple", icon: Apple },
  { id: "samsung", label: "Samsung", icon: Airplay },
  { id: "google-pixel", label: "Google pixel", icon: Camera },
  { id: "dell", label: "Dell", icon: LaptopMinimal },
  { id: "hp", label: "HP", icon: TabletSmartphone },
  { id: "lenovo", label: "Lenovo", icon: Tv },
];

const whyChooseUs = [
  {
    icon: Truck,
    title: "Swift Delivery",
    description: "Akure & Ondo: Same Day Delivery. Nationwide: 1-2 Business Days.",
    color: "text-peach-500",
    bg: "bg-peach-50",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    description: "100% secure payment processing with multi-layer encryption via Paystack.",
    color: "text-green-500",
    bg: "bg-green-50",
  },
  {
    icon: Award,
    title: "Authentic Only",
    description: "Every gadget is strictly verified and authentic, sourced directly from trusted global suppliers.",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    icon: Headphones,
    title: "Expert Support",
    description: "Dedicated tech experts available 24/7 to resolve any issues you might have.",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
];

/* Exact 12 SWOT Stock Products & Media Fitting Rules */
const SWOT_STOCK_PRODUCTS = [
  {
    _id: "swot-stock-1",
    title: "iPhone 18 Pro",
    category: "smartphones",
    swotLabel: "APPLE · FACTORY UNLOCKED",
    image: "/products/iphone-18-pro.png",
    media: "cutout phone",
    price: 1950000,
    salePrice: 1850000,
    condition: "Brand New",
  },
  {
    _id: "swot-stock-2",
    title: "MacBook Pro M4",
    category: "laptops",
    swotLabel: "APPLE · M-SERIES SILICON",
    image: "/products/macbook-pro.png",
    media: "cutout",
    price: 2650000,
    salePrice: 2480000,
    condition: "Brand New",
  },
  {
    _id: "swot-stock-3",
    title: "PlayStation 5 Pro",
    category: "gaming",
    swotLabel: "PLAYSTATION · 4K 120FPS GAMING",
    image: "/products/ps5-pro.jpg",
    media: "dark-photo",
    price: 1250000,
    salePrice: 1180000,
    condition: "Brand New",
  },
  {
    _id: "swot-stock-4",
    title: "Samsung Galaxy S26 Ultra",
    category: "smartphones",
    swotLabel: "SAMSUNG · SNAPDRAGON FLAGSHIP",
    image: "/products/galaxy-s26-ultra.jpg",
    media: "dark-photo galaxy",
    price: 1890000,
    salePrice: 1760000,
    condition: "Brand New",
  },
  {
    _id: "swot-stock-5",
    title: "iPhone Duo",
    category: "smartphones",
    swotLabel: "APPLE · FOLDABLE FLAGSHIP",
    image: "/products/iphone-duo.jpg",
    media: "editorial-photo",
    price: 2850000,
    salePrice: 0,
    condition: "Brand New",
  },
  {
    _id: "swot-stock-6",
    title: "Samsung Galaxy Z Fold8",
    category: "smartphones",
    swotLabel: "SAMSUNG · FOLDABLE GALAXY",
    image: "/products/galaxy-z-fold8.jpg",
    media: "editorial-photo",
    price: 2450000,
    salePrice: 2290000,
    condition: "Brand New",
  },
  {
    _id: "swot-stock-7",
    title: "Sony WH-1000XM6",
    category: "speaker",
    swotLabel: "SONY · ACTIVE NOISE CANCELLING",
    image: "/products/sony-wh1000xm6.png",
    media: "wide-photo",
    price: 620000,
    salePrice: 580000,
    condition: "Brand New",
  },
  {
    _id: "swot-stock-8",
    title: "ROG Zephyrus G16",
    category: "laptops",
    swotLabel: "ASUS ROG · HIGH-FPS GAMING & 3D",
    image: "/products/rog-zephyrus-g16.png",
    media: "cutout rog",
    price: 2950000,
    salePrice: 2790000,
    condition: "Brand New",
  },
  {
    _id: "swot-stock-9",
    title: "Apple Studio Display",
    category: "accessories",
    swotLabel: "APPLE · 5K RETINA DISPLAY",
    image: "/products/studio-display.jpg",
    media: "studio-photo",
    price: 2350000,
    salePrice: 0,
    condition: "Brand New",
  },
  {
    _id: "swot-stock-10",
    title: "Samsung Portable SSD T9",
    category: "accessories",
    swotLabel: "SAMSUNG · 2,000MB/S HIGH-SPEED",
    image: "/products/t9-product.png",
    media: "studio-photo",
    price: 340000,
    salePrice: 310000,
    condition: "Brand New",
  },
  {
    _id: "swot-stock-11",
    title: "AirPods 5",
    category: "speaker",
    swotLabel: "APPLE · ACTIVE NOISE CANCELLATION",
    image: "/products/airpods-5.jpg",
    media: "cutout",
    price: 385000,
    salePrice: 350000,
    condition: "Brand New",
  },
  {
    _id: "swot-stock-12",
    title: "Nintendo Switch 2",
    category: "gaming",
    swotLabel: "NINTENDO · HOME & HANDHELD",
    image: "/products/switch-2.png",
    media: "cutout",
    price: 780000,
    salePrice: 720000,
    condition: "Brand New",
  },
];

function ShoppingHome() {
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredTab, setFeaturedTab] = useState("all");

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const shuffleFeaturedProducts = () => {
    if (productList.length > 0) {
      const shuffledProducts = shuffleArray([...productList]).slice(0, 8);
      setFeaturedProducts(shuffledProducts);
    }
  };

  useEffect(() => {
    shuffleFeaturedProducts();
    const interval = setInterval(shuffleFeaturedProducts, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [productList]);

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = { [section]: [getCurrentItem.id] };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

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
          title: `Stock Limit`,
          description: `Only ${getTotalStock} units available in stock.`,
          variant: "destructive",
        });
        return;
      }

      if (!existingItem && 1 > getTotalStock) {
        toast({
          title: `Limited Stock`,
          description: `Only ${getTotalStock} quantity available for this product.`,
          variant: "destructive",
        });
        return;
      }

      if (existingItem && existingItem.quantity + 1 > getTotalStock) {
        toast({
          title: `Stock Exceeded`,
          description: `Adding one more would exceed available stock of ${getTotalStock}.`,
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
          description: "Item successfully added to your shopping cart.",
        });
      } else {
        toast({
          title: response.message || "Failed to add product to cart",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast({
        title: "Failed to add product to cart",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    if (productList.length > 4) {
      const interval = setInterval(() => {
        setFeaturedIndex((prevIndex) => (prevIndex + 4) % productList.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [productList]);

  useEffect(() => {
    dispatch(getFeatureImages());
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  // Top 4 curated arrivals directly from live database productList
  const displayedProducts =
    productList && productList.length > 0
      ? (productList.length > 4
          ? [...productList, ...productList].slice(featuredIndex, featuredIndex + 4)
          : productList.slice(0, 4))
      : [];

  // Filtered products for the homepage mini-filter tabs directly from live database productList
  const currentFeaturedList = (() => {
    if (!productList || productList.length === 0) return [];

    if (featuredTab === "all") {
      return productList.slice(0, 8);
    }
    if (featuredTab === "laptops") {
      return productList.filter((p) => {
        const cat = String(p.category || "").toLowerCase();
        return cat === "laptops" || cat === "laptop";
      });
    }
    if (featuredTab === "phones") {
      return productList.filter((p) => {
        const cat = String(p.category || "").toLowerCase();
        return cat === "smartphones" || cat === "phones" || cat === "phone";
      });
    }
    if (featuredTab === "gaming") {
      return productList.filter((p) => {
        const cat = String(p.category || "").toLowerCase();
        return cat === "gaming" || cat === "games";
      });
    }
    return productList.slice(0, 8);
  })();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Reelmark-style Curved Cylinder Hero for Mobiletrends */}
      <ReelmarkHero
        products={productList}
        onSelectProduct={handleGetProductDetails}
        onExploreClick={() => navigate("/shop/listing")}
      />

      {/* 4-Column Trust Bar + Infinite Global Brand Logo Marquee */}
      <BrandMarquee
        onSelectBrand={(brandId) => {
          if (brandId === "products") {
            navigate("/shop/listing");
          } else {
            handleNavigateToListingPage({ id: brandId }, "brand");
          }
        }}
      />

      {/* Exact SWOT Gadget Catalogue Section (Clean devices. Honest specs. Zero stories.) */}
      <GadgetCatalogue
        onSelectCategory={(categoryId) => {
          if (categoryId === "products") {
            sessionStorage.removeItem("filters");
            navigate("/shop/listing");
          } else {
            handleNavigateToListingPage({ id: categoryId }, "category");
          }
        }}
      />

      <section className="py-14 sm:py-20 bg-[#fafaf8] font-body">
        <div className="mx-auto w-[min(1180px,calc(100%-32px))] md:w-[min(1180px,calc(100%-48px))]">
          <div className="flex flex-row items-end justify-between mb-7 sm:mb-10 gap-4">
            <div>
              <p className="text-[8px] sm:text-[10px] tracking-[1.8px] sm:tracking-[2.2px] font-semibold uppercase text-[#62665d] mb-2.5 sm:mb-3">
                CURATED ARRIVALS
              </p>
              <h2 className="font-manrope text-[clamp(28px,3.5vw,44px)] leading-[1.18] font-semibold text-[#20231e] tracking-[-1.8px] m-0">
                Top Products
              </h2>
            </div>
            <Button
              onClick={() => navigate('/shop/listing')}
              variant="ghost"
              className="font-body text-[12px] sm:text-[13px] text-[#20231e] font-semibold hover:bg-[#e6e8e1]/60 hover:text-[#DF5E00] rounded-full group transition-all px-3 h-9 shrink-0"
            >
              View All <ChevronRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-[13px] gap-y-[25px] sm:gap-x-[18px] sm:gap-y-[30px] lg:gap-x-[20px] lg:gap-y-[32px]">
            {displayedProducts.map((productItem, index) => (
              <motion.div
                key={productItem.id || productItem._id || index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
              >
                <ShoppingProductTile
                  handleGetProductDetails={handleGetProductDetails}
                  product={productItem}
                  handleAddToCart={handleAddToCart}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20 bg-[#f3f4ef] border-y border-[#daddd4] font-body">
        <div className="mx-auto w-[min(1180px,calc(100%-32px))] md:w-[min(1180px,calc(100%-48px))]">
          <div className="flex flex-row items-end justify-between mb-5 sm:mb-6 gap-4">
            <div>
              <p className="text-[8px] sm:text-[10px] tracking-[1.8px] sm:tracking-[2.2px] font-semibold uppercase text-[#62665d] mb-2.5 sm:mb-3">
                HANDPICKED FOR PERFORMANCE
              </p>
              <h2 className="font-manrope text-[clamp(28px,3.5vw,44px)] leading-[1.18] font-semibold text-[#20231e] tracking-[-1.8px] m-0">
                Featured Picks
              </h2>
            </div>
            <Button
              onClick={() => navigate('/shop/listing')}
              variant="ghost"
              className="font-body text-[12px] sm:text-[13px] text-[#20231e] font-semibold hover:bg-[#e6e8e1] hover:text-[#DF5E00] rounded-full group transition-all px-3 h-9 shrink-0"
            >
              View All <ChevronRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Mini-Filter Bar matching user reference */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-1 mb-7 sm:mb-9 font-manrope">
            <button
              type="button"
              onClick={() => setFeaturedTab("all")}
              className={`px-3.5 sm:px-4 py-2 rounded-[8px] text-[13px] sm:text-[14.5px] font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                featuredTab === "all"
                  ? "border border-[#DF5E00] bg-[#DF5E00]/[0.06] text-[#DF5E00] shadow-sm"
                  : "text-[#62665d] hover:text-[#20231e] hover:bg-black/[0.03]"
              }`}
            >
              All gadgets
            </button>
            <button
              type="button"
              onClick={() => setFeaturedTab("laptops")}
              className={`px-3.5 sm:px-4 py-2 rounded-[8px] text-[13px] sm:text-[14.5px] font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                featuredTab === "laptops"
                  ? "border border-[#DF5E00] bg-[#DF5E00]/[0.06] text-[#DF5E00] shadow-sm"
                  : "text-[#62665d] hover:text-[#20231e] hover:bg-black/[0.03]"
              }`}
            >
              Laptops
            </button>
            <button
              type="button"
              onClick={() => setFeaturedTab("phones")}
              className={`px-3.5 sm:px-4 py-2 rounded-[8px] text-[13px] sm:text-[14.5px] font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                featuredTab === "phones"
                  ? "border border-[#DF5E00] bg-[#DF5E00]/[0.06] text-[#DF5E00] shadow-sm"
                  : "text-[#62665d] hover:text-[#20231e] hover:bg-black/[0.03]"
              }`}
            >
              Phones
            </button>
            <button
              type="button"
              onClick={() => setFeaturedTab("gaming")}
              className={`px-3.5 sm:px-4 py-2 rounded-[8px] text-[13px] sm:text-[14.5px] font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                featuredTab === "gaming"
                  ? "border border-[#DF5E00] bg-[#DF5E00]/[0.06] text-[#DF5E00] shadow-sm"
                  : "text-[#62665d] hover:text-[#20231e] hover:bg-black/[0.03]"
              }`}
            >
              Gaming
            </button>
            <button
              type="button"
              onClick={() => navigate('/shop/listing')}
              className="px-3.5 sm:px-4 py-2 rounded-[8px] text-[13px] sm:text-[14.5px] font-semibold text-[#62665d] hover:text-[#DF5E00] hover:bg-black/[0.03] transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              More tech
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-[13px] gap-y-[25px] sm:gap-x-[18px] sm:gap-y-[30px] lg:gap-x-[20px] lg:gap-y-[32px]">
            {currentFeaturedList.map((productItem, index) => (
              <motion.div
                key={productItem.id || productItem._id || index}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
              >
                <ShoppingProductTile
                  handleGetProductDetails={handleGetProductDetails}
                  product={productItem}
                  handleAddToCart={handleAddToCart}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SWOT-Style Buying Process, Decade of Earned Customer Trust & Verified Google Reviews */}
      <BuyingProcessAndReviews />

      {/* SWOT-Style Frequently Asked Questions Section */}
      <FaqSection />

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
