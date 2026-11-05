// deliveryService.js
import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8050/api";

let cachedSettings = {
  lagosFee: 10000,
  outsideLagosFee: 20000,
  freeDeliveryThreshold: 0,
  estimatedDaysLagos: "Same Day Delivery",
  estimatedDaysOutside: "1-2 Business Days",
};

export const fetchDeliverySettings = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/common/delivery-settings`);
    if (response?.data?.success && response.data.data) {
      cachedSettings = {
        ...cachedSettings,
        ...response.data.data,
      };
    }
  } catch (error) {
    console.warn("Using fallback delivery settings:", error?.message);
  }
  return cachedSettings;
};

export const getCachedDeliverySettings = () => cachedSettings;

export const getDeliveryPrice = (state, customSettings = null, subtotal = 0) => {
  if (!state) return 0;
  const settings = customSettings || cachedSettings;
  const normalizedState = String(state).toLowerCase().trim();

  if (
    settings.freeDeliveryThreshold > 0 &&
    subtotal >= settings.freeDeliveryThreshold
  ) {
    return 0;
  }

  return normalizedState === "lagos"
    ? Number(settings.lagosFee ?? 10000)
    : Number(settings.outsideLagosFee ?? 20000);
};

export const getEstimatedDeliveryTime = (state, customSettings = null) => {
  const settings = customSettings || cachedSettings;
  const normalizedState = String(state || "").toLowerCase().trim();
  return normalizedState === "lagos"
    ? settings.estimatedDaysLagos || "Same Day Delivery"
    : settings.estimatedDaysOutside || "1-2 Business Days";
};
