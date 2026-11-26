// backend/services/discount.service.js
/**
 * Dynamic Discount Calculation Engine for ZEWA
 * 
 * Rules:
 * 1. Discount increases automatically as time passes towards restaurant closing time.
 * 2. Starting discount is configured by the restaurant.
 * 3. Selling price NEVER drops below the restaurant's configured minimum price (floor).
 * 4. Selling price NEVER exceeds the starting price (ceiling).
 * 5. Discounts depend on remaining availability time, food quantity, and restaurant configuration.
 * 6. If available quantity is 0 or time has expired, item is unavailable.
 * 7. Price is calculated deterministically on the backend.
 */

function calculateDynamicDiscount(foodItem, currentTime = new Date()) {
  const originalPrice = Number(foodItem.original_price || foodItem.originalPrice);
  const startingPrice = Number(foodItem.starting_price || foodItem.startingPrice || (originalPrice * 0.7));
  const minPrice = Number(foodItem.min_price || foodItem.minPrice || (originalPrice * 0.3));
  const availableQty = Number(foodItem.available_quantity ?? foodItem.availableQuantity ?? 0);
  const isActive = foodItem.is_active ?? foodItem.isActive ?? true;

  const expiryTime = new Date(foodItem.expiry_time || foodItem.expiryTime);
  const now = new Date(currentTime);

  const remainingSeconds = Math.max(0, Math.floor((expiryTime.getTime() - now.getTime()) / 1000));
  const isExpired = remainingSeconds <= 0;
  const isSoldOut = availableQty <= 0;

  if (isExpired || isSoldOut || !isActive) {
    return {
      currentPrice: minPrice,
      originalPrice,
      startingPrice,
      minPrice,
      discountPercent: Math.round(((originalPrice - minPrice) / originalPrice) * 100),
      savings: Math.round(originalPrice - minPrice),
      timeRemainingSeconds: 0,
      timeRemainingFormatted: '00:00:00',
      isExpired: true,
      isSoldOut,
      isAvailable: false
    };
  }

  // Active dynamic decay window: default 4 hours (14,400 seconds) prior to closing
  // If the listing window is shorter, use its actual duration
  const totalWindowSeconds = 14400; // 4 hours window
  let decayRatio = 0.0;

  if (remainingSeconds < totalWindowSeconds) {
    // Non-linear acceleration as closing nears (e.g. higher discounts in final hour & last 30 mins)
    const elapsedRatio = (totalWindowSeconds - remainingSeconds) / totalWindowSeconds;
    decayRatio = Math.pow(elapsedRatio, 1.35); // Accelerates towards closing
  }

  // Calculate dynamic price sliding from startingPrice down towards minPrice
  let calculatedPrice = startingPrice - ((startingPrice - minPrice) * decayRatio);

  // Strict boundary enforcement: minPrice <= price <= startingPrice
  calculatedPrice = Math.max(minPrice, Math.min(startingPrice, calculatedPrice));
  calculatedPrice = Math.round(calculatedPrice); // Round to integer rupees for clean customer experience

  const savings = Math.max(0, originalPrice - calculatedPrice);
  const discountPercent = Math.min(
    Number(foodItem.max_discount_percent || 80),
    Math.round(((originalPrice - calculatedPrice) / originalPrice) * 100)
  );

  // Format countdown string HH:MM:SS
  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;
  const timeRemainingFormatted = [
    hours > 0 ? String(hours).padStart(2, '0') : null,
    String(minutes).padStart(2, '0'),
    String(seconds).padStart(2, '0')
  ].filter(Boolean).join(':');

  return {
    currentPrice: calculatedPrice,
    current_price: calculatedPrice,
    originalPrice,
    original_price: originalPrice,
    startingPrice,
    starting_price: startingPrice,
    minPrice,
    min_price: minPrice,
    discountPercent,
    discount_percentage: discountPercent,
    savings,
    timeRemainingSeconds: remainingSeconds,
    timeRemainingFormatted,
    time_remaining_formatted: timeRemainingFormatted,
    closing_time: foodItem.expiry_time || foodItem.expiryTime,
    isExpired: false,
    isSoldOut: false,
    isAvailable: true
  };
}

module.exports = {
  calculateDynamicDiscount
};
