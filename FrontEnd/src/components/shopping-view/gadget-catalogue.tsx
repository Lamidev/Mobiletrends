'use client';

import React from "react";
import {
  ArrowUpRight,
  Tablet,
  Watch,
  LayoutGrid,
  Plane,
} from "lucide-react";

interface GadgetCatalogueProps {
  onSelectCategory?: (categoryId: string) => void;
}

/* Exact SWOT #lucide-headphones SVG icon */
function SwotAudioIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
    </svg>
  );
}

/* Exact SWOT #lucide-cable SVG icon */
function SwotAccessoriesIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M17 21v-2a1 1 0 0 1-1-1v-1a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1" />
      <path d="M19 15V6.5a1 1 0 0 0-7 0v11a1 1 0 0 1-7 0V9" />
      <path d="M21 21v-2h-4" />
      <path d="M3 5h4V3" />
      <path d="M7 5a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1V3" />
    </svg>
  );
}

const SMALL_CATEGORIES = [
  { id: "tablets", label: "Tablets", icon: Tablet },
  { id: "smartwatches", label: "Watches", icon: Watch },
  { id: "drones", label: "Drones", icon: Plane },
  { id: "audio", label: "Audio", icon: SwotAudioIcon },
  { id: "accessories", label: "Accessories", icon: SwotAccessoriesIcon },
  { id: "products", label: "All Products", icon: LayoutGrid },
];

