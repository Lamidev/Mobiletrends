'use client';

import ShoppingLayout from '@/components/shopping-view/layout';
import ShoppingHome from '@/views/shopping-view/home';

export default function HomePage() {
  return (
    <ShoppingLayout>
      <ShoppingHome />
    </ShoppingLayout>
  );
}
