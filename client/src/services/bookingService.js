import api from './api';

export const bookingService = {
  createBooking: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my'),
  getBooking: (id) => api.get(`/bookings/${id}`),
  cancelBooking: (id) => api.put(`/bookings/${id}/cancel`),
  getEventBookings: (eventId) => api.get(`/bookings/event/${eventId}`),
  checkin: (qrData) => api.post('/bookings/checkin', { qrData }),
};
