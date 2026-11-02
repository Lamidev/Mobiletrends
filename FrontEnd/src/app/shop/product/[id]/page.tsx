import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import ProductPageView from '@/views/shopping-view/product-page';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params?.id;
  if (!id) return { title: 'Mobiletrends Systems Limited' };

  try {
    const apiBase =
      process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8050/api';
    const res = await fetch(`${apiBase}/shop/products/get/${id}`, {
      next: { revalidate: 60 },
    });
    const data = await res.json();
    const product = data?.data;

    if (!product) {
      return { title: 'Product Details | Mobiletrends' };
    }

    const price = product.salePrice > 0 ? product.salePrice : product.price;
    const formattedPrice = `₦${Number(price).toLocaleString('en-NG')}`;
    const title = `${product.title} - ${formattedPrice} | Mobiletrends`;
    const description = product.description
      ? `${product.description.slice(0, 150)}... Buy ${product.title} (${product.condition || 'Brand New'}) at ${formattedPrice} with verified warranty from Mobiletrends.`
      : `Buy ${product.title} (${product.condition || 'Brand New'}) at ${formattedPrice} with verified warranty from Mobiletrends Systems Limited.`;

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || 'https://mobiletrends.com.ng';
    const imageUrl = product.image?.startsWith('http')
      ? product.image
      : `${siteUrl}${product.image}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [
          {
            url: imageUrl,
            width: 800,
            height: 800,
            alt: product.title,
          },
        ],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch (error) {
    return {
      title: 'Product Details | Mobiletrends',
    };
  }
}

export default function ShopProductDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center font-manrope text-sm font-semibold text-[#62665d]">
          Loading product...
        </div>
      }
    >
      <ProductPageView />
    </Suspense>
  );
}