export default function GadgetCatalogue({
  onSelectCategory,
}: GadgetCatalogueProps) {
  const handleSelect = (categoryId: string) => {
    if (onSelectCategory) {
      onSelectCategory(categoryId);
    }
  };

  return (
    <section id="categories" className="w-full bg-[#fafaf8] font-body">
      <div className="mx-auto w-[min(1180px,calc(100%-32px))] md:w-[min(1180px,calc(100%-48px))] py-16 md:py-24">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8 mb-7 md:mb-9">
          <div>
            <p className="text-[#62665d] text-[8px] sm:text-[10px] tracking-[1.8px] sm:tracking-[2.2px] font-semibold mb-3 sm:mb-4 uppercase">
              EXPLORE OUR GADGET CATALOGUE
            </p>
            <h2 className="font-manrope text-[clamp(32px,3.7vw,48px)] leading-[1.19] tracking-[-2px] font-semibold text-[#20231e] m-0">
              Clean devices.
              <br />
              Honest specs. Zero stories.
            </h2>
          </div>
          <p className="text-[12px] sm:text-[13px] leading-[1.9] pb-1 text-[#62665d] m-0">
            From M-series MacBooks and high-spec Windows workstations
            <br className="hidden sm:inline" /> to factory-unlocked flagships and
            gaming consoles, we source only verified gear.
          </p>
        </div>

        {/* 3 Main Bento Category Cards (SWOT 2-col responsive mobile layout) */}
        <div className="grid grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] gap-3 sm:gap-4">
          {/* Card 1: Laptops (Full width on mobile, 1.5fr on desktop) */}
          <button
            type="button"
            onClick={() => handleSelect("laptops")}
            className="col-span-2 lg:col-span-1 group relative isolate overflow-hidden rounded-[7px] min-h-[280px] sm:min-h-[325px] flex items-end p-[21px] sm:p-[27px] text-[#f4f3ef] bg-[#eceeed] cursor-pointer text-left border-none w-full after:content-[''] after:absolute after:inset-0 after:-z-10 after:bg-[linear-gradient(180deg,transparent_40%,#111a_72%,#111e)]"
          >
            <img
              src="/products/macbook-pro.png"
              alt="MacBook Pro Laptops"
              loading="lazy"
              className="absolute inset-0 w-full h-[76%] object-contain pt-[5px] sm:pt-6 px-[25px] pb-[5px] -z-20 transition-transform duration-700 ease-out group-hover:scale-[1.045]"
            />
            <div>
              <span className="block text-[6.5px] sm:text-[8px] tracking-[0.8px] sm:tracking-[1.5px] text-[#c6c6c0] uppercase font-medium">
                DEVELOPER &amp; WORK RIGS
              </span>
              <h3 className="font-manrope text-[25px] sm:text-[29px] mt-1.5 sm:mt-2 mb-0 tracking-[-1px] font-semibold text-[#f4f3ef] leading-[1.35]">
                Laptops
              </h3>
              <p className="text-[10px] sm:text-[11px] mt-1 sm:mt-1.5 mb-0 text-[#cecec8] max-w-[82%] leading-[1.6]">
                MacBooks, high-battery Windows workhorses &amp; gaming rigs.
              </p>
            </div>
            <span className="absolute right-[15px] sm:right-5 bottom-[20px] sm:bottom-[26px] w-[27px] h-[27px] sm:w-[34px] sm:h-[34px] border border-white/25 rounded-full grid place-items-center transition-colors duration-200 text-[#f4f3ef] group-hover:bg-[#111344] group-hover:border-[#111344] group-hover:text-white">
              <ArrowUpRight className="w-[13px] h-[13px] sm:w-[14px] sm:h-[14px]" strokeWidth={1.75} />
            </span>
          </button>

          {/* Card 2: Phones (Left column on mobile, middle on desktop) */}
          <button
            type="button"
            onClick={() => handleSelect("smartphones")}
            className="col-span-1 group relative isolate overflow-hidden rounded-[7px] min-h-[240px] sm:min-h-[325px] flex items-end p-[18px] sm:p-[27px] text-[#f4f3ef] bg-[#eceeed] cursor-pointer text-left border-none w-full after:content-[''] after:absolute after:inset-0 after:-z-10 after:bg-[linear-gradient(180deg,transparent_40%,#111a_72%,#111e)]"
          >
            <img
              src="/products/iphone-18-pro.png"
              alt="Flagship Smartphones"
              loading="lazy"
              className="absolute inset-x-0 -top-[10%] w-full h-[93%] object-contain pt-4 sm:pt-6 px-3 sm:px-[25px] pb-[5px] -z-20 transition-transform duration-700 ease-out group-hover:scale-[1.045]"
            />
            <div>
              <span className="block text-[6px] sm:text-[8px] tracking-[0.8px] sm:tracking-[1.5px] text-[#c6c6c0] uppercase font-medium">
                FACTORY UNLOCKED &amp; TESTED
              </span>
              <h3 className="font-manrope text-[23px] sm:text-[29px] mt-1.5 sm:mt-2 mb-0 tracking-[-1px] font-semibold text-[#f4f3ef] leading-[1.35]">
                Phones
              </h3>
            </div>
            <span className="absolute right-[15px] sm:right-5 bottom-[20px] sm:bottom-[26px] w-[27px] h-[27px] sm:w-[34px] sm:h-[34px] border border-white/25 rounded-full grid place-items-center transition-colors duration-200 text-[#f4f3ef] group-hover:bg-[#111344] group-hover:border-[#111344] group-hover:text-white">
              <ArrowUpRight className="w-[13px] h-[13px] sm:w-[14px] sm:h-[14px]" strokeWidth={1.75} />
            </span>
          </button>

          {/* Card 3: Gaming (Right column on mobile, right on desktop) */}
          <button
            type="button"
            onClick={() => handleSelect("gaming")}
            className="col-span-1 group relative isolate overflow-hidden rounded-[7px] min-h-[240px] sm:min-h-[325px] flex items-end p-[18px] sm:p-[27px] text-[#f4f3ef] bg-[#20201e] cursor-pointer text-left border-none w-full after:content-[''] after:absolute after:inset-0 after:-z-10 after:bg-[linear-gradient(180deg,transparent_40%,#111a_72%,#111e)]"
          >
            <img
              src="/products/ps5-pro.jpg"
              alt="Gaming Consoles"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-[center_55%] -z-20 transition-transform duration-700 ease-out group-hover:scale-[1.045]"
            />
            <div>
              <span className="block text-[6px] sm:text-[8px] tracking-[0.8px] sm:tracking-[1.5px] text-[#c6c6c0] uppercase font-medium">
                PS5, XBOX &amp; ACCESSORIES
              </span>
              <h3 className="font-manrope text-[23px] sm:text-[29px] mt-1.5 sm:mt-2 mb-0 tracking-[-1px] font-semibold text-[#f4f3ef] leading-[1.35]">
                Gaming
              </h3>
            </div>
            <span className="absolute right-[15px] sm:right-5 bottom-[20px] sm:bottom-[26px] w-[27px] h-[27px] sm:w-[34px] sm:h-[34px] border border-white/25 rounded-full grid place-items-center transition-colors duration-200 text-[#f4f3ef] group-hover:bg-[#111344] group-hover:border-[#111344] group-hover:text-white">
              <ArrowUpRight className="w-[13px] h-[13px] sm:w-[14px] sm:h-[14px]" strokeWidth={1.75} />
            </span>
          </button>
        </div>

        {/* 6 Sub-Category Pills: Tablets, Watches, Drones, Audio, Accessories, All Products (Strict 2-per-row on mobile, 3-per-row on tablet, 6-per-row on desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mt-3 sm:mt-4 gap-2 sm:gap-3">
          {SMALL_CATEGORIES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => handleSelect(id)}
              className="w-full bg-white border border-[#daddd4] rounded-[4px] py-[13px] sm:py-[18px] px-[10px] sm:px-[14px] flex items-center justify-between gap-1.5 sm:gap-2.5 text-[11px] sm:text-[12px] font-medium text-[#20231e] cursor-pointer transition-all duration-200 hover:border-[#20231e] hover:bg-[#f3f4ef] hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Icon
                  className="w-[14px] h-[14px] text-[#62665d] shrink-0"
                  strokeWidth={1.75}
                />
                <span className="truncate">{label}</span>
              </div>
              <ArrowUpRight
                className="w-[12px] h-[12px] text-[#62665d] shrink-0"
                strokeWidth={1.75}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
