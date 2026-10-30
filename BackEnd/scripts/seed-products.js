require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/products");

const PRODUCTS = [
  {
    image: "/products/iphone-18-pro.png",
    title: "iPhone 18 Pro",
    description: "Next-generation flagship smartphone with aerospace-grade titanium frame, A-series Bionic processor, and pro triple-lens camera system with 5x optical zoom.",
    category: "smartphones",
    brand: "apple",
    price: 1950000,
    salePrice: 1850000,
    totalStock: 12,
    averageReview: 5,
    condition: "Brand New",
  },
  {
    image: "/products/macbook-pro.png",
    title: "MacBook Pro M4",
    description: "Built for pro creators, developers, and power users. Features Apple M4 silicon, Liquid Retina XDR display, up to 22 hours of battery life, and pro studio mics.",
    category: "laptops",
    brand: "apple",
    price: 2650000,
    salePrice: 2480000,
    totalStock: 8,
    averageReview: 5,
    condition: "Brand New",
  },
  {
    image: "/products/ps5-pro.jpg",
    title: "PlayStation 5 Pro",
    description: "Next-level gaming console with advanced ray tracing, PlayStation Spectral Super Resolution (PSSR), 2TB ultra-fast SSD, and ultra-smooth 4K 120Hz performance.",
    category: "gaming",
    brand: "sony",
    price: 1250000,
    salePrice: 1180000,
    totalStock: 15,
    averageReview: 5,
    condition: "Brand New",
  },
  {
    image: "/products/galaxy-s26-ultra.jpg",
    title: "Samsung Galaxy S26 Ultra",
    description: "Samsung's ultimate flagship with embedded S-Pen, 200MP quad-lens camera with 100x Space Zoom, Snapdragon 8 Elite processor, and Dynamic AMOLED 2X display.",
    category: "smartphones",
    brand: "samsung",
    price: 1890000,
    salePrice: 1760000,
    totalStock: 10,
    averageReview: 5,
    condition: "Brand New",
  },
  {
    image: "/products/iphone-duo.jpg",
    title: "iPhone Duo Foldable",
    description: "Apple's breakthrough foldable smartphone engineered with a creaseless dual OLED display, tactile magnetic hinge, and pro-level titanium durability.",
    category: "smartphones",
    brand: "apple",
    price: 2850000,
    salePrice: 0,
    totalStock: 6,
    averageReview: 5,
    condition: "Brand New",
  },
  {
    image: "/products/galaxy-z-fold8.jpg",
    title: "Samsung Galaxy Z Fold8",
    description: "Redefining multi-tasking on mobile. Dual screen immersive productivity, Armor Aluminum frame, IPX8 water resistance, and desktop-class performance.",
    category: "smartphones",
    brand: "samsung",
    price: 2450000,
    salePrice: 2290000,
    totalStock: 7,
    averageReview: 5,
    condition: "Brand New",
  },
  {
    image: "/products/sony-wh1000xm6.png",
    title: "Sony WH-1000XM6 Wireless Noise-Cancelling",
    description: "Industry-leading active noise cancelling headphones with dual processors, custom 30mm carbon drivers, 40-hour battery life, and crystal-clear hands-free calls.",
    category: "accessories",
    brand: "sony",
    price: 620000,
    salePrice: 580000,
    totalStock: 14,
    averageReview: 5,
    condition: "Brand New",
  },
  {
    image: "/products/rog-zephyrus-g16.png",
    title: "ASUS ROG Zephyrus G16",
    description: "Extreme portable gaming powerhouse. Equipped with Intel Core Ultra 9, NVIDIA GeForce RTX 4080 GPU, OLED ROG Nebula display, and whisper-quiet liquid metal cooling.",
    category: "laptops",
    brand: "asus",
    price: 2950000,
    salePrice: 2790000,
    totalStock: 5,
    averageReview: 5,
    condition: "Brand New",
  },
  {
    image: "/products/studio-display.jpg",
    title: "Apple Studio Display 27-inch 5K",
    description: "Expansive 27-inch 5K Retina display with 600 nits brightness, 12MP Ultra Wide camera with Center Stage, and high-fidelity six-speaker sound system with Spatial Audio.",
    category: "accessories",
    brand: "apple",
    price: 2350000,
    salePrice: 0,
    totalStock: 4,
    averageReview: 5,
    condition: "Brand New",
  },
  {
    image: "/products/t9-product.png",
    title: "Samsung Portable SSD T9 2TB",
    description: "Blazing fast rugged portable storage with USB 3.2 Gen 2x2 interface, reaching transfer speeds up to 2,000 MB/s. Shock-resistant and drop-tested up to 3 meters.",
    category: "accessories",
    brand: "samsung",
    price: 340000,
    salePrice: 310000,
    totalStock: 25,
    averageReview: 5,
    condition: "Brand New",
  },
  {
    image: "/products/airpods-5.jpg",
    title: "AirPods 5 with Active Noise Cancellation",
    description: "Iconic design reimagined with adaptive audio, personalized spatial audio with dynamic head tracking, voice isolation, and Qi/MagSafe charging case with speaker.",
    category: "accessories",
    brand: "apple",
    price: 385000,
    salePrice: 350000,
    totalStock: 18,
    averageReview: 5,
    condition: "Brand New",
  },
  {
    image: "/products/switch-2.png",
    title: "Nintendo Switch 2 OLED",
    description: "The next evolution of hybrid gaming with enhanced 1080p OLED handheld display, 4K DLSS docked performance, magnetic Joy-Cons, and backwards compatibility.",
    category: "gaming",
    brand: "nintendo",
    price: 780000,
    salePrice: 720000,
    totalStock: 9,
    averageReview: 5,
    condition: "Brand New",
  },
];

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URL;
    if (!mongoUri) {
      throw new Error("MONGODB_URL not found in .env");
    }

    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB.");

    const existingCount = await Product.countDocuments();
    console.log(`Current products in DB: ${existingCount}`);

    let added = 0;
    for (const prod of PRODUCTS) {
      const exists = await Product.findOne({ title: prod.title });
      if (!exists) {
        await Product.create(prod);
        added++;
        console.log(`+ Created product: ${prod.title} (₦${prod.price.toLocaleString("en-NG")})`);
      } else {
        console.log(`= Already exists: ${prod.title}`);
      }
    }

    const totalCount = await Product.countDocuments();
    console.log(`\nSeed completed! Added ${added} new products. Total in database: ${totalCount}`);
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();

