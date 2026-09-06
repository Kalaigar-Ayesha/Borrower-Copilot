/**
 * Indian Monetary and Financial Formatters
 */

/**
 * Format numbers into Indian Rupees (INR) format (e.g., ₹1,50,000 or ₹2.5 Lakhs)
 */
export function formatINR(amount, compact = false) {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0';
  }

  const num = Math.round(amount);

  if (compact) {
    if (Math.abs(num) >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    }
    if (Math.abs(num) >= 100000) {
      return `₹${(num / 100000).toFixed(2)} Lakh`;
    }
    if (Math.abs(num) >= 1000) {
      return `₹${(num / 1000).toFixed(1)}k`;
    }
  }

  // Standard Indian comma separation (3,2,2 format)
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Format percentage value (e.g., 10.5%)
 */
export function formatPercent(val, decimals = 2) {
  if (val === null || val === undefined || isNaN(val)) {
    return '0%';
  }
  return `${Number(val).toFixed(decimals)}%`;
}

/**
 * Format tenure in months to human readable years/months
 */
export function formatTenure(months) {
  if (!months || isNaN(months)) return '0 months';
  const yrs = Math.floor(months / 12);
  const remMonths = months % 12;

  if (yrs > 0 && remMonths > 0) {
    return `${yrs} yr ${remMonths} mo`;
  }
  if (yrs > 0) {
    return `${yrs} ${yrs === 1 ? 'year' : 'years'} (${months} mo)`;
  }
  return `${months} months`;
}

/**
 * Parse input string or number safely
 */
export function parseNumber(input, fallback = 0) {
  if (input === '' || input === null || input === undefined) return fallback;
  const cleaned = String(input).replace(/,/g, '').trim();
  const val = parseFloat(cleaned);
  return isNaN(val) ? fallback : val;
}
