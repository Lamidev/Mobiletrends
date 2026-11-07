const DeliverySettings = require("../../models/delivery-settings");

// Get active delivery settings (Public - for checkout, cart, and storefront)
const getDeliverySettings = async (req, res) => {
  try {
    let settings = await DeliverySettings.findOne();
    if (!settings) {
      settings = await DeliverySettings.create({
        localState: "Ondo",
        localCity: "Akure",
        localFee: 3000,
        nationwideFee: 7000,
        lagosFee: 3000,
        outsideLagosFee: 7000,
        freeDeliveryThreshold: 0,
        estimatedDaysLocal: "Same Day Delivery (Akure & Ondo)",
        estimatedDaysNationwide: "1-2 Business Days (Nationwide)",
        estimatedDaysLagos: "Same Day Delivery (Akure & Ondo)",
        estimatedDaysOutside: "1-2 Business Days (Nationwide)",
      });
    } else {
      // Ensure localFee and nationwideFee exist on legacy documents
      if (settings.localFee === undefined) {
        settings.localFee = settings.lagosFee ?? 3000;
      }
      if (settings.nationwideFee === undefined) {
        settings.nationwideFee = settings.outsideLagosFee ?? 7000;
      }
      if (!settings.estimatedDaysLocal) {
        settings.estimatedDaysLocal = settings.estimatedDaysLagos || "Same Day Delivery (Akure & Ondo)";
      }
      if (!settings.estimatedDaysNationwide) {
        settings.estimatedDaysNationwide = settings.estimatedDaysOutside || "1-2 Business Days (Nationwide)";
      }
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
        localState: "Ondo",
        localCity: "Akure",
        localFee: 3000,
        nationwideFee: 7000,
        lagosFee: 3000,
        outsideLagosFee: 7000,
        estimatedDaysLocal: "Same Day Delivery (Akure & Ondo)",
        estimatedDaysNationwide: "1-2 Business Days (Nationwide)",
      },
    });
  }
};

// Update delivery settings (Admin)
const updateDeliverySettings = async (req, res) => {
  try {
    const {
      localFee,
      nationwideFee,
      lagosFee,
      outsideLagosFee,
      freeDeliveryThreshold,
      estimatedDaysLocal,
      estimatedDaysNationwide,
      estimatedDaysLagos,
      estimatedDaysOutside,
      localState,
      localCity,
    } = req.body;

    let settings = await DeliverySettings.findOne();
    if (!settings) {
      settings = new DeliverySettings();
    }

    const resolvedLocalFee =
      localFee !== undefined ? Number(localFee) : lagosFee !== undefined ? Number(lagosFee) : undefined;
    const resolvedNationwideFee =
      nationwideFee !== undefined
        ? Number(nationwideFee)
        : outsideLagosFee !== undefined
        ? Number(outsideLagosFee)
        : undefined;

    if (resolvedLocalFee !== undefined) {
      settings.localFee = Math.max(0, resolvedLocalFee);
      settings.lagosFee = settings.localFee; // sync legacy alias
    }

    if (resolvedNationwideFee !== undefined) {
      settings.nationwideFee = Math.max(0, resolvedNationwideFee);
      settings.outsideLagosFee = settings.nationwideFee; // sync legacy alias
    }

    if (freeDeliveryThreshold !== undefined) {
      settings.freeDeliveryThreshold = Math.max(0, Number(freeDeliveryThreshold));
    }

    const resolvedLocalTime = estimatedDaysLocal || estimatedDaysLagos;
    if (resolvedLocalTime !== undefined) {
      settings.estimatedDaysLocal = String(resolvedLocalTime).trim();
      settings.estimatedDaysLagos = settings.estimatedDaysLocal;
    }

    const resolvedNationwideTime = estimatedDaysNationwide || estimatedDaysOutside;
    if (resolvedNationwideTime !== undefined) {
      settings.estimatedDaysNationwide = String(resolvedNationwideTime).trim();
      settings.estimatedDaysOutside = settings.estimatedDaysNationwide;
    }

    if (localState !== undefined) settings.localState = String(localState).trim();
    if (localCity !== undefined) settings.localCity = String(localCity).trim();

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
