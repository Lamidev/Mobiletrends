import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url || 'https://mobiletrends.ng';
  const apiBase =
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'http://localhost:8050/api';

  // Core static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop/home`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/shop/listing`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/shop/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/shop/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // Official store categories matching catalog
  const categories = [
    'smartphones',
    'laptops',
    'gaming',
    'drones',
    'tablets',
    'smartwatches',
    'audio',
    'monitors',
    'accessories',
  ];
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/shop/listing?category=${cat}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  // Fetch dynamic products from backend API
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${apiBase}/shop/products/get`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(3500),
    });
    if (res.ok) {
      const data = await res.json();
      const products = data?.data || [];
      productRoutes = products.map((prod: any) => ({
        url: `${baseUrl}/shop/product/${prod._id}`,
        lastModified: prod.updatedAt ? new Date(prod.updatedAt) : new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error('Error generating product sitemap entries:', error);
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}

