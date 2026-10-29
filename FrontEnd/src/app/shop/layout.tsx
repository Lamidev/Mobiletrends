'use client';
import ShoppingLayout from '@/components/shopping-view/layout';
export default function ShopRouteLayout({ children }: { children: React.ReactNode }) {
  return <ShoppingLayout>{children}</ShoppingLayout>;
}