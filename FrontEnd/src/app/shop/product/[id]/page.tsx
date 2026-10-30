'use client';

import React, { Suspense } from 'react';
import ProductPageView from '@/views/shopping-view/product-page';

export default function ShopProductDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center font-manrope text-sm font-semibold text-[#62665d]">Loading product...</div>}>
      <ProductPageView />
    </Suspense>
  );
}
