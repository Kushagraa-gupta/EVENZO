export const formatCurrency = (amount) => {
  if (amount === 0 || amount === null || amount === undefined) return 'Free';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getLowestPrice = (ticketTypes = []) => {
  if (!ticketTypes.length) return 0;
  return Math.min(...ticketTypes.map((t) => t.price));
};

export const getSeatsLeft = (ticketTypes = []) => {
  return ticketTypes.reduce((sum, t) => sum + (t.totalSeats - t.bookedSeats), 0);
};
