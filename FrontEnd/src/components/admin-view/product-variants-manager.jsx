'use client';

import React, { useState } from 'react';
import { resolveColorName } from '@/lib/color-resolver';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, X, Star, Check } from 'lucide-react';

const COMMON_STORAGE_PRESETS = ['128GB', '256GB', '512GB', '1TB'];
const COMMON_RAM_PRESETS = ['8GB', '16GB', '18GB', '24GB', '32GB', '64GB'];
const COMMON_SSD_PRESETS = ['256GB SSD', '512GB SSD', '1TB SSD', '2TB SSD'];
const POPULAR_COLOR_SUGGESTIONS = [
  'Space Black',
  'Natural Titanium',
  'Desert Titanium',
  'Silver',
  'Midnight',
  'Deep Blue',
  'Gold',
  'Burgundy',
];

// Comma formatting helpers
function formatWithCommas(val) {
  if (val === undefined || val === null || val === '') return '';
  const clean = String(val).replace(/[^0-9]/g, '');
  if (!clean) return '';
  return Number(clean).toLocaleString('en-NG');
}

function parseRawNumber(val) {
  if (val === undefined || val === null || val === '') return 0;
  const clean = String(val).replace(/[^0-9]/g, '');
  return clean ? Number(clean) : 0;
}

