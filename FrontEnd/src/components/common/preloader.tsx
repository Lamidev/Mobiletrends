'use client';

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface PreloaderProps {
  active?: boolean;
  subtitle?: string;
}

/**
 * Reusable SWOT-style full-screen preloader curtain with smooth upward slide-out animation.
 * Can be used for:
 * 1. Initial site visit / hydration preloader
 * 2. Protected route & auth session verification gate (/admin/*, /shop/checkout, /shop/account)
 * 3. Paystack payment verification return screen (/shop/paystack-return)
 * 4. Role switch / sign-in / sign-out transitions
 */
export function Preloader({ active = true, subtitle }: PreloaderProps) {
  const [shouldRender, setShouldRender] = useState(active);

  useEffect(() => {
    if (active) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 750);
      return () => clearTimeout(timer);
    }
  }, [active]);

  if (!shouldRender && !active) return null;

  return (
    <div
      aria-live="polite"
      aria-busy={active}
      className={`fixed inset-0 z-[9999] bg-[#fafaf8] flex items-center justify-center transition-transform duration-700 ease-out ${
        active
          ? "translate-y-0 pointer-events-auto"
          : "-translate-y-full pointer-events-none"
      }`}
    >
      <div className="flex flex-col items-center gap-5 px-6 text-center select-none">
        {/* Brand Logo + Wordmark */}
        <div className="flex items-center gap-2.5">
          <img
            src="/logo.jpg"
            alt="Mobiletrends Logo"
            className="h-9 w-9 sm:h-10 sm:w-10 object-contain mix-blend-multiply shrink-0"
          />
          <div className="flex flex-col text-left">
            <span className="font-manrope text-[19px] sm:text-[21px] leading-tight font-extrabold text-[#141619] tracking-[-0.6px] uppercase">
              Mobile<span className="text-[#0C1172]">trends</span>
            </span>
            <span className="font-body text-[9.5px] sm:text-[10px] font-bold text-[#DF5E00] uppercase tracking-[0.15em] -mt-0.5">
              Systems Limited
            </span>
          </div>
        </div>

        {/* 32px Circular Spinner matching SWOT preloader */}
        <div
          className="w-8 h-8 rounded-full border-[3px] border-[#daddd4] border-t-[#111344] animate-spin"
          role="status"
          aria-label="Loading Mobiletrends"
        />

        {subtitle && (
          <p className="font-body text-[12.5px] font-medium text-[#62665d] -mt-1">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * First-visit / initial app load preloader controller.
 * Displays the SWOT-style preloader on initial load and smoothly slides upward once ready.
 */
export function InitialVisitPreloader() {
  const { isCheckingAuth } = useSelector((state: any) => state.auth);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [maxTimeElapsed, setMaxTimeElapsed] = useState(false);

  useEffect(() => {
    const minTimer = setTimeout(() => setMinTimeElapsed(true), 550);
    const maxTimer = setTimeout(() => setMaxTimeElapsed(true), 1400);
    return () => {
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
    };
  }, []);

  const isActive = !maxTimeElapsed && (!minTimeElapsed || isCheckingAuth);

  return <Preloader active={isActive} />;
}

export default Preloader;

