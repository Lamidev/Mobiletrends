'use client';

import React, { Suspense } from 'react';
import ShoppingLayout from '@/components/shopping-view/layout';
import ShoppingHome from '@/views/shopping-view/home';

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fafaf8]" />}>
      <ShoppingLayout>
        <ShoppingHome />
      </ShoppingLayout>
    </Suspense>
  );
}
