'use client';

import React, { Suspense } from 'react';
import ShoppingListing from '@/views/shopping-view/listing';

export default function ShopListingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fafaf8]" />}>
      <ShoppingListing />
    </Suspense>
  );
}
