export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const formatRating = (rating: number): string => {
  return `${rating.toFixed(1)}/10`;
};

export const getRatingColor = (rating: number): string => {
  if (rating >= 8) return 'excellent';
  if (rating >= 6) return 'good';
  if (rating >= 4) return 'mixed';
  return 'poor';
};
