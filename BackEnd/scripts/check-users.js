require("dotenv").config({ path: __dirname + "/../.env" });
const mongoose = require("mongoose");
const User = require("../models/users");
const Order = require("../models/order");

async function check() {
  const mongoUri = process.env.MONGODB_URL || process.env.MONGO_URI;
  await mongoose.connect(mongoUri);

  const all = await User.find({}, "userName email role isVerified createdAt");
  const usersTaggedUser = all.filter((u) => u.role === "user");
  const usersTaggedAdmin = all.filter((u) => u.role === "admin");

  console.log("=== USER BREAKDOWN ===");
  console.log("Total users in database:", all.length);
  console.log("Users tagged as 'user':", usersTaggedUser.length);
  console.log("Users tagged as 'admin':", usersTaggedAdmin.length);

  all.forEach((u, idx) => {
    console.log(
      (idx + 1) + ". [" + u.role + "] ID: " + u._id + " (CUST-" + String(u._id).slice(-6).toUpperCase() + ") | Name: " + u.userName + " | Email: " + u.email + " | Verified: " + u.isVerified
    );
  });

  const orders = await Order.find({});
  console.log("\n=== ORDERS BREAKDOWN ===");
  console.log("Total orders in database:", orders.length);
  orders.forEach((o, idx) => {
    console.log(
      (idx + 1) + ". ID: " + o._id + " | UserID: " + o.userId + " | Name: " + o?.addressInfo?.fullName + " | Email: " + (o?.addressInfo?.email || o.payerId) + " | Status: " + o.orderStatus
    );
  });

  await mongoose.disconnect();
}

check().catch(console.error);
