'use client';
import ShoppingLayout from '@/components/shopping-view/layout';
import CheckAuth from '@/components/common/check-auth';

export default function ShopRouteLayout({ children }: { children: React.ReactNode }) {
  return (
    <CheckAuth>
      <ShoppingLayout>{children}</ShoppingLayout>
    </CheckAuth>
  );
}
