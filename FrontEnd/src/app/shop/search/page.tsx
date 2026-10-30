'use client';

import React, { Suspense } from 'react';
import SearchProducts from '@/views/shopping-view/search';

export default function ShopSearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fafaf8]" />}>
      <SearchProducts />
    </Suspense>
  );
}
