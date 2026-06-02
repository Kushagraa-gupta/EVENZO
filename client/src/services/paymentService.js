import api from './api';

export const paymentService = {
  createCheckout: (bookingId) => api.post('/payments/create-checkout', { bookingId }),
  getSessionBooking: (sessionId) => api.get('/payments/session', { params: { sessionId } }),
};
