/**
 * Format a number as Indian Rupees
 * Uses Unicode escape sequence for rupee symbol to ensure compatibility
 */
export function formatINR(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '\u20B9 0';
  return `\u20B9${amount.toLocaleString('en-IN')}`;
}

/**
 * Rupee symbol as Unicode escape (works in all fonts)
 */
export const RUPEE = '\u20B9';
