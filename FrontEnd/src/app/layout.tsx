import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ReduxProvider } from '@/providers/redux-provider';
import { siteConfig } from '@/config/site';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url || 'http://localhost:3000'),
  title: {
    default: `${siteConfig.name} | Phones, Laptops & Gadgets`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/logo.jpg',
    apple: '/logo.jpg',
  },
  openGraph: {
    title: siteConfig.name,
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
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
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
      </head>
      <body className="font-body antialiased bg-[#fafaf8] text-[#20231e] min-h-screen">
        <ReduxProvider>
          {children}
          <Toaster />
        </ReduxProvider>
      </body>
    </html>
  );
}
