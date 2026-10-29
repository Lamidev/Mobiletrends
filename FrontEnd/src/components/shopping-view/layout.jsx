'use client';

import React from "react";
import ShoppingHeader from "./header";
import Footer from "./footer";
import { FaWhatsapp } from "react-icons/fa";

const ShoppingLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white overflow-hidden">
      {/* Common header */}
      <ShoppingHeader />

      {/* Main Content */}
      <main className="flex-grow w-full">
        {children}
      </main>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/2348034378180?text=Hi,%20I%20would%20love%20to%20place%20an%20order%20with%20Mobiletrends"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Mobiletrends on WhatsApp"
        className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white p-3.5 rounded-full shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center"
      >
        <FaWhatsapp size={28} />
      </a>

      {/* Common Footer */}
      <Footer />
    </div>
  );
};

export default ShoppingLayout;
