'use client';

import { useState } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { X, Loader2, RotateCcw, Plus, Minus, Info } from "lucide-react";
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
  // Collapsible state for each section (matches the reference accordion format)
  const [openSections, setOpenSections] = useState({
    category: true,
    condition: true,
    brand: false,
    price: false,
  });

  const toggleSection = (sectionKey) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

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
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 text-[#141619] transition-colors"
            disabled={isFilterLoading}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Collapsible Filter Accordion Rows */}
      <div className="flex-1 overflow-y-auto px-4 py-2 divide-y divide-gray-200">
        {/* Dynamic Category, Brand, Condition Sections */}
        {Object.keys(filterOptions).map((keyItem) => {
          const isOpen = Boolean(openSections[keyItem]);
          const selectedCount = filters[keyItem]?.length || 0;

          return (
            <div key={keyItem} className="py-1">
              <button
                type="button"
                onClick={() => toggleSection(keyItem)}
                className="w-full flex items-center justify-between py-3.5 text-left font-manrope text-[13px] sm:text-[13.5px] font-bold text-[#141619] tracking-[0.02em] uppercase hover:text-[#0C1172] transition-colors cursor-pointer select-none group"
              >
                <span className="flex items-center gap-2">
                  <span>
                    {keyItem === "category"
                      ? "CATEGORY"
                      : keyItem === "brand"
                      ? "BRAND"
                      : keyItem === "condition"
                      ? "CONDITION"
                      : keyItem}
                  </span>
                  {keyItem === "condition" && (
                    <Info
                      className="w-3.5 h-3.5 text-gray-400 inline -mt-0.5"
                      title="Condition guidelines: Brand New or Premium Used"
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
                            id={optionItem.id}
                            checked={filters[keyItem]?.includes(optionItem.id)}
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
        })}

        {/* Collapsible Price Range Section */}
        <div className="py-1">
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
                    ₦{minPrice?.toLocaleString()} – ₦{maxPrice?.toLocaleString()}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Sticky Bottom Apply Button */}
      <div className="p-3.5 border-t border-gray-200 sticky bottom-0 bg-white">
        <Button
          className="w-full bg-[#111344] hover:bg-[#0C1172] text-white h-10 text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-all"
          onClick={handleApplyFilters}
          disabled={isFilterLoading}
        >
          {isFilterLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Applying Filters...
            </>
          ) : (
            "Apply Filters"
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Collapsible format matching design) */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-200 shadow-sm h-fit overflow-hidden sticky top-24">
        {content}
      </div>

      {/* Mobile Drawer (Collapsible accordion sliding from left) */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/60 z-[100] md:hidden backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-[300px] sm:w-[320px] max-w-[85vw] bg-white z-[110] md:hidden shadow-2xl flex flex-col"
            >
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default ProductFilter;
