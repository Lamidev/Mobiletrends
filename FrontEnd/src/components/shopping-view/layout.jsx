'use client';

import React from "react";
import ShoppingHeader from "./header";
import Footer from "./footer";
import { FaWhatsapp } from "react-icons/fa";
import { ArrowRight } from "lucide-react";

const ShoppingLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafaf8] font-body text-[#20231e] overflow-hidden">
      {/* Common header */}
      <ShoppingHeader />

      {/* Main Content */}
      <main className="flex-grow w-full">
        {children}
      </main>

      {/* SWOT-Style Floating WhatsApp Widget with Hover Popover */}
      <aside
        aria-label="WhatsApp support"
        className="group fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex items-center gap-3 font-body"
      >
        <div className="hidden sm:block bg-white border border-[#c7d3bb] rounded-[6px] px-[18px] py-3.5 shadow-[0_6px_25px_rgba(56,67,43,0.09)] opacity-0 translate-x-1.5 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:translate-x-0 group-focus-within:pointer-events-auto transition-all duration-200">
          <p className="text-[11px] text-[#62665d] m-0">
            Need prices, specs, or gadget info?
          </p>
          <a
            href="https://wa.me/2348034378180?text=Hi%20Mobiletrends%2C%20I%20need%20help%20checking%20gadget%20availability%20or%20prices."
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 flex items-center justify-between gap-6 text-[12px] font-semibold text-[#35522c] hover:text-[#DF5E00] transition-colors"
          >
            <span className="inline-flex items-center gap-1.5">
              <FaWhatsapp className="w-3.5 h-3.5" />
              <span>Chat with our team</span>
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <a
          href="https://wa.me/2348034378180?text=Hi%20Mobiletrends%2C%20I%20need%20help%20checking%20gadget%20availability%20or%20prices."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Mobiletrends on WhatsApp"
          className="grid place-items-center w-[48px] h-[48px] sm:w-[53px] sm:h-[53px] rounded-full bg-[#e2ecd8] text-[#35522c] border border-[#acbd98] shadow-[0_5px_24px_rgba(56,67,43,0.12)] hover:scale-105 transition-transform duration-200"
        >
          <FaWhatsapp className="w-6 h-6" />
        </a>
      </aside>

      {/* Common Footer */}
      <Footer />
    </div>
  );
};

export default ShoppingLayout;
