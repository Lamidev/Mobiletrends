'use client';

import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Preloader } from "./preloader";

function CheckAuth({
  isAuthenticated: propIsAuth = undefined,
  user: propUser = undefined,
  children,
}) {
  const location = useLocation();
  const authState = useSelector((state) => state.auth);

  const isAuthenticated =
    propIsAuth !== undefined ? propIsAuth : authState.isAuthenticated;
  const user = propUser !== undefined ? propUser : authState.user;
  const isCheckingAuth = authState.isCheckingAuth;

  const pathname = location.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isProtectedShopRoute = pathname === "/shop/account";
  const isAuthPage =
    pathname === "/auth/login" ||
    pathname === "/auth/register" ||
    pathname === "/auth/forgot-password" ||
    pathname.startsWith("/auth/reset-password");
  const isVerifyEmailPage = pathname === "/auth/verify-email";

  // Wait for initial session check before redirecting on protected or auth routes
  if (
    isCheckingAuth &&
    (isAdminRoute || isProtectedShopRoute || isAuthPage || isVerifyEmailPage)
  ) {
    return <Preloader active={true} />;
  }

  // 1. Unauthenticated users trying to access Admin or Protected Shop routes (/shop/checkout, /shop/account)
  if (!isAuthenticated && (isAdminRoute || isProtectedShopRoute)) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // 2. Unverified authenticated users trying to access protected routes or login/register
  if (
    isAuthenticated &&
    user &&
    !user.isVerified &&
    (isAdminRoute || isProtectedShopRoute || isAuthPage)
  ) {
    return <Navigate to="/auth/verify-email" replace />;
  }

  // 3. Verified authenticated users visiting /auth/verify-email or /auth/* pages
  if (isAuthenticated && user?.isVerified && (isAuthPage || isVerifyEmailPage)) {
    return (
      <Navigate
        to={user?.role === "admin" ? "/admin/dashboard" : "/shop/home"}
        replace
      />
    );
  }

  // 4. Non-admin authenticated users trying to access /admin/* routes
  if (isAuthenticated && user?.role !== "admin" && isAdminRoute) {
    return <Navigate to="/unauth-page" replace />;
  }

  return children;
}

export default CheckAuth;
