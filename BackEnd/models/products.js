const mongoose = require("mongoose");

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
      enum: ["Brand New", "Premium Used"],
      default: "Brand New",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
