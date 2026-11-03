import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url || 'https://mobiletrends.ng';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/auth/',
          '/unauth-page',
          '/shop/checkout',
          '/shop/account',
          '/shop/payment-success',
          '/shop/paystack-return',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
