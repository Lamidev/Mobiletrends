// deliveryService.js
export const getDeliveryPrice = (state) => {
  if (!state) return 0;
  const normalizedState = state.toLowerCase().trim();
  return normalizedState === 'lagos' ? 10000 : 20000;
};