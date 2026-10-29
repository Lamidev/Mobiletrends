'use client';

import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  // Redirect to login if trying to checkout without authentication
  if (!isAuthenticated && location.pathname === "/shop/checkout") {
    return <Navigate to="/auth/login" state={{ from: location }} />;
  }

  // Redirect authenticated users away from auth pages
  if (
    isAuthenticated &&
    ["/auth/login", "/auth/register", "/auth/forgot-password", "/auth/reset-password"].includes(location.pathname)
  ) {
    return <Navigate to={user?.role === "admin" ? "/admin/dashboard" : "/shop/home"} />;
  }

  // Ensure unverified users stay on the verification page
  if (isAuthenticated && !user?.isVerified && location.pathname !== "/auth/verify-email") {
    return <Navigate to="/auth/verify-email" />;
  }

  // After email verification, redirect users away from the verification page
  if (isAuthenticated && user?.isVerified && location.pathname === "/auth/verify-email") {
    return <Navigate to="/auth/login" />;
  }

  // Redirect non-admin users away from admin routes
  if (isAuthenticated && user?.role !== "admin" && location.pathname.startsWith("/admin")) {
    return <Navigate to="/unauth-page" />;
  }

  return children;
}

export default CheckAuth;


