// deliveryService.js
import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8050/api";

let cachedSettings = {
  localState: "Ondo",
  localCity: "Akure",
  localFee: 3000,
  nationwideFee: 7000,
  freeDeliveryThreshold: 0,
  estimatedDaysLocal: "Same Day Delivery (Akure & Ondo)",
  estimatedDaysNationwide: "1-2 Business Days (Nationwide)",
};

export const fetchDeliverySettings = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/common/delivery-settings`);
    if (response?.data?.success && response.data.data) {
      const data = response.data.data;
      cachedSettings = {
        ...cachedSettings,
        ...data,
        localFee: Number(data.localFee ?? data.lagosFee ?? 3000),
        nationwideFee: Number(data.nationwideFee ?? data.outsideLagosFee ?? 7000),
        estimatedDaysLocal:
          data.estimatedDaysLocal || data.estimatedDaysLagos || "Same Day Delivery (Akure & Ondo)",
        estimatedDaysNationwide:
          data.estimatedDaysNationwide || data.estimatedDaysOutside || "1-2 Business Days (Nationwide)",
      };
    }
  } catch (error) {
    console.warn("Using fallback delivery settings:", error?.message);
  }
  return cachedSettings;
};

export const getCachedDeliverySettings = () => cachedSettings;

export const isLocalDelivery = (state, lga = "") => {
  const normState = String(state || "").toLowerCase().trim();
  const normLga = String(lga || "").toLowerCase().trim();
  return (
    normState === "ondo" ||
    normState.includes("ondo") ||
    normLga.includes("akure") ||
    normState.includes("akure")
  );
};

export const getDeliveryPrice = (state, customSettings = null, subtotal = 0, lga = "") => {
  if (!state) return 0;
  const settings = customSettings || cachedSettings;

  if (
    settings.freeDeliveryThreshold > 0 &&
    subtotal >= settings.freeDeliveryThreshold
  ) {
    return 0;
  }

  const localRate = Number(settings.localFee ?? settings.lagosFee ?? 3000);
  const nationwideRate = Number(settings.nationwideFee ?? settings.outsideLagosFee ?? 7000);

  return isLocalDelivery(state, lga) ? localRate : nationwideRate;
};

export const getEstimatedDeliveryTime = (state, customSettings = null, lga = "") => {
  const settings = customSettings || cachedSettings;
  const isLocal = isLocalDelivery(state, lga);
  return isLocal
    ? settings.estimatedDaysLocal || settings.estimatedDaysLagos || "Same Day Delivery (Akure & Ondo)"
    : settings.estimatedDaysNationwide || settings.estimatedDaysOutside || "1-2 Business Days (Nationwide)";
};
