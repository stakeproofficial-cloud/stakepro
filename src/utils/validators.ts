export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6; // Example: Password must be at least 6 characters long
};

export const validateConfirmPassword = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

/**
 * Safely parse decimal amounts for financial calculations
 * Avoids floating point precision issues by using fixed decimal places
 */
export const parseDecimal = (value: string | number, decimals: number = 2): number => {
  if (typeof value === 'number') {
    return Number(value.toFixed(decimals));
  }

  if (typeof value === 'string') {
    // Remove any non-numeric characters except decimal point
    const cleaned = value.replace(/[^0-9.-]/g, '');
    const parsed = parseFloat(cleaned);

    if (isNaN(parsed)) {
      return 0;
    }

    return Number(parsed.toFixed(decimals));
  }

  return 0;
};

/**
 * Format currency amount for display
 */
export const formatCurrency = (amount: number, decimals: number = 2): string => {
  return amount.toFixed(decimals);
};
