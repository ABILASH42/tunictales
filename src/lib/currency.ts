/**
 * Format a number as Indian Rupees
 * Uses "Rs." prefix for maximum compatibility
 */
export function formatINR(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return 'Rs. 0';
  return `Rs. ${amount.toLocaleString('en-IN')}`;
}

/**
 * Rupee prefix
 */
export const RUPEE = 'Rs.';
