const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: String,
  isGuest: { type: Boolean, default: false },
  cartId: String,
  cartItems: [
    {
      productId: String,
      title: String,
      image: String,
      price: String,
      quantity: Number,
      selectedStorage: String,
      selectedRam: String,
      selectedColor: String,
      selectedCondition: String,
    },
  ],
  addressInfo: {
    addressId: String,
    fullName: String,
    email: String,
    address: String,
    city: String,
    lga: String,
    state: String,
    phone: String,
    country: { type: String, default: "Nigeria" },
    notes: String,
  },
  orderStatus: String,
  paymentMethod: String,
  paymentStatus: String,
  totalAmount: Number,
  deliveryPrice: Number,
  orderDate: Date,
  orderUpdateDate: Date,
  paymentId: String,
  payerId: String,
});

module.exports = mongoose.model("Order", OrderSchema);
