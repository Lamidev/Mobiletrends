const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        selectedStorage: {
          type: String,
          default: "",
        },
        selectedRam: {
          type: String,
          default: "",
        },
        selectedColor: {
          type: String,
          default: "",
        },
        selectedCondition: {
          type: String,
          default: "",
        },
        price: {
          type: Number,
        },
      },
    ],
    isGuest: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cart", CartSchema);
