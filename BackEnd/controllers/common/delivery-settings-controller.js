const DeliverySettings = require("../../models/delivery-settings");

// Get active delivery settings (Public - for checkout, cart, and storefront)
const getDeliverySettings = async (req, res) => {
  try {
    let settings = await DeliverySettings.findOne();
    if (!settings) {
      settings = await DeliverySettings.create({
        lagosFee: 10000,
        outsideLagosFee: 20000,
        freeDeliveryThreshold: 0,
        estimatedDaysLagos: "Same Day Delivery",
        estimatedDaysOutside: "1-2 Business Days",
      });
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Error fetching delivery settings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch delivery settings",
      data: {
        lagosFee: 10000,
        outsideLagosFee: 20000,
        estimatedDaysLagos: "Same Day Delivery",
        estimatedDaysOutside: "1-2 Business Days",
      },
    });
  }
};

// Update delivery settings (Admin)
const updateDeliverySettings = async (req, res) => {
  try {
    const {
      lagosFee,
      outsideLagosFee,
      freeDeliveryThreshold,
      estimatedDaysLagos,
      estimatedDaysOutside,
    } = req.body;

    let settings = await DeliverySettings.findOne();
    if (!settings) {
      settings = new DeliverySettings();
    }

    if (lagosFee !== undefined) settings.lagosFee = Math.max(0, Number(lagosFee));
    if (outsideLagosFee !== undefined)
      settings.outsideLagosFee = Math.max(0, Number(outsideLagosFee));
    if (freeDeliveryThreshold !== undefined)
      settings.freeDeliveryThreshold = Math.max(0, Number(freeDeliveryThreshold));
    if (estimatedDaysLagos !== undefined)
      settings.estimatedDaysLagos = String(estimatedDaysLagos).trim();
    if (estimatedDaysOutside !== undefined)
      settings.estimatedDaysOutside = String(estimatedDaysOutside).trim();

    await settings.save();

    res.status(200).json({
      success: true,
      message: "Delivery settings updated successfully",
      data: settings,
    });
  } catch (error) {
    console.error("Error updating delivery settings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update delivery settings",
    });
  }
};

module.exports = {
  getDeliverySettings,
  updateDeliverySettings,
};

