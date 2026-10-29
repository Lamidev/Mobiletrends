'use client';

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Airplay,
  Apple,
  Camera,
  ChevronLeftIcon,
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
  Zap,
  Headphones,
  CheckCircle2,
  Award,
  Globe
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
import { FaTruck, FaCreditCard, FaHeadset } from "react-icons/fa";
import CustomerReviews from "@/components/shopping-view/customer-reviews";
import { getOrCreateSessionId } from "@/components/utils/session";

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
    description: "Lagos: Same Day Delivery. Outside Lagos: 1-2 Business Days.",
    color: "text-peach-500",
    bg: "bg-peach-50"
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    description: "100% secure payment processing with multi-layer encryption via Paystack.",
    color: "text-green-500",
    bg: "bg-green-50"
  },
  {
    icon: Award,
    title: "Authentic Only",
    description: "Every gadget is strictly brand new and authentic, sourced directly from manufacturers.",
    color: "text-orange-500",
    bg: "bg-orange-50"
  },
  {
    icon: Headphones,
    title: "Expert Support",
    description: "Dedicated tech experts available 24/7 to resolve any issues you might have.",
    color: "text-blue-500",
    bg: "bg-blue-50"
  },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    if (productList.length > 4) {
      const interval = setInterval(() => {
        setFeaturedIndex((prevIndex) => (prevIndex + 4) % productList.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [productList]);

  useEffect(() => {
    if (productList.length === 0) {
      dispatch(
        fetchAllFilteredProducts({
          filterParams: {},
          sortParams: "price-lowtohigh",
        })
      );
    }
  }, [dispatch, productList.length]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  const displayedProducts =
    productList.length > 4
      ? [...productList, ...productList].slice(featuredIndex, featuredIndex + 4)
      : productList;

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[200px] xs:h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px] xl:h-[600px] overflow-hidden">
        {featureImageList?.map((slide, index) => (
          <motion.div
            key={index}
            className="absolute top-0 left-0 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentSlide ? 1 : 0 }}
            transition={{ duration: 1 }}
          >
            <img
              src={slide?.image}
              className="w-full h-full object-cover"
              alt={`Slide ${index + 1}`}
            />
            <motion.div
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentSlide ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Button
                onClick={() => navigate("/shop/listing")}
                className="bg-white text-black hover:bg-white/90 px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-base font-bold shadow-lg flex items-center gap-2"
              >
                <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />
                Shop Now
              </Button>
            </motion.div>
          </motion.div>
        ))}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + featureImageList.length) %
                featureImageList.length
            )
          }
          className="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon className="w-3 h-3 sm:w-4 sm:h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length)
          }
          className="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon className="w-3 h-3 sm:w-4 sm:h-4" />
        </Button>
      </div>

      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8 sm:mb-12">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                Top <span className="text-peach-600">Products</span>
              </h2>
              <div className="h-1 w-12 bg-peach-500 rounded-full" />
            </div>
            <Button
              onClick={() => navigate('/shop/listing')}
              variant="ghost"
              className="text-peach-600 font-bold hover:bg-peach-50 rounded-full group transition-all"
            >
              View All <ChevronRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {displayedProducts.map((productItem, index) => (
              <motion.div
                key={productItem.id}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                whileHover={{ scale: 1.03 }}
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

      <section className="py-12 sm:py-20 bg-gray-50/50 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight uppercase">
              Explore <span className="text-peach-600">Categories</span>
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm font-bold mt-2 uppercase tracking-widest">Find what you're looking for</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4">
            {categoriesWithIcon.map(({ id, label, icon: Icon }) => (
              <motion.div key={id} whileHover={{ scale: 1.05 }}>
                <Card
                  onClick={() => handleNavigateToListingPage({ id }, "category")}
                  className="cursor-pointer hover:shadow-md h-full border-none shadow-none bg-transparent"
                >
                  <CardContent className="flex flex-col items-center justify-center p-2 sm:p-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-2 transition-colors hover:bg-peach-50">
                      <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-peach-500" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-center leading-tight">
                      {label}
                    </span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-white px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight uppercase">
              Leading <span className="text-peach-600">Brands</span>
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm font-bold mt-2 uppercase tracking-widest">Trusted by millions worldwide</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4">
            {brandsWithIcon.map(({ id, label, icon: Icon }) => (
              <motion.div key={id} whileHover={{ scale: 1.05 }}>
                <Card
                  onClick={() => handleNavigateToListingPage({ id }, "brand")}
                  className="cursor-pointer hover:shadow-md h-full border-none shadow-none bg-transparent"
                >
                  <CardContent className="flex flex-col items-center justify-center p-2 sm:p-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-50 shadow-sm flex items-center justify-center mb-2 transition-colors hover:bg-gray-100">
                      <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-peach-500" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-center leading-tight">
                      {label}
                    </span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-gray-50/30 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8 sm:mb-12">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                Featured <span className="text-peach-600">Picks</span>
              </h2>
              <div className="h-1 w-12 bg-peach-500 rounded-full" />
            </div>
            <Button
              onClick={() => navigate('/shop/listing')}
              variant="ghost"
              className="text-peach-600 font-bold hover:bg-peach-50 rounded-full group transition-all"
            >
              View All <ChevronRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {featuredProducts.map((productItem, index) => (
              <motion.div
                key={productItem.id}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                whileHover={{ scale: 1.03 }}
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

      <section className="py-12 sm:py-20 bg-white px-4 sm:px-6 relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-peach-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-orange-50 rounded-full blur-3xl opacity-50" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 sm:mb-16 space-y-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight"
            >
              Why <span className="text-peach-600">Mobiletrends?</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base font-medium"
            >
              We combine cutting-edge technology with world-class service to give you a shopping experience that is fast, secure, and reliable.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {whyChooseUs.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <Card className="h-full border-none shadow-xl shadow-gray-100/50 hover:shadow-peach-100/50 transition-all duration-300 rounded-3xl overflow-hidden bg-white/50 backdrop-blur-sm border border-gray-50">
                    <CardContent className="flex flex-col items-center p-8 sm:p-10 space-y-6">
                      <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ${feature.bg} flex items-center justify-center transition-transform duration-500 group-hover:rotate-12`}>
                        <Icon className={`w-8 h-8 sm:w-10 sm:h-10 ${feature.color}`} />
                      </div>
                      <div className="text-center space-y-3">
                        <h3 className="font-black text-xl text-gray-900 uppercase tracking-tight">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                      <div className="pt-2">
                        <div className={`h-1 w-8 rounded-full ${feature.bg.replace('bg-', 'bg-').replace('-50', '-500')} opacity-20`} />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <CustomerReviews />

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;