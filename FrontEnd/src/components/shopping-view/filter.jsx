'use client';
import { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { X, Loader2, RotateCcw } from "lucide-react";
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
  const content = (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-background z-10">
        <h2 className="text-lg font-extrabold">Filters</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="text-xs font-bold text-muted-foreground hover:text-red-500 transition-colors"
            disabled={isFilterLoading}
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileFilterOpen(false)}
            className="md:hidden"
            disabled={isFilterLoading}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Price Filter Section */}
        <div className="space-y-2">
          <h3 className="text-base font-bold text-primary">Price Range (₦)</h3>

          <div className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label htmlFor="min-price" className="text-xs text-gray-500 font-medium uppercase">Min</Label>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₦</span>
                  <Input
                    id="min-price"
                    type="number"
                    placeholder="0"
                    value={minPrice === 0 ? "" : minPrice}
                    onChange={(e) => handlePriceChange("min", e.target.value === "" ? 0 : parseInt(e.target.value))}
                    className="pl-5 h-9 text-xs border-gray-200 focus:ring-peach-500"
                    disabled={isFilterLoading}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="max-price" className="text-xs text-gray-500 font-medium uppercase">Max</Label>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₦</span>
                  <Input
                    id="max-price"
                    type="number"
                    placeholder="5,000,000"
                    value={maxPrice === 5000000 || maxPrice === 0 ? "" : maxPrice}
                    onChange={(e) => handlePriceChange("max", e.target.value === "" ? 5000000 : parseInt(e.target.value))}
                    className="pl-5 h-9 text-xs border-gray-200 focus:ring-peach-500"
                    disabled={isFilterLoading}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="5000000"
                step="10000"
                value={maxPrice || 5000000}
                onChange={(e) => handlePriceChange("max", parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-peach-500"
                disabled={isFilterLoading}
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-bold">
                <span>₦0</span>
                <span>₦5,000,000+</span>
              </div>
              <div className="text-center text-[11px] font-bold text-peach-600 bg-peach-50/50 py-1 rounded">
                Range: ₦{minPrice?.toLocaleString()} - ₦{maxPrice?.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-100" />

        {/* Dynamic Options */}
        {Object.keys(filterOptions).map((keyItem) => (
          <Fragment key={keyItem}>
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold capitalize text-primary">{keyItem}</h3>
              <div className="grid grid-cols-1 gap-0.5">
                {filterOptions[keyItem].map((optionItem) => (
                  <label
                    key={optionItem.id}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-peach-50/50 cursor-pointer transition-colors group"
                  >
                    <Checkbox
                      id={optionItem.id}
                      checked={filters[keyItem]?.includes(optionItem.id)}
                      onCheckedChange={(checked) =>
                        handleFilter(keyItem, optionItem.id, checked)
                      }
                      disabled={isFilterLoading}
                      className="data-[state=checked]:bg-peach-500 data-[state=checked]:border-peach-500 border-gray-300 rounded-sm"
                    />
                    <span className="text-sm font-medium text-gray-600 group-hover:text-primary transition-colors">
                      {optionItem.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <Separator className="bg-gray-100" />
          </Fragment>
        ))}
      </div>

      <div className="p-3 border-t sticky bottom-0 bg-background space-y-2">
        <Button
          className="w-full bg-peach-500 hover:bg-peach-600 h-10 text-sm font-bold shadow-sm"
          onClick={handleApplyFilters}
          disabled={isFilterLoading}
        >
          {isFilterLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Applying...
            </>
          ) : (
            "Filter Products"
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm h-fit overflow-hidden sticky top-24">
        {content}
      </div>

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
              className="fixed inset-y-0 left-0 w-[280px] bg-background z-[110] md:hidden shadow-2xl flex flex-col"
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
