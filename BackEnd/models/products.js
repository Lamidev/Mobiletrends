

// const mongoose = require("mongoose");

// const ProductSchema = new mongoose.Schema(
//   {
//     image: String,
//     title: String,
//     description: String,
//     category: String,
//     brand: String,
//     price: Number,
//     salePrice: Number,
//     totalStock: Number,
//     averageReview: Number,
//     condition: {
//       type: String,
//       enum: ["Brand New", "Premium Used"], // Only accept these two values
//       default: "Brand New", // Default to Brand New
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Product", ProductSchema);


const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    image: String,
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