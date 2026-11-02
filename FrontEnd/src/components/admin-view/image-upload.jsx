'use client';

import React, { useRef, useState } from 'react';
import { UploadCloudIcon, XIcon, Plus, Loader2, Image as ImageIcon } from 'lucide-react';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import axios from 'axios';
import { useToast } from '../ui/use-toast';

export default function ProductImageUpload({
  uploadedImages = [],
  setUploadedImages,
  uploadedImageUrl = '',
  setUploadedImageUrl,
  imageLoadingState = false,
  setImageLoadingState,
  isEditMode = false,
  isCustomStyling = false,
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  // Normalize image list
  const images = Array.isArray(uploadedImages) && uploadedImages.length > 0
    ? uploadedImages
    : (uploadedImageUrl ? [uploadedImageUrl] : []);

  async function handleFileSelected(event) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    if (images.length + files.length > 3) {
      toast({
        title: 'Maximum 3 images',
        description: 'You can upload a maximum of 3 images per product.',
        variant: 'destructive',
      });
    }

    const availableSlots = 3 - images.length;
    const filesToUpload = files.slice(0, availableSlots);

    if (filesToUpload.length === 0) return;

    setUploading(true);
    if (setImageLoadingState) setImageLoadingState(true);

    const apiBase =
      process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8050/api';

    const newUrls = [...images];

    try {
      for (const file of filesToUpload) {
        const formData = new FormData();
        formData.append('my_file', file);
        const res = await axios.post(
          `${apiBase}/admin/products/upload-image`,
          formData
        );
        if (res.data?.success && res.data?.result?.url) {
          newUrls.push(res.data.result.url);
        }
      }

      if (setUploadedImages) {
        setUploadedImages(newUrls);
      }
      if (setUploadedImageUrl && newUrls[0]) {
        setUploadedImageUrl(newUrls[0]);
      }

      toast({
        title: 'Upload successful',
        description: `${filesToUpload.length} image(s) uploaded.`,
      });
    } catch (err) {
      console.error('Upload failed:', err);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload image(s). Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      if (setImageLoadingState) setImageLoadingState(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function handleRemoveSlot(index) {
    const updated = images.filter((_, idx) => idx !== index);
    if (setUploadedImages) {
      setUploadedImages(updated);
    }
    if (setUploadedImageUrl) {
      setUploadedImageUrl(updated[0] || '');
    }
  }

  return (
    <div className={`w-full mt-4 ${isCustomStyling ? '' : 'max-w-md mx-auto'}`}>
      <div className="flex items-center justify-between mb-2">
        <Label className="text-sm font-bold text-[#111344] uppercase tracking-wide">
          Product Images (Max 3)
        </Label>
        <span className="text-xs font-semibold text-gray-500">
          {images.length}/3 Uploaded
        </span>
      </div>

      {/* 3-Slot Grid Preview */}
      <div className="grid grid-cols-3 gap-2.5 mb-3">
        {[0, 1, 2].map((slotIndex) => {
          const imgUrl = images[slotIndex];
          return (
            <div
              key={slotIndex}
              className={`relative aspect-square rounded-xl border flex flex-col items-center justify-center overflow-hidden transition-all ${
                imgUrl
                  ? 'border-gray-200 bg-gray-50'
                  : 'border-dashed border-gray-300 bg-gray-50/50'
              }`}
            >
              {imgUrl ? (
                <>
                  <img
                    src={imgUrl}
                    alt={`Product slot ${slotIndex + 1}`}
                    className="w-full h-full object-contain p-2"
                  />
                  <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    {slotIndex === 0 ? 'Primary' : `Image ${slotIndex + 1}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSlot(slotIndex)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-[4px] bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-md transition-transform hover:scale-110"
                    title="Remove image"
                  >
                    <XIcon size={12} />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400 p-2 text-center">
                  <ImageIcon size={20} className="mb-1 opacity-40" />
                  <span className="text-[10px] font-semibold">Slot {slotIndex + 1}</span>
                  {slotIndex === 0 && (
                    <span className="text-[8px] text-gray-400">Main</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Upload Button / Dropzone if slots remaining */}
      {images.length < 3 && (
        <div>
          <Input
            id="multi-image-upload"
            type="file"
            className="hidden"
            ref={inputRef}
            onChange={handleFileSelected}
            accept="image/*"
            multiple
            disabled={uploading}
          />
          <label
            htmlFor="multi-image-upload"
            className={`border-2 border-dashed border-gray-300 hover:border-[#111344] rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${
              uploading ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:bg-[#111344]/[0.02]'
            }`}
          >
            {uploading ? (
              <div className="flex items-center gap-2 text-sm text-[#DF5E00] font-semibold">
                <Loader2 size={18} className="animate-spin" />
                <span>Uploading to Cloudinary...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center">
                <UploadCloudIcon className="w-8 h-8 text-[#DF5E00] mb-1.5" />
                <span className="text-xs font-bold text-[#111344]">
                  Upload Image ({images.length === 0 ? 'Slot 1' : `Slot ${images.length + 1} of 3`})
                </span>
                <span className="text-[10px] text-gray-500 mt-0.5">
                  Click or drag files here (PNG, JPG, WebP)
                </span>
              </div>
            )}
          </label>
        </div>
      )}
    </div>
  );
}
