'use client';

import React, { useState } from 'react';
import { resolveColorName } from '@/lib/color-resolver';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, X, Sparkles } from 'lucide-react';

const COMMON_STORAGE_PRESETS = ['128GB', '256GB', '512GB', '1TB'];
const COMMON_RAM_PRESETS = ['8GB', '16GB', '18GB', '24GB', '32GB', '36GB', '64GB'];
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

export default function ProductVariantsManager({ formData, setFormData }) {
  const [colorInput, setColorInput] = useState('');

  // ----------------------------------------------------
  // COLORS MANAGEMENT
  // ----------------------------------------------------
  const handleAddColor = (nameToAdd) => {
    const raw = (nameToAdd || colorInput).trim();
    if (!raw) return;

    const resolved = resolveColorName(raw);
    const existing = formData.colors || [];

    // Avoid duplicate names (case-insensitive)
    if (existing.some((c) => c.name.toLowerCase() === resolved.name.toLowerCase())) {
      setColorInput('');
      return;
    }

    setFormData({
      ...formData,
      colors: [...existing, resolved],
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
    // Suggest next preset size
    const nextPreset =
      COMMON_STORAGE_PRESETS.find((p) => !existing.some((v) => v.size === p)) ||
      `${existing.length + 1}TB`;

    const basePrice = Number(formData.price) || 0;

    setFormData({
      ...formData,
      storageVariants: [
        ...existing,
        {
          size: nextPreset,
          price: basePrice > 0 ? basePrice : 0,
          salePrice: 0,
          stock: Number(formData.totalStock) || 5,
        },
      ],
    });
  };

  const handleUpdateStorageVariant = (index, field, value) => {
    const updated = [...(formData.storageVariants || [])];
    updated[index] = {
      ...updated[index],
      [field]: field === 'size' ? value : Number(value) || 0,
    };
    setFormData({
      ...formData,
      storageVariants: updated,
    });
  };

  const handleRemoveStorageVariant = (indexToRemove) => {
    setFormData({
      ...formData,
      storageVariants: (formData.storageVariants || []).filter(
        (_, idx) => idx !== indexToRemove
      ),
    });
  };

  // ----------------------------------------------------
  // LAPTOP CONFIG VARIANTS (Laptops)
  // ----------------------------------------------------
  const handleAddLaptopVariant = () => {
    const existing = formData.laptopVariants || [];
    const basePrice = Number(formData.price) || 0;

    setFormData({
      ...formData,
      laptopVariants: [
        ...existing,
        {
          ram: '16GB',
          storage: '512GB SSD',
          price: basePrice > 0 ? basePrice : 0,
          salePrice: 0,
          stock: Number(formData.totalStock) || 3,
        },
      ],
    });
  };

  const handleUpdateLaptopVariant = (index, field, value) => {
    const updated = [...(formData.laptopVariants || [])];
    updated[index] = {
      ...updated[index],
      [field]: field === 'ram' || field === 'storage' ? value : Number(value) || 0,
    };
    setFormData({
      ...formData,
      laptopVariants: updated,
    });
  };

  const handleRemoveLaptopVariant = (indexToRemove) => {
    setFormData({
      ...formData,
      laptopVariants: (formData.laptopVariants || []).filter(
        (_, idx) => idx !== indexToRemove
      ),
    });
  };

  const isPhoneOrTablet =
    formData.category === 'smartphones' || formData.category === 'tablets';
  const isLaptop = formData.category === 'laptops';

  return (
    <div className="space-y-6 pt-4 border-t border-gray-200">
      {/* 1. DYNAMIC COLOR BUILDER */}
      <div className="space-y-3 bg-gray-50/70 p-4 rounded-xl border border-gray-200">
        <div>
          <Label className="text-sm font-bold text-gray-900 flex items-center justify-between">
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
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white text-gray-800 border border-gray-300 shadow-sm transition-all"
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
        <div className="flex items-center gap-2">
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
            className="h-9 text-sm bg-white"
          />
          <Button
            type="button"
            onClick={() => handleAddColor()}
            size="sm"
            className="h-9 bg-[#111344] hover:bg-[#0C1172] text-white shrink-0 font-semibold"
          >
            <Plus size={14} className="mr-1" /> Add Color
          </Button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[11px] font-semibold text-gray-500 flex items-center gap-1">
            <Sparkles size={11} className="text-amber-500" /> Quick Add:
          </span>
          {POPULAR_COLOR_SUGGESTIONS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handleAddColor(preset)}
              className="text-[11px] font-medium text-gray-600 bg-white hover:bg-gray-100 hover:text-gray-900 border border-gray-200 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
            >
              + {preset}
            </button>
          ))}
        </div>
      </div>

      {/* 2. DYNAMIC STORAGE VARIANTS (SMARTPHONES / TABLETS) */}
      {isPhoneOrTablet && (
        <div className="space-y-3 bg-gray-50/70 p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-bold text-gray-900">
                Storage Variants & Pricing
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Set individual price & stock for each storage size (e.g. 128GB, 256GB).
              </p>
            </div>
            <Button
              type="button"
              onClick={handleAddStorageVariant}
              size="sm"
              variant="outline"
              className="h-8 text-xs font-bold border-gray-300 hover:bg-white"
            >
              <Plus size={13} className="mr-1" /> Add Storage
            </Button>
          </div>

          {formData.storageVariants && formData.storageVariants.length > 0 ? (
            <div className="space-y-2.5">
              {formData.storageVariants.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-2 items-center bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm"
                >
                  <div className="col-span-3">
                    <Label className="text-[10px] font-bold text-gray-500 uppercase">
                      Storage
                    </Label>
                    <Input
                      type="text"
                      value={item.size}
                      onChange={(e) =>
                        handleUpdateStorageVariant(idx, 'size', e.target.value)
                      }
                      placeholder="e.g. 128GB"
                      className="h-8 text-xs font-semibold"
                    />
                  </div>
                  <div className="col-span-3">
                    <Label className="text-[10px] font-bold text-gray-500 uppercase">
                      Price (₦)
                    </Label>
                    <Input
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        handleUpdateStorageVariant(idx, 'price', e.target.value)
                      }
                      placeholder="₦ Price"
                      className="h-8 text-xs font-semibold"
                    />
                  </div>
                  <div className="col-span-3">
                    <Label className="text-[10px] font-bold text-gray-500 uppercase">
                      Sale Price (₦)
                    </Label>
                    <Input
                      type="number"
                      value={item.salePrice || ''}
                      onChange={(e) =>
                        handleUpdateStorageVariant(idx, 'salePrice', e.target.value)
                      }
                      placeholder="Optional"
                      className="h-8 text-xs font-semibold"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-[10px] font-bold text-gray-500 uppercase">
                      Stock
                    </Label>
                    <Input
                      type="number"
                      value={item.stock}
                      onChange={(e) =>
                        handleUpdateStorageVariant(idx, 'stock', e.target.value)
                      }
                      placeholder="Qty"
                      className="h-8 text-xs font-semibold"
                    />
                  </div>
                  <div className="col-span-1 flex items-end justify-center pb-0.5">
                    <button
                      type="button"
                      onClick={() => handleRemoveStorageVariant(idx)}
                      className="h-8 w-8 text-gray-400 hover:text-red-600 flex items-center justify-center rounded-md hover:bg-red-50 transition-colors"
                      title="Delete Variant"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 bg-white rounded-lg border border-dashed border-gray-300">
              <p className="text-xs text-muted-foreground">
                No storage variants added. Base price (₦{formData.price || 0}) will be used.
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

      {/* 3. DYNAMIC LAPTOP CONFIG VARIANTS (LAPTOPS) */}
      {isLaptop && (
        <div className="space-y-3 bg-gray-50/70 p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-bold text-gray-900">
                Laptop RAM & SSD Configurations
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Set individual price & stock for RAM & SSD combinations.
              </p>
            </div>
            <Button
              type="button"
              onClick={handleAddLaptopVariant}
              size="sm"
              variant="outline"
              className="h-8 text-xs font-bold border-gray-300 hover:bg-white"
            >
              <Plus size={13} className="mr-1" /> Add Config
            </Button>
          </div>

          {formData.laptopVariants && formData.laptopVariants.length > 0 ? (
            <div className="space-y-2.5">
              {formData.laptopVariants.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-2 items-center bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm"
                >
                  <div className="col-span-3">
                    <Label className="text-[10px] font-bold text-gray-500 uppercase">
                      RAM
                    </Label>
                    <Input
                      type="text"
                      value={item.ram}
                      onChange={(e) =>
                        handleUpdateLaptopVariant(idx, 'ram', e.target.value)
                      }
                      placeholder="e.g. 16GB"
                      className="h-8 text-xs font-semibold"
                    />
                  </div>
                  <div className="col-span-3">
                    <Label className="text-[10px] font-bold text-gray-500 uppercase">
                      SSD Storage
                    </Label>
                    <Input
                      type="text"
                      value={item.storage}
                      onChange={(e) =>
                        handleUpdateLaptopVariant(idx, 'storage', e.target.value)
                      }
                      placeholder="e.g. 512GB SSD"
                      className="h-8 text-xs font-semibold"
                    />
                  </div>
                  <div className="col-span-3">
                    <Label className="text-[10px] font-bold text-gray-500 uppercase">
                      Price (₦)
                    </Label>
                    <Input
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        handleUpdateLaptopVariant(idx, 'price', e.target.value)
                      }
                      placeholder="₦ Price"
                      className="h-8 text-xs font-semibold"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-[10px] font-bold text-gray-500 uppercase">
                      Stock
                    </Label>
                    <Input
                      type="number"
                      value={item.stock}
                      onChange={(e) =>
                        handleUpdateLaptopVariant(idx, 'stock', e.target.value)
                      }
                      placeholder="Qty"
                      className="h-8 text-xs font-semibold"
                    />
                  </div>
                  <div className="col-span-1 flex items-end justify-center pb-0.5">
                    <button
                      type="button"
                      onClick={() => handleRemoveLaptopVariant(idx)}
                      className="h-8 w-8 text-gray-400 hover:text-red-600 flex items-center justify-center rounded-md hover:bg-red-50 transition-colors"
                      title="Delete Config"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 bg-white rounded-lg border border-dashed border-gray-300">
              <p className="text-xs text-muted-foreground">
                No laptop configurations added. Base price (₦{formData.price || 0}) will be used.
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
