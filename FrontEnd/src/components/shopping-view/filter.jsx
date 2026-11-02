'use client';

import { useState } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { X, RotateCcw, Plus, Minus, Info } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { motion, AnimatePresence } from "framer-motion";

function ProductFilter({
  filters,
  handleFilter,
  filterOptions,
  isMobileFilterOpen,
  setIsMobileFilterOpen,
  isFilterLoading,
  minPrice,
  maxPrice,
  handlePriceChange,
  handleResetFilters,
  handleApplyFilters,
}) {
  // All sections closed/collapsed by default on both mobile and desktop
  const [openSections, setOpenSections] = useState({
    price: false,
    condition: false,
    category: false,
    brand: false,
  });

  const toggleSection = (sectionKey) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const renderFilterSection = (keyItem, customLabel = null) => {
    if (!filterOptions || !filterOptions[keyItem]) return null;
    const isOpen = Boolean(openSections[keyItem]);
    const selectedCount = filters[keyItem]?.length || 0;
    const label =
      customLabel ||
      (keyItem === "category"
        ? "CATEGORY"
        : keyItem === "brand"
        ? "BRAND"
        : keyItem === "condition"
        ? "CONDITION"
        : keyItem.toUpperCase());

    return (
      <div key={keyItem} className="py-1">
        <button
          type="button"
          onClick={() => toggleSection(keyItem)}
          className="w-full flex items-center justify-between py-3.5 text-left font-manrope text-[13px] sm:text-[13.5px] font-bold text-[#141619] tracking-[0.02em] uppercase hover:text-[#0C1172] transition-colors cursor-pointer select-none group"
        >
          <span className="flex items-center gap-2">
            <span>{label}</span>
            {keyItem === "condition" && (
              <Info
                className="w-3.5 h-3.5 text-gray-400 inline -mt-0.5"
                title="Condition guidelines: Brand New or UK-Used"
              />
            )}
            {selectedCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#111344] text-white leading-none">
                {selectedCount}
              </span>
            )}
          </span>
          <span className="flex items-center justify-center w-5 h-5 text-[#141619]">
            {isOpen ? (
              <Minus className="w-4 h-4" strokeWidth={2.2} />
            ) : (
              <Plus className="w-4 h-4" strokeWidth={2.2} />
            )}
          </span>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden pb-3.5 pt-0.5"
            >
              <div className="grid grid-cols-1 gap-1">
                {filterOptions[keyItem].map((optionItem) => (
                  <label
                    key={optionItem.id}
                    className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group select-none"
                  >
                    <Checkbox
                      id={`filter-${keyItem}-${optionItem.id}`}
                      checked={Boolean(filters?.[keyItem]?.includes(optionItem.id))}
                      onCheckedChange={(checked) =>
                        handleFilter(keyItem, optionItem.id, checked)
                      }
                      disabled={isFilterLoading}
                      className="data-[state=checked]:bg-[#111344] data-[state=checked]:border-[#111344] border-gray-300 rounded-sm"
                    />
                    <span className="text-[13px] font-medium text-[#4b5563] group-hover:text-[#111827] transition-colors">
                      {optionItem.label}
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderPriceSection = () => (
    <div key="price" className="py-1">
      <button
        type="button"
        onClick={() => toggleSection("price")}
        className="w-full flex items-center justify-between py-3.5 text-left font-manrope text-[13px] sm:text-[13.5px] font-bold text-[#141619] tracking-[0.02em] uppercase hover:text-[#0C1172] transition-colors cursor-pointer select-none group"
      >
        <span className="flex items-center gap-2">
          <span>PRICE RANGE</span>
          {(minPrice > 0 || maxPrice < 5000000) && (
            <span className="h-2 w-2 rounded-full bg-[#DF5E00]" />
          )}
        </span>
        <span className="flex items-center justify-center w-5 h-5 text-[#141619]">
          {openSections.price ? (
            <Minus className="w-4 h-4" strokeWidth={2.2} />
          ) : (
            <Plus className="w-4 h-4" strokeWidth={2.2} />
          )}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {openSections.price && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden pb-4 pt-1 space-y-3"
          >
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label
                  htmlFor="min-price"
                  className="text-[10px] text-gray-500 font-bold uppercase"
                >
                  Min (₦)
                </Label>
                <Input
                  id="min-price"
                  type="number"
                  placeholder="0"
                  value={minPrice === 0 ? "" : minPrice}
                  onChange={(e) =>
                    handlePriceChange(
                      "min",
                      e.target.value === "" ? 0 : parseInt(e.target.value)
                    )
                  }
                  className="h-9 text-xs border-gray-200"
                  disabled={isFilterLoading}
                />
              </div>
              <div className="space-y-1">
                <Label
                  htmlFor="max-price"
                  className="text-[10px] text-gray-500 font-bold uppercase"
                >
                  Max (₦)
                </Label>
                <Input
                  id="max-price"
                  type="number"
                  placeholder="5,000,000"
                  value={
                    maxPrice === 5000000 || maxPrice === 0 ? "" : maxPrice
                  }
                  onChange={(e) =>
                    handlePriceChange(
                      "max",
                      e.target.value === ""
                        ? 5000000
                        : parseInt(e.target.value)
                    )
                  }
                  className="h-9 text-xs border-gray-200"
                  disabled={isFilterLoading}
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <input
                type="range"
                min="0"
                max="5000000"
                step="10000"
                value={maxPrice || 5000000}
                onChange={(e) =>
                  handlePriceChange("max", parseInt(e.target.value))
                }
                className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#111344]"
                disabled={isFilterLoading}
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                <span>₦0</span>
                <span>₦5,000,000+</span>
              </div>
              <div className="text-center text-[11px] font-bold text-[#111344] bg-gray-100/70 py-1 rounded">
                ₦{(minPrice || 0).toLocaleString("en-NG")} — ₦
                {(maxPrice || 5000000).toLocaleString("en-NG")}
              </div>
            </div>

            <Button
              type="button"
              onClick={handleApplyFilters}
              disabled={isFilterLoading}
              className="w-full h-8 text-xs font-semibold bg-[#111344] hover:bg-[#0C1172] text-white rounded-[6px]"
            >
              Apply Price Filter
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const content = (
    <div className="font-body flex flex-col h-full bg-white">
      {/* Sticky Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
        <h2 className="font-manrope text-[17px] font-extrabold text-[#141619] tracking-tight">
          Filters
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="text-xs font-semibold text-[#62665d] hover:text-red-600 transition-colors h-8 px-2.5"
            disabled={isFilterLoading}
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset
          </Button>
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(false)}
            aria-label="Close filters"
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-[6px] hover:bg-gray-100 text-[#141619] transition-colors"
            disabled={isFilterLoading}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Collapsible Filter Accordion Rows (Ordered: 1. Price, 2. Condition, 3. Category, 4. Brand) */}
      <div className="flex-1 overflow-y-auto px-4 py-2 divide-y divide-gray-200">
        {/* 1. PRICE RANGE (FIRST) */}
        {renderPriceSection()}

        {/* 2. CONDITION (SECOND) */}
        {renderFilterSection("condition", "CONDITION")}

        {/* 3. CATEGORY (THIRD) */}
        {renderFilterSection("category", "CATEGORY")}

        {/* 4. BRAND (FOURTH) */}
        {renderFilterSection("brand", "BRAND")}

        {/* Any Other Custom Options */}
        {filterOptions &&
          Object.keys(filterOptions)
            .filter((k) => !["condition", "category", "brand"].includes(k))
            .map((k) => renderFilterSection(k))}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Filter Sidebar Card */}
      <aside className="hidden md:block w-64 lg:w-72 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)] h-fit sticky top-28">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isMobileFilterOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 md:hidden bg-black/50 backdrop-blur-sm flex justify-start animate-in fade-in duration-200"
          onClick={() => setIsMobileFilterOpen(false)}
        >
          <div
            className="w-full max-w-xs h-full bg-white shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {content}
          </div>
        </div>
      )}
    </>
  );
}

export default ProductFilter;
