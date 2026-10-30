'use client';
import AdminLayout from '@/components/admin-view/layout';
import CheckAuth from '@/components/common/check-auth';

export default function AdminRouteLayout({ children }: { children: React.ReactNode }) {
  return (
    <CheckAuth>
      <AdminLayout>{children}</AdminLayout>
    </CheckAuth>
  );
}
