/**
 * Utility functions for mileage formatting.
 * Displays the original API mileage value directly without conversion.
 */

export const KM_TO_MILES_FACTOR = 1;

/**
 * Returns the original numeric mileage value directly.
 * @param {number|string} val
 * @returns {number}
 */
export const kmToMiles = (val) => {
  if (val === null || val === undefined || val === "") return 0;
  const numericVal = typeof val === "number" ? val : parseFloat(String(val).replace(/,/g, ""));
  if (isNaN(numericVal)) return 0;
  return Math.round(numericVal);
};

/**
 * Returns the original numeric mileage value directly.
 * @param {number|string} val
 * @returns {number}
 */
export const milesToKm = (val) => {
  if (val === null || val === undefined || val === "") return 0;
  const numericVal = typeof val === "number" ? val : parseFloat(String(val).replace(/,/g, ""));
  if (isNaN(numericVal)) return 0;
  return Math.round(numericVal);
};

/**
 * Formats an original mileage value into customer-facing display string with commas.
 * Example: 72262 -> "72,262 Miles"
 * @param {number|string} val
 * @returns {string}
 */
export const formatMileage = (val) => {
  const miles = kmToMiles(val);
  return `${miles.toLocaleString()} Miles`;
};
