# Gadgetsgrid 🚀

Gadgetsgrid is a modern, high-performance E-commerce platform specialized in gadgets and tech electronics. Built with the MERN stack (MongoDB, Express, React, Node.js), it offers a seamless shopping experience with a focus on security, visual aesthetics, and user accessibility.

## ✨ Key Features

- **🛍️ Complete Shopping Flow:** Browse products, filter by category/brand/price, add to cart, and secure checkout.
- **🔐 Advanced Security:** 
  - JWT Authentication via secure HttpOnly cookies.
  - Protection against XSS, CSRF, and account enumeration.
  - Zero password hash leakage to the frontend.
- **💳 Payment Integration:** Fully integrated with **Paystack** and **Flutterwave** for secure Nigerian and international transactions.
- **📱 Responsive Design:** Optimized for all devices, featuring a side-drawer filter system and a clean, premium UI using **Shadcn UI** and **Tailwind CSS**.
- **🔍 Smart Search & Filtering:** Dynamic brand, category, and price range filtering with real-time UI updates.
- **📧 Automated Emails:** Transactional emails for account verification, welcome messages, and order receipts powered by **Mailtrap**.
- **📂 Image Management:** Cloud-hosted images via **Cloudinary** for fast loading and reliable delivery.
- **⚡ Performance First:** Global "Scroll to Top" navigation, manual filter application to save bandwidth, and optimized state management with **Redux Toolkit**.

## 🚀 Tech Stack

### Frontend
- **React 18** (Vite-powered)
- **Redux Toolkit** (State Management)
- **Tailwind CSS** (Styling)
- **Shadcn UI** (Component Library)
- **Framer Motion** (Animations)
- **Lucide Icons**

### Backend
- **Node.js & Express**
- **MongoDB & Mongoose** (Database)
- **Cloudinary** (Image Hosting)
- **Paystack & Flutterwave** (Payments)
- **Mailtrap** (SMTP/Email Service)
- **JWT & BcryptJS** (Security)

## 🛠️ Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account or local MongoDB
- Cloudinary, Mailtrap, and Paystack/Flutterwave API keys

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd verseGadget
   ```

2. **Backend Setup:**
   ```bash
   cd BackEnd
   npm install
   # Create a .env file based on your credentials
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ../FrontEnd
   npm install
   # Create a .env file (VITE_API_BASE_URL)
   npm run dev
   ```

### Environment Variables (.env)

**Backend:**
```env
MONGODB_URL=
JWT_SECRET=
NODE_ENV=
CLIENT_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
MAILTRAP_TOKEN=
MAILTRAP_ENDPOINT=
SENDER_EMAIL=
PAYSTACK_SECRET_KEY=
FLUTTER_PUBLIC_KEY=
FLUTTER_SECRET_KEY=
```

**Frontend:**
```env
VITE_API_BASE_URL=http://localhost:8050/api
```

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the ISC License.

---
*Built with ❤️ by [Lamidev](https://github.com/Lamidev)*
