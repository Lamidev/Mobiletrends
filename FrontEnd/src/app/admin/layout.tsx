'use client';
import AdminLayout from '@/components/admin-view/layout';
import CheckAuth from '@/components/common/check-auth';
import { useSelector } from 'react-redux';

export default function AdminRouteLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useSelector((state: any) => state.auth);
  return (
    <CheckAuth isAuthenticated={isAuthenticated} user={user}>
      <AdminLayout>{children}</AdminLayout>
    </CheckAuth>
  );
}