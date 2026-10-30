'use client';

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { X } from "lucide-react";

function AuthLayout({ children }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col font-body text-[#0f172a]">
      {/* Minimal Top Bar: Brand Logo Left, Circular Close Button Right */}
      <header className="w-full px-6 sm:px-12 pt-6 pb-2 flex items-center justify-between">
        <Link to="/shop/home" className="flex items-center gap-2.5 group">
          <div className="relative overflow-hidden rounded-xl border border-gray-200 p-1 group-hover:border-[#0C1172] transition-colors shadow-sm bg-white">
            <img
              src="/logo.jpg"
              alt="Mobiletrends Logo"
              className="h-9 w-9 object-contain rounded-lg"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-manrope text-[18px] leading-tight font-extrabold text-[#0f172a] tracking-[-0.6px] uppercase">
              Mobile<span className="text-[#DF5E00]">trends</span>
            </span>
            <span className="text-[9px] font-bold text-[#64748b] uppercase tracking-[0.16em] -mt-0.5">
              Systems Limited
            </span>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => navigate("/shop/home")}
          aria-label="Close and return to shop"
          className="w-10 h-10 rounded-full bg-[#f3f4f6] hover:bg-[#e5e7eb] text-[#1e293b] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" strokeWidth={2} />
        </button>
      </header>

      {/* Centered Auth Form Container */}
      <main className="flex-1 flex items-center justify-center px-5 py-8 sm:py-12">
        <div className="w-full max-w-[430px]">{children}</div>
      </main>
    </div>
  );
}

export default AuthLayout;
