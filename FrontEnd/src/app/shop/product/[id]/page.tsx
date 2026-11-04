import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import ProductPageView from '@/views/shopping-view/product-page';

type Props = {
  params: { id: string };
};

async function getProduct(id: string) {
  try {
    const apiBase =
      process.env.INTERNAL_API_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      'http://localhost:8050/api';
    const res = await fetch(`${apiBase}/shop/products/get/${id}`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(3500),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data || null;
  } catch (err) {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params?.id;
  if (!id) return { title: 'Mobiletrends Systems Limited' };

  try {
    const product = await getProduct(id);
    if (!product) {
      return { title: 'Product Details | Mobiletrends' };
    }

    const price = product.salePrice > 0 ? product.salePrice : product.price;
    const formattedPrice = `₦${Number(price).toLocaleString('en-NG')}`;
    const title = `${product.title} - ${formattedPrice} | Mobiletrends`;
    const description = product.description
      ? `${product.description.slice(0, 150)}... Buy ${product.title} (${product.condition || 'Brand New'}) at ${formattedPrice} with verified warranty from Mobiletrends.`
      : `Buy ${product.title} (${product.condition || 'Brand New'}) at ${formattedPrice} with verified warranty from Mobiletrends Systems Limited.`;

    const siteUrl = 'https://mobiletrends.ng';
    const imageUrl = product.image?.startsWith('http')
      ? product.image
      : `${siteUrl}${product.image || '/logo.jpg'}`;

    return {
      title,
      description,
      alternates: {
        canonical: `/shop/product/${id}`,
      },
      openGraph: {
        title,
        description,
        url: `${siteUrl}/shop/product/${id}`,
        siteName: 'Mobiletrends Systems Limited',
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

export default async function ShopProductDetailPage({ params }: Props) {
  const product = await getProduct(params?.id);
  const siteUrl = 'https://mobiletrends.ng';
  const price = product?.salePrice > 0 ? product.salePrice : product?.price || 0;
  const inStock = Number(product?.totalStock) > 0;
  const imageUrl = product?.image?.startsWith('http')
    ? product.image
    : `${siteUrl}${product?.image || '/logo.jpg'}`;

  // Rich Schema.org/Product structured data for Google Search Console
  const productJsonLd = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        image: [imageUrl],
        description:
          product.description ||
          `${product.title} available at Mobiletrends Systems Limited.`,
        sku: String(product._id || params.id),
        brand: {
          '@type': 'Brand',
          name: product.brand || 'Mobiletrends',
        },
        offers: {
          '@type': 'Offer',
          url: `${siteUrl}/shop/product/${params.id}`,
          priceCurrency: 'NGN',
          price: price,
          priceValidUntil: '2027-12-31',
          itemCondition: String(product.condition).toLowerCase().includes('brand')
            ? 'https://schema.org/NewCondition'
            : 'https://schema.org/UsedCondition',
          availability: inStock
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          seller: {
            '@type': 'Organization',
            name: 'Mobiletrends Systems Limited',
          },
        },
      }
    : null;

  return (
    <>
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
      <Suspense
        fallback={
          <div className="min-h-[70vh] flex items-center justify-center font-manrope text-sm font-semibold text-[#62665d]">
            Loading product...
          </div>
        }
      >
        <ProductPageView />
      </Suspense>
    </>
  );
}
