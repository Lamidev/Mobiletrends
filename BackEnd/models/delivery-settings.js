const mongoose = require("mongoose");

const DeliverySettingsSchema = new mongoose.Schema(
  {
    // Mobiletrends Headquarter base: Akure, Ondo State
    localState: {
      type: String,
      default: "Ondo",
    },
    localCity: {
      type: String,
      default: "Akure",
    },
    localFee: {
      type: Number,
      default: 3000,
      min: 0,
    },
    nationwideFee: {
      type: Number,
      default: 7000,
      min: 0,
    },
    // Backward compatibility aliases
    lagosFee: {
      type: Number,
      default: 3000,
      min: 0,
    },
    outsideLagosFee: {
      type: Number,
      default: 7000,
      min: 0,
    },
    freeDeliveryThreshold: {
      type: Number,
      default: 0, // 0 = disabled
      min: 0,
    },
    estimatedDaysLocal: {
      type: String,
      default: "Same Day Delivery (Akure & Ondo)",
    },
    estimatedDaysNationwide: {
      type: String,
      default: "1-2 Business Days (Nationwide)",
    },
    estimatedDaysLagos: {
      type: String,
      default: "Same Day Delivery (Akure & Ondo)",
    },
    estimatedDaysOutside: {
      type: String,
      default: "1-2 Business Days (Nationwide)",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DeliverySettings", DeliverySettingsSchema);
