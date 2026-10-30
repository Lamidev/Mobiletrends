'use client';

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { X } from "lucide-react";

function AuthLayout({ children }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-[100dvh] w-full max-w-[100vw] overflow-x-hidden bg-white flex flex-col justify-between font-body text-[#0f172a]">
      {/* Minimal Top Bar: Brand Logo Left, Circular Close Button Right */}
      <header className="w-full px-5 sm:px-12 pt-5 sm:pt-6 pb-2 flex items-center justify-between shrink-0">
        <Link to="/shop/home" className="flex items-center gap-2.5 group min-w-0">
          <div className="relative overflow-hidden rounded-xl border border-gray-200 p-1 group-hover:border-[#0C1172] transition-colors shadow-sm bg-white shrink-0">
            <img
              src="/logo.jpg"
              alt="Mobiletrends Logo"
              className="h-8 w-8 sm:h-9 sm:w-9 object-contain rounded-lg"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-manrope text-[16px] sm:text-[18px] leading-tight font-extrabold text-[#0f172a] tracking-[-0.5px] uppercase truncate">
              Mobile<span className="text-[#DF5E00]">trends</span>
            </span>
            <span className="text-[8.5px] sm:text-[9px] font-bold text-[#64748b] uppercase tracking-[0.15em] -mt-0.5 truncate">
              Systems Limited
            </span>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => navigate("/shop/home")}
          aria-label="Close and return to shop"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#f3f4f6] hover:bg-[#e5e7eb] text-[#1e293b] flex items-center justify-center transition-colors cursor-pointer shrink-0"
        >
          <X className="w-4 h-4" strokeWidth={2} />
        </button>
      </header>

      {/* Vertically & Horizontally Centered Auth Form Container */}
      <main className="flex-1 flex flex-col items-center justify-center px-5 py-6 sm:py-10 w-full max-w-full overflow-x-hidden">
        <div className="w-full max-w-[420px] mx-auto my-auto">{children}</div>
      </main>

      {/* Bottom balancer on mobile so the form sits truly in the middle of the viewport */}
      <div className="h-6 sm:h-8 shrink-0" aria-hidden="true" />
    </div>
  );
}

export default AuthLayout;
