'use client';
import AuthLayout from '@/components/auth/layout';
import CheckAuth from '@/components/common/check-auth';

export default function AuthRouteLayout({ children }: { children: React.ReactNode }) {
  return (
    <CheckAuth>
      <AuthLayout>{children}</AuthLayout>
    </CheckAuth>
  );
}
