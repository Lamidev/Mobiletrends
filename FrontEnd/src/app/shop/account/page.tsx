'use client';
import { Suspense } from 'react';
import ShoppingAccount from '@/views/shopping-view/account';

export default function ShopAccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fafaf8]" />}>
      <ShoppingAccount />
    </Suspense>
  );
}