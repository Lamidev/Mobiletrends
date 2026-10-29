import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/pages': path.resolve(__dirname, 'src/views'),
      '@/views': path.resolve(__dirname, 'src/views'),
      'react-router-dom': path.resolve(__dirname, 'src/lib/router-adapter.tsx'),
    };
    return config;
  },
};

export default nextConfig;
