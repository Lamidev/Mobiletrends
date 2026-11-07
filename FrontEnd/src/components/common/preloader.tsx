'use client';

import React, { useEffect, useState } from "react";

interface PreloaderProps {
  active?: boolean;
  subtitle?: string;
}

/**
 * Reusable full-screen preloader curtain with smooth upward slide-out animation.
 */
export function Preloader({ active = true, subtitle }: PreloaderProps) {
  const [shouldRender, setShouldRender] = useState(active);

  useEffect(() => {
    if (active) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 350);
      return () => clearTimeout(timer);
    }
  }, [active]);

  if (!shouldRender && !active) return null;

  return (
    <div
      aria-live="polite"
      aria-busy={active}
      className={`fixed inset-0 z-[9999] bg-[#fafaf8] flex items-center justify-center transition-transform duration-300 ease-out ${
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

        {/* Circular Spinner */}
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
 * Displays on the first visit only per session and smoothly dismisses without blocking navigation.
 */
export function InitialVisitPreloader() {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    try {
      const hasSeen = sessionStorage.getItem("mt_preloader_seen");
      if (!hasSeen) {
        setIsActive(true);
        sessionStorage.setItem("mt_preloader_seen", "true");
        // Fast, non-blocking 250ms dismiss
        const timer = setTimeout(() => setIsActive(false), 250);
        return () => clearTimeout(timer);
      }
    } catch {
      setIsActive(false);
    }
  }, []);

  if (!isActive) return null;

  return <Preloader active={isActive} />;
}

export default Preloader;
