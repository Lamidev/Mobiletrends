import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Windows paths are case-insensitive, but webpack is not. Starting Next from
// "...\frontend" when the folder is really "...\FrontEnd" bundles two copies of
// Next's router internals, which breaks hydration with
// "Invariant: Missing ActionQueueContext". Fail fast with a clear message instead.
const cwd = process.cwd();
const realCwd = fs.realpathSync.native(cwd);
if (cwd !== realCwd) {
  throw new Error(
    `\n\nPath casing mismatch:\n  current dir: ${cwd}\n  actual dir:  ${realCwd}\n\n` +
      `Run: cd "${realCwd}"  then delete the .next folder and start again.\n`
  );
}

const rawApiUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://api.mobiletrends.ng/api'
    : 'http://localhost:8050/api');

const normalizedApiBaseUrl = rawApiUrl.replace(/\/+$/, '').endsWith('/api')
  ? rawApiUrl.replace(/\/+$/, '')
  : `${rawApiUrl.replace(/\/+$/, '')}/api`;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_API_BASE_URL: normalizedApiBaseUrl,
  },
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
      '@/views': path.resolve(__dirname, 'src/views'),
      'react-router-dom': path.resolve(__dirname, 'src/lib/router-adapter.tsx'),
    };
    return config;
  },
};

export default nextConfig;
