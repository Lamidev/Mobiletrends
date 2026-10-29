'use client';

import React from "react";
import { motion } from "framer-motion";

function AuthLayout({ children }) {
  return (
    <motion.div
      className="min-h-screen bg-[#fafafa] flex flex-col lg:flex-row items-center justify-center relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-60 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-100 rounded-full blur-[120px] opacity-60" />
      <div className="absolute top-[20%] right-[10%] w-[15%] h-[15%] bg-blue-50 rounded-full blur-[80px] opacity-40" />

      {/* Mobile: Logo above the form */}
      <motion.div
        className="lg:hidden flex flex-col items-center justify-center w-full px-6 py-8 relative z-10"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-white p-3 rounded-2xl shadow-xl shadow-blue-100/50 mb-4 border border-gray-100">
          <img
            src="/logo.jpg"
            alt="Mobiletrends Systems Limited"
            className="w-16 h-16 object-contain rounded-xl"
          />
        </div>
        <motion.p
          className="text-gray-900 text-center text-lg font-black max-w-xs uppercase tracking-tight leading-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Mobile<span className="text-[#0C1172]">trends</span>
        </motion.p>
        <p className="text-[#DF5E00] text-xs font-bold mt-1 uppercase tracking-[0.2em]">Systems Limited</p>
      </motion.div>

      {/* Desktop: Left Panel with Logo and Description */}
      <motion.div
        className="hidden lg:flex flex-col items-center justify-center w-1/2 px-12 py-4 relative z-10"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 50 }}
      >
        <div className="relative group">
          <div className="absolute inset-0 bg-[#0C1172]/10 blur-2xl opacity-40 group-hover:opacity-60 transition-opacity rounded-full"></div>
          <motion.div
            className="bg-white p-6 rounded-[2.5rem] shadow-2xl relative z-20 border border-white/50"
            whileHover={{ y: -5, rotate: -2 }}
          >
            <img
              src="/logo.jpg"
              alt="Mobiletrends Systems Limited"
              className="w-44 h-44 object-contain rounded-3xl"
            />
          </motion.div>
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h1 className="text-5xl font-black text-gray-900 mb-2 tracking-tighter">
            Mobile<span className="text-[#0C1172]">trends</span>
          </h1>
          <p className="text-[#DF5E00] text-sm font-black uppercase tracking-[0.3em] mb-8">Systems Limited</p>
          <p className="text-gray-700 text-lg font-medium max-w-sm mx-auto leading-relaxed border-l-4 border-[#0C1172] pl-6 text-left italic">
            "Your trusted destination for premium smartphones, laptops, and technology accessories."
          </p>
        </motion.div>
      </motion.div>

      {/* Right Panel for Content (Login, Register, etc.) */}
      <motion.div
        className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-8 w-full relative z-20"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 50 }}
      >
        <div className="w-full max-w-lg">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default AuthLayout;