export default function ProductVariantsManager({ formData, setFormData }) {
  const [colorInput, setColorInput] = useState('');
  const [customColorPickerHex, setCustomColorPickerHex] = useState('#111344');

  // Live preview for current typing color
  const liveColorPreview = resolveColorName(colorInput, customColorPickerHex);

  // ----------------------------------------------------
  // COLORS MANAGEMENT
  // ----------------------------------------------------
  const handleAddColor = (nameToAdd, forcedHex) => {
    const raw = (nameToAdd || colorInput).trim();
    if (!raw) return;

    const resolved = forcedHex
      ? { name: raw, hex: forcedHex, isRecognized: true }
      : resolveColorName(raw, customColorPickerHex);

    const existing = formData.colors || [];

    // Avoid duplicate names (case-insensitive)
    if (existing.some((c) => c.name.toLowerCase() === resolved.name.toLowerCase())) {
      setColorInput('');
      return;
    }

    setFormData({
      ...formData,
      colors: [...existing, { name: resolved.name, hex: resolved.hex }],
    });
    setColorInput('');
  };

  const handleRemoveColor = (indexToRemove) => {
    setFormData({
      ...formData,
      colors: (formData.colors || []).filter((_, idx) => idx !== indexToRemove),
    });
  };

  // ----------------------------------------------------
  // STORAGE VARIANTS (Smartphones & Tablets)
  // ----------------------------------------------------
  const handleAddStorageVariant = () => {
    const existing = formData.storageVariants || [];
    const nextPreset =
      COMMON_STORAGE_PRESETS.find((p) => !existing.some((v) => v.size === p)) ||
      `${existing.length + 1}TB`;

    const isFirst = existing.length === 0;

    setFormData({
      ...formData,
      storageVariants: [
        ...existing,
        {
          size: nextPreset,
          price: 0, // Additional delta amount (+₦0 for base, +₦X for upgrades)
          isBase: isFirst, // First variant defaults to base model
        },
      ],
    });
  };

  const handleSetBaseStorage = (targetIndex) => {
    const updated = (formData.storageVariants || []).map((v, idx) => ({
      ...v,
      isBase: idx === targetIndex,
      price: idx === targetIndex ? 0 : v.price, // Base model is always +₦0
    }));
    setFormData({ ...formData, storageVariants: updated });
  };

  const handleUpdateStorageVariant = (index, field, rawValue) => {
    const updated = [...(formData.storageVariants || [])];
    const current = updated[index] || {};

    if (field === 'size') {
      updated[index] = { ...current, size: rawValue };
    } else if (field === 'price') {
      // Store raw input or empty string during typing so user can backspace 0
      const numericVal = parseRawNumber(rawValue);
      updated[index] = {
        ...current,
        price: rawValue === '' ? '' : numericVal,
      };
    }

    setFormData({
      ...formData,
      storageVariants: updated,
    });
  };

  const handleRemoveStorageVariant = (indexToRemove) => {
    const updated = (formData.storageVariants || []).filter(
      (_, idx) => idx !== indexToRemove
    );
    // If we removed the base variant, make the first remaining variant the base
    if (updated.length > 0 && !updated.some((v) => v.isBase)) {
      updated[0].isBase = true;
      updated[0].price = 0;
    }
    setFormData({
      ...formData,
      storageVariants: updated,
    });
  };

  // ----------------------------------------------------
  // LAPTOP CONFIG VARIANTS (Laptops: RAM + SSD)
  // ----------------------------------------------------
  const handleAddLaptopVariant = () => {
    const existing = formData.laptopVariants || [];
    const isFirst = existing.length === 0;

    setFormData({
      ...formData,
      laptopVariants: [
        ...existing,
        {
          ram: '16GB',
          storage: '512GB SSD',
          price: 0, // Additional delta amount (+₦0 for base config)
          isBase: isFirst,
        },
      ],
    });
  };

  const handleSetBaseLaptop = (targetIndex) => {
    const updated = (formData.laptopVariants || []).map((v, idx) => ({
      ...v,
      isBase: idx === targetIndex,
      price: idx === targetIndex ? 0 : v.price,
    }));
    setFormData({ ...formData, laptopVariants: updated });
  };

  const handleUpdateLaptopVariant = (index, field, rawValue) => {
    const updated = [...(formData.laptopVariants || [])];
    const current = updated[index] || {};

    if (field === 'ram' || field === 'storage') {
      updated[index] = { ...current, [field]: rawValue };
    } else if (field === 'price') {
      const numericVal = parseRawNumber(rawValue);
      updated[index] = {
        ...current,
        price: rawValue === '' ? '' : numericVal,
      };
    }

    setFormData({
      ...formData,
      laptopVariants: updated,
    });
  };

  const handleRemoveLaptopVariant = (indexToRemove) => {
    const updated = (formData.laptopVariants || []).filter(
      (_, idx) => idx !== indexToRemove
    );
    if (updated.length > 0 && !updated.some((v) => v.isBase)) {
      updated[0].isBase = true;
      updated[0].price = 0;
    }
    setFormData({
      ...formData,
      laptopVariants: updated,
    });
  };

  const hasCategory = Boolean(formData.category);
  const isPhoneOrTablet =
    formData.category === 'smartphones' || formData.category === 'tablets';
  const isLaptop = formData.category === 'laptops';

  if (!hasCategory) {
    return (
      <div className="pt-4 border-t border-gray-200">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-[#111344]/10 text-[#111344] flex items-center justify-center shrink-0 font-bold text-xs">
            i
          </div>
          <div className="text-xs">
            <p className="font-bold text-gray-900">Select a Category Above</p>
            <p className="text-gray-500 mt-0.5">
              Choose a product category (e.g. Smartphones or Laptops) above to configure hardware variants, storage, and colors.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-4 border-t border-gray-200 max-w-full overflow-hidden">
      {/* 1. DYNAMIC COLOR BUILDER */}
      <div className="space-y-3 bg-gray-50/80 p-3.5 sm:p-4 rounded-xl border border-gray-200">
        <div>
          <Label className="text-sm font-bold text-gray-900 flex flex-wrap items-center justify-between gap-1">
            <span>Available Colors</span>
            <span className="text-[11px] font-normal text-muted-foreground">
              Type color name (e.g. burgundy, midnight)
            </span>
          </Label>
        </div>

        {/* Existing Color Chips */}
        {formData.colors && formData.colors.length > 0 ? (
          <div className="flex flex-wrap gap-2 py-1">
            {formData.colors.map((col, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white text-gray-800 border border-gray-300 shadow-sm"
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0 shadow-inner"
                  style={{ backgroundColor: col.hex }}
                />
                <span className="capitalize">{col.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveColor(idx)}
                  className="text-gray-400 hover:text-red-500 font-bold ml-1 transition-colors"
                  title="Remove color"
                >
                  <X size={13} />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            No colors added yet. Type a color name below to add one.
          </p>
        )}

        {/* Add Color Input Row */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 min-w-0">
              <Input
                type="text"
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddColor();
                  }
                }}
                placeholder="Type color (e.g. burgundy, desert titanium)..."
                className="h-9 text-xs sm:text-sm bg-white pr-8"
              />
              {colorInput.trim() && (
                <div
                  className="absolute right-2 top-2.5 w-4 h-4 rounded-full border border-black/20 shadow-inner"
                  style={{ backgroundColor: liveColorPreview.hex }}
                  title={liveColorPreview.isRecognized ? `Matched: ${liveColorPreview.name}` : 'Unrecognized'}
                />
              )}
            </div>

            <Button
              type="button"
              onClick={() => handleAddColor()}
              size="sm"
              className="h-9 bg-[#111344] hover:bg-[#0C1172] text-white shrink-0 font-semibold px-3"
            >
              <Plus size={14} className="mr-1" /> Add
            </Button>
          </div>

          {/* Color Resolution Status & Custom Picker Fallback */}
          {colorInput.trim() && (
            <div className="flex items-center justify-between text-[11px] px-1 text-gray-600 bg-white/80 p-1.5 rounded-md border border-gray-200">
              <div className="flex items-center gap-1.5 truncate">
                <span
                  className="w-3 h-3 rounded-full border border-black/20 shrink-0"
                  style={{ backgroundColor: liveColorPreview.hex }}
                />
                {liveColorPreview.isRecognized ? (
                  <span className="text-emerald-700 font-semibold truncate">
                    Recognized: {liveColorPreview.name}
                  </span>
                ) : (
                  <span className="text-amber-700 font-medium truncate">
                    Custom shade: adjust with picker →
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-2">
                <input
                  type="color"
                  value={liveColorPreview.hex}
                  onChange={(e) => setCustomColorPickerHex(e.target.value)}
                  className="w-6 h-6 p-0 border border-gray-300 rounded cursor-pointer"
                  title="Pick exact custom color"
                />
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[11px] font-semibold text-gray-500 shrink-0">
            Quick Add:
          </span>
          {POPULAR_COLOR_SUGGESTIONS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handleAddColor(preset)}
              className="text-[11px] font-medium text-gray-600 bg-white hover:bg-gray-100 hover:text-gray-900 border border-gray-200 px-2 py-0.5 rounded-md transition-colors cursor-pointer shrink-0"
            >
              + {preset}
            </button>
          ))}
        </div>
      </div>

      {/* 2. DYNAMIC STORAGE VARIANTS (SMARTPHONES / TABLETS) */}
      {isPhoneOrTablet && (
        <div className="space-y-3 bg-gray-50/80 p-3.5 sm:p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <Label className="text-sm font-bold text-gray-900 block truncate">
                Storage Variants & Pricing
              </Label>
              <p className="text-[11px] text-muted-foreground truncate">
                Set additional price (+₦) per storage upgrade.
              </p>
            </div>
            <Button
              type="button"
              onClick={handleAddStorageVariant}
              size="sm"
              variant="outline"
              className="h-8 text-xs font-bold border-gray-300 hover:bg-white shrink-0 px-2.5"
            >
              <Plus size={13} className="mr-1" /> Add Storage
            </Button>
          </div>

          {formData.storageVariants && formData.storageVariants.length > 0 ? (
            <div className="space-y-2.5">
              {formData.storageVariants.map((item, idx) => {
                const isBase = Boolean(item.isBase);
                const displayPrice = isBase
                  ? '0'
                  : item.price === ''
                  ? ''
                  : formatWithCommas(item.price);

                return (
                  <div
                    key={idx}
                    className={`bg-white p-3 rounded-lg border shadow-sm transition-all ${
                      isBase
                        ? 'border-[#111344]/30 bg-blue-50/20 ring-1 ring-[#111344]/15'
                        : 'border-gray-200'
                    }`}
                  >
                    {/* Top Row: Storage Size & Base Model Pill */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Input
                          type="text"
                          value={item.size}
                          onChange={(e) =>
                            handleUpdateStorageVariant(idx, 'size', e.target.value)
                          }
                          placeholder="e.g. 128GB"
                          className="h-8 text-xs font-bold w-24 sm:w-28 bg-white shrink-0"
                        />
                        <button
                          type="button"
                          onClick={() => handleSetBaseStorage(idx)}
                          className={`text-[11px] font-bold px-2 py-1 rounded-md transition-all flex items-center gap-1 shrink-0 ${
                            isBase
                              ? 'bg-[#111344] text-white shadow-xs'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          title="Click to set as base model"
                        >
                          <Star size={11} className={isBase ? 'fill-amber-400 text-amber-400' : ''} />
                          <span>{isBase ? 'Base Model' : 'Set as Base'}</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveStorageVariant(idx)}
                        className="h-7 w-7 text-gray-400 hover:text-red-600 flex items-center justify-center rounded-md hover:bg-red-50 transition-colors shrink-0"
                        title="Delete Variant"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Bottom Row: Additional Price Input */}
                    <div>
                      <Label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                        {isBase ? 'Additional Price (Base Included)' : 'Additional Price (+₦ Upgrade)'}
                      </Label>
                      <div className="relative flex items-center">
                        <span className="absolute left-2.5 text-xs font-bold text-gray-500 pointer-events-none">
                          + ₦
                        </span>
                        <Input
                          type="text"
                          inputMode="numeric"
                          disabled={isBase}
                          value={displayPrice}
                          onChange={(e) =>
                            handleUpdateStorageVariant(idx, 'price', e.target.value)
                          }
                          placeholder={isBase ? '0 (Included in Base Price)' : 'e.g. 50,000'}
                          className={`h-8 text-xs font-semibold pl-8 ${
                            isBase ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4 bg-white rounded-lg border border-dashed border-gray-300">
              <p className="text-xs text-muted-foreground">
                No storage variants added. Base product price will be used.
              </p>
              <Button
                type="button"
                onClick={handleAddStorageVariant}
                size="sm"
                variant="ghost"
                className="mt-1 text-xs text-[#111344] font-bold hover:bg-gray-100"
              >
                + Add First Storage Tier
              </Button>
            </div>
          )}
        </div>
      )}

      {/* 3. DYNAMIC LAPTOP CONFIG VARIANTS (LAPTOPS: RAM + SSD) */}
      {isLaptop && (
        <div className="space-y-3 bg-gray-50/80 p-3.5 sm:p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <Label className="text-sm font-bold text-gray-900 block truncate">
                Laptop RAM & SSD Configurations
              </Label>
              <p className="text-[11px] text-muted-foreground truncate">
                Set additional price (+₦) per hardware configuration.
              </p>
            </div>
            <Button
              type="button"
              onClick={handleAddLaptopVariant}
              size="sm"
              variant="outline"
              className="h-8 text-xs font-bold border-gray-300 hover:bg-white shrink-0 px-2.5"
            >
              <Plus size={13} className="mr-1" /> Add Config
            </Button>
          </div>

          {formData.laptopVariants && formData.laptopVariants.length > 0 ? (
            <div className="space-y-2.5">
              {formData.laptopVariants.map((item, idx) => {
                const isBase = Boolean(item.isBase);
                const displayPrice = isBase
                  ? '0'
                  : item.price === ''
                  ? ''
                  : formatWithCommas(item.price);

                return (
                  <div
                    key={idx}
                    className={`bg-white p-3 rounded-lg border shadow-sm transition-all ${
                      isBase
                        ? 'border-[#111344]/30 bg-blue-50/20 ring-1 ring-[#111344]/15'
                        : 'border-gray-200'
                    }`}
                  >
                    {/* Top Row: RAM & SSD Specs + Base Toggle */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 flex-1 flex-wrap">
                        <Input
                          type="text"
                          value={item.ram}
                          onChange={(e) =>
                            handleUpdateLaptopVariant(idx, 'ram', e.target.value)
                          }
                          placeholder="RAM (e.g. 16GB)"
                          className="h-8 text-xs font-bold w-20 sm:w-24 bg-white shrink-0"
                        />
                        <Input
                          type="text"
                          value={item.storage}
                          onChange={(e) =>
                            handleUpdateLaptopVariant(idx, 'storage', e.target.value)
                          }
                          placeholder="SSD (e.g. 512GB SSD)"
                          className="h-8 text-xs font-bold w-28 sm:w-32 bg-white shrink-0"
                        />
                        <button
                          type="button"
                          onClick={() => handleSetBaseLaptop(idx)}
                          className={`text-[11px] font-bold px-2 py-1 rounded-md transition-all flex items-center gap-1 shrink-0 ${
                            isBase
                              ? 'bg-[#111344] text-white shadow-xs'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          title="Click to set as base configuration"
                        >
                          <Star size={11} className={isBase ? 'fill-amber-400 text-amber-400' : ''} />
                          <span>{isBase ? 'Base Config' : 'Set Base'}</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveLaptopVariant(idx)}
                        className="h-7 w-7 text-gray-400 hover:text-red-600 flex items-center justify-center rounded-md hover:bg-red-50 transition-colors shrink-0"
                        title="Delete Config"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Bottom Row: Additional Price Input */}
                    <div>
                      <Label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                        {isBase ? 'Additional Price (Base Included)' : 'Additional Price (+₦ Upgrade)'}
                      </Label>
                      <div className="relative flex items-center">
                        <span className="absolute left-2.5 text-xs font-bold text-gray-500 pointer-events-none">
                          + ₦
                        </span>
                        <Input
                          type="text"
                          inputMode="numeric"
                          disabled={isBase}
                          value={displayPrice}
                          onChange={(e) =>
                            handleUpdateLaptopVariant(idx, 'price', e.target.value)
                          }
                          placeholder={isBase ? '0 (Included in Base Price)' : 'e.g. 100,000'}
                          className={`h-8 text-xs font-semibold pl-8 ${
                            isBase ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4 bg-white rounded-lg border border-dashed border-gray-300">
              <p className="text-xs text-muted-foreground">
                No configurations added. Base product price will be used.
              </p>
              <Button
                type="button"
                onClick={handleAddLaptopVariant}
                size="sm"
                variant="ghost"
                className="mt-1 text-xs text-[#111344] font-bold hover:bg-gray-100"
              >
                + Add First Laptop Configuration
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
