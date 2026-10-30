'use client';

import React from 'react';
import { useDispatch } from 'react-redux';
import { Dialog, DialogContent } from '../ui/dialog';
import { setProductDetails } from '@/store/shop/products-slice';
import ProductDetailView from './product-detail-view';

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const dispatch = useDispatch();

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
  }

  if (!productDetails) return null;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="font-body p-4 sm:p-6 lg:p-8 max-w-[95vw] md:max-w-[85vw] lg:max-w-[1060px] max-h-[92dvh] overflow-y-auto rounded-3xl border border-[#e5e7eb] shadow-2xl bg-white [scrollbar-width:thin]">
        <ProductDetailView
          product={productDetails}
          isDialog={true}
          onClose={handleDialogClose}
        />
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
