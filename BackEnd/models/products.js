const mongoose = require("mongoose");

const ColorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    hex: { type: String, default: "#111344" },
  },
  { _id: false }
);

const StorageVariantSchema = new mongoose.Schema(
  {
    size: { type: String, required: true },
    price: { type: Number, required: true },
    salePrice: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
  },
  { _id: false }
);

const LaptopVariantSchema = new mongoose.Schema(
  {
    ram: { type: String, required: true },
    storage: { type: String, required: true },
    price: { type: Number, required: true },
    salePrice: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    image: String,
    images: {
      type: [String],
      default: [],
    },
    title: String,
    description: String,
    category: String,
    brand: String,
    price: Number,
    salePrice: Number,
    totalStock: Number,
    averageReview: Number,
    condition: {
      type: String,
      enum: ["Brand New", "UK-Used", "Premium Used"],
      default: "Brand New",
    },
    colors: {
      type: [ColorSchema],
      default: [],
    },
    storageVariants: {
      type: [StorageVariantSchema],
      default: [],
    },
    laptopVariants: {
      type: [LaptopVariantSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
