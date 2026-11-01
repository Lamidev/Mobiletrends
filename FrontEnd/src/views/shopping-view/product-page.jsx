'use client';

import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import {
  fetchProductDetails,
  fetchAllFilteredProducts,
} from '@/store/shop/products-slice';
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice';
import ProductDetailView from '@/components/shopping-view/product-detail-view';
import ShoppingProductTile from '@/components/shopping-view/product-tile';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductPageView() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const productId = params?.id;

  const { productDetails, productList, isLoading } = useSelector(
    (state) => state.shopProducts
  );

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetails(productId));
    }
  }, [productId, dispatch]);

  useEffect(() => {
    if (!productList || productList.length === 0) {
      dispatch(
        fetchAllFilteredProducts({
          filterParams: {},
          sortParams: 'price-lowtohigh',
        })
      );
    }
    dispatch(fetchCartItems());
  }, [dispatch, productList]);

  // Similar products recommendation (Category-first with Brand weighting)
  const relatedProducts = useMemo(() => {
    if (!productList || productList.length === 0 || !productDetails) return [];

    const currentId = String(productDetails._id || productDetails.id);
    const currentCategory = String(productDetails.category || '').toLowerCase().trim();
    const currentBrand = String(productDetails.brand || '').toLowerCase().trim();

    // Exclude current product
    const otherProducts = productList.filter(
      (p) => String(p._id || p.id) !== currentId
    );

    // Score similarity:
    // +10: same category (e.g. smartphones -> smartphones)
    // +5:  same brand (e.g. apple -> apple)
    const scored = otherProducts.map((p) => {
      const pCat = String(p.category || '').toLowerCase().trim();
      const pBrand = String(p.brand || '').toLowerCase().trim();

      let score = 0;
      if (currentCategory && pCat === currentCategory) {
        score += 10;
      }
      if (currentBrand && pBrand === currentBrand) {
        score += 5;
      }

      return { product: p, score };
    });

    // Sort by highest similarity score first, then pick top 4
    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, 4).map((item) => item.product);
  }, [productList, productDetails]);

  async function handleAddToCart(id, totalStock) {
    try {
      const response = await dispatch(
        addToCart({
          productId: id,
          quantity: 1,
        })
      ).unwrap();
      if (response?.success) {
        await dispatch(fetchCartItems()).unwrap();
        toast({
          title: 'Added to cart!',
          description: 'Product added to your cart.',
        });
      }
    } catch (e) {
      toast({
        title: 'Error',
        description: 'Failed to add item to cart.',
        variant: 'destructive',
      });
    }
  }

  function handleNavigateToProduct(id) {
    router.push(`/shop/product/${id}`);
  }

  if (isLoading && (!productDetails || productDetails._id !== productId)) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#DF5E00]" />
        <p className="font-manrope text-sm font-semibold text-[#62665d]">
          Loading product specifications...
        </p>
      </div>
    );
  }

  if (!productDetails && !isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="font-manrope text-2xl font-bold text-[#111344] mb-2">
          Product Not Found
        </h2>
        <p className="text-sm text-[#62665d] mb-6 max-w-md">
          The requested device or gadget might have been sold or moved from our inventory.
        </p>
        <Button
          onClick={() => router.push('/shop/listing')}
          className="bg-[#111344] hover:bg-[#0C1172] text-white font-manrope font-semibold px-6 py-2.5 rounded-xl gap-2"
        >
          <ArrowLeft size={16} />
          Back to Catalogue
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-6 sm:py-10">
      <div className="mx-auto w-[min(1220px,calc(100%-32px))] md:w-[min(1220px,calc(100%-48px))]">
        {/* Back Link */}
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#62665d] hover:text-[#DF5E00] mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back</span>
        </button>

        {/* Main Product Detail Content */}
        <ProductDetailView product={productDetails} />

        {/* Related Products / Recommendations */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 sm:mt-24 pt-12 border-t border-[#e5e7eb]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[10px] font-bold tracking-[2px] uppercase text-[#62665d] mb-1">
                  MORE FOR YOU
                </p>
                <h2 className="font-manrope text-xl sm:text-2xl font-bold text-[#111344] tracking-tight">
                  You May Also Like
                </h2>
              </div>
              <Button
                variant="ghost"
                onClick={() => router.push('/shop/listing')}
                className="text-[12px] sm:text-[13px] font-semibold text-[#111344] hover:text-[#DF5E00] hover:bg-[#fafaf8] rounded-xl"
              >
                Explore All
              </Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-[13px] gap-y-[25px] sm:gap-x-[18px] sm:gap-y-[30px] lg:gap-x-[20px]">
              {relatedProducts.map((p, idx) => (
                <motion.div
                  key={p._id || idx}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <ShoppingProductTile
                    product={p}
                    handleGetProductDetails={handleNavigateToProduct}
                    handleAddToCart={handleAddToCart}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

