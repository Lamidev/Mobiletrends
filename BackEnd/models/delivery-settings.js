const mongoose = require("mongoose");

const DeliverySettingsSchema = new mongoose.Schema(
  {
    lagosFee: {
      type: Number,
      default: 10000,
      min: 0,
    },
    outsideLagosFee: {
      type: Number,
      default: 20000,
      min: 0,
    },
    freeDeliveryThreshold: {
      type: Number,
      default: 0, // 0 means disabled
      min: 0,
    },
    estimatedDaysLagos: {
      type: String,
      default: "Same Day Delivery",
    },
    estimatedDaysOutside: {
      type: String,
      default: "1-2 Business Days",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DeliverySettings", DeliverySettingsSchema);

