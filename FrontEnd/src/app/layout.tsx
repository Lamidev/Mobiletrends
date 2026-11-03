import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ReduxProvider } from '@/providers/redux-provider';
import { siteConfig } from '@/config/site';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url || 'https://mobiletrends.ng'),
  title: {
    default: `${siteConfig.name} | Phones, Laptops & Gadgets in Nigeria`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: 'Mobiletrends Systems Limited' }],
  generator: 'Next.js',
  keywords: [
    'smartphones Nigeria',
    'buy iPhone Lagos Akure',
    'Samsung phones Nigeria',
    'laptops Nigeria',
    'MacBook price Nigeria',
    'gadgets store Akure',
    'original phones Nigeria',
    'Mobiletrends',
  ],
  referrer: 'origin-when-cross-origin',
  creator: 'Mobiletrends Systems Limited',
  publisher: 'Mobiletrends Systems Limited',
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon0.svg', type: 'image/svg+xml' },
      { url: '/icon1.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  verification: {
    google: 'xtnurZvbcqBfSIERHuL6GWxZ-ZZGFlR6CunG8PIpIsk',
  },
  openGraph: {
    title: `${siteConfig.name} | Phones, Laptops & Gadgets in Nigeria`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: '/logo.jpg',
        width: 800,
        height: 600,
        alt: siteConfig.name,
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} | Phones, Laptops & Gadgets in Nigeria`,
    description: siteConfig.description,
    images: ['/logo.jpg'],
    creator: '@mobiletrends_ng',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'OnlineStore',
      '@id': `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/logo.jpg`,
      description: siteConfig.description,
      telephone: '+2348034378180',
      email: siteConfig.contact.email,
      priceRange: '₦₦₦',
      address: {
        '@type': 'PostalAddress',
        streetAddress: siteConfig.contact.offices[0]?.address,
        addressLocality: siteConfig.contact.offices[0]?.city,
        addressRegion: siteConfig.contact.offices[0]?.state,
        addressCountry: 'NG',
      },
      sameAs: [
        siteConfig.socials.facebook,
        siteConfig.socials.instagram,
        siteConfig.socials.twitter,
        siteConfig.socials.whatsapp,
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      publisher: {
        '@id': `${siteConfig.url}/#organization`,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteConfig.url}/shop/search?keyword={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="xtnurZvbcqBfSIERHuL6GWxZ-ZZGFlR6CunG8PIpIsk"
        />
        <meta name="apple-mobile-web-app-title" content="Mobiletrends" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=DM+Sans:ital,opsz,wght@0,9..40,400..800;1,9..40,400..800&family=Manrope:wght@400;500;600;700;800&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="font-body antialiased bg-[#fafaf8] text-[#20231e] min-h-screen">
        <ReduxProvider>
          {children}
          <Toaster richColors position="top-right" />
        </ReduxProvider>
      </body>
    </html>
  );
}
