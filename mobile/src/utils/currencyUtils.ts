export const formatCurrency = (amount: number, currency: string = 'GHS'): string => {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatPrice = (amount: number, isFree: boolean, currency: string = 'GHS'): string => {
  if (isFree) return 'Free';
  return formatCurrency(amount, currency);
};

