// const mongoose = require("mongoose");

// const OrderSchema = new mongoose.Schema({
//   userId: String,
//   cartId: String,
//   cartItems: [
//     {
//       productId: String,
//       title: String,
//       image: String,
//       price: String,
//       quantity: Number,
//     },
//   ],
//   addressInfo: {
//     addressId: String,
//     address: String,
//     city: String,
//     pincode: String,
//     phone: String,
//     notes: String,
//   },
//   orderStatus: String,
//   paymentMethod: String,
//   paymentStatus: String,
//   totalAmount: Number,
//   orderDate: Date,
//   orderUpdateDate: Date,
//   paymentId: String,
//   payerId: String,
// });

// module.exports = mongoose.model("Order", OrderSchema);


const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema({
  userId: String,
  cartId: String,
  cartItems: [
    {
      productId: String,
      title: String,
      image: String,
      price: String,
      quantity: Number,
    },
  ],
  addressInfo: {
    addressId: String,
    fullName: String, // Add fullName
    address: String,
    lga: String, // Add LGA (city equivalent)
    state: String, // Add state
    // pincode: String,
    phone: String,
    country: { type: String, default: "Nigeria" }, // Ensure country is included
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
