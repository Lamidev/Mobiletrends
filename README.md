# Mobiletrends Systems Limited — E-Commerce Platform

Enterprise-grade e-commerce web platform for **Mobiletrends Systems Limited** (`https://mobiletrends.ng`), built with **Next.js 14 App Router**, **Node.js / Express**, **MongoDB Atlas**, **Paystack**, and **Resend**.

---

## 📁 Repository & Directory Architecture

The repository is structured as a clean full-stack monorepo:

```text
Mobiletrends/
├── BackEnd/                      # Node.js + Express REST API Server
│   ├── controllers/              # Request handlers & core business logic
│   │   ├── admin/                # Admin operations (orders, products, users)
│   │   ├── auth/                 # Authentication & authorization logic
│   │   ├── common/               # Shared features (banners, newsletter)
│   │   └── shop/                 # Customer shop logic (cart, orders, address)
│   ├── helpers/                  # Third-party integrations (Cloudinary, Paystack)
│   ├── models/                   # Mongoose DB Schemas (Products, Orders, Users, Cart)
│   ├── resend/                   # Transactional email service & HTML templates
│   ├── routes/                   # Express API Route definitions
│   │   ├── admin/                # Admin-protected endpoints (RBAC-enforced)
│   │   ├── auth/                 # Authentication endpoints (login, register, reset)
│   │   ├── common/               # Feature banners and newsletter endpoints
│   │   └── shop/                 # Storefront endpoints (catalog, cart, checkout)
│   ├── scripts/                  # Administrative CLI scripts & database seeders
│   │   ├── check-paystack-config.js  # Validates Paystack live/test keys
│   │   ├── check-users.js            # Customer audit and diagnostic tool
│   │   ├── create-admin.js           # Admin account generator & promoter
│   │   └── seed-products.js          # Initial catalog seed script
│   ├── utils/                    # Utility functions (token generation, cookies)
│   ├── .env.example              # Template for backend environment variables
│   ├── index.js                  # Express application entrypoint
│   └── package.json              # Backend dependencies and CLI scripts
│
├── FrontEnd/                     # Next.js 14 App Router Web Client
│   ├── public/                   # Static assets, manifests & favicons
│   │   ├── products/             # Local product fallback images
│   │   ├── reviews/              # Customer review avatars
│   │   ├── site.webmanifest      # PWA Web App Manifest
│   │   └── web-app-manifest-*.png# PWA icons
│   ├── src/
│   │   ├── app/                  # Next.js 14 App Router routes & layouts
│   │   │   ├── admin/            # Admin dashboard and catalog management
│   │   │   ├── auth/             # Login, register, email verification, password reset
│   │   │   ├── shop/             # Storefront routes (catalog, products, checkout)
│   │   │   ├── layout.tsx        # Root layout, JSON-LD schemas, font loading
│   │   │   ├── robots.ts         # Dynamic crawler directives (robots.txt)
│   │   │   └── sitemap.ts        # Dynamic XML sitemap generator (MongoDB-backed)
│   │   ├── assets/               # Brand imagery and static visual media
│   │   ├── components/           # Reusable UI component modules
│   │   │   ├── admin-view/       # Admin sidebar, headers, product variant managers
│   │   │   ├── auth/             # Auth layout and credential wrappers
│   │   │   ├── common/           # Shared UI (forms, preloader, ratings, guards)
│   │   │   ├── shopping-view/    # Customer storefront components (cart, filters)
│   │   │   └── ui/               # Radix UI + Tailwind design system primitives
│   │   ├── config/               # Navigation, metadata, and static configurations
│   │   ├── lib/                  # Utilities, color resolver, safe storage, router adapter
│   │   ├── providers/            # Redux & context state providers
│   │   ├── services/             # Client-side external API services (delivery fees)
│   │   ├── store/                # Redux Toolkit state slices & async thunks
│   │   └── views/                # View-layer page components mapped to routes
│   ├── .env.example              # Template for frontend environment variables
│   ├── next.config.mjs           # Next.js build and image optimization settings
│   ├── tailwind.config.js        # Tailwind CSS theme, animations & custom tokens
│   └── tsconfig.json             # TypeScript configuration & path aliases
│
├── .gitignore                    # Root git ignore rules (builds, logs, secrets)
└── README.md                     # Monorepo architecture & operations guide
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js:** v18.x or v20.x+
- **MongoDB Atlas** cluster or local MongoDB instance
- **npm** or **pnpm**

---

### 2. Backend Setup (`BackEnd/`)

1. Change directory to `BackEnd`:
   ```bash
   cd BackEnd
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` and fill in your `MONGODB_URL`, `JWT_SECRET`, `PAYSTACK_SECRET_KEY`, `RESEND_API_KEY`, and `CLOUDINARY_*` keys.*

4. Useful CLI Commands:
   ```bash
   # Start in development mode (with nodemon auto-restart)
   npm run dev

   # Start in production mode
   npm start

   # Check Paystack live key configuration
   npm run check-paystack

   # Check registered users and roles
   npm run check-users

   # Create or promote an admin account
   npm run create-admin <email> <password> <name>

   # Seed catalog products
   npm run seed-products
   ```

---

### 3. Frontend Setup (`FrontEnd/`)

1. Change directory to `FrontEnd`:
   ```bash
   cd FrontEnd
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```
   *Ensure `NEXT_PUBLIC_API_BASE_URL` points to your backend (`http://localhost:8050/api` in development).*

4. Run the development server:
   ```bash
   npm run dev
   ```
   The site will be available at [http://localhost:3000](http://localhost:3000).

5. Build for production:
   ```bash
   npm run build
   npm start
   ```

---

## 🔒 Security Architecture

- **Role-Based Access Control (RBAC):** All administrative endpoints (`/api/admin/*`) are strictly guarded with `adminAuthMiddleware`. Non-admin or unauthenticated access returns `403 Forbidden`.
- **Price Tampering Protection:** Client-submitted cart prices and subtotals are disregarded during checkout. The backend calculates the authoritative total directly from database records and enforces that the Paystack captured payment matches the required total down to the kobo.
- **Insecure Direct Object Reference (IDOR) Guards:** Customer addresses and order histories are protected via user ownership checks (`req.userId === targetUserId || req.userRole === 'admin'`).
- **Sanitized Secrets:** No third-party API keys or credentials are hardcoded. All credentials must be supplied via runtime environment variables.
- **Strict CORS:** Express CORS middleware verifies origins and enforces strict origin checks in production.

---

## 📈 SEO & Search Console Setup

- **Dynamic Sitemap:** `https://mobiletrends.ng/sitemap.xml` dynamically queries MongoDB Atlas to index all active catalog products and high-priority storefront categories.
- **Search Engine Directives:** `https://mobiletrends.ng/robots.txt` disallows sensitive administrative, authentication, and checkout routes to optimize search crawl budget.
- **Structured Data (Schema.org):**
  - **Root Layout:** `Organization` & `WebSite` JSON-LD with official business addresses, phone numbers, and search action links.
  - **Product Pages:** `Product` & `Offer` JSON-LD schemas with pricing in NGN, availability, brand details, and canonical URLs.

